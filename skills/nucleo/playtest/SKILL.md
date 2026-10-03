---
name: playtest
description: Planeja e conduz playtests, cria perguntas para testadores, organiza achados e transforma feedback em ajustes priorizados. Use na etapa de playtest e balanceamento ou sempre que o usuário trouxer feedback de jogadores.
etapas: [playtest_balanceamento, prototipo]
tags: [playtest, teste, feedback, metricas, balanceamento, relatorio]
---

# Playtest

## Plano rápido

1. **Objetivo do teste** (um só): "Entendem o objetivo sem ajuda?" ou "A fase 3 é difícil demais?"
2. **Quem**: 3–5 pessoas que **não** acompanharam o desenvolvimento. 5 pessoas encontram a maioria dos problemas grandes.
3. **Como**: peça para jogarem pensando em voz alta. **Não ajude, não explique.** Anote onde travam.
4. **Duração**: 10–20 min de jogo + 5 min de perguntas.

## O que observar (vale mais que o que dizem)

- Onde param, hesitam ou repetem a mesma falha.
- O que tentam fazer que o jogo não permite (desejos escondidos).
- Quando sorriem, reclamam em voz alta ou largam o controle.
- Quanto tempo até entender o objetivo.

## Perguntas pós-jogo (abertas, não induzidas)

- "Me conta com suas palavras o que era o jogo."
- "Qual foi o momento mais legal? E o mais frustrante?"
- "Teve algo que você queria fazer e não conseguiu?"
- "Você jogaria de novo? Por quê?"
- Escala 1–5: diversão, dificuldade, clareza.

Evite: "Você gostou do pulo duplo?" (induz). Prefira: "O que achou de se mover pelo mapa?"

## Organizando os achados

| Achado | Quantos viram | Gravidade (1–3) | Ideia de ajuste |
|---|---|---|---|

Prioridade = quantos viram × gravidade. Corrija o topo, teste de novo. Salve em
`resultados` e `ajustes` com `salvar_etapa`.

## Traduzindo feedback em ação

- Jogador diz **o problema** com precisão, mas **a solução** sugerida costuma ser ruim.
  "O chefe é impossível" → investigue: o padrão do ataque é legível? Há tempo de reação?
- Ajustes de sensação e dificuldade no protótipo: veja `progressao-e-economia` e `game-feel`.
