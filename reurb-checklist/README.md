# Sistema Fundiário

Ferramenta de checklist para consultoria jurídica em processos de Regularização Fundiária Urbana (REURB), inspirada no módulo de checklist do S.R.I.:

- **Modelos de checklist** (cadastro): nome, descrição e perguntas. Cada pergunta tem tipo de resposta, fundamentação legal, providência e orientação para quem responde.
- **Análises** (aplicação): feitas dentro do protocolo (aba *Checklists* → *Aplicar checklist*). Você responde as perguntas do modelo; o checklist marca as pendências e monta o relatório.

## Como usar

Abra `index.html` no navegador (Chrome, Edge ou Firefox). Não precisa instalar nada nem estar online. Os dados ficam salvos no próprio navegador.

> A versão anterior às mudanças do protocolo (interface do S.R.I., com Exigência e a aba Dados) está guardada, sem alterações, no ramo `backup/sistema-fundiario-v1`.

### Área de trabalho e janelas

A interface e o funcionamento seguem os do S.R.I., no visual do Windows: letra Segoe UI de 12 px, barra de menus só com texto (*Cadastros, Recepção, Protocolo, Indicadores, Sistema*) e, logo abaixo, a **barra de ícones** com os atalhos das telas mais usadas (Recepção de Título, Consultar Protocolos, Indicador Pessoal, Indicador Real, Itens Checklist, Modelos de Minuta, Lado a lado e Exportar backup). A área de trabalho mostra a marca do sistema ao fundo; embaixo fica a **barra de status**, com o estado do salvamento, as janelas abertas e, na ponta direita, a data de hoje (`dd/mm/aaaa`). Como o S.R.I., o sistema não tem modo escuro. Cada opção do menu abre uma **janela** com moldura azul-clara, o ícone do sistema no título e os botões de minimizar, maximizar e fechar do Windows 7, e dá para trabalhar em várias ao mesmo tempo — por exemplo, o cadastro de um imóvel e o de uma pessoa lado a lado:

- arraste pela barra de título para mover; puxe as bordas ou os cantos para mudar o tamanho (o conteúdo se reorganiza conforme a largura da janela);
- os botões do canto minimizam, maximizam (ou duplo clique no título) e fecham;
- na barra de status, clique numa janela para trazê-la para a frente ou, se ela já estiver na frente, minimizá-la. O ícone **Lado a lado** divide a área entre todas as janelas abertas;
- toda pesquisa é como a do S.R.I.: **Filtro:** no alto, uma grade branca com o nome das colunas e uma linha por registro, e os botões embaixo, com **Fechar** na ponta direita. Um clique marca a linha (os botões que agem sobre ela — *Visualizar*, *Exportar*, *Excluir*… — ficam apagados até haver uma linha marcada), dois cliques (ou Enter) abrem o registro na própria janela (*Voltar à lista* volta), e as setas andam pela grade. **Excluir** confirma no segundo clique. Na pesquisa aberta pelo *Adicionar* do protocolo ou da *Propriedade*, o *Excluir* dá lugar a **Selecionar**, que adiciona a linha marcada (os dois cliques também adicionam). Um link para outro registro — como o botão *Protocolo 0001/2026* numa pessoa — abre esse registro em outra janela ou traz para a frente a janela dele, se já estiver aberta;
- o que se altera numa janela aparece nas outras; um formulário ainda não enviado numa janela não se perde.

No celular, cada janela ocupa a tela inteira, a barra de status alterna entre elas e, nas grades, cada linha mostra os dados um embaixo do outro, com o nome da coluna.

A barra de menus do topo segue o S.R.I.:

> Todo cadastro novo (modelo de checklist, modelo de minuta, pessoa, imóvel) só é gravado no botão **Salvar**. Fechar a janela antes descarta o rascunho, então nada é criado à toa. Depois de salvo, as alterações continuam sendo gravadas enquanto você edita.

