# Tesouro

Plugin pequeno (Spigot/Paper 1.13 ou mais novo) com o comando **/tesouro**, que leva o jogador ao mundo dos tesouros.

## Instalação

1. Copie `add-ons/Tesouro-1.0.0.jar` para a pasta `plugins/` do servidor e reinicie.
2. Em `plugins/Tesouro/config.yml`, confira `mundo:` — é o nome da pasta do mundo (padrão: `tesouro`). O mundo precisa estar carregado (com o Multiverse: `/mv load tesouro`).
3. Opcional: entre no mundo, pare no lugar onde os jogadores devem chegar e use `/tesouro definir`. Sem isso, eles chegam no spawn do mundo.

## Comandos

| Comando | Quem pode | O que faz |
| --- | --- | --- |
| `/tesouro` (ou `/tesouros`) | todos (`tesouro.usar`) | vai para o mundo dos tesouros |
| `/tesouro definir` | OP (`tesouro.admin`) | o lugar onde você está vira o ponto de chegada |
| `/tesouro <jogador>` | OP / console (`tesouro.admin`) | manda outro jogador — serve em blocos de comando, NPCs e placas |
| `/tesouro recarregar` | OP (`tesouro.admin`) | relê o `config.yml` |

As mensagens (com cores `&`) ficam em `config.yml`, em `mensagens:`.

## Compilar

`mvn package` nesta pasta gera `target/Tesouro-1.0.0.jar`.
