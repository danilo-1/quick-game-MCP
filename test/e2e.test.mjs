// Teste de ponta a ponta: sobe o servidor via stdio e percorre o fluxo de criação de um jogo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const workspace = mkdtempSync(path.join(tmpdir(), "qg-"));
const client = new Client({ name: "teste", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: { ...process.env, QUICK_GAME_WORKSPACE: workspace } }));
const chamar = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  assert.ok(!r.isError, r.content[0].text);
  return r.content[0].text;
};

test("lista ferramentas, prompts e skills", async () => {
  const { tools } = await client.listTools();
  for (const t of ["criar_jogo", "guia_etapa", "salvar_etapa", "gerar_prototipo", "gerar_gdd", "ler_skill"]) assert.ok(tools.some((x) => x.name === t), t);
  const { prompts } = await client.listPrompts();
  assert.ok(prompts.some((p) => p.name === "novo-jogo"));
  const sk = JSON.parse(await chamar("listar_skills"));
  assert.ok(sk.total >= 80, `total ${sk.total}`);
  assert.ok(sk.skills.some((s) => s.nome === "interpretar-ideia" && s.origem === "quick-game-mcp"));
  assert.ok(sk.skills.some((s) => s.nome === "platformer" && s.origem === "awesome-gamedev-agent-skills"));
});

test("fluxo completo de um jogo de plataforma", async () => {
  const criado = JSON.parse(await chamar("criar_jogo", { ideia: "Quero um jogo de plataforma tipo Celeste com um gato astronauta coletando estrelas", nome: "Gato Espacial" }));
  assert.equal(criado.jogo, "gato-espacial");
  assert.ok(criado.skills_para_ler_agora.includes("platformer"));
  assert.ok(criado.guia.perguntas_para_o_usuario.length > 0);

  const s1 = JSON.parse(await chamar("salvar_etapa", { jogo: "gato-espacial", etapa: "conceito", concluir: true, dados: {
    pitch: "Um gato astronauta salta entre planetas para recuperar seu peixe dourado.", genero: "plataforma",
    fantasia_do_jogador: "Sentir-se ágil", publico: "Casual", pilares: ["Movimento delicioso", "Curiosidade", "Desafio justo"] } }));
  assert.equal(s1.concluida, true);
  assert.equal(s1.proxima_etapa.id, "core_loop");

  const s2 = JSON.parse(await chamar("salvar_etapa", { jogo: "gato-espacial", etapa: "core_loop", concluir: true, dados: { loop_principal: "pular" } }));
  assert.equal(s2.concluida, false);
  assert.ok(s2.faltando.includes("verbos"));

  await chamar("salvar_etapa", { jogo: "gato-espacial", etapa: "core_loop", concluir: true, dados: {
    verbos: "correr, pular", objetivo: "Chegar à bandeira", condicao_vitoria: "Bandeira", condicao_derrota: "Cair" } });
  await chamar("salvar_etapa", { jogo: "gato-espacial", etapa: "arte_audio", dados: { paleta: "#000000, #ffec27, #ff004d, #29adff, #fff1e8" } });
  await chamar("salvar_etapa", { jogo: "gato-espacial", etapa: "escopo", dados: {
    prazo: "2 semanas", equipe: "só eu", mvp: "pulo; 3 fases; estrelas; tela de vitória; multiplayer online" } });

  const escopo = JSON.parse(await chamar("checar_escopo", { jogo: "gato-espacial" }));
  assert.equal(escopo.veredito, "atenção");
  assert.ok(escopo.alertas.some((a) => a.includes("Multiplayer")));

  const status = await chamar("status_jogo", { jogo: "gato-espacial" });
  assert.match(status, /2\/11 etapas obrigatórias/);

  const proto = JSON.parse(await chamar("gerar_prototipo", { jogo: "gato-espacial", ajustes: { forcaPulo: 14 } }));
  assert.equal(proto.modelo, "plataforma");
  const html = readFileSync(proto.arquivo, "utf8");
  assert.match(html, /"forcaPulo":14/);
  assert.match(html, /"corFundo":"#000000"/);
  assert.ok(!html.includes("__AJUSTES__"));

  const gdd = await chamar("gerar_gdd", { jogo: "gato-espacial" });
  assert.match(gdd, /# Gato Espacial/);
  assert.match(gdd, /peixe dourado/);
  assert.ok(existsSync(path.join(workspace, "gato-espacial", "GDD.md")));

  const backlog = await chamar("gerar_backlog", { jogo: "gato-espacial" });
  assert.match(backlog, /- \[ \] Implementar: 3 fases/);
});

test("roteamento e leitura de skills", async () => {
  const r = JSON.parse(await chamar("recomendar_skills", { pedido: "um roguelike em Godot com inimigos que patrulham e salvar progresso" }));
  assert.equal(r.genero, "roguelike");
  assert.equal(r.engine, "godot");
  assert.ok(r.skills.includes("godot-gdscript") && r.skills.includes("save-systems") && r.skills.includes("game-ai"));
  const conteudo = await chamar("ler_skill", { nome: "interpretar-ideia" });
  assert.match(conteudo, /Interpretar a ideia/);
  const res = await client.readResource({ uri: "skill://game-feel" });
  assert.ok(res.contents[0].text.length > 100);
});

test("protótipos de todos os modelos são gerados", async () => {
  await chamar("criar_jogo", { ideia: "história interativa com escolhas", nome: "Conto" });
  for (const modelo of ["plataforma", "topdown", "nave", "narrativa"]) {
    const r = JSON.parse(await chamar("gerar_prototipo", { jogo: "conto", modelo }));
    const html = readFileSync(r.arquivo, "utf8");
    assert.ok(!/__[A-Z]+__/.test(html), `marcadores sobrando em ${modelo}`);
  }
  await client.close();
});
