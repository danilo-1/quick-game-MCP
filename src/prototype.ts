// Gera um protótipo jogável (HTML5, sem dependências) a partir do design salvo.
// Os modelos ficam em templates/prototipos/*.html; para criar um novo modelo basta
// adicionar um arquivo ali usando os mesmos marcadores (__TITULO__, __AJUSTES__, __FASES__, __CENAS__).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Projeto, valorTexto } from "./project.js";
import { templateDoGenero } from "./skills.js";

export function modelosDisponiveis(dir: string) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(/\.html$/, ""));
}

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);
// JSON seguro para embutir dentro de <script>.
const jsonScript = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");

function coresDaPaleta(paleta: string): string[] {
  return paleta.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
}

export function gerarPrototipo(
  p: Projeto,
  dirModelos: string,
  opcoes: { modelo?: string; ajustes?: Record<string, unknown>; fases?: string[][]; cenas?: Record<string, unknown> },
) {
  const modelo = opcoes.modelo ?? p.rota?.templatePrototipo ?? templateDoGenero(String(p.etapas.conceito?.dados.genero ?? ""));
  const arquivo = path.join(dirModelos, `${modelo}.html`);
  if (!existsSync(arquivo))
    throw new Error(`Modelo "${modelo}" não existe. Disponíveis: ${modelosDisponiveis(dirModelos).join(", ")}.`);

  const conceito = p.etapas.conceito?.dados ?? {};
  const loop = p.etapas.core_loop?.dados ?? {};
  const cores = coresDaPaleta(valorTexto(p.etapas.arte_audio?.dados.paleta));
  // Paleta: 1ª cor = fundo, 2ª = jogador, 3ª = inimigo/perigo, 4ª = destaque, 5ª = texto.
  const chavesCor = ["corFundo", "corJogador", "corInimigo", "corDestaque", "corTexto"];
  const dePaleta = Object.fromEntries(cores.slice(0, chavesCor.length).map((cor, i) => [chavesCor[i], cor]));

  const ajustes = {
    titulo: p.nome,
    subtitulo: valorTexto(conceito.pitch),
    ...(loop.objetivo ? { objetivo: valorTexto(loop.objetivo) } : {}),
    ...dePaleta,
    ...(opcoes.ajustes ?? {}),
  };

  const html = readFileSync(arquivo, "utf8")
    .replaceAll("__TITULO__", escapeHtml(p.nome))
    .replace("__AJUSTES__", jsonScript(ajustes))
    .replace("__FASES__", opcoes.fases ? jsonScript(opcoes.fases) : "null")
    .replace("__CENAS__", opcoes.cenas ? jsonScript(opcoes.cenas) : "null");

  return { modelo, html, ajustes };
}