- **Cadastros → Análise do Título → Itens Checklist**: a pesquisa dos modelos de checklist, igual à do S.R.I. — grade *Descrição* e os botões **Visualizar Checklist**, **Importar Checklist JSON**, **Exportar Checklist JSON**, **Clonar**, **Novo**, **Imprimir** (o checklist em branco, com as perguntas numeradas e as caixas de marcar), **Excluir** e **Fechar**. *Novo* e *Clonar* abrem o checklist em rascunho; dois cliques abrem o checklist para editar, com **Visualizar Checklist** e **Salvar** embaixo.
- **Cadastros → Modelos de Minuta**: os modelos de texto das minutas. À esquerda a lista (os seus e os prontos, com o uso e o grupo), com **Adicionar** e **Excluir**; à direita o editor, com nome, grupo (os modelos aparecem agrupados na hora de escolher), **uso** e o texto. O uso separa as minutas: *Minuta do protocolo* (ofícios do município, decretos… — aparece no botão *Minuta* do protocolo), *Minuta da parte* (aparece na aba *Termos* do Indicador Pessoal) ou *Protocolo e parte*. *Adicionar* começa um modelo em branco ou uma cópia de qualquer modelo existente; ele só entra na lista quando você clica em **Salvar**, no canto do editor. No texto, **Inserir campo** coloca campos automáticos (etiquetas azuis) — número do protocolo, interessado, município, data por extenso, núcleo, localização, matrículas, lista e quadro de imóveis, qualificação do requerente, do ocupante, de todas as partes, tabela de ocupantes da CRF, pendências do checklist, qualificação e condição do notificado —, que na minuta viram os dados do protocolo; *Em MAIÚSCULAS* insere o campo em caixa alta. O que você escrever **[entre colchetes]** vira campo destacado a preencher na minuta. Com um campo do notificado, a minuta sai com uma cópia para cada proprietário, confrontante ou intimado (a qualidade vem do cadastro da pessoa). Os modelos prontos também podem ser editados (e voltar ao texto original com *Restaurar original*). **Excluir** vale para qualquer modelo, seu ou pronto (confirma no segundo clique); o pronto excluído some da lista, da *Minuta* do protocolo e dos *Termos*, e pode ser trazido de volta em *Adicionar → Restaurar modelo pronto excluído*. As minutas já feitas com um modelo excluído continuam como estão.
- **Cadastros → Indicadores → Estado Civil**: tabela das opções que aparecem no campo *Estado civil* do Indicador Pessoal. Vem com os estados civis da legislação (solteiro, casado, separado judicialmente, separado extrajudicialmente, divorciado, viúvo); dá para incluir, renomear (os cadastros que usavam o nome antigo são atualizados), reordenar e excluir.
- **Cadastros → Indicadores → Qualidade**: tabela das opções do campo *Qualidade* do Indicador Pessoal (o que a pessoa é no processo). Vem com Beneficiário, Intimado, Proprietário, Confrontante, Ocupante, Requerente e Outro; dá para incluir, renomear (os cadastros e as partes dos protocolos que usavam o nome antigo são atualizados), reordenar e excluir. As minutas reconhecem as qualidades pelo nome (Requerente, Ocupante, Beneficiário, Proprietário, Confrontante, Intimado): renomear uma delas faz a minuta deixar de encontrá-la.
- **Recepção → Recepção de Título**: cadastra um novo protocolo para cada processo acompanhado (veja abaixo).
- **Protocolo → Consultar Protocolos**: grade *Protocolo | Município | Interessado | Situação*. O filtro procura por qualquer um desses três dados; dois cliques abrem o protocolo. Embaixo, **Novo** (abre a Recepção de Título na mesma janela), **Excluir** e **Fechar**.
- **Indicadores → Real → Pesquisar / Urbano / Rural / Condomínio**: pesquisa e cadastro dos imóveis, com matrícula, **origem** (Matrícula Mãe ou Matrícula Filha) e vínculo ao protocolo. Na pesquisa, a grade tem as colunas *Núcleo | Lote | Quadra | Cidade* (no rural vai a denominação; no condomínio, o nome, a unidade e o bloco, com o tipo na ponta), e o filtro procura por qualquer um desses dados, pela matrícula ou pela pessoa. Cada tipo tem seus campos:
  - *Urbano*: núcleo ou loteamento, quadra, lote, logradouro, área (m²) e construção (m²);
  - *Rural*: denominação, localidade, área (ha), CCIR, NIRF/CIB, CAR e certificação SIGEF;
  - *Condomínio*: condomínio, unidade, bloco, vaga, fração ideal, área privativa e área total.

  No fim do cadastro ficam **Editar** e **Salvar**: o imóvel novo só é gravado no *Salvar* (fechar a janela antes descarta o cadastro); o imóvel já salvo abre travado, *Editar* libera os campos e só o *Salvar* grava as alterações — sair sem salvar (*Voltar à lista* ou fechar a janela) descarta. Depois do *Salvar*, a janela volta para a lista do Indicador Real. O botão *Excluir imóvel* fica embaixo, à esquerda do *Salvar*, no mesmo tamanho e formato dos outros botões do rodapé, e só aparece em imóveis já salvos (confirma no segundo clique).
