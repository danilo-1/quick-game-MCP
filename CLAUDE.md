# quick-game-mcp

Este repositório é um servidor MCP para criar jogos. Ao abrir o Claude Code aqui, o servidor
`quick-game` (definido em `.mcp.json`) sobe sozinho: na primeira vez ele instala as dependências e compila.

## Quando o usuário quiser criar ou continuar um jogo

Use as ferramentas do servidor `quick-game` em vez de escrever código à mão: `criar_jogo`,
`guia_etapa`, `salvar_etapa`, `gerar_prototipo`, `gerar_gdd`. Fale em português, não peça
decisões técnicas e leia as skills recomendadas (`ler_skill`) antes de cada etapa. Os jogos ficam
em `jogos/` (fora do git).

## Desenvolvendo o próprio servidor

- `npm run build` compila `src/` para `dist/`; `npm test` roda o teste de ponta a ponta.
- Etapas: `src/stages.ts`. Roteador de gênero/engine: `src/skills.ts`. Modelos de protótipo: `templates/prototipos/`.
- Skills novas: uma pasta com `SKILL.md` em `skills/` (veja `skills/README.md`). Coleções de terceiros
  vão em `skills/comunidade/<nome>/` com o arquivo de licença original.
- Depois de mudar `src/`, reinicie o servidor com `/mcp` no Claude Code.
