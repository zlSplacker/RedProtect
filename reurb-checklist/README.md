# Checklist REURB

Ferramenta de checklist para consultoria jurídica em processos de Regularização Fundiária Urbana (REURB), inspirada no módulo de checklist do S.R.I.:

- **Modelos de checklist** (cadastro): nome, descrição e perguntas. Cada pergunta tem tipo de resposta, fundamentação legal, providência e orientação para quem responde.
- **Análises** (aplicação): você escolhe um modelo, identifica o núcleo e o processo e responde. O checklist marca as pendências e monta o relatório.

## Como usar

Abra `index.html` no navegador (Chrome, Edge ou Firefox). Não precisa instalar nada nem estar online. Os dados ficam salvos no próprio navegador.

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