- **Indicadores → Pessoal → Pesquisar / Pessoa Física / Pessoa Jurídica**: pesquisa e cadastro das pessoas, no mesmo formato do S.R.I. Na pesquisa, a grade tem as colunas *Nome | CPF/CNPJ | Protocolo vinculado*, e o filtro também procura pelo número do protocolo. No cadastro:
  - *Modalidade*: ao lado de *Qualidade*, diz se a pessoa é **Reurb-S** (interesse social, gratuita) ou **Reurb-E** (interesse específico, paga). Aparece também na linha da parte em *Partes e Imóveis* do protocolo e entra no filtro da pesquisa ("reurb-e", "reurb-s");
  - *Termos*: quarta aba, ao lado de *Informações*. É a mesma tela da *Minuta* do protocolo (lista à esquerda com *Adicionar* e *Excluir*, editor à direita, *Baixar Word*), mas os documentos ficam guardados na pessoa. *Adicionar* puxa os modelos de **Cadastros → Modelos de Minuta** marcados como *Minuta da parte* (de fábrica: notificação de titulares e confinantes, termo de oitiva e documento em branco); o texto sai preenchido com a qualificação da pessoa (ela responde por todos os campos de pessoa: requerente, ocupante, notificado…), com o protocolo e o núcleo do primeiro protocolo em que ela está e com os imóveis da *Propriedade* dela;
  - *Informações*: terceira aba, ao lado de *Propriedade*. Mostra, só para consulta, os protocolos em que a pessoa está, na mesma grade da consulta de protocolos. Não tem botão de adicionar: quando a pessoa é adicionada a um protocolo, o número dele aparece aqui sozinho. Dois cliques abrem o protocolo;
  - *Propriedade*: no alto do cadastro ficam as abas **Cadastro** (os dados abaixo), **Propriedade**, **Informações** e **Termos**, como as do protocolo. *Propriedade* mostra os imóveis vinculados à pessoa, com **Adicionar** e **Excluir**. *Adicionar* abre a pesquisa do Indicador Real: dois cliques no imóvel (ou Enter) o vinculam como *Proprietário*, a pesquisa fecha e a pessoa volta à frente já nessa aba. *Novo imóvel* ali já vincula o imóvel novo ao salvar. Na pessoa ainda não salva, os vínculos só são gravados no **Salvar** dela. Um duplo clique na linha abre o cadastro do imóvel;
  - *Dados pessoais*: nome, **qualidade** (o que a pessoa é no processo: Beneficiário, Intimado, Proprietário, Confrontante, Ocupante, Requerente ou Outro; a pessoa jurídica também tem esse campo), nascimento, óbito, CPF (com conferência dos dígitos), RG, sexo, celular, e-mail, CNH, profissão, estado civil, nacionalidade e certidão de nascimento;
  - *Casamento*: regime, data, cônjuge (ligado ao cadastro do outro cônjuge), pacto antenupcial e certidão;
  - *Endereço Residencial* (CEP, tipo, logradouro, número, complemento, bairro, município) e *Filiação* (pai e mãe);
  - *Observação*, com a opção de mostrar um aviso sempre que o cadastro for consultado.
  
  Ao lado do **Salvar** fica o botão **Arquivos**, igual ao do protocolo (lista à esquerda com *Adicionar* e *Excluir*, visualização à direita; um clique mostra, dois cliques abrem no computador), mas os arquivos ficam guardados no próprio cadastro da pessoa — cada indicador tem os seus. Na pessoa nova, os arquivos entram no cadastro junto com o *Salvar*; ao excluir a pessoa, os arquivos dela são apagados.

  No fim do cadastro ficam **Editar** e **Salvar**: a pessoa nova só é gravada no *Salvar*; a pessoa já salva abre com os campos do *Cadastro* travados, *Editar* libera e só o *Salvar* grava as alterações (o cônjuge escolhido também é atualizado no cadastro do outro nesse momento) — sair sem salvar descarta. As abas *Propriedade*, *Informações* e *Termos* e o botão *Arquivos* funcionam sem precisar do *Editar*. Depois do *Salvar*, a janela volta para a lista do Indicador Pessoal. O botão *Excluir pessoa* fica embaixo, à esquerda, no mesmo tamanho e formato dos outros botões do rodapé, e só aparece em pessoas já salvas (confirma no segundo clique).

  No arquivo aberto no navegador, a lupa do CEP preenche o endereço automaticamente (ViaCEP).

