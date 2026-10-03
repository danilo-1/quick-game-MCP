# quick-game-mcp

Servidor [MCP](https://modelcontextprotocol.io) especializado em **criação de jogos**. Ele conduz o
assistente (Claude ou qualquer cliente MCP) por todas as etapas centrais de um jogo, do conceito
ao lançamento, e cuida da parte técnica: o usuário só precisa idealizar.

- **12 etapas guiadas**, cada uma com perguntas em linguagem simples, campos a preencher e skills recomendadas.
- **87 skills** carregadas sob demanda: 12 próprias em português (uma por etapa) e 75 da comunidade
  (Godot, Unity, Unreal, Phaser, gêneros, game feel, publicação…). Basta soltar uma pasta com
  `SKILL.md` em `skills/` para adicionar mais.
- **Protótipo jogável instantâneo** em HTML5 (abre no navegador, sem instalar nada), com nome,
  objetivo e paleta do jogo e parâmetros de sensação ajustáveis por conversa.
- **GDD e backlog** gerados automaticamente a partir das decisões.

## Etapas

| # | Etapa | O que sai dela |
|---|---|---|
| 1 | Conceito | pitch, gênero, fantasia do jogador, público, 3 pilares |
| 2 | Loop principal | ciclo do jogador, verbos, vitória e derrota |
| 3 | Mecânicas e controles | regras de cada mecânica, inimigos, controles |
| 4 | Progressão, dificuldade e economia | progressão, recompensas, curva, moedas |
| 5 | Escopo, plataforma e MVP | plataforma, tecnologia (decidida pelo assistente), prazo, MVP |
| 6 | Mundo e narrativa *(opcional)* | ambientação, protagonista, história, tom |
| 7 | Direção de arte e áudio | estilo, paleta, áudio, lista de assets |
| 8 | Conteúdo e níveis | estrutura de fases e quantidade de conteúdo |
| 9 | Interface e experiência | HUD, telas, onboarding, acessibilidade |
| 10 | Protótipo jogável | HTML5 gerado e iterado com o usuário |
| 11 | Playtest e balanceamento | plano de teste, perguntas, ajustes |
| 12 | Polimento e lançamento | canal, modelo de negócio, materiais, checklist |

## Ferramentas

| Ferramenta | Para quê |
|---|---|
| `criar_jogo` | Começa um jogo a partir da ideia do usuário; detecta gênero/tecnologia e sugere skills |
| `listar_jogos`, `status_jogo` | Progresso de cada jogo e próxima etapa |
| `listar_etapas`, `guia_etapa` | Roteiro de cada etapa (perguntas, campos, dicas, skills) |
| `salvar_etapa`, `anotar_decisao` | Registra decisões; fecha a etapa quando os campos obrigatórios estão completos |
| `listar_skills`, `ler_skill`, `recomendar_skills`, `recarregar_skills` | Biblioteca de skills e roteador |
| `checar_escopo` | Avalia se o MVP cabe no prazo/equipe e aponta riscos |
| `gerar_prototipo` | Protótipo HTML5 (`plataforma`, `topdown`, `nave`, `narrativa`) com ajustes de sensação |
| `gerar_gdd`, `gerar_backlog` | Documento de design e lista de tarefas em markdown |

**Prompts** (aparecem como comandos no cliente): `novo-jogo`, `continuar-jogo`, `brainstorm`, `ajustar-sensacao`.
**Recursos**: `skill://{nome}` e `jogo://{slug}/gdd`.

## Instalação

Requer Node 18+ e git.

### Opção 1: abrir o repositório no Claude Code (configuração automática)

```bash
git clone https://github.com/danilo-1/quick-game-MCP.git
cd quick-game-MCP
claude
```

O `.mcp.json` registra o servidor `quick-game` e o `.claude/settings.json` já o aprova. Na primeira
execução ele instala as dependências e compila sozinho (leva alguns segundos). Confira com `/mcp`.
Depois é só dizer *"Quero criar um jogo de plataforma com um gato astronauta"* ou usar o prompt
`/mcp__quick-game__novo-jogo`. Os jogos ficam em `jogos/`.

### Opção 2: instalar em qualquer pasta, direto do GitHub

```bash
claude mcp add quick-game --scope user -- npx -y github:danilo-1/quick-game-MCP
```

Com `--scope user` o servidor fica disponível em todos os seus projetos. Os jogos são salvos em
`./jogos` da pasta onde o Claude foi aberto (mude com `-e QUICK_GAME_WORKSPACE=/caminho`).

### Opção 3: Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "quick-game": {
      "command": "npx",
      "args": ["-y", "github:danilo-1/quick-game-MCP"],
      "env": { "QUICK_GAME_WORKSPACE": "/caminho/para/meus-jogos" }
    }
  }
}
```

### Desenvolvimento

```bash
npm install     # instala e compila
npm test        # teste de ponta a ponta com um cliente MCP real
npx @modelcontextprotocol/inspector node dist/index.js   # testar as ferramentas numa interface web
```

### Variáveis de ambiente

| Variável | Padrão | Uso |
|---|---|---|
| `QUICK_GAME_WORKSPACE` | `./jogos` | Onde cada jogo é salvo (`projeto.json`, `GDD.md`, `BACKLOG.md`, `prototipo/index.html`) |
| `QUICK_GAME_SKILLS_DIRS` | — | Pastas extras de skills (separadas por `:`; `;` no Windows) |

## Estendendo

- **Skills**: veja [`skills/README.md`](skills/README.md). Uma pasta com `SKILL.md` = uma skill nova.
  O campo opcional `etapas:` faz ela ser recomendada automaticamente na etapa certa.
- **Modelos de protótipo**: adicione um `.html` em `templates/prototipos/` usando os marcadores
  `__TITULO__` e `__AJUSTES__` (e opcionalmente `__FASES__`/`__CENAS__`). Ele aparece em `gerar_prototipo` pelo nome do arquivo.
- **Etapas**: estão como dados em `src/stages.ts` (perguntas, campos, skills).
- **Roteador**: palavras-chave de gênero, engine e disciplina em `src/skills.ts`.

## Créditos e licenças

Código e skills em `skills/nucleo/`: [Apache-2.0](LICENSE).

`skills/comunidade/awesome-gamedev-agent-skills/`: © 2026 Abhishek Barali e contribuidores,
[Apache-2.0](skills/comunidade/awesome-gamedev-agent-skills/LICENSE), copiado sem alterações de
[gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills).
O fluxo em etapas se inspirou no [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) (MIT).
