'use strict';
/* Sistema Fundiário — servidor com login por usuário.
   Sem dependências: só o Node.js 22 (http + node:sqlite). Inicie com `npm start`.

   Variáveis de ambiente:
     PORT           porta (o Railway/Render definem sozinhos; padrão 3000)
     DATA_DIR       pasta do banco e dos anexos (padrão: o Volume do Railway, senão ./dados)
     ADMIN_USUARIO  login do primeiro administrador (padrão: admin)
     ADMIN_SENHA    senha do primeiro administrador; só vale enquanto não houver usuários
     ADMIN_SENHA_NOVA  redefine a senha do ADMIN_USUARIO ao iniciar (use uma vez e apague)
     SESSAO_DIAS    dias sem uso até a sessão expirar (padrão: 7)
*/
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

let DatabaseSync;
try { ({ DatabaseSync } = require('node:sqlite')); }
catch (e) {
  console.error('Este servidor precisa do Node.js 22.13 ou mais novo (módulo node:sqlite). Versão atual: ' + process.version);
  process.exit(1);
}

const PORTA = Number(process.env.PORT) || 3000;
const VOLUME = process.env.RAILWAY_VOLUME_MOUNT_PATH || '';
const DATA_DIR = path.resolve(process.env.DATA_DIR || VOLUME || path.join(__dirname, 'dados'));
const NA_NUVEM = !!(process.env.RAILWAY_ENVIRONMENT || process.env.RENDER || process.env.NODE_ENV === 'production');
// atrás do proxy da hospedagem o IP e o https chegam nos cabeçalhos X-Forwarded-*
const CONFIAR_PROXY = process.env.TRUST_PROXY ? process.env.TRUST_PROXY !== '0' : NA_NUVEM;
// sem Volume no Railway o disco é apagado a cada atualização: o sistema avisa o administrador
const PERSISTENTE = !process.env.RAILWAY_ENVIRONMENT || !!(VOLUME || process.env.DATA_DIR);
const SESSAO_MS = (Number(process.env.SESSAO_DIAS) || 7) * 86400e3;
const SESSAO_MAX_MS = 30 * 86400e3;
const COLECOES = new Set(['modelos', 'analises', 'protocolos', 'pessoas', 'imoveis', 'tabelas', 'modelosMinuta']);
const ID_OK = /^[\w.:-]{1,128}$/;
const LIMITE_DOC = 8 * 1024 * 1024;
const LIMITE_ARQUIVO = 50 * 1024 * 1024;
const SENHA_MIN = 8;

fs.mkdirSync(path.join(DATA_DIR, 'arquivos'), { recursive: true });
const PASTA_ARQ = path.join(DATA_DIR, 'arquivos');

