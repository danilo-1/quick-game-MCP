#!/usr/bin/env node
// quick-game-mcp: servidor MCP que conduz a criação de um jogo do conceito ao lançamento.
// O usuário só idealiza; o assistente usa estas ferramentas para registrar o design,
// carregar as skills certas e gerar documentos e protótipos jogáveis.
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { ETAPAS } from "./stages.js";
import { SkillRegistry, rotear } from "./skills.js";
import { ProjectStore, faltando, proximaEtapa, resolverEtapa, resumoStatus, valorTexto, type Valor } from "./project.js";
import { checarEscopo, gerarBacklog, gerarGDD } from "./docs.js";
import { gerarPrototipo, modelosDisponiveis } from "./prototype.js";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR_MODELOS = path.join(RAIZ, "templates", "prototipos");
const dirsExtras = (process.env.QUICK_GAME_SKILLS_DIRS ?? "").split(path.delimiter).filter(Boolean);
const skills = new SkillRegistry([
  ...dirsExtras.map((d) => path.resolve(d)),
  path.join(RAIZ, "skills", "nucleo"),
  path.join(RAIZ, "skills", "comunidade"),
]);
const store = new ProjectStore(path.resolve(process.env.QUICK_GAME_WORKSPACE ?? path.join(process.cwd(), "jogos")));

const server = new McpServer(
  { name: "quick-game-mcp", version: "0.2.0" },
  {
    instructions: [
      "Servidor para criar jogos com o usuário focado apenas em ideias. Regras:",
      "1) Fale a língua do usuário e nunca peça decisões técnicas (engine, código, arquitetura): decida você e explique em uma frase.",
      "2) Comece com criar_jogo; depois siga guia_etapa → conversa com o usuário → salvar_etapa, etapa por etapa (status_jogo mostra a próxima).",
      "3) Antes de cada etapa, leia as skills que guia_etapa recomenda (ler_skill). A skill 'interpretar-ideia' ensina a extrair o que o usuário quer.",
      "4) Ofereça opções concretas para o usuário escolher em vez de perguntas abertas demais. Resuma e confirme antes de salvar.",
      "5) Gere o protótipo cedo (gerar_prototipo) e itere com ajustes; gere o GDD (gerar_gdd) e o backlog quando o design estiver maduro.",
    ].join("\n"),
  },
);

const texto = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (v: unknown) => texto(JSON.stringify(v, null, 2));
const erro = (e: unknown) => ({ ...texto(`Erro: ${e instanceof Error ? e.message : String(e)}`), isError: true });
const seguro =
  <A,>(fn: (a: A) => ReturnType<typeof texto> | Promise<ReturnType<typeof texto>>) =>
  async (a: A) => {
    try {
      return await fn(a);
    } catch (e) {
      return erro(e);
    }
  };

const valorSchema = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);
const jogoArg = z.string().describe("Nome ou identificador (slug) do jogo");

function guia(etapaId: string, jogo?: string) {
  const e = resolverEtapa(etapaId);
  const p = jogo ? store.carregar(jogo) : undefined;
  const dados = p?.etapas[e.id]?.dados ?? {};
  const recomendadas = skills.daEtapa(e.id, e.skills).map((s) => ({ nome: s.nome, descricao: s.descricao, origem: s.origem }));
  return {
    etapa: `${e.ordem}. ${e.nome}${e.obrigatoria ? "" : " (opcional)"}`,
    id: e.id,
    objetivo: e.objetivo,
    perguntas_para_o_usuario: e.perguntas,
    campos: e.campos.map((c) => ({
      id: c.id,
      descricao: c.descricao,
      obrigatorio: c.obrigatorio,
      exemplo: c.exemplo,
      valor_atual: dados[c.id],
    })),
    entregavel: e.entregavel,
    dicas: e.dicas,
    skills_recomendadas: recomendadas,
    ...(p ? { faltando: faltando(p, e), concluida: p.etapas[e.id]?.concluida ?? false } : {}),
  };
}

// ---------- Projeto ----------

