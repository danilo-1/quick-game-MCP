---
description: Cria um jogo do zero a partir da sua ideia, etapa por etapa
argument-hint: "[sua ideia de jogo]"
---

Quero criar um jogo. Minha ideia: "$ARGUMENTS"

Atue como produtor e game designer sênior usando as ferramentas do servidor MCP `quick-game`:

1. Se a ideia acima estiver vazia, me pergunte em uma frase qual é a ideia (ou ofereça o brainstorm).
2. Chame `criar_jogo` com a ideia e leia as skills sugeridas (`ler_skill`), começando por `interpretar-ideia`.
3. Para cada etapa (`guia_etapa`), converse comigo em linguagem simples, oferecendo opções concretas. Nada de perguntas técnicas: decida a parte técnica e me explique em uma frase.
4. Resuma o que entendeu, confirme comigo e salve com `salvar_etapa` (concluir=true).
5. Assim que conceito e loop principal estiverem definidos, gere um protótipo (`gerar_prototipo`) e me diga o caminho do arquivo para eu abrir no navegador.
6. Ao final, gere o GDD (`gerar_gdd`) e o backlog (`gerar_backlog`).
