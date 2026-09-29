# RURB — Sistema Integrado Regularização Fundiária

Ferramenta de checklist para consultoria jurídica em processos de Regularização Fundiária Urbana (REURB), inspirada no módulo de checklist do S.R.I.:

- **Modelos de checklist** (cadastro): nome, descrição e perguntas. Cada pergunta tem tipo de resposta, fundamentação legal, providência e orientação para quem responde.
- **Análises** (aplicação): você escolhe um modelo, identifica o núcleo e o processo e responde. O checklist marca as pendências e monta o relatório.

## Como usar

Abra `index.html` no navegador (Chrome, Edge ou Firefox). Não precisa instalar nada nem estar online. Os dados ficam salvos no próprio navegador.

### Área de trabalho e janelas

Ao abrir, o sistema mostra só a barra de menus e, abaixo dela, a área de trabalho azul. Cada opção do menu abre uma **janela** sobre essa área, e dá para trabalhar em várias ao mesmo tempo — por exemplo, o cadastro de um imóvel e o de uma pessoa lado a lado:

- arraste pela barra de título para mover; puxe as bordas ou os cantos para mudar o tamanho (o conteúdo se reorganiza conforme a largura da janela);
- os botões do canto minimizam, maximizam (ou duplo clique no título) e fecham;
- a barra de baixo lista as janelas abertas e só aparece quando há alguma: clique para trazer a janela para a frente ou, se ela já estiver na frente, minimizá-la. O botão **Lado a lado** divide a área entre todas as janelas abertas;
- numa janela de pesquisa, clicar num item abre o registro na própria janela (*Voltar à lista* volta). Um link para outro registro — como o botão *Protocolo 0001/2026* numa pessoa — abre esse registro em outra janela ou traz para a frente a janela dele, se já estiver aberta;
- o que se altera numa janela aparece nas outras; um formulário ainda não enviado numa janela não se perde.

No celular, cada janela ocupa a tela inteira e a barra de baixo alterna entre elas.

A barra de menus do topo segue o S.R.I.:

- **Cadastros → Modelos de checklist**: passe o mouse sobre *Cadastros* (no celular, toque) e escolha a opção para criar e editar os modelos. Os próximos cadastros do sistema entram neste mesmo menu.
- **Cadastros → Indicadores → Estado Civil**: tabela das opções que aparecem no campo *Estado civil* do Indicador Pessoal. Vem com os estados civis da legislação (solteiro, casado, separado judicialmente, separado extrajudicialmente, divorciado, viúvo); dá para incluir, renomear (os cadastros que usavam o nome antigo são atualizados), reordenar e excluir.
- **Recepção → Recepção de Título**: cadastra um novo protocolo para cada processo acompanhado (veja abaixo).
- **Protocolo → Consultar Protocolos**: um protocolo por linha, no formato *Protocolo | Município | Interessado*, com a situação na ponta direita. O filtro procura por qualquer um desses três dados; clique na linha para abrir o protocolo.
- **Indicadores → Real → Pesquisa / Urbano / Rural / Condomínio**: pesquisa e cadastro dos imóveis, com matrícula, **origem** (Matrícula Mãe ou Matrícula Filha) e vínculo ao protocolo. Cada tipo tem seus campos:
  - *Urbano*: núcleo ou loteamento, quadra, lote, logradouro, área (m²) e construção (m²);
  - *Rural*: denominação, localidade, área (ha), CCIR, NIRF/CIB, CAR e certificação SIGEF;
  - *Condomínio*: condomínio, unidade, bloco, vaga, fração ideal, área privativa e área total.

  No fim do cadastro fica o botão **Salvar**: o imóvel novo só é gravado quando você clica nele (fechar a janela antes descarta o cadastro), e a janela volta para a lista do Indicador Real.
- **Indicadores → Pessoal → Pesquisar / Pessoa Física / Pessoa Jurídica**: pesquisa e cadastro das pessoas, no mesmo formato do S.R.I.:
  - *Dados pessoais*: nome, nome social, nascimento, óbito, CPF (com conferência dos dígitos), RG, passaporte, sexo, telefone, celular, e-mail, CNH, profissão, estado civil, nacionalidade, naturalidade e certidão de nascimento;
  - *Casamento*: regime, data, cônjuge (ligado ao cadastro do outro cônjuge), pacto antenupcial e certidão;
  - *Endereço Residencial*, *Endereço Profissional* (CEP, tipo, logradouro, número, complemento, bairro, município) e *Filiação* (pai e mãe);
  - *Observação*, com a opção de mostrar um aviso sempre que o cadastro for consultado.
  
  No arquivo aberto no navegador, a lupa do CEP preenche o endereço automaticamente (ViaCEP).
- **Análises**: aplica os modelos aos núcleos e mostra as pendências.

### O protocolo é o centro do trabalho

Tudo começa na **Recepção de Título**, que cria o protocolo. No topo da ficha fica a barra de botões, como no S.R.I.; cada botão abre um quadro à frente, dentro da janela do protocolo (fecha no X, no Esc ou clicando fora):

