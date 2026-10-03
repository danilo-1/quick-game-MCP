// Descoberta e roteamento de skills. Qualquer pasta com um SKILL.md dentro dos diretórios
// de skills vira uma skill disponível, sem precisar registrar nada no código.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

export interface Skill {
  nome: string;
  descricao: string;
  categoria: string;
  origem: string;
  dir: string;
  arquivo: string;
  etapas: string[];
  tags: string[];
}

export function parseFrontmatter(texto: string): { meta: Record<string, string | string[]>; corpo: string } {
  const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { meta: {}, corpo: texto };
  const meta: Record<string, string | string[]> = {};
  const linhas = m[1].split(/\r?\n/);
  for (let i = 0; i < linhas.length; i++) {
    const km = linhas[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!km) continue;
    const [, chave, bruto] = km;
    let valor = bruto.trim();
    if (valor === ">" || valor === "|" || valor === ">-" || valor === "|-" || valor === "") {
      const bloco: string[] = [];
      while (i + 1 < linhas.length && /^\s+/.test(linhas[i + 1])) bloco.push(linhas[++i].trim());
      if (bloco.length && bloco.every((l) => l.startsWith("- "))) {
        meta[chave] = bloco.map((l) => l.slice(2).trim());
        continue;
      }
      valor = bloco.join(valor.startsWith("|") ? "\n" : " ");
    }
    if (valor.startsWith("[") && valor.endsWith("]")) {
      meta[chave] = valor
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      meta[chave] = valor.replace(/^["']|["']$/g, "");
    }
  }
  return { meta, corpo: texto.slice(m[0].length) };
}

const asList = (v: string | string[] | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);

function descobrir(raiz: string, dir: string, out: Skill[]) {
  let entradas: string[];
  try {
    entradas = readdirSync(dir);
  } catch {
    return;
  }
  if (entradas.includes("SKILL.md")) {
    const arquivo = path.join(dir, "SKILL.md");
    const { meta } = parseFrontmatter(readFileSync(arquivo, "utf8"));
    // Categoria = caminho a partir da pasta-pai do diretório configurado (ex.: "nucleo", "comunidade/x/genres").
    const rel = path.relative(path.dirname(raiz), dir).split(path.sep);
    const iCom = rel.indexOf("comunidade");
    out.push({
      nome: String(meta.name ?? path.basename(dir)),
      descricao: String(meta.description ?? ""),
      categoria: rel.slice(0, -1).join("/") || "geral",
      origem: iCom >= 0 && rel[iCom + 1] ? rel[iCom + 1] : rel[0] === "nucleo" ? "quick-game-mcp" : "local",
      dir,
      arquivo,
      etapas: asList(meta.etapas),
      tags: asList(meta.tags),
    });
  }
  for (const e of entradas) {
    if (e.startsWith(".") || e === "node_modules") continue;
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) descobrir(raiz, p, out);
  }
}

export class SkillRegistry {
  private skills: Skill[] = [];
  constructor(private dirs: string[]) {
    this.recarregar();
  }

  recarregar() {
    const out: Skill[] = [];
    for (const d of this.dirs) if (existsSync(d)) descobrir(d, d, out);
    // Em nomes repetidos, a primeira pasta configurada vence (skills próprias antes das da comunidade).
    const vistos = new Set<string>();
    this.skills = out.filter((s) => (vistos.has(s.nome) ? false : (vistos.add(s.nome), true)));
    return this.skills.length;
  }

  todas() {
    return this.skills;
  }

  get(nome: string) {
    const n = nome.trim().toLowerCase();
    return this.skills.find((s) => s.nome.toLowerCase() === n);
  }

  buscar(termo: string, limite = 20) {
    const palavras = normalizar(termo).split(/\s+/).filter((p) => p.length > 2);
    if (!palavras.length) return [];
    return this.skills
      .map((s) => {
        const alvo = normalizar(`${s.nome} ${s.descricao} ${s.tags.join(" ")} ${s.categoria}`);
        const nome = normalizar(s.nome);
        const score = palavras.reduce((acc, p) => acc + (nome.includes(p) ? 3 : 0) + (alvo.includes(p) ? 1 : 0), 0);
        return { s, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limite)
      .map((x) => x.s);
  }

  daEtapa(etapaId: string, nomesSugeridos: string[]) {
    const porMeta = this.skills.filter((s) => s.etapas.includes(etapaId));
    const porNome = nomesSugeridos.map((n) => this.get(n)).filter((s): s is Skill => !!s);
    return [...new Map([...porNome, ...porMeta].map((s) => [s.nome, s])).values()];
  }

  ler(nome: string) {
    const s = this.get(nome);
    if (!s) return undefined;
    const referencias: string[] = [];
    const listar = (d: string) => {
      for (const e of readdirSync(d)) {
        const p = path.join(d, e);
        if (statSync(p).isDirectory()) listar(p);
        else if (p !== s.arquivo) referencias.push(path.relative(s.dir, p));
      }
    };
    listar(s.dir);
    return { skill: s, conteudo: readFileSync(s.arquivo, "utf8"), referencias };
  }

  lerReferencia(nome: string, rel: string) {
    const s = this.get(nome);
    if (!s) return undefined;
    const alvo = path.resolve(s.dir, rel);
    if (!alvo.startsWith(path.resolve(s.dir) + path.sep) || !existsSync(alvo)) return undefined;
    return readFileSync(alvo, "utf8");
  }
}

export function normalizar(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

// Roteador: lê a descrição do usuário (em português ou inglês) e indica gênero, engine
// e as skills mais úteis. Mantido como dados para facilitar acrescentar novas regras.
const GENEROS: Record<string, string[]> = {
  platformer: ["plataforma", "platformer", "mario", "celeste", "pular entre", "side-scroller", "metroidvania"],
  roguelike: ["roguelike", "roguelite", "dungeon", "masmorra", "permadeath", "hades", "binding of isaac", "vampire survivors"],
  rpg: ["rpg", "role-playing", "aventura", "quest", "missao", "missoes", "zelda", "pokemon", "jrpg"],
  "fps-shooter": ["fps", "tiro", "shooter", "atirar", "nave", "shmup", "bullet hell", "arma"],
  "tower-defense": ["tower defense", "defesa de torre", "torres", "ondas de inimigos"],
  "card-game": ["carta", "cartas", "card", "deckbuilder", "baralho", "slay the spire"],
  "visual-novel": ["visual novel", "romance visual", "historia interativa", "escolhas", "dialogos", "narrativo"],
  "survival-crafting": ["sobrevivencia", "survival", "crafting", "construir base", "minecraft", "fome"],
  puzzle: ["puzzle", "quebra-cabeca", "quebra cabeca", "enigma", "logica", "tetris", "match-3", "sokoban"],
};

const ENGINES: Record<string, string[]> = {
  godot: ["godot", "gdscript"],
  unity: ["unity", "c#"],
  unreal: ["unreal", "blueprint"],
  phaser: ["phaser"],
  threejs: ["three.js", "threejs", "webgl 3d"],
  pixijs: ["pixi"],
  roblox: ["roblox", "luau"],
  pygame: ["pygame", "python"],
  love2d: ["love2d", "löve", "love 2d"],
  bevy: ["bevy", "rust"],
};

const ENGINE_SKILLS: Record<string, string[]> = {
  godot: ["godot-nodes-scenes", "godot-gdscript", "godot-2d-movement"],
  unity: ["unity-csharp-scripting", "unity-physics", "unity-input-system"],
  unreal: ["unreal-blueprints", "unreal-cpp-gameplay", "unreal-enhanced-input"],
  phaser: ["phaser-core", "phaser-arcade-physics"],
  threejs: ["threejs-scene-setup", "threejs-materials-lighting"],
  pixijs: ["pixijs-rendering"],
  roblox: ["roblox-studio-workflow", "roblox-luau"],
  pygame: ["pygame-core"],
  love2d: ["love2d-core"],
  bevy: ["bevy-ecs"],
  web: ["phaser-core", "prototype-fast"],
};

const DISCIPLINAS: Record<string, string[]> = {
  "game-ai": ["inimigo inteligente", "ia ", "inteligencia artificial", "persegue", "patrulha"],
  "dialogue-systems": ["dialogo", "conversa", "npc"],
  "procedural-gen": ["procedural", "aleatori", "gerado", "infinito"],
  "save-systems": ["salvar", "save", "progresso salvo"],
  "level-design": ["fase", "fases", "nivel", "niveis", "mapa", "level"],
  "camera-systems": ["camera"],
  "audio-design": ["musica", "som", "audio", "trilha"],
  "game-feel": ["sensacao", "juice", "feel", "fluido", "gostoso", "responsivo"],
  "game-ui-ux": ["menu", "hud", "interface", "inventario"],
  "create-game-assets": ["sprite", "arte", "pixel art", "personagem", "asset"],
  "performance-optimization": ["performance", "lento", "fps baixo", "otimiz"],
  "game-jam": ["game jam", "jam", "48 horas", "fim de semana"],
  "itch-publish": ["itch"],
  "steam-publish": ["steam"],
};

export interface Rota {
  genero?: string;
  engine: string;
  skills: string[];
  templatePrototipo: string;
  justificativa: string[];
}

function detectar(texto: string, mapa: Record<string, string[]>) {
  const t = ` ${normalizar(texto)} `;
  const achados: { chave: string; hits: number }[] = [];
  for (const [chave, termos] of Object.entries(mapa)) {
    const hits = termos.filter((k) => t.includes(normalizar(k))).length;
    if (hits) achados.push({ chave, hits });
  }
  return achados.sort((a, b) => b.hits - a.hits).map((a) => a.chave);
}

export function templateDoGenero(genero?: string): string {
  switch (genero) {
    case "platformer":
      return "plataforma";
    case "fps-shooter":
      return "nave";
    case "visual-novel":
      return "narrativa";
    default:
      return "topdown";
  }
}

export function rotear(texto: string, registry: SkillRegistry): Rota {
  const generos = detectar(texto, GENEROS);
  const engines = detectar(texto, ENGINES);
  const disciplinas = detectar(texto, DISCIPLINAS);
  const genero = generos[0];
  const engine = engines[0] ?? "web";
  const justificativa: string[] = [];
  justificativa.push(genero ? `Gênero detectado: ${genero}.` : "Gênero não ficou claro: pergunte ao usuário na etapa de conceito.");
  justificativa.push(
    engines[0]
      ? `Engine citada pelo usuário: ${engine}.`
      : "Nenhuma engine citada: o protótipo será gerado em HTML5 (web), sem exigir nada técnico do usuário.",
  );
  if (disciplinas.length) justificativa.push(`Temas específicos: ${disciplinas.join(", ")}.`);
  const nomes = ["interpretar-ideia", ...(genero ? [genero] : []), ...(ENGINE_SKILLS[engine] ?? []), ...disciplinas];
  const skills = [...new Set(nomes)].filter((n) => registry.get(n));
  return { genero, engine, skills, templatePrototipo: templateDoGenero(genero), justificativa };
}