server.registerTool(
  "criar_jogo",
  {
    title: "Criar jogo",
    description:
      "Começa um novo projeto de jogo a partir da ideia do usuário (do jeito que ele falou). Detecta gênero e tecnologia, sugere skills e devolve o guia da primeira etapa.",
    inputSchema: {
      ideia: z.string().describe("A ideia do usuário, com as palavras dele"),
      nome: z.string().optional().describe("Nome provisório do jogo; se faltar, use um nome de trabalho"),
    },
  },
  seguro(({ ideia, nome }: { ideia: string; nome?: string }) => {
    const p = store.criar(nome ?? ideia.split(/\s+/).slice(0, 4).join(" "), ideia);
    const rota = rotear(ideia, skills);
    p.rota = { genero: rota.genero, engine: rota.engine, skills: rota.skills, templatePrototipo: rota.templatePrototipo };
    if (rota.genero) p.etapas.conceito.dados.genero = rota.genero;
    store.salvar(p);
    return json({
      jogo: p.slug,
      pasta: store.dir(p.slug),
      leitura_da_ideia: rota.justificativa,
      skills_para_ler_agora: rota.skills,
      proximo_passo: "Leia a skill 'interpretar-ideia' e conduza a etapa de conceito com o usuário.",
      guia: guia("conceito", p.slug),
    });
  }),
);

server.registerTool(
  "listar_jogos",
  { title: "Listar jogos", description: "Lista os jogos em andamento e o progresso de cada um.", inputSchema: {} },
  seguro(() => {
    const jogos = store.listar().map((p) => ({ jogo: p.slug, nome: p.nome, ...resumoStatus(p), atualizadoEm: p.atualizadoEm }));
    return jogos.length ? json(jogos) : texto("Nenhum jogo criado ainda. Use criar_jogo com a ideia do usuário.");
  }),
);

server.registerTool(
  "status_jogo",
  {
    title: "Status do jogo",
    description: "Mostra o checklist de etapas do jogo, o que falta em cada uma e qual é a próxima.",
    inputSchema: { jogo: jogoArg },
  },
  seguro(({ jogo }: { jogo: string }) => {
    const p = store.carregar(jogo);
    const r = resumoStatus(p);
    return texto(
      [`# ${p.nome}`, r.progresso, "", ...r.linhas, "", r.proxima ? `Próxima etapa: ${r.proxima.nome} (${r.proxima.id}). Use guia_etapa.` : "Todas as etapas concluídas. Hora de lançar!"].join("\n"),
    );
  }),
);

server.registerTool(
  "guia_etapa",
  {
    title: "Guia da etapa",
    description:
      "Devolve o roteiro de uma etapa: objetivo, perguntas em linguagem simples para o usuário, campos a preencher, dicas e skills recomendadas. Sem 'jogo', devolve o guia genérico.",
    inputSchema: {
      etapa: z.string().describe(`Etapa: ${ETAPAS.map((e) => e.id).join(", ")} (ou o número)`),
      jogo: jogoArg.optional(),
    },
  },
  seguro(({ etapa, jogo }: { etapa: string; jogo?: string }) => json(guia(etapa, jogo))),
);

server.registerTool(
  "salvar_etapa",
  {
    title: "Salvar etapa",
    description:
      "Registra as decisões do usuário em uma etapa (mescla com o que já existe). Use concluir=true depois que o usuário confirmar o resumo; a etapa só fecha se os campos obrigatórios estiverem preenchidos.",
    inputSchema: {
      jogo: jogoArg,
      etapa: z.string(),
      dados: z.record(z.string(), valorSchema).describe("Campos da etapa (ids de guia_etapa). Campos extras também são aceitos."),
      concluir: z.boolean().optional(),
    },
  },
  seguro(({ jogo, etapa, dados, concluir }: { jogo: string; etapa: string; dados: Record<string, Valor>; concluir?: boolean }) => {
    const p = store.carregar(jogo);
    const e = resolverEtapa(etapa);
    const st = p.etapas[e.id] ?? (p.etapas[e.id] = { dados: {}, concluida: false });
    Object.assign(st.dados, dados);
    st.atualizadoEm = new Date().toISOString();
    const falta = faltando(p, e);
    let aviso: string | undefined;
    if (concluir) {
      if (falta.length) aviso = `Etapa não concluída: faltam ${falta.join(", ")}.`;
      else st.concluida = true;
    }
    if (e.id === "conceito" && dados.genero && p.rota) {
      const r = rotear(`${valorTexto(dados.genero)} ${p.ideiaOriginal}`, skills);
      p.rota.genero = r.genero ?? p.rota.genero;
      p.rota.templatePrototipo = r.templatePrototipo;
    }
    if (e.id === "escopo" && dados.engine && p.rota) p.rota.engine = rotear(valorTexto(dados.engine), skills).engine;
    store.salvar(p);
    const prox = proximaEtapa(p);
    return json({
      salvo: e.id,
      concluida: st.concluida,
      ...(aviso ? { aviso } : {}),
      faltando: falta,
      proxima_etapa: st.concluida && prox ? { id: prox.id, nome: prox.nome } : undefined,
    });
  }),
);

