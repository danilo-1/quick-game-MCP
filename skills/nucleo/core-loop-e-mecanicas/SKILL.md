---
name: core-loop-e-mecanicas
description: Define o loop principal (o que o jogador repete) e transforma verbos em mecânicas com regras claras, incluindo condições de vitória e derrota. Use nas etapas de loop principal e mecânicas.
etapas: [core_loop, mecanicas]
tags: [core loop, mecanicas, regras, verbos, vitoria, derrota]
---

# Loop principal e mecânicas

## Três camadas de loop

- **Momento a momento (segundos)**: o verbo principal. Pular, atirar, combinar, escolher.
- **Loop de sessão (minutos)**: uma fase, uma run, um dia no jogo. Começa, tem tensão, termina.
- **Meta-loop (horas)**: o que muda entre sessões. Desbloqueios, história, coleção, upgrades.

Todo jogo precisa do primeiro e do segundo. O terceiro é opcional no MVP.

Formato para salvar em `loop_principal`: `Ação → Resultado → Recompensa → (volta)`.
Ex.: *Explorar a sala → enfrentar inimigos → pegar moedas → comprar upgrade → próxima sala.*

## De verbo a mecânica

Para cada verbo, defina em uma linha:

1. **Gatilho**: o que o jogador aperta/faz.
2. **Regra**: o que acontece no mundo.
3. **Limite**: o que impede abuso (recarga, custo, estamina, número de usos).
4. **Feedback**: como o jogador percebe (som, partícula, tremor de tela, número).

> Pulo duplo: Espaço no ar → impulso para cima → 1 vez até tocar o chão → som "whoosh" + poeira.

## Vitória e derrota

- Deixe claro **o que é vencer** em cada escala (fase, jogo).
- Derrota boa: rápida de entender, rápida de recomeçar, ensina algo.
- Escolha o **custo da derrota**: recomeça a sala (leve), a fase (médio), a run inteira (roguelike).
  Pergunte ao usuário qual combina com a fantasia.

## Inimigos e obstáculos

Descreva cada um por **comportamento**, não por aparência: "anda até a borda e volta",
"persegue quando te vê", "atira a cada 2 s em linha reta". Comportamentos simples e legíveis
combinados criam situações ricas.

## Controles

Proponha um esquema padrão do gênero (o usuário raramente quer reinventar):
- Plataforma: setas/WASD + Espaço para pular.
- Top-down: WASD move, mouse mira, clique ataca.
- Tiro vertical: setas movem, Espaço atira.
- Toque (celular): botões virtuais grandes ou gestos (arrastar/tocar).

## Teste do papel

Antes de concluir, narre 30 segundos de jogo para o usuário como se fosse um replay:
"Você entra na sala, um morcego vem na sua direção, você pula e…". Se a narração for
chata ou confusa, o loop precisa de ajuste.
