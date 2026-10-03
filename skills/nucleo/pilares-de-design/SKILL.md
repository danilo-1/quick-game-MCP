---
name: pilares-de-design
description: Como definir 3 pilares de design que servem de filtro para todas as decisões do jogo. Use na etapa de conceito e sempre que surgir dúvida se uma feature deve entrar.
etapas: [conceito, escopo]
tags: [pilares, visao, decisao, filtro, conceito]
---

# Pilares de design

Pilares são **3 frases curtas** que descrevem a experiência que o jogo precisa entregar. Eles
servem para decidir: toda feature nova precisa servir a pelo menos um pilar.

## Como escrever

- Curto e memorável (2–5 palavras + uma frase de explicação).
- Sobre a **experiência do jogador**, não sobre features ("Combate tático" é melhor que "Ter 20 armas").
- Que gere **conflito útil**: um bom pilar diz não a alguma coisa.

Exemplos:

| Jogo hipotético | Pilares |
|---|---|
| Plataforma espacial | **Movimento delicioso**: pular e planar é bom por si só. **Curiosidade recompensada**: todo canto esconde algo. **Desafio justo**: morrer é culpa sua e recomeçar é instantâneo. |
| Jogo de fazenda | **Ritmo calmo**: nada pune a pausa. **Pequenas conquistas diárias**. **Comunidade viva**: os vizinhos lembram de você. |
| Roguelike de cartas | **Cada run conta uma história**. **Sinergias descobertas**. **Decisões rápidas, consequências longas**. |

## Como conduzir com o usuário

1. A partir da fantasia do jogador, proponha 5–6 candidatos a pilar.
2. Peça para ele escolher os 3 que "se perdesse, não seria mais o jogo dele".
3. Teste: cite uma feature tentadora (ex.: multiplayer) e pergunte a qual pilar ela serve.
   Se nenhum, ela vai para `fora_do_escopo`.

## Uso contínuo

Em toda etapa posterior, quando o usuário sugerir algo novo, verifique contra os pilares e diga
em uma frase qual pilar a ideia reforça ou por que ela compete com eles.