server.registerTool(
  "anotar_decisao",
  {
    title: "Anotar decisão",
    description: "Guarda uma decisão, ideia solta ou mudança de rumo no histórico do jogo (aparece no GDD).",
    inputSchema: { jogo: jogoArg, texto: z.string() },
  },
  seguro(({ jogo, texto: t }: { jogo: string; texto: string }) => {
    const p = store.carregar(jogo);
    p.notas.push({ quando: new Date().toISOString(), texto: t });
    store.salvar(p);
    return texto(`Anotado em ${p.nome}.`);
  }),
);

// ---------- Skills ----------

server.registerTool(
  "listar_skills",
  {
    title: "Listar skills",
    description: "Lista as skills disponíveis (próprias e da comunidade), opcionalmente filtrando por categoria ou busca.",
    inputSchema: {
      busca: z.string().optional().describe("Palavras-chave, ex.: 'pulo plataforma'"),
      categoria: z.string().optional().describe("Trecho da categoria, ex.: 'nucleo', 'genres', 'godot'"),
    },
  },
  seguro(({ busca, categoria }: { busca?: string; categoria?: string }) => {
    let lista = busca ? skills.buscar(busca, 40) : skills.todas();
    if (categoria) lista = lista.filter((s) => s.categoria.includes(categoria));
    return json({
      total: lista.length,
      skills: lista.map((s) => ({ nome: s.nome, categoria: s.categoria, origem: s.origem, descricao: s.descricao })),
    });
  }),
);

server.registerTool(
  "ler_skill",
  {
    title: "Ler skill",
    description: "Carrega o conteúdo completo de uma skill (SKILL.md). Com 'referencia', lê um arquivo auxiliar da skill.",
    inputSchema: { nome: z.string(), referencia: z.string().optional().describe("Caminho relativo de um arquivo listado em 'referencias'") },
  },
  seguro(({ nome, referencia }: { nome: string; referencia?: string }) => {
    if (referencia) {
      const r = skills.lerReferencia(nome, referencia);
      if (r === undefined) throw new Error(`Referência "${referencia}" não encontrada na skill ${nome}.`);
      return texto(r);
    }
    const r = skills.ler(nome);
    if (!r) {
      const parecidas = skills.buscar(nome, 5).map((s) => s.nome);
      throw new Error(`Skill "${nome}" não encontrada.${parecidas.length ? ` Parecidas: ${parecidas.join(", ")}.` : ""}`);
    }
    const rodape = r.referencias.length ? `\n\n---\nArquivos auxiliares (use ler_skill com 'referencia'): ${r.referencias.join(", ")}` : "";
    return texto(`<!-- skill: ${r.skill.nome} · origem: ${r.skill.origem} -->\n${r.conteudo}${rodape}`);
  }),
);

server.registerTool(
  "recomendar_skills",
  {
    title: "Recomendar skills",
    description: "Interpreta um pedido em linguagem natural e indica gênero, tecnologia e as skills que devem ser lidas.",
    inputSchema: { pedido: z.string() },
  },
  seguro(({ pedido }: { pedido: string }) => {
    const r = rotear(pedido, skills);
    const extras = skills.buscar(pedido, 5).map((s) => s.nome).filter((n) => !r.skills.includes(n));
    return json({ ...r, tambem_relevantes: extras });
  }),
);

server.registerTool(
  "recarregar_skills",
  {
    title: "Recarregar skills",
    description: "Relê as pastas de skills (use depois de adicionar uma skill nova sem reiniciar o servidor).",
    inputSchema: {},
  },
  seguro(() => texto(`${skills.recarregar()} skills carregadas.`)),
);