- **Exigência**: registro das exigências do protocolo (texto e data de emissão), com marcação de cumprida e cópia das pendentes em texto. O botão mostra quantas estão pendentes, e cada registro ou cumprimento entra nos andamentos.
- **Dados**: as abas **Indicador Real** (imóveis) e **Indicador Pessoal** (pessoas, com sua qualidade). Abaixo das abas fica só a lista do que foi adicionado ao protocolo e, depois de uma linha, os botões **Adicionar** e **Excluir**. *Adicionar* abre a janela de pesquisa do indicador (Pessoal ou Real): pesquise e dê dois cliques no nome (ou Enter) para adicioná-lo ao protocolo — a pesquisa fecha e o protocolo volta à frente com o item marcado na lista. Quem já está no protocolo aparece marcado na pesquisa; *Nova pessoa* e *Novo imóvel* ali já ligam o cadastro novo ao protocolo. A pessoa entra como *Beneficiário*. Para excluir, clique na linha e depois em *Excluir* (confirmando no segundo clique). Um duplo clique na linha abre o cadastro.

Na página, abaixo da barra, fica a linha de abas **Recepção**, **Andamentos**, **Financeiro** e **Checklists**. Cada aba mostra só o seu conteúdo, e o protocolo abre em *Recepção*:

| Aba | O que tem |
| --- | --- |
| **Recepção** | O quadro *Dados do protocolo*: na primeira linha, ordem de protocolo e situação à esquerda e abertura e prazo estimado à direita; depois município, interessado e contato; e a descrição do pedido. |
| **Andamentos** | Histórico datado; registra sozinho a abertura, as mudanças de situação e os checklists aplicados. |
| **Financeiro** | Honorários contratados e lançamentos (recebimentos e despesas, com data, descrição e valor), com o resumo de recebido, a receber, despesas e saldo. |
| **Checklists** | Análises aplicadas ao protocolo, com progresso e pendências, e o botão *Aplicar checklist*. |

Imóveis, pessoas e análises mostram um botão *Protocolo 0000/AAAA*, que abre (ou traz para a frente) a janela do protocolo de origem.

### Protocolos (Recepção)

- **Ordem de protocolo**: número automático por ano (`0001/2026`, `0002/2026`…), exibido no início do quadro *Dados do protocolo* e sem possibilidade de alteração.
- **Abertura**: data e hora registradas automaticamente no clique em *Recepção de Título*, sem possibilidade de alteração.
- **Dados do protocolo**: interessado (quem está contratando), contato, município, prazo estimado e descrição do pedido.
- **Situação**: aberto, em análise, aguardando documentos, concluído ou arquivado. Cada mudança fica registrada nos andamentos.
- **Prazo estimado**: o protocolo avisa quando faltam 7 dias ou menos e quando o prazo venceu.
- **Andamentos**: histórico datado de tudo o que aconteceu no processo.
- **Aplicar checklist**: abre uma análise já vinculada ao protocolo, com núcleo, município e número preenchidos. A análise mostra o link de volta para o protocolo.

> Use **Backup → Exportar backup (JSON)** de tempos em tempos. Se você limpar os dados do navegador ou trocar de computador, é esse arquivo que recupera os modelos e as análises (**Backup → Importar arquivo JSON**).

## Recursos

| Recurso | Como funciona |
| --- | --- |
| Tipos de resposta | Sim/Não, Sim/Não/Não se aplica, escolha única, múltipla escolha, texto livre e data |
| Sub-perguntas condicionais | Aparecem só quando a pergunta de cima recebe a resposta escolhida (ex.: *2.1 – Em qual data?* só aparece se *2 – Núcleo consolidado?* for **Sim**) |
| Pendências | Em cada pergunta você marca quais respostas geram pendência. A análise mostra o carimbo **PENDÊNCIA** com a providência e a fundamentação |
| Observações | Cada item aceita uma observação, que vai para o relatório |
| Filtros | Mostra todas as perguntas, só as em aberto ou só as pendências |
| Relatório | Arquivo HTML com a identificação, as pendências e providências, os itens em aberto e todas as respostas, pronto para imprimir ou salvar em PDF |
| Copiar pendências | Texto simples para colar em e-mail ou ofício |
| Visualizar | Testa o modelo, com as condicionais, sem salvar respostas |
| Clonar, exportar e importar JSON | Para criar variações por município e trocar modelos entre computadores |
| Versões | Cada análise guarda a versão do modelo com que começou. Se o modelo mudar depois, a análise oferece atualizar para a nova versão sem perder as respostas |

## Modelo incluído

`modelos/reurb-lei-13465-2017.json` traz o roteiro **REURB — Análise do processo (Lei 13.465/2017)**, com 54 perguntas em 8 seções:

1. Requerimento e instauração (legitimados, prazo de 180 dias, modalidade Reurb-S/Reurb-E)
2. Núcleo urbano informal (consolidação, marco de 22/12/2016, parcelamentos anteriores a 1979, titularidade)
3. Restrições ambientais e áreas de risco (APP, unidades de conservação, estudos de risco)
4. Infraestrutura essencial (água, esgoto, energia, drenagem, calçadas e equipamentos definidos pelo município)
5. Projeto de regularização fundiária (elementos mínimos do art. 35)
6. Notificações e conflitos (notificação de titulares e confinantes, impugnação, demarcação urbanística)
7. Titulação, decisão e CRF
8. Registro

O modelo já vem carregado na primeira abertura, junto com uma análise de **exemplo** com dados fictícios. Exclua o exemplo quando não precisar mais.

> As referências legais servem de ponto de partida. Confira os dispositivos com a legislação vigente e acrescente as exigências da lei municipal de cada cliente, clonando o modelo por município.