/* ---------- banco ---------- */
const db = new DatabaseSync(path.join(DATA_DIR, 'sistema-fundiario.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS usuarios (
    id TEXT PRIMARY KEY,
    usuario TEXT NOT NULL UNIQUE COLLATE NOCASE,
    nome TEXT NOT NULL,
    hash TEXT NOT NULL,
    perfil TEXT NOT NULL DEFAULT 'usuario',
    ativo INTEGER NOT NULL DEFAULT 1,
    criado_em TEXT NOT NULL,
    ultimo_acesso TEXT
  );
  CREATE TABLE IF NOT EXISTS sessoes (
    token TEXT PRIMARY KEY,
    usuario_id TEXT NOT NULL,
    criada_em INTEGER NOT NULL,
    expira_em INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS docs (
    col TEXT NOT NULL,
    id TEXT NOT NULL,
    dados TEXT NOT NULL,
    atualizado_em TEXT NOT NULL,
    atualizado_por TEXT,
    PRIMARY KEY (col, id)
  );
  CREATE TABLE IF NOT EXISTS arquivos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    tamanho INTEGER NOT NULL,
    criado_em TEXT NOT NULL,
    criado_por TEXT
  );
  CREATE TABLE IF NOT EXISTS meta (chave TEXT PRIMARY KEY, valor TEXT);
`);
const Q = {
  usuarioPorLogin: db.prepare('SELECT * FROM usuarios WHERE usuario = ?'),
  usuarioPorId: db.prepare('SELECT * FROM usuarios WHERE id = ?'),
  usuarios: db.prepare('SELECT id, usuario, nome, perfil, ativo, criado_em, ultimo_acesso FROM usuarios ORDER BY nome COLLATE NOCASE'),
  contarUsuarios: db.prepare('SELECT COUNT(*) AS n FROM usuarios'),
  contarAdmins: db.prepare("SELECT COUNT(*) AS n FROM usuarios WHERE perfil = 'admin' AND ativo = 1"),
  criarUsuario: db.prepare('INSERT INTO usuarios (id, usuario, nome, hash, perfil, ativo, criado_em) VALUES (?, ?, ?, ?, ?, 1, ?)'),
  acesso: db.prepare('UPDATE usuarios SET ultimo_acesso = ? WHERE id = ?'),
  sessao: db.prepare('SELECT s.token, s.criada_em, s.expira_em, u.id, u.usuario, u.nome, u.perfil, u.ativo FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = ?'),
  criarSessao: db.prepare('INSERT INTO sessoes (token, usuario_id, criada_em, expira_em) VALUES (?, ?, ?, ?)'),
  renovarSessao: db.prepare('UPDATE sessoes SET expira_em = ? WHERE token = ?'),
  apagarSessao: db.prepare('DELETE FROM sessoes WHERE token = ?'),
  apagarSessoesDe: db.prepare('DELETE FROM sessoes WHERE usuario_id = ?'),
  apagarOutrasSessoes: db.prepare('DELETE FROM sessoes WHERE usuario_id = ? AND token <> ?'),
  limparSessoes: db.prepare('DELETE FROM sessoes WHERE expira_em < ? OR criada_em < ?'),
  docs: db.prepare('SELECT col, id, dados FROM docs'),
  gravarDoc: db.prepare('INSERT INTO docs (col, id, dados, atualizado_em, atualizado_por) VALUES (?, ?, ?, ?, ?) ON CONFLICT (col, id) DO UPDATE SET dados = excluded.dados, atualizado_em = excluded.atualizado_em, atualizado_por = excluded.atualizado_por'),
  apagarDoc: db.prepare('DELETE FROM docs WHERE col = ? AND id = ?'),
  arquivo: db.prepare('SELECT * FROM arquivos WHERE id = ?'),
  criarArquivo: db.prepare('INSERT INTO arquivos (id, nome, tipo, tamanho, criado_em, criado_por) VALUES (?, ?, ?, ?, ?, ?)'),
  apagarArquivo: db.prepare('DELETE FROM arquivos WHERE id = ?'),
  meta: db.prepare('SELECT valor FROM meta WHERE chave = ?'),
  gravarMeta: db.prepare('INSERT INTO meta (chave, valor) VALUES (?, ?) ON CONFLICT (chave) DO UPDATE SET valor = excluded.valor')
};
const agora = () => new Date().toISOString();
const novoId = p => p + crypto.randomBytes(9).toString('base64url');

/* ---------- senhas (scrypt) ---------- */
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const scrypt = (senha, sal) => new Promise((ok, falha) =>
  crypto.scrypt(String(senha).normalize('NFC'), sal, 64, SCRYPT, (e, k) => e ? falha(e) : ok(k)));
async function gerarHash(senha) {
  const sal = crypto.randomBytes(16);
  return `scrypt$${sal.toString('base64')}$${(await scrypt(senha, sal)).toString('base64')}`;
}
const HASH_FALSO = 'scrypt$' + crypto.randomBytes(16).toString('base64') + '$' + crypto.randomBytes(64).toString('base64');
async function conferirSenha(senha, hash) {
  const [alg, sal, k] = String(hash).split('$');
  if (alg !== 'scrypt' || !sal || !k) return false;
  const esperado = Buffer.from(k, 'base64');
  const obtido = await scrypt(senha, Buffer.from(sal, 'base64'));
  return esperado.length === obtido.length && crypto.timingSafeEqual(esperado, obtido);
}
const senhaFraca = s => typeof s !== 'string' || s.length < SENHA_MIN || s.length > 200;
const LOGIN_OK = /^[a-z0-9._-]{2,40}$/i;

/* ---------- primeiro administrador ---------- */
async function prepararAdmin() {
  const login = (process.env.ADMIN_USUARIO || 'admin').trim();
  if (!LOGIN_OK.test(login)) { console.error('ADMIN_USUARIO inválido: use letras, números, ponto, hífen ou sublinhado.'); process.exit(1); }
  const nova = process.env.ADMIN_SENHA_NOVA;
  if (nova) {
    if (senhaFraca(nova)) { console.error(`ADMIN_SENHA_NOVA precisa de pelo menos ${SENHA_MIN} caracteres.`); process.exit(1); }
    const u = Q.usuarioPorLogin.get(login);
    if (u) {
      db.prepare("UPDATE usuarios SET hash = ?, ativo = 1, perfil = 'admin' WHERE id = ?").run(await gerarHash(nova), u.id);
      Q.apagarSessoesDe.run(u.id);
    } else Q.criarUsuario.run(novoId('u'), login, 'Administrador', await gerarHash(nova), 'admin', agora());
    console.log(`Senha do usuário "${login}" redefinida por ADMIN_SENHA_NOVA. Apague essa variável agora.`);
    return;
  }
  if (Q.contarUsuarios.get().n > 0) return;
  let senha = process.env.ADMIN_SENHA;
  let gerada = false;
  if (!senha) { senha = crypto.randomBytes(9).toString('base64url'); gerada = true; }
  if (senhaFraca(senha)) { console.error(`ADMIN_SENHA precisa de pelo menos ${SENHA_MIN} caracteres.`); process.exit(1); }
  Q.criarUsuario.run(novoId('u'), login, 'Administrador', await gerarHash(senha), 'admin', agora());
  console.log(`Administrador criado: usuário "${login}".` + (gerada ? ` Senha provisória: ${senha}  (troque em Sistema > Alterar senha)` : ' Senha: a de ADMIN_SENHA.'));
}

/* ---------- utilidades HTTP ---------- */
const HTML = fs.readFileSync(path.join(__dirname, 'index.html'));
const HTML_GZ = zlib.gzipSync(HTML, { level: 9 });
const HTML_ETAG = '"' + crypto.createHash('sha1').update(HTML).digest('base64url') + '"';
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://viacep.com.br",
  "worker-src 'self' blob: https://cdnjs.cloudflare.com",
  "frame-src 'self' blob:",
  "object-src 'self' blob:",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join('; ');
function seguro(req) { return !!req.socket.encrypted || (CONFIAR_PROXY && /^https\b/i.test(String(req.headers['x-forwarded-proto'] || ''))); }
function cabecalhosBase(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (seguro(req)) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
}
function json(res, status, obj, extra) {
  const corpo = Buffer.from(JSON.stringify(obj));
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': corpo.length, 'Cache-Control': 'no-store' }, extra));
  res.end(corpo);
}
const erro = (res, status, msg, extra) => json(res, status, { sistema: 'fundiario', erro: msg }, extra);
function lerCorpo(req, limite) {
  return new Promise((ok, falha) => {
    const partes = [];
    let n = 0;
    req.on('data', c => {
      n += c.length;
      if (n > limite) { falha(Object.assign(new Error('grande demais'), { status: 413 })); req.destroy(); return; }
      partes.push(c);
    });
    req.on('end', () => ok(Buffer.concat(partes)));
    req.on('error', falha);
  });
}
async function lerJson(req, limite = 64 * 1024) {
  const b = await lerCorpo(req, limite);
  try { return JSON.parse(b.toString('utf8') || 'null'); }
  catch (e) { throw Object.assign(new Error('JSON inválido'), { status: 400 }); }
}
function lerCookies(req) {
  const c = {};
  for (const par of String(req.headers.cookie || '').split(';')) {
    const i = par.indexOf('=');
    if (i > 0) c[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
  return c;
}
const nomeCookie = req => seguro(req) ? '__Host-sf_sessao' : 'sf_sessao';
function cookieSessao(req, valor, maxAge) {
  return `${nomeCookie(req)}=${valor}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}` + (seguro(req) ? '; Secure' : '');
}
function ipDe(req) {
  if (CONFIAR_PROXY) {
    const real = String(req.headers['x-real-ip'] || '').trim();
    if (real) return real;
    const ff = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
    if (ff.length) return ff[ff.length - 1];
  }
  return req.socket.remoteAddress || '?';
}
const hashToken = t => crypto.createHash('sha256').update(t).digest('base64url');
const publico = u => ({ id: u.id, usuario: u.usuario, nome: u.nome, perfil: u.perfil });

/* ---------- sessões ---------- */
function sessaoDe(req) {
  const c = lerCookies(req);
  const t = c['__Host-sf_sessao'] || c.sf_sessao;
  if (!t || t.length > 100) return null;
  const token = hashToken(t);
  const s = Q.sessao.get(token);
  const ms = Date.now();
  if (!s) return null;
  if (!s.ativo || s.expira_em < ms || s.criada_em + SESSAO_MAX_MS < ms) { Q.apagarSessao.run(token); return null; }
  // renova o prazo no máximo uma vez por hora
  if (s.expira_em - ms < SESSAO_MS - 3600e3) Q.renovarSessao.run(ms + SESSAO_MS, token);
  return s;
}
function iniciarSessao(req, res, u) {
  const t = crypto.randomBytes(32).toString('base64url');
  const ms = Date.now();
  Q.criarSessao.run(hashToken(t), u.id, ms, ms + SESSAO_MS);
  Q.acesso.run(agora(), u.id);
  res.setHeader('Set-Cookie', cookieSessao(req, t, Math.floor(SESSAO_MAX_MS / 1000)));
}
setInterval(() => { const ms = Date.now(); Q.limparSessoes.run(ms, ms - SESSAO_MAX_MS); }, 3600e3).unref();

/* ---------- limite de tentativas de login ---------- */
const falhas = new Map(); // chave → [instantes das falhas]
const JANELA = 15 * 60e3, MAX_FALHAS = 10;
function bloqueado(chave) {
  const l = (falhas.get(chave) || []).filter(t => t > Date.now() - JANELA);
  falhas.set(chave, l);
  return l.length >= MAX_FALHAS ? Math.ceil((l[0] + JANELA - Date.now()) / 1000) : 0;
}
function falhou(chave) { const l = falhas.get(chave) || []; l.push(Date.now()); falhas.set(chave, l); }
setInterval(() => { const lim = Date.now() - JANELA; for (const [k, l] of falhas) if (!l.some(t => t > lim)) falhas.delete(k); }, 60e3).unref();

/* ---------- atualização ao vivo (Server-Sent Events) ---------- */
const ouvintes = new Set();
function enviar(o, evento, dados) { o.res.write(`event: ${evento}\ndata: ${dados}\n\n`); }
function avisarTodos(evento, dados) { for (const o of ouvintes) enviar(o, evento, dados); }
function encerrarOuvintes(filtro) {
  for (const o of [...ouvintes]) if (filtro(o)) { enviar(o, 'sair', '{}'); o.res.end(); ouvintes.delete(o); }
}
function fotografia() {
  const por = {};
  for (const c of COLECOES) por[c] = [];
  for (const r of Q.docs.all()) if (por[r.col]) por[r.col].push(JSON.stringify(r.id) + ':' + r.dados);
  const cols = [...COLECOES].map(c => JSON.stringify(c) + ':{' + por[c].join(',') + '}').join(',');
  return `{"novo":${!Q.meta.get('iniciado')},"dados":{${cols}}}`;
}
setInterval(() => {
  for (const o of [...ouvintes]) {
    // sessão encerrada ou expirada: o navegador pede o login de novo
    const s = Q.sessao.get(o.token);
    if (!s || !s.ativo || s.expira_em < Date.now()) { enviar(o, 'sair', '{}'); o.res.end(); ouvintes.delete(o); }
    else o.res.write(': ping\n\n');
  }
}, 25e3).unref();

/* ---------- rotas ---------- */
const TIPOS_SEGUROS = /^(application\/pdf|image\/(png|jpeg|gif|webp|bmp)|video\/(mp4|webm|ogg)|audio\/[\w.+-]+|text\/plain|text\/csv|application\/(json|zip|x-zip-compressed|msword|vnd\.[\w.+-]+|octet-stream))$/i;

async function api(req, res, url, s) {
  const m = req.method, p = url.pathname;
  let r;

  if (p === '/api/eu' && m === 'GET') {
    if (!s) return erro(res, 401, 'nao_autenticado');
    return json(res, 200, { sistema: 'fundiario', usuario: publico(s), persistente: PERSISTENTE, senhaMin: SENHA_MIN });
  }

  if (p === '/api/login' && m === 'POST') {
    const b = await lerJson(req);
    const login = String((b && b.usuario) || '').trim().toLowerCase().slice(0, 60), senha = String((b && b.senha) || '');
    const ip = ipDe(req);
    const espera = Math.max(bloqueado('ip:' + ip), bloqueado('u:' + login));
    if (espera) return erro(res, 429, 'Muitas tentativas. Aguarde alguns minutos.', { 'Retry-After': String(espera) });
    const u = login ? Q.usuarioPorLogin.get(login) : null;
    const ok = await conferirSenha(senha, u ? u.hash : HASH_FALSO);
    if (!u || !ok || !u.ativo) {
      falhou('ip:' + ip); falhou('u:' + login);
      console.log(`login recusado: "${login}" de ${ip}`);
      return erro(res, 401, u && ok && !u.ativo ? 'Usuário desativado. Fale com o administrador.' : 'Usuário ou senha incorretos.');
    }
    falhas.delete('u:' + login);
    iniciarSessao(req, res, u);
    console.log(`login: "${u.usuario}" de ${ip}`);
    return json(res, 200, { sistema: 'fundiario', usuario: publico(u), persistente: PERSISTENTE, senhaMin: SENHA_MIN });
  }

  if (p === '/api/logout' && m === 'POST') {
    if (s) { Q.apagarSessao.run(s.token); encerrarOuvintes(o => o.token === s.token); }
    return json(res, 200, { ok: true }, { 'Set-Cookie': cookieSessao(req, '', 0) });
  }

  if (!s) return erro(res, 401, 'nao_autenticado');

  if (p === '/api/senha' && m === 'POST') {
    const b = await lerJson(req);
    const u = Q.usuarioPorId.get(s.id);
    if (!(await conferirSenha(String((b && b.atual) || ''), u.hash))) return erro(res, 400, 'A senha atual não confere.');
    if (senhaFraca(b.nova)) return erro(res, 400, `A nova senha precisa de pelo menos ${SENHA_MIN} caracteres.`);
    db.prepare('UPDATE usuarios SET hash = ? WHERE id = ?').run(await gerarHash(b.nova), u.id);
    Q.apagarOutrasSessoes.run(u.id, s.token);
    encerrarOuvintes(o => o.usuarioId === u.id && o.token !== s.token);
    return json(res, 200, { ok: true });
  }

  if (p === '/api/eventos' && m === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no', Connection: 'keep-alive' });
    const o = { res, token: s.token, usuarioId: s.id };
    res.on('error', () => ouvintes.delete(o));
    res.write('retry: 3000\n\n');
    enviar(o, 'inicio', fotografia());
    ouvintes.add(o);
    req.on('close', () => ouvintes.delete(o));
    return;
  }

  if ((r = p.match(/^\/api\/dados\/([^/]+)\/([^/]+)$/))) {
    const col = r[1], id = decodeURIComponent(r[2]);
    if (!COLECOES.has(col) || !ID_OK.test(id)) return erro(res, 400, 'Registro inválido.');
    if (m === 'PUT') {
      let obj = null;
      try { obj = JSON.parse((await lerCorpo(req, LIMITE_DOC)).toString('utf8') || 'null'); }
      catch (e) { if (e.status) throw e; }
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return erro(res, 400, 'Registro inválido.');
      obj.id = id;
      const txt = JSON.stringify(obj);
      Q.gravarDoc.run(col, id, txt, agora(), s.usuario);
      if (!Q.meta.get('iniciado')) Q.gravarMeta.run('iniciado', agora());
      avisarTodos('doc', `{"col":${JSON.stringify(col)},"id":${JSON.stringify(id)},"dados":${txt}}`);
      return json(res, 200, { ok: true });
    }
    if (m === 'DELETE') {
      Q.apagarDoc.run(col, id);
      avisarTodos('doc', `{"col":${JSON.stringify(col)},"id":${JSON.stringify(id)},"dados":null}`);
      return json(res, 200, { ok: true });
    }
  }

  if (p === '/api/arquivos' && m === 'POST') {
    let nome = 'arquivo';
    try { nome = decodeURIComponent(String(req.headers['x-nome'] || 'arquivo')).slice(0, 255) || 'arquivo'; } catch (e) { /* nome padrão */ }
    const tipo = String(req.headers['content-type'] || 'application/octet-stream').split(';')[0].trim().slice(0, 120);
    const declarado = Number(req.headers['content-length']);
    if (declarado > LIMITE_ARQUIVO) return erro(res, 413, 'Arquivo grande demais (máximo de 50 MB).');
    const id = novoId('a');
    const tmp = path.join(PASTA_ARQ, id + '.parcial');
    const saida = fs.createWriteStream(tmp, { flags: 'wx' });
    let n = 0, estourou = false;
    await new Promise((ok, falha) => {
      req.on('data', c => {
        n += c.length;
        if (n > LIMITE_ARQUIVO && !estourou) { estourou = true; req.unpipe(saida); saida.destroy(); ok(); }
      });
      req.on('error', falha);
      saida.on('error', falha);
      saida.on('finish', ok);
      req.pipe(saida);
    }).catch(e => { estourou = estourou || e; });
    if (estourou) {
      fs.rm(tmp, { force: true }, () => {});
      if (estourou === true) { res.setHeader('Connection', 'close'); return erro(res, 413, 'Arquivo grande demais (máximo de 50 MB).'); }
      throw estourou;
    }
    fs.renameSync(tmp, path.join(PASTA_ARQ, id));
    Q.criarArquivo.run(id, nome, tipo, n, agora(), s.usuario);
    return json(res, 200, { id, tamanho: n });
  }

  if ((r = p.match(/^\/api\/arquivos\/(a[\w-]{6,40})$/))) {
    const a = Q.arquivo.get(r[1]);
    const arq = path.join(PASTA_ARQ, r[1]);
    if (m === 'GET') {
      if (!a || !fs.existsSync(arq)) return erro(res, 404, 'Arquivo não encontrado.');
      res.writeHead(200, {
        'Content-Type': TIPOS_SEGUROS.test(a.tipo) ? a.tipo : 'application/octet-stream',
        'Content-Length': a.tamanho,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(a.nome)}`,
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Cache-Control': 'private, max-age=31536000, immutable'
      });
      fs.createReadStream(arq).pipe(res);
      return;
    }
    if (m === 'DELETE') {
      if (a) Q.apagarArquivo.run(a.id);
      fs.rm(arq, { force: true }, () => {});
      return json(res, 200, { ok: true });
    }
  }

  /* administração de usuários */
  if (p === '/api/usuarios' || p.startsWith('/api/usuarios/')) {
    if (s.perfil !== 'admin') return erro(res, 403, 'Só o administrador pode gerenciar usuários.');
    if (p === '/api/usuarios' && m === 'GET') {
      return json(res, 200, { usuarios: Q.usuarios.all().map(u => ({ id: u.id, usuario: u.usuario, nome: u.nome, perfil: u.perfil, ativo: !!u.ativo, criadoEm: u.criado_em, ultimoAcesso: u.ultimo_acesso })) });
    }
    if (p === '/api/usuarios' && m === 'POST') {
      const b = await lerJson(req) || {};
      const login = String(b.usuario || '').trim().toLowerCase(), nome = String(b.nome || '').trim().slice(0, 120);
      if (!LOGIN_OK.test(login)) return erro(res, 400, 'Usuário: de 2 a 40 letras, números, ponto, hífen ou sublinhado, sem espaços.');
      if (!nome) return erro(res, 400, 'Informe o nome.');
      if (senhaFraca(b.senha)) return erro(res, 400, `A senha precisa de pelo menos ${SENHA_MIN} caracteres.`);
      if (Q.usuarioPorLogin.get(login)) return erro(res, 409, 'Já existe um usuário com esse login.');
      const id = novoId('u');
      Q.criarUsuario.run(id, login, nome, await gerarHash(b.senha), b.perfil === 'admin' ? 'admin' : 'usuario', agora());
      console.log(`usuário criado: "${login}" por "${s.usuario}"`);
      return json(res, 200, { ok: true, id });
    }
    if ((r = p.match(/^\/api\/usuarios\/(u[\w-]{4,40})$/))) {
      const u = Q.usuarioPorId.get(r[1]);
      if (!u) return erro(res, 404, 'Usuário não encontrado.');
      const ultimoAdmin = u.perfil === 'admin' && u.ativo && Q.contarAdmins.get().n <= 1;
      if (m === 'PATCH') {
        const b = await lerJson(req) || {};
        const nome = b.nome !== undefined ? String(b.nome).trim().slice(0, 120) : u.nome;
        const perfil = b.perfil !== undefined ? (b.perfil === 'admin' ? 'admin' : 'usuario') : u.perfil;
        const ativo = b.ativo !== undefined ? (b.ativo ? 1 : 0) : u.ativo;
        let login = u.usuario;
        if (b.usuario !== undefined) {
          login = String(b.usuario).trim().toLowerCase();
          if (!LOGIN_OK.test(login)) return erro(res, 400, 'Usuário: de 2 a 40 letras, números, ponto, hífen ou sublinhado, sem espaços.');
          const outro = Q.usuarioPorLogin.get(login);
          if (outro && outro.id !== u.id) return erro(res, 409, 'Já existe um usuário com esse login.');
        }
        if (!nome) return erro(res, 400, 'Informe o nome.');
        if (ultimoAdmin && (perfil !== 'admin' || !ativo)) return erro(res, 400, 'O sistema precisa de pelo menos um administrador ativo.');
        if (u.id === s.id && !ativo) return erro(res, 400, 'Você não pode desativar o próprio usuário.');
        let hash = u.hash;
        if (b.senha !== undefined) {
          if (senhaFraca(b.senha)) return erro(res, 400, `A senha precisa de pelo menos ${SENHA_MIN} caracteres.`);
          hash = await gerarHash(b.senha);
        }
        db.prepare('UPDATE usuarios SET usuario = ?, nome = ?, perfil = ?, ativo = ?, hash = ? WHERE id = ?').run(login, nome, perfil, ativo, hash, u.id);
        // senha trocada ou acesso retirado: as sessões abertas daquele usuário caem
        if (!ativo || hash !== u.hash) {
          if (u.id === s.id) { Q.apagarOutrasSessoes.run(u.id, s.token); encerrarOuvintes(o => o.usuarioId === u.id && o.token !== s.token); }
          else { Q.apagarSessoesDe.run(u.id); encerrarOuvintes(o => o.usuarioId === u.id); }
        }
        return json(res, 200, { ok: true });
      }
      if (m === 'DELETE') {
        if (u.id === s.id) return erro(res, 400, 'Você não pode excluir o próprio usuário.');
        if (ultimoAdmin) return erro(res, 400, 'O sistema precisa de pelo menos um administrador ativo.');
        db.prepare('DELETE FROM usuarios WHERE id = ?').run(u.id);
        Q.apagarSessoesDe.run(u.id);
        encerrarOuvintes(o => o.usuarioId === u.id);
        console.log(`usuário excluído: "${u.usuario}" por "${s.usuario}"`);
        return json(res, 200, { ok: true });
      }
    }
  }

  return erro(res, 404, 'Rota não encontrada.');
}