### O protocolo é o centro do trabalho

Tudo começa na **Recepção de Título**, que cria o protocolo. No topo da ficha ficam os botões **Minuta** e **Arquivos**, lado a lado; no rodapé, **Excluir protocolo** no canto esquerdo. Minuta e Arquivos abrem um quadro à frente, dentro da janela do protocolo (fecha no X, no Esc ou clicando fora):

- **Arquivos** (ao lado de *Minuta*): documentos do protocolo (PDF, imagens, Word, Excel…). À esquerda fica a lista, com os botões **Adicionar** (um ou vários arquivos; também dá para arrastá-los para a janela) e **Excluir**; à direita, a visualização: **um clique** num arquivo o mostra ali; **dois cliques** o abrem no computador (baixa o arquivo; Shift+Enter faz o mesmo pelo teclado). Mostra PDF, imagens, vídeos, textos, Word (.docx) e planilhas (Excel, ODS, CSV, com uma aba por planilha); os outros tipos, e o Word/Excel sem internet, ficam com o botão **Baixar**. Cada anexo e cada exclusão entram nos andamentos. Na página publicada os arquivos ficam guardados com a própria página, até 20 MB cada (15 MB para tipos que não sejam PDF, imagem ou vídeo); no `index.html`, ficam no navegador em que foram anexados. O backup em JSON leva a lista, mas não o conteúdo dos arquivos.
- **Minuta**: os documentos do protocolo — ofícios do município, decretos, parecer, PRF, CRF… As minutas de cada parte (notificação, termo de oitiva) ficam separadas, na aba *Termos* do Indicador Pessoal dela. O botão abre a tela de criação, no formato da tela de atos do S.R.I.: no alto, a identificação (núcleo, município e interessado), *Protocolo*, *Minuta nº* (sequencial no protocolo), *Data*, *Título da minuta* e *Modelo*; abaixo, a aba *Texto/Partes Envolvidas*, com a barra de formatação, a folha e a grade das partes do protocolo (*Nome | CPF/CNPJ | Qualidade | Modalidade | Imóvel*) — dois cliques numa parte, ou **Inserir qualificação**, põem a qualificação dela onde está o cursor; **Abrir cadastro** abre a pessoa; **Remover parte** tira a parte marcada só desta minuta (o protocolo não muda) — ela sai da grade e dos campos de pessoa do modelo, e o texto é refeito sem ela se ainda não foi mexido; e, embaixo, **Salvar** e **Fechar**. *Modelo* lista os modelos de **Cadastros → Modelos de Minuta** marcados como *Minuta do protocolo*, agrupados (os seus e os prontos); escolher um preenche o texto e o título, e trocar de modelo depois de mexer no texto pede confirmação. **Salvar** avisa se ainda há campos [entre colchetes] (um segundo clique salva assim mesmo), registra o andamento e leva a minuta para a aba **Minutas Realizadas**. Fechar com a minuta mexida e não salva avisa antes de descartar. Os modelos prontos:
  - *Instauração*: requerimento de instauração e decreto de instauração;
  - *Notificações*: edital de notificação;
  - *Instrução*: parecer jurídico (com as pendências do checklist aplicado ao protocolo);
  - *Projeto e aprovação*: Projeto de Regularização Fundiária (PRF, com os elementos do art. 35 e o quadro de unidades) e decreto de aprovação e conclusão;
  - *Titulação e registro*: Certidão de Regularização Fundiária (CRF, com o conteúdo do art. 41 e a listagem dos ocupantes) e ofício ao Registro de Imóveis;
  - documento em branco.

  O texto já sai preenchido com os dados do protocolo, das pessoas (qualificação completa, com concordância de gênero) e dos imóveis; o que falta aparece **[entre colchetes]**, destacado em amarelo, e a barra mostra quantos campos faltam. Um clique no campo o seleciona para digitar por cima. No alto ficam o título e os botões; logo abaixo, numa linha só dela, a barra de ferramentas, como a do S.R.I.: desfazer e refazer; negrito, itálico e sublinhado; alinhar à esquerda, centralizar, à direita e justificar; diminuir e aumentar recuo (1,25 cm por clique); **Aa** — maiúsculas e minúsculas (*Primeira letra maiúscula*, *TODAS MAIÚSCULAS*, *todas minúsculas*, *Cada Palavra em Maiúscula*; também no Alt+F3); limpar formatação; inserir tabela (linhas × colunas); quebra de página; localizar e substituir; verificação ortográfica (liga e desliga); copiar o texto; e trazer o texto de um arquivo do Word (.docx). A contagem de campos a preencher fica na ponta da barra. Colar traz só o texto. Nos *Termos* do Indicador Pessoal o mesmo editor salva sozinho e tem **Baixar Word** (o `.docx` abre no Word e no LibreOffice Writer; recuo, alinhamento, tabela e quebra de página vão junto).

  > Os modelos são pontos de partida: confira a redação e os dispositivos legais com a legislação vigente e a lei municipal antes de usar.

