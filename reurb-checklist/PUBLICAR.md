# Colocar o Sistema Fundiário na internet (com login)

O sistema agora tem um servidor próprio (`servidor.js`). Com ele:

- cada pessoa entra com **usuário e senha**;
- os dados ficam num banco no servidor, iguais para todos, e aparecem **ao vivo** nas telas abertas;
- os anexos (PDF, fotos, Word…) também ficam no servidor;
- o administrador cadastra, desativa e exclui usuários em **Sistema → Usuários**.

O servidor não usa nenhuma biblioteca externa: só o Node.js 22. O guia abaixo usa o **Railway** (cerca de US$ 5 por mês no plano Hobby), que publica direto do GitHub.

---

## 1. Criar a conta

1. Entre em **railway.com** e clique em **Login** → **Login with GitHub**. Use a conta do GitHub que tem o repositório `RedProtect`.
2. Escolha o plano **Hobby** (o teste grátis serve para experimentar, mas apaga o projeto quando acaba).

## 2. Criar o projeto a partir do GitHub

1. No painel, clique em **New Project** → **Deploy from GitHub repo**.
2. Se o repositório não aparecer, clique em **Configure GitHub App** e libere o acesso ao `RedProtect`.
3. Escolha o repositório **RedProtect**. O Railway cria um serviço e tenta publicar — a primeira tentativa pode falhar; é normal, falta configurar os passos abaixo.

## 3. Apontar para a pasta e o ramo certos

O repositório tem outras coisas além do sistema, então o serviço precisa olhar só a pasta `reurb-checklist`.

1. Clique no serviço → aba **Settings**.
2. Em **Source**:
   - **Root Directory**: `reurb-checklist`
   - **Branch**: `claude/reurb-checklist-cadastro-imxb14` (ou o ramo para onde o sistema for juntado depois)

O Railway reconhece o `package.json` sozinho e inicia com `npm start`.

## 4. Disco permanente (Volume) — obrigatório

Sem Volume, **tudo é apagado** a cada atualização. O sistema avisa na barra de status (*Servidor sem disco permanente*) se faltar.

1. No quadro do projeto, clique com o botão direito no espaço vazio (ou use **Ctrl+K**) → **Volume** / **New Volume**.
2. Ligue o Volume ao serviço do sistema e use o caminho de montagem **`/data`**.

O servidor descobre o Volume sozinho. O banco (`sistema-fundiario.db`) e a pasta `arquivos/` ficam lá.

## 5. Variáveis

Na aba **Variables** do serviço, adicione:

| Variável | Valor |
| --- | --- |
| `ADMIN_SENHA` | a senha do primeiro administrador (mínimo de 8 caracteres) |
| `PORT` | `3000` |
| `ADMIN_USUARIO` | opcional — o login do administrador (padrão: `admin`) |

`ADMIN_SENHA` só é usada na primeira vez, para criar o administrador. Depois disso, a senha muda dentro do sistema (**Sistema → Alterar senha**) e a variável pode ser apagada.

> Se não definir `ADMIN_SENHA`, o servidor cria uma senha provisória e mostra no registro (**Deployments → View logs**): `Senha provisória: …`.

## 6. Endereço na internet

1. Aba **Settings** → **Networking** → **Generate Domain**.
2. Se pedir a porta, informe **3000**.
3. O Railway dá um endereço como `sistema-fundiario-production.up.railway.app`, já com **https**.

Para usar um domínio próprio (ex.: `sistema.seuescritorio.com.br`), use **Custom Domain** na mesma tela e crie no seu provedor o registro CNAME que o Railway mostrar.

## 7. Primeiro acesso

1. Abra o endereço → aparece a tela **Sistema Fundiário — Acesso**.
2. Entre com `admin` e a senha de `ADMIN_SENHA`.
3. **Sistema → Alterar senha**: troque por uma senha só sua.
4. **Sistema → Usuários → Novo**: cadastre cada pessoa do escritório (nome, usuário, perfil e senha provisória). Perfil **Administrador** pode gerenciar usuários; **Usuário** usa o sistema normalmente.
5. Para trazer o que já existe no seu computador: no navegador antigo, **Sistema → Exportar backup (JSON)**; no sistema publicado, **Sistema → Importar arquivo JSON**. Anexos guardados só no navegador antigo não vão junto — anexe de novo os que precisar.

## Atualizações

Cada `push` no ramo escolhido publica a nova versão sozinho. Os dados no Volume continuam.

## Segurança

- Senhas guardadas com *scrypt* (nunca em texto); sessão em cookie `HttpOnly`, só por https.
- Depois de 10 tentativas erradas em 15 minutos, o login daquele usuário (e daquele endereço de internet) fica bloqueado até completar os 15 minutos.
- Sessão expira após 7 dias sem uso (variável `SESSAO_DIAS` muda isso).
- Desativar, excluir ou trocar a senha de um usuário derruba na hora as sessões abertas dele.
- O sistema precisa de pelo menos um administrador ativo; ninguém exclui a si mesmo.

**Esqueceu a senha do administrador?** Crie a variável `ADMIN_SENHA_NOVA` com uma senha nova e aplique (**Deploy**). Ao reiniciar, o servidor redefine a senha do `admin` e reativa o usuário. Depois **apague a variável** e aplique de novo.

## Cópias de segurança

- **Sistema → Exportar backup (JSON)** de tempos em tempos (protocolos, pessoas, imóveis, checklists, minutas).
- Os anexos ficam no Volume. O Railway oferece *backups* do Volume na tela do próprio Volume, conforme o plano.

## Rodar no próprio computador (opcional)

Com o [Node.js 22](https://nodejs.org) instalado:

```bash
cd reurb-checklist
npm start
```

Abra `http://localhost:3000`. A senha do `admin` aparece no terminal (ou defina antes `ADMIN_SENHA`; no PowerShell: `$env:ADMIN_SENHA="sua-senha"; npm start`). Os dados ficam na pasta `reurb-checklist/dados/`.

## Sem servidor

O `index.html` continua funcionando sozinho, como antes: aberto direto no navegador, sem login, salvando no próprio navegador.
