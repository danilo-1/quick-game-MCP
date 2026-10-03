---
name: game-design-document
description: Estrutura e boas práticas para escrever e manter o GDD (documento de design) e o one-pager de um jogo. Use ao gerar o GDD, ao preparar um pitch para terceiros ou ao revisar se o design está completo.
etapas: [conceito, escopo, lancamento]
tags: [gdd, documento, one-pager, pitch, design document]
---

# Documento de Design do Jogo (GDD)

O GDD é a **fonte única de verdade** do jogo. Aqui ele é gerado automaticamente por
`gerar_gdd` a partir das etapas salvas; seu papel é garantir que o conteúdo seja bom.

## Princípios

- **Vivo, não monumento.** Atualize a cada decisão (`salvar_etapa`, `anotar_decisao`).
- **Concreto.** "O pulo alcança 3 blocos de altura" e não "o pulo é satisfatório".
- **Curto primeiro.** Comece pelo one-pager; detalhe só o que for ser construído em breve.
- **Decisões com motivo.** Quando algo for cortado ou mudado, anote o porquê.

## One-pager (para apresentar a alguém)

1. Título + pitch de uma linha
2. Gênero, plataforma, público
3. Fantasia do jogador + 3 pilares
4. Loop principal (3–4 passos)
5. 3 features que diferenciam
6. Referências visuais (2–3 jogos)
7. Escopo: prazo, equipe, MVP

## Estrutura completa (espelha as etapas do quick-game-mcp)

Conceito · Loop principal · Mecânicas e controles · Progressão e economia · Escopo e MVP ·
Mundo e narrativa · Arte e áudio · Conteúdo e níveis · Interface · Protótipo · Playtest ·
Lançamento · Notas e decisões.

## Revisão de completude

Antes de dar o GDD como pronto, verifique:

- Alguém que nunca ouviu da ideia entende **o que faz** nos primeiros 30 s?
- Toda mecânica tem regra, limite e feedback?
- Vitória e derrota estão definidas?
- O MVP é jogável do começo ao fim?
- Não há termo vago sem número ou exemplo ("muitos inimigos" → "6 por onda, +3 por onda")?

Liste para o usuário apenas o que falta, em linguagem simples, e volte à etapa correspondente.