// ---------- Geração ----------

server.registerTool(
  "gerar_gdd",
  {
    title: "Gerar GDD",
    description: "Compila tudo o que foi decidido em um Documento de Design do Jogo (GDD.md) na pasta do jogo e devolve o conteúdo.",
    inputSchema: { jogo: jogoArg },
  },
  seguro(({ jogo }: { jogo: string }) => {
    const p = store.carregar(jogo);
    const md = gerarGDD(p);
    const arq = store.escreverArquivo(p.slug, "GDD.md", md);
    return texto(`Salvo em ${arq}\n\n${md}`);
  }),
);

server.registerTool(
  "gerar_backlog",
  {
    title: "Gerar backlog",
    description: "Transforma o design em uma lista de tarefas (BACKLOG.md) organizada por marcos.",
    inputSchema: { jogo: jogoArg },
  },
  seguro(({ jogo }: { jogo: string }) => {
    const p = store.carregar(jogo);
    const md = gerarBacklog(p);
    const arq = store.escreverArquivo(p.slug, "BACKLOG.md", md);
    return texto(`Salvo em ${arq}\n\n${md}`);
  }),
);

server.registerTool(
  "checar_escopo",
  {
    title: "Checar escopo",
    description: "Avalia se o MVP cabe no prazo e na equipe e aponta riscos comuns (multiplayer, mundo aberto, 3D...).",
    inputSchema: { jogo: jogoArg },
  },
  seguro(({ jogo }: { jogo: string }) => json(checarEscopo(store.carregar(jogo)))),
);

server.registerTool(
  "gerar_prototipo",
  {
    title: "Gerar protótipo jogável",
    description: [
      "Gera um protótipo HTML5 jogável (abre direto no navegador, sem instalar nada) usando o gênero, nome, pitch, objetivo e paleta do jogo.",
      "Modelos: plataforma, topdown (aventura/roguelike/RPG/sobrevivência), nave (tiro), narrativa (visual novel).",
      "'ajustes' muda parâmetros de sensação/balanceamento (ex.: forcaPulo, gravidade, velocidade, vidas, velocidadeInimigo, ondas, cores).",
      "'fases' (plataforma): lista de fases, cada uma é uma lista de linhas de texto (# chão, = plataforma, * estrela, ! espinho, E inimigo, F bandeira, P início).",
      "'cenas' (narrativa): objeto {idCena: {quem, texto, cenario, cor, escolhas:[{texto, ir, marca?, se?}], fim?}} começando em 'inicio'.",
    ].join(" "),
    inputSchema: {
      jogo: jogoArg,
      modelo: z.string().optional(),
      ajustes: z.record(z.string(), z.any()).optional(),
      fases: z.array(z.array(z.string())).optional(),
      cenas: z.record(z.string(), z.any()).optional(),
    },
  },
  seguro(
    ({ jogo, modelo, ajustes, fases, cenas }: { jogo: string; modelo?: string; ajustes?: Record<string, unknown>; fases?: string[][]; cenas?: Record<string, unknown> }) => {
      const p = store.carregar(jogo);
      const r = gerarPrototipo(p, DIR_MODELOS, { modelo, ajustes, fases, cenas });
      const arq = store.escreverArquivo(p.slug, path.join("prototipo", "index.html"), r.html);
      const st = p.etapas.prototipo;
      st.dados.template = r.modelo;
      st.dados.arquivo = arq;
      store.salvar(p);
      return json({
        arquivo: arq,
        modelo: r.modelo,
        parametros_aplicados: r.ajustes,
        como_jogar: "Abra o arquivo no navegador. Peça ao usuário para jogar e dizer o que sentiu; traduza o feedback em 'ajustes' e gere de novo.",
      });
    },
  ),
);

server.registerTool(
  "listar_etapas",
  { title: "Listar etapas", description: "Lista todas as etapas do pipeline de criação de jogos.", inputSchema: {} },
  seguro(() =>
    json(
      ETAPAS.map((e) => ({ id: e.id, ordem: e.ordem, nome: e.nome, obrigatoria: e.obrigatoria, objetivo: e.objetivo, modelos_prototipo: e.id === "prototipo" ? modelosDisponiveis(DIR_MODELOS) : undefined })),
    ),
  ),
);

