# quick-game-mcp

Repositório do plugin `quick-game` para o Claude Code: um servidor MCP de criação de jogos, skills de
game dev e comandos. A raiz é ao mesmo tempo o plugin (`.claude-plugin/plugin.json`) e o marketplace
(`.claude-plugin/marketplace.json`).

## Desenvolvendo

- `npm install` instala e compila; `npm test` roda o teste de ponta a ponta; `claude plugin validate .` valida o plugin.
- Para testar o plugin local: `claude --plugin-dir .` (depois de mudar `src/`, use `/reload-plugins`).
- Etapas: `src/stages.ts`. Roteador de gênero/engine: `src/skills.ts`. Modelos de protótipo: `templates/prototipos/`.
- Skills do núcleo (`skills/nucleo/`) são também skills nativas do plugin. Skills novas: uma pasta com
  `SKILL.md` em `skills/` (veja `skills/README.md`). Coleções de terceiros vão em `skills/comunidade/<nome>/`
  com o arquivo de licença original.
- Comandos do plugin ficam em `commands/`. Ao mudar algo visível ao usuário, suba `version` em `.claude-plugin/plugin.json`.
