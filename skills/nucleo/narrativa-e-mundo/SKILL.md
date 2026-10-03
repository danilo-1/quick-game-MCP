---
name: narrativa-e-mundo
description: Constrói mundo, personagens, tom e história de forma enxuta e integrada ao gameplay, incluindo histórias com escolhas. Use na etapa de mundo e narrativa e ao montar cenas do protótipo narrativo.
etapas: [mundo_narrativa]
tags: [narrativa, historia, mundo, personagens, tom, dialogo, escolhas]
---

# Mundo e narrativa

## Comece pelo mínimo

Para quase todo jogo, bastam 4 frases:
1. **Onde** (cenário com um detalhe marcante).
2. **Quem** (protagonista + o que quer).
3. **O que impede** (conflito).
4. **Tom** (fofo, sombrio, cômico, melancólico…).

Jogos abstratos (puzzle, arcade) podem ter só tom e ambientação. Não force história.

## Narrativa a serviço do loop

- A história deve **explicar o verbo**: por que o jogador pula, atira, coleta?
- Prefira **contar pelo ambiente** (cenário, itens, inimigos) a blocos de texto.
- Cada fase pode revelar **uma** informação nova.

## Estrutura simples (3 atos)

- **Começo**: mundo normal + chamado (5–10% do jogo).
- **Meio**: complicações crescem; o protagonista aprende/muda.
- **Fim**: confronto final + mudança no mundo.

## Personagens

Para cada personagem importante: **quer**, **teme**, **jeito de falar** (1 exemplo de fala).
Um bom detalhe vale mais que uma biografia longa.

## Histórias com escolhas (visual novel / diálogos)

- Use **marcas** (flags) para lembrar escolhas e liberar caminhos depois.
- Funil: ramifique e reconverja; 2–3 finais bastam para um MVP.
- Toda escolha deve ser **significativa** (muda algo) ou **expressiva** (diz quem o jogador é).

No protótipo `narrativa`, cada cena é:
`{ quem, texto, cenario (emoji), cor, escolhas: [{ texto, ir, marca?, se? }], fim? }`,
começando pela cena `inicio`. `marca` grava uma escolha; `se` só mostra a opção se a marca existir.

## Tom e escrita

- Frases curtas na tela. Diálogos com no máximo 2–3 linhas por fala.
- Evite exposição ("Como você sabe, o reino…"). Mostre por ação.
