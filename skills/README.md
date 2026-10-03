# Skills

Esta pasta guarda o conhecimento que o assistente carrega sob demanda. O servidor descobre
**automaticamente** qualquer pasta que contenha um `SKILL.md` (em qualquer profundidade): para
adicionar uma skill, basta criar a pasta e o arquivo. Depois chame a ferramenta
`recarregar_skills` (ou reinicie o servidor).

```
skills/
├── nucleo/        Skills próprias do quick-game-mcp, em português, uma por etapa do pipeline
├── comunidade/    Skills de terceiros, cada coleção na sua pasta com LICENSE e NOTICE originais
└── _modelo/       Modelo para criar uma skill nova (SKILL.md.exemplo)
```

## Formato

O formato é o mesmo das [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview):
frontmatter YAML com `name` e `description`, seguido de markdown. O quick-game-mcp entende
também dois campos opcionais:

- `etapas: [conceito, core_loop]`: a skill passa a ser recomendada em `guia_etapa` dessas etapas.
- `tags: [pulo, plataforma]`: melhora a busca.

Arquivos auxiliares (referências, exemplos, scripts) podem ficar na mesma pasta; o assistente
os lê com `ler_skill` + `referencia`.

Etapas disponíveis: conceito, core_loop, mecanicas, progressao, escopo, mundo_narrativa,
arte_audio, conteudo_niveis, ux_interface, prototipo, playtest_balanceamento, lancamento.

## Pastas extras

Para manter skills fora do projeto (por exemplo, skills privadas), aponte a variável
`QUICK_GAME_SKILLS_DIRS` para uma ou mais pastas (separadas por `:` no Linux/macOS e `;` no
Windows). Elas têm prioridade sobre as daqui quando o nome se repete.

## Skills da comunidade incluídas

| Coleção | Licença | O que traz |
|---|---|---|
| [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) (commit `d4b0e35`) | Apache-2.0 | 74 skills + roteador: Godot, Unity, Unreal, Phaser, PixiJS, three.js, Bevy, pygame, LÖVE, Roblox; disciplinas (game feel, IA, level design, save, áudio, shaders…); 9 gêneros; workflows (game jam, itch.io, Steam) |

Copiadas sem alterações, com `LICENSE` e `NOTICE` originais na pasta da coleção. Copyright 2026
Abhishek Barali e contribuidores.

Ao adicionar outra coleção, confira a licença (MIT, Apache-2.0, CC-BY e CC0 permitem
redistribuir com crédito), copie o arquivo de licença junto e registre a origem nesta tabela.

### Avaliadas e não incluídas

- [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) (MIT): 73 skills
  muito boas, mas presas à estrutura daquele template (agentes, hooks e docs próprios), então não
  funcionam soltas. Serviu de inspiração para o fluxo por etapas; nenhum texto foi copiado.
- [game-design-document](https://github.com/ityes22/game-design-document): sem licença declarada,
  então não pode ser redistribuída. A skill `game-design-document` daqui é original.