// ---------- Prompts (aparecem como comandos no cliente) ----------

server.registerPrompt(
  "novo-jogo",
  {
    title: "Criar um jogo do zero",
    description: "Conduz o usuário da ideia ao protótipo, etapa por etapa.",
    argsSchema: { ideia: z.string().describe("A ideia do jogo, do seu jeito") },
  },
  ({ ideia }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: [
            `Quero criar um jogo. Minha ideia: "${ideia}"`,
            "",
            "Atue como produtor e game designer sênior. Use o servidor quick-game-mcp assim:",
            "1. Chame criar_jogo com a ideia e leia as skills sugeridas (ler_skill), começando por 'interpretar-ideia'.",
            "2. Para cada etapa (guia_etapa), converse comigo em linguagem simples, oferecendo opções concretas. Nada de perguntas técnicas: decida a parte técnica e me explique em uma frase.",
            "3. Resuma o que entendeu, confirme comigo e salve com salvar_etapa (concluir=true).",
            "4. Assim que conceito e loop principal estiverem definidos, gere um protótipo (gerar_prototipo) para eu sentir o jogo.",
            "5. Ao final, gere o GDD e o backlog.",
          ].join("\n"),
        },
      },
    ],
  }),
);

server.registerPrompt(
  "continuar-jogo",
  {
    title: "Continuar um jogo",
    description: "Retoma um jogo do ponto em que parou.",
    argsSchema: { jogo: z.string() },
  },
  ({ jogo }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Vamos continuar o jogo "${jogo}". Chame status_jogo, me lembre em 3 linhas onde paramos e conduza a próxima etapa com guia_etapa, lendo as skills recomendadas antes de me perguntar algo.`,
        },
      },
    ],
  }),
);

server.registerPrompt(
  "brainstorm",
  {
    title: "Brainstorm de ideias",
    description: "Gera conceitos de jogo a partir de um tema, sentimento ou restrição.",
    argsSchema: { tema: z.string().optional().describe("Tema, sentimento ou restrição (opcional)") },
  },
  ({ tema }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Leia a skill 'brainstorm-conceito' (ler_skill) e me proponha 5 conceitos de jogo${tema ? ` sobre: ${tema}` : ""}, cada um com pitch de uma linha, fantasia do jogador e loop principal. Depois me ajude a escolher um e chame criar_jogo.`,
        },
      },
    ],
  }),
);

server.registerPrompt(
  "ajustar-sensacao",
  {
    title: "Ajustar a sensação do protótipo",
    description: "Traduz feedback subjetivo ('pulo pesado', 'muito difícil') em ajustes do protótipo.",
    argsSchema: { jogo: z.string(), feedback: z.string() },
  },
  ({ jogo, feedback }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Joguei o protótipo de "${jogo}" e senti: "${feedback}". Leia a skill 'game-feel', traduza isso em mudanças nos parâmetros do protótipo, explique em linguagem simples o que vai mudar e gere de novo com gerar_prototipo.`,
        },
      },
    ],
  }),
);

// ---------- Recursos ----------

server.registerResource(
  "skill",
  new ResourceTemplate("skill://{nome}", {
    list: () => ({
      resources: skills.todas().map((s) => ({ uri: `skill://${s.nome}`, name: s.nome, description: s.descricao, mimeType: "text/markdown" })),
    }),
  }),
  { title: "Skills de game dev", description: "Cada skill disponível como documento markdown", mimeType: "text/markdown" },
  (uri, { nome }) => {
    const r = skills.ler(String(nome));
    if (!r) throw new Error(`Skill ${nome} não encontrada`);
    return { contents: [{ uri: uri.href, mimeType: "text/markdown", text: r.conteudo }] };
  },
);

server.registerResource(
  "gdd",
  new ResourceTemplate("jogo://{slug}/gdd", {
    list: () => ({
      resources: store.listar().map((p) => ({ uri: `jogo://${p.slug}/gdd`, name: `GDD: ${p.nome}`, mimeType: "text/markdown" })),
    }),
  }),
  { title: "GDD dos jogos", description: "Documento de design atualizado de cada jogo", mimeType: "text/markdown" },
  (uri, { slug }) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: gerarGDD(store.carregar(String(slug))) }] }),
);

await server.connect(new StdioServerTransport());
