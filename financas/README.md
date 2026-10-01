# Finanças

Controle financeiro com a mesma estrutura da página **Finanças 2026** do Notion, em um único arquivo (`index.html`), sem instalação nem servidor.

## Como usar

Abra `index.html` no navegador. Os dados ficam salvos no próprio navegador (`localStorage`). Para levar para outro aparelho ou guardar uma cópia, use o menu **⋯ → Exportar backup (.json)** e depois **Importar backup (.json)**.

## Bases

| Base | Colunas |
| --- | --- |
| Despesas Variáveis | Descrição, Categoria, Data, Valor, Forma de Pagamento, Qual foi o cartão?, Data de Vencimento, Status |
| Dívidas e Parcelamentos | Descrição, Data, Valor Total, Total Pago, Saldo Restante, Progresso, Parcela, Obs: |
| Investimentos | Descrição, Corretora, Tipo de Investimento, Data, Valor |
| Despesas Fixas | Descrição, Categoria, Data do Debito, Valor, Forma de Pagamento, Qual foi o cartão?, Obs |
| Ganhos | Descrição, Data, Valor |
| Resumo | Nome, VALOR QUE ENTROU, VALOR DE SAÍDA, SALDO |
| Pagamentos de Dívidas | Descrição, Data, Dívida, Valor Pago |

Cada base tem a aba do ano (registros ligados ao Resumo principal) e uma aba por mês, filtrada pela data. Em Despesas Fixas, as abas de mês mostram as despesas sem data de vencimento (recorrentes) e as que vencem naquele mês.

## Fórmulas

- **Total Pago** = soma do Valor Pago dos pagamentos ligados à dívida
- **Saldo Restante** = Valor Total − Total Pago
- **Progresso** = Total Pago ÷ Valor Total
- **VALOR QUE ENTROU** = Total Ganhos
- **VALOR DE SAÍDA** = Despesas Fixas + Despesas Variáveis + Dívidas Pagas + Investimentos
- **SALDO** = Valor que entrou − Valor de saída

## Recursos

- Edição direto na célula: texto, número em reais (aceita `1.234,56`), data, seleção com opções coloridas (é possível criar novas) e relações.
- Página lateral de cada registro com todas as propriedades. Na dívida, **Adicionar pagamento** cria o pagamento já ligado.
- Pesquisa, ordenação por coluna, soma no rodapé, duplicar e excluir com opção de desfazer.
- Tema claro e escuro conforme o sistema, e layout para celular.