Na página, abaixo da barra, fica a linha de abas **Recepção**, **Andamentos**, **Financeiro**, **Checklists**, **Partes e Imóveis**, **Minutas Realizadas** e **Observação**. Cada aba mostra só o seu conteúdo, e o protocolo abre em *Recepção*:

| Aba | O que tem |
| --- | --- |
| **Recepção** | O quadro *Dados do protocolo*: na primeira linha, ordem de protocolo e situação à esquerda e abertura e prazo estimado à direita; depois município, interessado e contato; e a descrição do pedido. Os campos ficam travados: embaixo, **Editar** libera a edição e **Salvar** grava e trava de novo (nada é gravado antes do *Salvar*; a mudança de situação entra nos andamentos ao salvar). |
| **Andamentos** | Histórico datado; registra sozinho a abertura, as mudanças de situação e os checklists aplicados. |
| **Financeiro** | **Contrato** no alto, travado como a Recepção (**Editar** libera, **Salvar** grava): honorários, forma de pagamento — *À vista* (um vencimento), *Parcelado* (número de parcelas e 1º vencimento; as parcelas saem mês a mês, com os centavos acertados na última e o dia ajustado no fim do mês) ou *Por etapas* (você monta as parcelas, por exemplo instauração, aprovação do PRF e registro da CRF). Abaixo, uma linha com *Contratado*, *Recebido*, *Retido*, *A receber*, *Vencido*, *Despesas* e *Saldo* (recebido menos despesas) e a barra do quanto do contrato já foi quitado; se as parcelas não somam o contrato, um aviso diz a diferença. Depois, as abas **Parcelas** e **Despesas**, em grade: um clique marca, dois cliques abrem. **Receber** registra o pagamento da parcela marcada (data, valor recebido, retenção de impostos na fonte — ISS, IR — e documento: nota fiscal, empenho ou comprovante); aceita pagamento parcial e não deixa passar do que falta. **Estornar** desfaz o último recebimento (confirma no segundo clique). **Excluir todo financeiro**, ao lado de *Excluir* (nas duas abas), apaga de uma vez o contrato, as parcelas com os recebimentos e as despesas do protocolo — confirma no segundo clique e fica registrado nos andamentos. Parcela com recebimento não é editada nem excluída sem antes estornar; *Nova parcela*, *Editar* e *Excluir* passam o contrato para *Por etapas*, e salvar o contrato de novo refaz só as parcelas em aberto. Contrato, recebimentos e estornos entram nos andamentos, e parcela vencida aparece como alerta no alto do protocolo. Os lançamentos do formato anterior viram parcelas pagas (e o que faltava do contrato, uma parcela *Saldo*) e despesas. |
| **Checklists** | Análises aplicadas ao protocolo, com progresso e pendências, e o botão *Aplicar checklist*. |
| **Partes e Imóveis** | No alto, **Cadastrar Pessoa** e **Cadastrar Imóvel** de um lado e **Adicionar** e **Excluir** do outro; abaixo, a lista de quem está no protocolo, em duas metades separadas por uma linha: a parte (*Nome \| CPF \| qualidade* — a qualidade vem do cadastro da pessoa; sem ela, *Beneficiário*) e, do outro lado, a propriedade dela (*Lote \| Quadra \| Área*, uma linha por imóvel da aba *Propriedade*) — ou *Sem propriedade*. *Cadastrar Pessoa* e *Cadastrar Imóvel* abrem o cadastro numa janela; no **Salvar** ele entra no protocolo, a janela fecha e o protocolo volta à frente com a linha marcada. *Adicionar* abre a pesquisa do Indicador Pessoal: dê dois cliques no nome (ou marque e clique em *Selecionar*) para adicionar a parte — os imóveis dela que ainda não estão em nenhum protocolo entram junto. Um imóvel vinculado depois a quem já é parte também entra no protocolo. *Excluir* tira a parte do protocolo com os imóveis que só ela ocupava (confirmando no segundo clique). Imóveis do protocolo sem nenhuma parte aparecem numa linha *Sem parte*. Dois cliques na metade da parte abrem a pessoa; na metade do imóvel, o imóvel. |
| **Minutas Realizadas** | As minutas salvas pela tela *Minuta*, em PDF: à esquerda a grade *Nº \| Título \| Data*; um clique mostra o PDF ao lado (A4, Times 12, margens de 3 e 2 cm), com **Baixar PDF**; dois cliques baixam o PDF. **Excluir Minuta** apaga a marcada (confirma no segundo clique) e registra o andamento. O PDF é montado a partir do texto guardado no protocolo, por isso entra no backup em JSON; na primeira vez é preciso estar conectado à internet. |
| **Observação** | Um campo livre, em branco, para anotar o que quiser sobre o protocolo. Fica travado como a Recepção: **Editar** libera e **Salvar** grava (antes do *Salvar*, nada é gravado). |

