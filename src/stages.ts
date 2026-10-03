// Pipeline de criação de jogos: as etapas centrais, na ordem em que um estúdio as percorre.
// Cada etapa traz as perguntas em linguagem simples (sem jargão técnico) que o assistente
// deve fazer ao usuário, os campos que precisam ser preenchidos e as skills que ajudam.

export interface Campo {
  id: string;
  descricao: string;
  obrigatorio: boolean;
  exemplo?: string;
}

export interface Etapa {
  id: string;
  ordem: number;
  nome: string;
  obrigatoria: boolean;
  objetivo: string;
  perguntas: string[];
  campos: Campo[];
  entregavel: string;
  dicas: string[];
  skills: string[];
}

const c = (id: string, descricao: string, obrigatorio = true, exemplo?: string): Campo => ({
  id,
  descricao,
  obrigatorio,
  exemplo,
});

export const ETAPAS: Etapa[] = [
  {
    id: "conceito",
    ordem: 1,
    nome: "Conceito",
    obrigatoria: true,
    objetivo: "Transformar a ideia solta em um conceito claro: o que é o jogo, para quem e por que é divertido.",
    perguntas: [
      "Em uma frase, como você contaria o jogo para um amigo?",
      "Que jogos, filmes ou séries têm a 'vibe' que você imagina? (ex.: 'Celeste encontra Hollow Knight')",
      "O que o jogador deve SENTIR jogando? (poder, tensão, calma, curiosidade, esperteza...)",
      "Quem você imagina jogando? (idade, joga no celular no ônibus ou no PC por horas?)",
    ],
    campos: [
      c("pitch", "Frase de uma linha que vende o jogo", true, "Um gato astronauta que salta entre planetas para recuperar seu peixe dourado."),
      c("genero", "Gênero principal (plataforma, roguelike, RPG, puzzle, tiro, visual novel...)", true, "plataforma"),
      c("fantasia_do_jogador", "A experiência/emoção central que o jogador vive", true, "Sentir-se ágil e livre no espaço"),
      c("publico", "Público-alvo e contexto de jogo", true, "Jogadores casuais, sessões de 5–15 min"),
      c("referencias", "Jogos/obras de referência", false, "Celeste, Mario Galaxy"),
      c("pilares", "3 pilares de design: frases que decidem o que entra ou sai do jogo", true, "Movimento delicioso; Exploração curiosa; Desafio justo"),
    ],
    entregavel: "Ficha de conceito (pitch + pilares) aprovada pelo usuário.",
    dicas: [
      "Nunca pergunte sobre engine ou código aqui. O usuário só idealiza.",
      "Ofereça 2–3 versões do pitch para o usuário escolher em vez de pedir que ele escreva do zero.",
      "Pilares são filtros: se uma feature não serve a nenhum pilar, ela sai.",
    ],
    skills: ["interpretar-ideia", "brainstorm-conceito", "pilares-de-design"],
  },
  {
    id: "core_loop",
    ordem: 2,
    nome: "Loop principal",
    obrigatoria: true,
    objetivo: "Definir o ciclo que o jogador repete o tempo todo e como ele ganha ou perde.",
    perguntas: [
      "O que o jogador faz a cada poucos segundos? (pular, atirar, escolher, combinar...)",
      "O que ele está tentando alcançar? Quando sabe que venceu?",
      "Como ele pode falhar? O que acontece quando falha?",
    ],
    campos: [
      c("loop_principal", "Ciclo de 2–4 passos repetido pelo jogador", true, "Explorar → coletar estrelas → desbloquear planeta → explorar"),
      c("verbos", "Ações principais do jogador (verbos)", true, "correr, pular, planar"),
      c("objetivo", "Objetivo do jogador", true, "Chegar à bandeira de cada fase"),
      c("condicao_vitoria", "Como se vence (fase/jogo)", true, "Tocar a bandeira"),
      c("condicao_derrota", "Como se perde e o que acontece", true, "Cair no vazio volta ao último checkpoint"),
    ],
    entregavel: "Loop principal descrito e validado com o usuário.",
    dicas: [
      "Se o loop não cabe em uma frase, provavelmente são dois jogos.",
      "Verbos concretos geram mecânicas; adjetivos ('épico', 'imersivo') não.",
    ],
    skills: ["core-loop-e-mecanicas", "interpretar-ideia"],
  },
  {
    id: "mecanicas",
    ordem: 3,
    nome: "Mecânicas e controles",
    obrigatoria: true,
    objetivo: "Detalhar as regras e mecânicas que sustentam o loop e como o jogador controla tudo.",
    perguntas: [
      "Quais 'poderes' ou ações especiais o jogador tem além do básico?",
      "Existem inimigos, obstáculos ou adversários? Como se comportam?",
      "Onde você imagina jogando: teclado, controle, toque na tela?",
    ],
    campos: [
      c("mecanicas", "Lista de mecânicas com regra curta para cada uma", true, "Pulo duplo: um segundo pulo no ar, recarrega ao tocar o chão"),
      c("obstaculos_inimigos", "Inimigos/obstáculos e comportamento", false, "Meteoros caem em linha reta; aliens patrulham plataformas"),
      c("controles", "Esquema de controle", true, "Setas/WASD movem, Espaço pula"),
    ],
    entregavel: "Lista de mecânicas com regras claras e esquema de controles.",
    dicas: ["Comece com o mínimo de mecânicas que torna o loop divertido; o resto vai para 'depois do MVP'."],
    skills: ["core-loop-e-mecanicas", "game-feel", "input-systems"],
  },
  {
    id: "progressao",
    ordem: 4,
    nome: "Progressão, dificuldade e economia",
    obrigatoria: true,
    objetivo: "Definir como o jogo evolui com o tempo: desafio, recompensas e (se houver) economia.",
    perguntas: [
      "O jogo fica mais difícil como? Inimigos mais rápidos, fases mais longas, novas regras?",
      "O que o jogador ganha ao avançar? (fases novas, habilidades, itens, história)",
      "Existe moeda, loja, upgrades ou crafting?",
    ],
    campos: [
      c("progressao", "Como o jogador avança (fases, níveis, mapa, runs)", true, "5 mundos com 3 fases cada"),
      c("recompensas", "O que é conquistado ao progredir", true, "Nova habilidade a cada mundo"),
      c("curva_dificuldade", "Como a dificuldade cresce", true, "Introduz um conceito por fase, combina no fim do mundo"),
      c("economia", "Moedas, lojas, upgrades (se houver)", false),
    ],
    entregavel: "Mapa de progressão e curva de dificuldade.",
    dicas: ["Ensine, teste, combine: apresente uma ideia em segurança, depois cobre, depois misture."],
    skills: ["progressao-e-economia", "level-design"],
  },
  {
    id: "escopo",
    ordem: 5,
    nome: "Escopo, plataforma e MVP",
    obrigatoria: true,
    objetivo: "Decidir o tamanho real do projeto e o mínimo jogável (MVP). A parte técnica é decidida pelo assistente.",
    perguntas: [
      "Onde o jogo deve rodar? (navegador, PC, celular, console)",
      "Quanto tempo você quer investir até ter algo jogável? (fim de semana, 1 mês, 6 meses)",
      "Quem vai trabalhar nisso? Só você ou um time?",
      "Das ideias até agora, quais 3–7 são indispensáveis para o jogo 'ser ele'?",
    ],
    campos: [
      c("plataforma", "Plataforma(s) alvo", true, "Navegador (web)"),
      c("engine", "Tecnologia escolhida (o assistente decide se o usuário não tiver preferência)", true, "web-canvas (protótipo gerado automaticamente)"),
      c("prazo", "Prazo desejado", true, "4 semanas"),
      c("equipe", "Quem trabalha no projeto", true, "1 pessoa"),
      c("mvp", "Lista curta de features indispensáveis", true, "movimento + pulo; 3 fases; coletáveis; tela de vitória"),
      c("fora_do_escopo", "O que fica para depois", false, "multiplayer, editor de fases"),
    ],
    entregavel: "MVP fechado + plataforma + tecnologia definida.",
    dicas: [
      "Se o usuário não tem preferência técnica, escolha web-canvas (protótipo instantâneo) ou recomende Godot para projetos maiores.",
      "Use a ferramenta checar_escopo antes de concluir esta etapa.",
    ],
    skills: ["escopo-e-mvp", "prototype-fast", "game-jam"],
  },
  {
    id: "mundo_narrativa",
    ordem: 6,
    nome: "Mundo e narrativa",
    obrigatoria: false,
    objetivo: "Dar contexto e alma ao jogo: ambientação, personagens e tom. Pode ser mínima em jogos abstratos.",
    perguntas: [
      "Onde e quando o jogo acontece?",
      "Quem é o protagonista e o que ele quer?",
      "O tom é sério, engraçado, sombrio, fofo?",
    ],
    campos: [
      c("ambientacao", "Mundo/cenário", true, "Sistema solar de doces"),
      c("protagonista", "Personagem principal e motivação", false, "Miau, gato astronauta que perdeu seu peixe"),
      c("historia", "Resumo da história (começo, meio, fim)", false),
      c("tom", "Tom geral", true, "Fofo e bem-humorado"),
    ],
    entregavel: "Bíblia curta do mundo (ambientação, personagens, tom).",
    dicas: ["Narrativa deve reforçar o loop, não competir com ele."],
    skills: ["narrativa-e-mundo", "dialogue-systems"],
  },
  {
    id: "arte_audio",
    ordem: 7,
    nome: "Direção de arte e áudio",
    obrigatoria: true,
    objetivo: "Definir a identidade visual e sonora de forma que seja viável de produzir.",
    perguntas: [
      "Que estilo visual combina com o jogo? (pixel art, desenho à mão, 3D simples, minimalista)",
      "Quais cores você associa a ele?",
      "Que tipo de música e sons você imagina?",
    ],
    campos: [
      c("estilo_visual", "Estilo visual", true, "Pixel art 16x16, contornos escuros"),
      c("paleta", "Paleta de cores (nomes ou hex)", true, "#1d2b53, #ff77a8, #ffec27, #29adff"),
      c("estilo_audio", "Estilo de música e efeitos", true, "Chiptune alegre, efeitos curtos"),
      c("lista_assets", "Lista inicial de assets necessários", false, "gato (idle/correr/pular), plataforma, estrela, bandeira"),
    ],
    entregavel: "Guia visual/sonoro + lista de assets.",
    dicas: ["Para quem não desenha, estilos simples (formas geométricas, pixel art pequena, assets CC0 da Kenney) são o caminho."],
    skills: ["direcao-de-arte-e-audio", "create-game-assets", "audio-design"],
  },
  {
    id: "conteudo_niveis",
    ordem: 8,
    nome: "Conteúdo e níveis",
    obrigatoria: true,
    objetivo: "Planejar o conteúdo concreto: fases, inimigos, itens e como são distribuídos.",
    perguntas: [
      "Quantas fases/áreas o MVP precisa ter?",
      "Como a primeira fase ensina o jogo sem tutorial em texto?",
      "Qual o momento mais marcante que você imagina em uma fase?",
    ],
    campos: [
      c("estrutura_niveis", "Estrutura de fases/áreas", true, "Fase 1 ensina pulo; Fase 2 pulo duplo; Fase 3 combina com meteoros"),
      c("quantidade_conteudo", "Quantidade de conteúdo do MVP", true, "3 fases, 2 inimigos, 1 coletável"),
      c("momentos_chave", "Momentos memoráveis", false),
    ],
    entregavel: "Plano de fases e lista de conteúdo do MVP.",
    dicas: ["A primeira fase é o tutorial: ensine com o design do espaço, não com texto."],
    skills: ["level-design", "procedural-gen"],
  },
  {
    id: "ux_interface",
    ordem: 9,
    nome: "Interface e experiência",
    obrigatoria: true,
    objetivo: "Definir telas, HUD e como o jogador aprende e se orienta.",
    perguntas: [
      "Que informação o jogador precisa ver o tempo todo? (vida, pontos, tempo...)",
      "Quais telas o jogo tem? (menu, pausa, fim de jogo, opções)",
      "Há algo de acessibilidade importante para seu público? (legendas, daltonismo, controles remapeáveis)",
    ],
    campos: [
      c("hud", "Informações sempre visíveis", true, "Estrelas coletadas, vidas"),
      c("telas", "Telas do jogo", true, "Título, jogo, pausa, vitória, game over"),
      c("onboarding", "Como o jogador aprende a jogar", true, "Dicas de controle na primeira fase"),
      c("acessibilidade", "Opções de acessibilidade", false),
    ],
    entregavel: "Fluxo de telas e HUD definidos.",
    dicas: ["Menos HUD é mais: só o que muda decisões do jogador."],
    skills: ["ux-e-onboarding", "game-ui-ux"],
  },
  {
    id: "prototipo",
    ordem: 10,
    nome: "Protótipo jogável",
    obrigatoria: true,
    objetivo: "Gerar algo jogável para validar o loop. O assistente cuida de todo o código.",
    perguntas: [
      "Quer ver uma primeira versão jogável agora para sentir o jogo?",
      "Depois de jogar: o que está mais divertido e o que está estranho?",
    ],
    campos: [
      c("template", "Modelo de protótipo usado", true, "plataforma"),
      c("arquivo", "Caminho do protótipo gerado", true),
      c("feedback", "Impressões do usuário ao jogar", false),
    ],
    entregavel: "Protótipo jogável (HTML5) que o usuário abre no navegador.",
    dicas: [
      "Use a ferramenta gerar_prototipo; ela escolhe o modelo pelo gênero e aplica paleta e parâmetros.",
      "Ajustes de sensação ('pulo muito baixo', 'inimigo rápido demais') viram parâmetros em gerar_prototipo.ajustes.",
    ],
    skills: ["prototype-fast", "game-feel", "phaser-core"],
  },
  {
    id: "playtest_balanceamento",
    ordem: 11,
    nome: "Playtest e balanceamento",
    obrigatoria: true,
    objetivo: "Colocar o jogo na mão de outras pessoas, observar e ajustar.",
    perguntas: [
      "Quem pode testar o jogo? (amigos, comunidade, família)",
      "O que você mais quer descobrir com o teste? (é divertido? é difícil demais? entendem o objetivo?)",
    ],
    campos: [
      c("plano_teste", "Quem testa, como e o que observar", true),
      c("perguntas_teste", "Perguntas para os testadores", true),
      c("resultados", "Principais achados", false),
      c("ajustes", "Mudanças decididas a partir do teste", false),
    ],
    entregavel: "Relatório de playtest e lista de ajustes.",
    dicas: ["Observe mais do que pergunte; o que o jogador faz vale mais do que o que ele diz."],
    skills: ["playtest", "progressao-e-economia", "game-feel"],
  },
  {
    id: "lancamento",
    ordem: 12,
    nome: "Polimento e lançamento",
    obrigatoria: true,
    objetivo: "Polir, empacotar e publicar o jogo onde o público está.",
    perguntas: [
      "Onde quer publicar? (itch.io, Steam, lojas de celular, site próprio)",
      "O jogo será gratuito, pago ou 'pague quanto quiser'?",
      "Que imagem/trailer representaria o jogo melhor?",
    ],
    campos: [
      c("canal", "Onde publicar", true, "itch.io (web)"),
      c("modelo_negocio", "Gratuito, pago, doações...", true, "Gratuito com doação opcional"),
      c("materiais", "Materiais de divulgação", true, "Capa 630x500, 5 screenshots, GIF de 10s"),
      c("checklist", "Checklist final de lançamento", false),
    ],
    entregavel: "Jogo publicado com página e materiais.",
    dicas: ["Lance cedo e pequeno; um jogo publicado ensina mais que dez inacabados."],
    skills: ["lancamento", "itch-publish", "steam-publish"],
  },
];

export function getEtapa(id: string): Etapa | undefined {
  const norm = id.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ETAPAS.find((e) => e.id === norm || String(e.ordem) === norm);
}
