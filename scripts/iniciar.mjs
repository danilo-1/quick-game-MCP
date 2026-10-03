#!/usr/bin/env node
// Inicializador usado pelo .mcp.json: na primeira execução instala as dependências e compila,
// depois sobe o servidor. Toda saída de instalação vai para stderr para não poluir o canal MCP (stdout).
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const rodar = (args) => {
  const r = spawnSync(npm, args, { cwd: raiz, stdio: ["ignore", 2, 2], shell: process.platform === "win32" });
  if (r.status !== 0) {
    console.error(`[quick-game-mcp] falhou: npm ${args.join(" ")}`);
    process.exit(1);
  }
};

if (!existsSync(path.join(raiz, "node_modules", "@modelcontextprotocol", "sdk"))) {
  console.error("[quick-game-mcp] primeira execução: instalando dependências...");
  rodar(["install", "--no-audit", "--no-fund"]);
}
if (!existsSync(path.join(raiz, "dist", "index.js"))) rodar(["run", "build"]);

await import(pathToFileURL(path.join(raiz, "dist", "index.js")).href);
