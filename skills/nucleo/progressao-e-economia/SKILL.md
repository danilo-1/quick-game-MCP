---
name: progressao-e-economia
description: Desenha progressão, curva de dificuldade, recompensas e economia (moedas, upgrades) e orienta o balanceamento por números. Use nas etapas de progressão e de playtest/balanceamento.
etapas: [progressao, playtest_balanceamento]
tags: [progressao, dificuldade, economia, balanceamento, recompensa, curva]
---

# Progressão, dificuldade e economia

## Tipos de progressão (escolha 1–2)

- **Linear por fases**: fase 1, 2, 3… Simples e clara.
- **Mapa aberto com portões**: áreas liberadas por habilidade/chave (metroidvania).
- **Runs**: cada partida recomeça; o jogador (ou um meta-progresso) evolui (roguelike).
- **Crescimento contínuo**: números sobem sem fim (idle/clicker, survivors).
- **Narrativa**: avanço é a história (visual novel).

## Curva de dificuldade: ensinar → testar → combinar → torcer

1. **Ensinar**: apresente a ideia sem risco.
2. **Testar**: cobre a ideia sozinha com risco leve.
3. **Combinar**: misture com o que já foi aprendido.
4. **Torcer**: uma variação surpreendente no fim do mundo/capítulo.

Alterne picos de tensão com respiros (curva serrilhada, não rampa reta).

## Recompensas

- **Frequência**: algo pequeno a cada 30–60 s, algo médio a cada sessão, algo grande a cada poucas sessões.
- **Variedade**: poder (habilidade), conteúdo (fase nova), cosmético, história, conhecimento.
- Recompensa deve **mudar como se joga**, não só números maiores, sempre que possível.

## Economia simples (se houver moeda)

Defina **fontes** (de onde vem) e **ralos** (para onde vai). Exemplo:

| Fontes | Ralos |
|---|---|
| inimigos derrotados (1–3), baús (10), fim de fase (25) | upgrade de vida (50, 100, 200), nova arma (150) |

Regra prática: o jogador deve conseguir a 1ª compra relevante na **1ª ou 2ª sessão**.
Custos crescendo ×1,5 a ×2 por nível funcionam bem para upgrades.

## Balanceamento por números (sem código)

No protótipo, a sensação é controlada por parâmetros de `gerar_prototipo.ajustes`. Mude
**um parâmetro por vez**, em passos de 10–25%, e peça ao usuário para jogar de novo.

| Queixa | Ajuste provável |
|---|---|
| "difícil demais" | menos inimigos (`inimigosPorOnda`), inimigos mais lentos (`velocidadeInimigo`), mais `vidas`/`vida` |
| "fácil/chato" | o contrário, ou mais `ondas`/fases |
| "pulo pesado" | `gravidade` menor ou `forcaPulo` maior |
| "pulo flutuante" | `gravidade` maior |
| "lento" | `velocidade` maior, `cadenciaTiro` menor |

Anote cada mudança e o motivo com `anotar_decisao`.