Imóveis e análises mostram um botão *Protocolo 0000/AAAA*, que abre (ou traz para a frente) a janela do protocolo de origem; na pessoa, os protocolos ficam na aba *Informações*.

### Protocolos (Recepção)

- **Ordem de protocolo**: número automático por ano (`0001/2026`, `0002/2026`…), exibido no início do quadro *Dados do protocolo* e sem possibilidade de alteração.
- **Abertura**: data e hora registradas automaticamente no clique em *Recepção de Título*, sem possibilidade de alteração.
- **Dados do protocolo**: interessado (quem está contratando), contato, e-mail, município, nome do núcleo, prazo estimado e descrição do pedido.
- **Contato**: só números, no formato `(XX) XXXXX-XXXX` (o sistema põe parênteses, espaço e hífen enquanto você digita).
- **E-mail**: ao lado de *Contato*, na Recepção de Título e na aba Recepção; o *Salvar* não aceita e-mail mal escrito.
- **Nome do núcleo**: ao lado de *Situação*. É o núcleo que aparece na identificação da *Minuta* e no campo *Núcleo* dos modelos de minuta (antes do núcleo do checklist ou dos imóveis), e também entra no filtro da consulta de protocolos.
- **Situação**: aberto, em análise, aguardando documentos, concluído ou arquivado. Cada mudança fica registrada nos andamentos.
- **Prazo estimado**: o protocolo avisa quando faltam 7 dias ou menos e quando o prazo venceu.
- **Andamentos**: histórico datado de tudo o que aconteceu no processo, em ordem cronológica — o mais antigo em cima e o novo entrando embaixo (fica destacado por um instante).
- **Aplicar checklist** (na aba *Checklists*): mostra só os nomes dos checklists cadastrados (modelos em branco, sem nenhuma pergunta escrita, ficam de fora); ali não se cria checklist. Ao escolher um, a análise do núcleo abre vinculada ao protocolo, pronta para responder (município e número vêm do protocolo). A análise mostra o link de volta para o protocolo.
- **Excluir protocolo**: fica no canto inferior esquerdo da janela, abaixo de uma linha fina, e pede confirmação no segundo clique. Esse rodapé fica sempre no mesmo lugar, embaixo da janela, em qualquer aba — o mesmo vale para o rodapé do Indicador Pessoal (*Excluir pessoa*, *Arquivos*, *Salvar*), do Indicador Real e do checklist. Imóveis, pessoas e checklists continuam cadastrados.

> Use **Sistema → Exportar backup (JSON)** (ou o ícone do disquete) de tempos em tempos. Se você limpar os dados do navegador ou trocar de computador, é esse arquivo que recupera os modelos e as análises (**Sistema → Importar arquivo JSON**).

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
| Visualizar Checklist | Mostra o checklist como no S.R.I. — *1 - pergunta*, caixas de marcar e as sub-perguntas (*2.1 - …*) aparecendo conforme a resposta —, sem salvar nada; **Fechar** no canto |
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
