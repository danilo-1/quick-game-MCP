// Documentos gerados a partir do estado do projeto: GDD, backlog e checagem de escopo.
import { ETAPAS } from "./stages.js";
import { Projeto, lista, valorTexto, vazio, faltando } from "./project.js";

export function gerarGDD(p: Projeto): string {
  const out: string[] = [];
  const conceito = p.etapas.conceito?.dados ?? {};
  out.push(`# ${p.nome}`, "");
  if (conceito.pitch) out.push(`> ${valorTexto(conceito.pitch)}`, "");
  out.push(`*Documento de Design do Jogo (GDD), gerado pelo quick-game-mcp em ${new Date().toLocaleDateString("pt-BR")}.*`, "");
  out.push("## Ideia original", "", p.ideiaOriginal, "");
  for (const e of ETAPAS) {
    const st = p.etapas[e.id];
    const dados = st?.dados ?? {};
    const preenchidos = e.campos.filter((c) => !vazio(dados[c.id]));
    const extras = Object.keys(dados).filter((k) => !e.campos.some((c) => c.id === k));
    out.push(`## ${e.ordem}. ${e.nome}${st?.concluida ? "" : " *(em aberto)*"}`, "");
    if (!preenchidos.length && !extras.length) {
      out.push("_Ainda não definido._", "");
      continue;
    }
    for (const c of preenchidos) {
      const v = dados[c.id];
      const itens = Array.isArray(v) ? v : lista(v).length > 2 ? lista(v) : null;
      out.push(`**${rotulo(c.id)}**${itens ? "" : `: ${valorTexto(v)}`}`);
      if (itens) out.push(...itens.map((i) => `- ${i}`));
      out.push("");
    }
    for (const k of extras) out.push(`**${rotulo(k)}**: ${valorTexto(dados[k])}`, "");
    const falta = faltando(p, e);
    if (falta.length && !st?.concluida) out.push(`> Pendente: ${falta.map(rotulo).join(", ")}`, "");
  }
  if (p.notas.length) {
    out.push("## Notas e decisões", "");
    for (const n of p.notas) out.push(`- ${n.quando.slice(0, 10)}: ${n.texto}`);
    out.push("");
  }
  return out.join("\n");
}

function rotulo(id: string) {
  const s = id.replace(/_/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function gerarBacklog(p: Projeto): string {
  const d = (etapa: string) => p.etapas[etapa]?.dados ?? {};
  const mvp = lista(d("escopo").mvp);
  const mecs = lista(d("mecanicas").mecanicas);
  const telas = lista(d("ux_interface").telas);
  const assets = lista(d("arte_audio").lista_assets);
  const niveis = lista(d("conteudo_niveis").estrutura_niveis);
  const out: string[] = [`# Backlog: ${p.nome}`, "", "Tarefas derivadas do design. Marque com [x] ao concluir.", ""];
  const bloco = (titulo: string, itens: string[], prefixo = "") => {
    if (!itens.length) return;
    out.push(`## ${titulo}`, "", ...itens.map((i) => `- [ ] ${prefixo}${i}`), "");
  };
  bloco("Marco 1: MVP jogável", mvp, "Implementar: ");
  bloco("Mecânicas", mecs, "Mecânica: ");
  bloco("Conteúdo e fases", niveis, "Construir: ");
  bloco("Telas e interface", telas, "Tela: ");
  bloco("Arte e áudio", assets, "Asset: ");
  out.push(
    "## Validação",
    "",
    "- [ ] Gerar protótipo e jogar 10 minutos",
    "- [ ] Playtest com 3–5 pessoas que não conhecem o jogo",
    "- [ ] Ajustar dificuldade a partir do playtest",
    "",
    "## Lançamento",
    "",
    "- [ ] Capa, screenshots e GIF",
    `- [ ] Página em ${valorTexto(d("lancamento").canal) || "itch.io"}`,
    "- [ ] Build final testado na plataforma alvo",
    "",
  );
  if (!mvp.length) out.splice(3, 0, "> Aviso: o MVP ainda não foi definido (etapa escopo). O backlog está incompleto.", "");
  return out.join("\n");
}

const PRAZO_SEMANAS: [RegExp, number][] = [
  [/(\d+)\s*(dia|day)/, 1 / 7],
  [/(\d+)\s*(semana|week)/, 1],
  [/(\d+)\s*(m[eê]s|meses|month)/, 4.3],
  [/(\d+)\s*(ano|year)/, 52],
];

export function checarEscopo(p: Projeto) {
  const e = p.etapas.escopo?.dados ?? {};
  const alertas: string[] = [];
  const ok: string[] = [];
  const mvp = lista(e.mvp);
  const mecs = lista(p.etapas.mecanicas?.dados.mecanicas);
  const prazoTxt = valorTexto(e.prazo).toLowerCase();
  let semanas: number | undefined;
  if (/fim de semana|weekend|jam/.test(prazoTxt)) semanas = 0.3;
  for (const [re, fator] of PRAZO_SEMANAS) {
    const m = prazoTxt.match(re);
    if (m) semanas = Number(m[1]) * fator;
  }
  const equipeTxt = valorTexto(e.equipe).toLowerCase();
  const pessoas = Number(equipeTxt.match(/\d+/)?.[0] ?? (/(s[oó]|sozinho|solo|eu)/.test(equipeTxt) ? 1 : 1));
  const capacidade = semanas !== undefined ? Math.max(1, Math.round(semanas * pessoas * 1.5)) : undefined;

  if (!mvp.length) alertas.push("MVP não definido: liste as 3–7 features indispensáveis.");
  else if (mvp.length > 7) alertas.push(`MVP com ${mvp.length} itens: acima de 7 costuma não ser mínimo. Corte ou mova itens para 'fora_do_escopo'.`);
  else ok.push(`MVP com ${mvp.length} itens: tamanho saudável.`);

  if (capacidade !== undefined && mvp.length > capacidade)
    alertas.push(`Com ~${semanas!.toFixed(1)} semana(s) e ${pessoas} pessoa(s), cabem ~${capacidade} features. O MVP tem ${mvp.length}.`);
  else if (capacidade !== undefined) ok.push(`Prazo e equipe comportam o MVP (~${capacidade} features possíveis).`);
  else alertas.push("Prazo não informado ou não reconhecido (use algo como '2 semanas', '3 meses').");

  if (mecs.length > 5) alertas.push(`${mecs.length} mecânicas listadas. Para um primeiro jogo, 2–4 mecânicas bem feitas valem mais.`);
  const texto = JSON.stringify(p.etapas).toLowerCase();
  const riscos: [RegExp, string][] = [
    [/multiplayer|online|pvp|co-?op/, "Multiplayer online multiplica o esforço (rede, sincronização, servidores). Considere deixar para depois do MVP."],
    [/mundo aberto|open world/, "Mundo aberto exige muito conteúdo. Considere uma área pequena e densa."],
    [/mmo/, "MMO está fora do alcance de times pequenos. Reduza para multiplayer local ou single-player."],
    [/procedural|gerado aleatori/, "Geração procedural economiza conteúdo, mas consome tempo de ajuste. Reserve tempo extra."],
    [/3d/, "3D custa mais em arte e câmera que 2D. Confirme que é essencial para a fantasia do jogador."],
    [/dublag|voice acting|voz/, "Dublagem é cara e difícil de iterar; texto ou sons vocais genéricos resolvem no MVP."],
  ];
  for (const [re, msg] of riscos) if (re.test(texto)) alertas.push(msg);
  return { veredito: alertas.length ? "atenção" : "ok", alertas, ok, semanas, pessoas, itensMvp: mvp.length };
}
