---
name: ux-e-onboarding
description: Define telas, HUD, fluxo de navegação, tutorial implícito e acessibilidade básica. Use na etapa de interface e experiência e quando playtesters se perdem ou não entendem o objetivo.
etapas: [ux_interface, conteudo_niveis]
tags: [ux, ui, hud, menu, tutorial, onboarding, acessibilidade]
---

# Interface, experiência e onboarding

## Fluxo de telas mínimo

`Título → Jogo ⇄ Pausa → (Vitória | Fim de jogo) → Título ou Jogar de novo`

Opções (volume, controles) podem esperar o pós-MVP, exceto se o público precisar delas.

## HUD: só o que muda decisões

Pergunte para cada elemento: *"O jogador faria algo diferente ao ver isso?"* Se não, tire.
Comum: vida, recurso principal (munição, energia), progresso (pontos, fase, onda).
Posicione nos cantos; o centro é do jogo.

## Onboarding sem textão

- **A primeira fase é o tutorial.** Ensine uma coisa por vez, num espaço seguro.
- **Mostre, não diga**: um buraco pequeno ensina a pular; um inimigo lento ensina a atacar.
- Dicas de controle **no momento do uso** e só na primeira vez.
- O objetivo deve ser visível ou dito em uma frase na tela de título.

Exemplo de 1ª fase de plataforma: andar → pequeno degrau (pula) → buraco (pulo com risco
baixo) → moeda num ponto alto (incentiva pulo) → inimigo lento (pular em cima) → bandeira.

## Feedback

Toda ação do jogador precisa de resposta em < 100 ms: som, animação, número, tremor.
Dano recebido deve ser inconfundível (piscar, som diferente, tremor).

## Acessibilidade básica (barata e importante)

- Não usar só cor para informação crítica.
- Tamanho de texto legível (≥ 18 px em 1080p) e alto contraste.
- Controles remapeáveis ou alternativos (WASD e setas).
- Opção de reduzir tremor de tela e flashes.
- Pausa a qualquer momento.

Para aprofundar em UI de engine, veja `game-ui-ux` (comunidade).
