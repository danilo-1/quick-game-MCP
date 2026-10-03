---
name: escopo-e-mvp
description: Define o MVP (mínimo jogável), corta escopo sem matar a ideia e escolhe plataforma e tecnologia pelo usuário. Use na etapa de escopo e sempre que o projeto parecer grande demais.
etapas: [escopo]
tags: [escopo, mvp, prazo, plataforma, engine, priorizacao]
---

# Escopo e MVP

## MVP = o menor jogo que ainda é "o jogo"

Pergunte: *"Se o jogo tivesse só 3 coisas, quais seriam para ainda ser o SEU jogo?"*
O MVP ideal tem **3 a 7 itens** e pode ser jogado do começo ao fim (início, meio, fim).

## Priorização MoSCoW

- **Must** (MVP): sem isso não existe jogo.
- **Should**: deixa muito melhor, entra se sobrar tempo.
- **Could**: bom ter, vai para depois do lançamento.
- **Won't (agora)**: registrado em `fora_do_escopo` para não se perder.

## Regras de bolso de tamanho

| Prazo | Equipe de 1 | Exemplo de escopo realista |
|---|---|---|
| Fim de semana (jam) | 1 mecânica, 1 tela/fase, sem menus | "Um botão, uma ideia" |
| 1 mês | 2–3 mecânicas, 5–10 fases curtas | Plataforma pequeno, puzzle |
| 3–6 meses | loop + meta-loop, 1–2 horas de jogo | Roguelike enxuto, metroidvania curto |
| 1 ano+ | jogo comercial pequeno | Steam indie |

Multiplique o tempo estimado por 2 (a maioria subestima). Rode `checar_escopo`.

## Cortar sem matar

- Corte **quantidade**, não **qualidade**: 3 fases ótimas > 15 medianas.
- Troque sistemas por conteúdo fixo: loja → itens espalhados no mapa.
- Troque online por local: multiplayer no mesmo teclado.
- Troque 3D por 2D, cutscene por texto, dublagem por sons.

## Plataforma e tecnologia (decisão do assistente)

Pergunte só **onde** o usuário quer que rode. A tecnologia você escolhe:

| Situação | Escolha | Por quê (frase para o usuário) |
|---|---|---|
| Sem preferência, quer testar já | **web-canvas** (protótipo gerado) | "Abre no navegador, sem instalar nada." |
| Projeto 2D maior, PC/celular | **Godot** | "Gratuita, leve e ótima para 2D." |
| 3D ambicioso ou console | **Unity** ou **Unreal** | "Padrão da indústria para 3D." |
| Web com mais recursos | **Phaser** | "Feito para jogos de navegador." |
| Público jovem, social | **Roblox** | "Seu público já está lá." |

Se o usuário citou uma engine, respeite. Use as skills da comunidade daquela engine para a
implementação (ex.: `godot-nodes-scenes`, `phaser-core`).

## Saída

Salve `plataforma`, `engine`, `prazo`, `equipe`, `mvp` (lista) e `fora_do_escopo`.
