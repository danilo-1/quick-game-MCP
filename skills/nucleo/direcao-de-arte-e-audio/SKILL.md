---
name: direcao-de-arte-e-audio
description: Ajuda quem não é artista a definir estilo visual, paleta, áudio e lista de assets viáveis, com fontes de assets livres e cuidados de licença. Use na etapa de arte e áudio.
etapas: [arte_audio]
tags: [arte, visual, paleta, cores, audio, musica, assets, licenca, pixel art]
---

# Direção de arte e áudio

## Descobrir o estilo sem jargão

Ofereça 3–4 opções com referências conhecidas:

- **Pixel art** (Celeste, Stardew): barato de produzir, envelhece bem.
- **Formas geométricas / minimalista** (Thomas Was Alone, Geometry Dash): o mais rápido; a paleta faz tudo.
- **Desenho à mão / vetorial** (Hollow Knight, Cuphead): marcante, mais caro.
- **3D low-poly** (A Short Hike): 3D acessível.

Pergunte também **3 adjetivos** do visual ("aconchegante, colorido, noturno") e use-os como regra.

## Paleta

- 4–6 cores com papéis fixos. No protótipo a ordem importa:
  **1 fundo · 2 jogador · 3 perigo/inimigo · 4 destaque/coletável · 5 texto**.
- O jogador e os perigos devem ser os elementos de **maior contraste**.
- Paletas prontas (livres para usar): PICO-8, Sweetie 16, Endesga 32, Resurrect 64 (Lospec.com).
  Ex. PICO-8: `#1d2b53 #ffec27 #ff004d #29adff #fff1e8`.
- Verifique legibilidade para daltonismo: não diferencie amigo/inimigo **só** por vermelho/verde.

## Áudio

- **Música**: defina gênero e energia (chiptune animado, piano calmo, synthwave tenso).
- **Efeitos**: lista dos sons do loop principal primeiro (pulo, acerto, coleta, dano, vitória).
- Ferramentas simples: jsfxr/sfxr para efeitos retrô; BeepBox para músicas chiptune.

## Lista de assets

Liste por prioridade do MVP: personagem (estados: parado, andando, pulando, dano), inimigos,
cenário/tiles, coletáveis, UI (botões, ícones), efeitos (partículas). Comece com o protótipo
usando formas e só depois troque pela arte final.

## Fontes de assets livres (sempre confira a licença de cada pacote)

| Fonte | Licença típica | Observação |
|---|---|---|
| Kenney.nl | CC0 (domínio público) | Enorme e consistente; ótimo para MVP |
| OpenGameArt.org | Varia (CC0, CC-BY, GPL…) | Verifique cada item; CC-BY exige crédito |
| itch.io (assets) | Varia; muitos gratuitos | Leia os termos de uso comercial |
| Freesound.org | CC0 / CC-BY / CC-BY-NC | NC proíbe uso comercial |

Mantenha um arquivo `CREDITOS.md` com autor, link e licença de cada asset usado.

## Arte gerada por IA

Se o usuário quiser usá-la, alerte: termos variam entre ferramentas, algumas lojas exigem
declaração (ex.: Steam pede divulgação de conteúdo gerado por IA) e consistência entre imagens
exige uma direção bem definida. Para fluxo detalhado de produção de assets, veja a skill
`create-game-assets`.
