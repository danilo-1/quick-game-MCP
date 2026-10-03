// Estado de cada jogo: um projeto.json por jogo dentro da pasta de trabalho.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { ETAPAS, Etapa, getEtapa } from "./stages.js";
import { normalizar } from "./skills.js";

export type Valor = string | number | boolean | string[];

export interface EstadoEtapa {
  dados: Record<string, Valor>;
  concluida: boolean;
  atualizadoEm?: string;
}

export interface Projeto {
  slug: string;
  nome: string;
  ideiaOriginal: string;
  criadoEm: string;
  atualizadoEm: string;
  rota?: { genero?: string; engine: string; skills: string[]; templatePrototipo: string };
  etapas: Record<string, EstadoEtapa>;
  notas: { quando: string; texto: string }[];
}

export function slugify(t: string) {
  return (
    normalizar(t)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "jogo"
  );
}

export class ProjectStore {
  constructor(public readonly raiz: string) {}

  dir(slug: string) {
    return path.join(this.raiz, slug);
  }

  private arquivo(slug: string) {
    return path.join(this.dir(slug), "projeto.json");
  }

  listar(): Projeto[] {
    if (!existsSync(this.raiz)) return [];
    return readdirSync(this.raiz)
      .filter((d) => existsSync(this.arquivo(d)))
      .map((d) => this.carregar(d));
  }

  existe(slug: string) {
    return existsSync(this.arquivo(slug));
  }

  carregar(slugOuNome: string): Projeto {
    const slug = this.existe(slugOuNome) ? slugOuNome : slugify(slugOuNome);
    if (!this.existe(slug)) {
      const disponiveis = this.listar().map((p) => p.slug);
      throw new Error(
        `Jogo "${slugOuNome}" não encontrado.` +
          (disponiveis.length ? ` Jogos existentes: ${disponiveis.join(", ")}.` : " Use criar_jogo primeiro."),
      );
    }
    return JSON.parse(readFileSync(this.arquivo(slug), "utf8"));
  }

  salvar(p: Projeto) {
    p.atualizadoEm = new Date().toISOString();
    mkdirSync(this.dir(p.slug), { recursive: true });
    writeFileSync(this.arquivo(p.slug), JSON.stringify(p, null, 2));
  }

  criar(nome: string, ideia: string): Projeto {
    let slug = slugify(nome);
    for (let i = 2; this.existe(slug); i++) slug = `${slugify(nome)}-${i}`;
    const agora = new Date().toISOString();
    const p: Projeto = {
      slug,
      nome,
      ideiaOriginal: ideia,
      criadoEm: agora,
      atualizadoEm: agora,
      etapas: Object.fromEntries(ETAPAS.map((e) => [e.id, { dados: {}, concluida: false }])),
      notas: [],
    };
    this.salvar(p);
    return p;
  }

  escreverArquivo(slug: string, rel: string, conteudo: string) {
    const alvo = path.join(this.dir(slug), rel);
    mkdirSync(path.dirname(alvo), { recursive: true });
    writeFileSync(alvo, conteudo);
    return alvo;
  }
}

export function faltando(p: Projeto, e: Etapa) {
  const dados = p.etapas[e.id]?.dados ?? {};
  return e.campos.filter((c) => c.obrigatorio && vazio(dados[c.id])).map((c) => c.id);
}

export function vazio(v: Valor | undefined) {
  return v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
}

export function proximaEtapa(p: Projeto): Etapa | undefined {
  return ETAPAS.find((e) => !p.etapas[e.id]?.concluida && (e.obrigatoria || Object.keys(p.etapas[e.id]?.dados ?? {}).length === 0));
}

export function valorTexto(v: Valor | undefined): string {
  if (v === undefined) return "";
  return Array.isArray(v) ? v.join("; ") : String(v);
}

export function lista(v: Valor | undefined): string[] {
  if (v === undefined) return [];
  if (Array.isArray(v)) return v;
  return String(v)
    .split(/\s*(?:;|\n|\+|,(?![^(]*\)))\s*/)
    .map((s) => s.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export function resumoStatus(p: Projeto) {
  const linhas = ETAPAS.map((e) => {
    const st = p.etapas[e.id];
    const falta = faltando(p, e);
    const icone = st?.concluida ? "✓" : Object.keys(st?.dados ?? {}).length ? "✱" : "○";
    const extra = st?.concluida ? "" : falta.length ? ` (faltam: ${falta.join(", ")})` : " (pronta para concluir)";
    return `${icone} ${e.ordem}. ${e.nome}${e.obrigatoria ? "" : " [opcional]"}${extra}`;
  });
  const obrig = ETAPAS.filter((e) => e.obrigatoria);
  const feitas = obrig.filter((e) => p.etapas[e.id]?.concluida).length;
  const prox = proximaEtapa(p);
  return {
    progresso: `${feitas}/${obrig.length} etapas obrigatórias concluídas`,
    linhas,
    proxima: prox ? { id: prox.id, nome: prox.nome } : null,
  };
}

export function resolverEtapa(id: string) {
  const e = getEtapa(id);
  if (!e) throw new Error(`Etapa "${id}" não existe. Etapas: ${ETAPAS.map((x) => x.id).join(", ")}.`);
  return e;
}