const servidor = http.createServer(async (req, res) => {
  cabecalhosBase(req, res);
  let url;
  try { url = new URL(req.url, 'http://local'); } catch (e) { res.writeHead(400); res.end(); return; }
  try {
    if (url.pathname.startsWith('/api/')) {
      // proteção contra CSRF: chamadas que alteram dados só da própria página
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        const origem = req.headers.origin;
        let deFora = false;
        if (origem) {
          let h = null;
          try { h = new URL(origem).host; } catch (e) { /* origem inválida */ }
          deFora = h !== req.headers.host && !(CONFIAR_PROXY && h === req.headers['x-forwarded-host']);
        }
        if (req.headers['x-fundiario'] !== '1' || deFora) return erro(res, 403, 'Origem não permitida.');
      }
      return await api(req, res, url, sessaoDe(req));
    }
    if ((url.pathname === '/' || url.pathname === '/index.html') && (req.method === 'GET' || req.method === 'HEAD')) {
      if (req.headers['if-none-match'] === HTML_ETAG) { res.writeHead(304, { ETag: HTML_ETAG }); res.end(); return; }
      const gz = /\bgzip\b/.test(String(req.headers['accept-encoding'] || ''));
      const corpo = gz ? HTML_GZ : HTML;
      res.writeHead(200, Object.assign({
        'Content-Type': 'text/html; charset=utf-8', 'Content-Length': corpo.length, 'Cache-Control': 'no-cache',
        ETag: HTML_ETAG, Vary: 'Accept-Encoding', 'Content-Security-Policy': CSP
      }, gz ? { 'Content-Encoding': 'gzip' } : {}));
      res.end(req.method === 'HEAD' ? undefined : corpo);
      return;
    }
    if (url.pathname === '/saude') { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('ok'); return; }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Não encontrado');
  } catch (e) {
    if (e && e.status) { if (!res.headersSent) erro(res, e.status, e.status === 413 ? 'Conteúdo grande demais.' : 'Requisição inválida.'); return; }
    console.error(e);
    if (!res.headersSent) erro(res, 500, 'Erro interno do servidor.');
    else res.end();
  }
});
servidor.requestTimeout = 10 * 60e3; // anexos grandes em conexões lentas
servidor.headersTimeout = 60e3;

prepararAdmin().then(() => {
  servidor.listen(PORTA, () => {
    console.log(`Sistema Fundiário no ar na porta ${PORTA}. Dados em ${DATA_DIR}`);
    if (!PERSISTENTE) console.warn('ATENÇÃO: sem Volume (disco permanente). Os dados serão apagados na próxima atualização do Railway.');
  });
});
function encerrar() {
  for (const o of ouvintes) o.res.end();
  servidor.close(() => { db.close(); process.exit(0); });
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', encerrar);
process.on('SIGINT', encerrar);
