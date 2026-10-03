---
name: interpretar-ideia
description: Transforma pedidos vagos ("quero um jogo tipo Hollow Knight mas fofo") em decisões de design concretas, sem jargão técnico. Use no início de qualquer projeto e sempre que o usuário descrever algo de forma ambígua.
etapas: [conceito, core_loop, mecanicas]
tags: [entrevista, requisitos, ideacao, usuario, perguntas]
---

# Interpretar a ideia do usuário

O usuário pensa em **experiências** ("quero que seja tenso", "tipo Stardew"). Seu trabalho é
traduzir isso em **decisões de design** e deixar a parte técnica invisível.

## Princípios

1. **Nunca pergunte o que você mesmo pode decidir.** Engine, linguagem, arquitetura, formato de
   arquivo: decida e explique em uma frase ("Vou fazer para navegador, assim você testa na hora").
2. **Ofereça opções em vez de perguntas abertas.** "O combate é (a) rápido e reflexo, (b) tático
   por turnos ou (c) quase nenhum, foco em exploração?" rende mais que "Como é o combate?".
3. **Uma pergunta por vez quando é importante; agrupe as fáceis.** No máximo 3 perguntas por mensagem.
4. **Espelhe antes de salvar.** "Entendi assim: … Está certo?" O usuário corrige o resumo muito
   mais fácil do que escreve do zero.
5. **Registre o 'não'.** O que o usuário rejeita vale tanto quanto o que aceita (salve em
   `fora_do_escopo` ou como nota com `anotar_decisao`).

## Decodificando referências

Quando o usuário cita um jogo, descubra **qual aspecto** ele quer. Pergunte com opções:

> "Quando você diz 'tipo Hollow Knight', é mais pelo (a) combate desafiador, (b) mapa para
> explorar e descobrir atalhos, (c) clima melancólico e arte desenhada à mão, ou (d) tudo isso?"

Tabela rápida de leituras comuns:

| Referência | Geralmente significa |
|---|---|
| Stardew Valley | rotina relaxante, progresso lento e constante, relações com personagens |
| Dark Souls / Hollow Knight | desafio alto e justo, aprender padrões, morrer faz parte |
| Celeste | controle preciso, muitas tentativas rápidas, história pessoal |
| Vampire Survivors | poder crescente, hordas, decisões de upgrade simples |
| Minecraft | liberdade criativa, coletar e construir, sem objetivo imposto |
| Among Us | social, blefe, partidas curtas com amigos |
| Candy Crush | sessões curtas, satisfação de combinar, metas por fase |
| Undertale | escolhas morais, humor, quebrar expectativas |

## Os 8 tipos de diversão (MDA)

Use para descobrir o **sentimento** buscado. Pergunte "Qual destes é o coração do jogo?" e
ofereça 2–3 que combinem com a ideia:

- **Sensação**: prazer dos sentidos, feedback gostoso (juice).
- **Fantasia**: ser alguém/algo que não se é.
- **Narrativa**: viver uma história.
- **Desafio**: superar obstáculos, dominar uma habilidade.
- **Companheirismo**: jogar com/contra outras pessoas.
- **Descoberta**: explorar, desvendar segredos.
- **Expressão**: criar, personalizar, deixar sua marca.
- **Submissão**: relaxar, passar o tempo sem pressão.

## Perfil do jogador (simplificado de Bartle)

Conquistadores (completar tudo), Exploradores (descobrir), Socializadores (interagir),
Competidores (vencer outros). Um jogo pequeno deve servir bem **um** perfil.

## Traduzindo adjetivos em decisões

| O usuário diz | Pergunte / proponha |
|---|---|
| "épico" | escala? (chefes enormes, trilha orquestral, história longa) Escolha uma. |
| "viciante" | loop curto (< 1 min) + recompensa frequente + "só mais uma" |
| "difícil" | justo (culpa do jogador) ou punitivo (perde progresso)? |
| "relaxante" | sem tempo limite, sem derrota dura, sons suaves |
| "realista" | visual realista ou regras realistas? (quase sempre: só o clima) |
| "com história" | história contada (cutscenes/texto) ou descoberta (ambiente/itens)? |
| "multiplayer" | local no mesmo sofá ou online? competitivo ou cooperativo? |

## Sinais de alerta (trate com cuidado)

- Ideia gigante ("MMO de mundo aberto"): valide o sonho e proponha o **núcleo jogável** dele
  como primeiro passo. Use `checar_escopo`.
- Muitas ideias soltas: peça para escolher a **uma** coisa que não pode faltar.
- Indecisão: gere um protótipo rápido de 2 variações; jogar decide melhor que discutir.

## Saída esperada

Ao fim da conversa, você deve conseguir preencher, com palavras que o usuário aprovou:
`pitch`, `genero`, `fantasia_do_jogador`, `publico`, `pilares`, e o esboço do `loop_principal`.
