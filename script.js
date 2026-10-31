// ============ PREENCHA AQUI ============
// Só números, com 55 + DDD.
const WHATSAPP = "5581999070229";
const TELEFONE = "+5581999070229";

// Endereço que aparece no mapa, no "Como chegar" e no rodapé.
// Troque pelo endereço completo, por exemplo: "Av. Conselheiro Aguiar, 1000, Boa Viagem, Recife - PE".
const ENDERECO = "Boa Viagem, Recife - PE";

// Link para o cliente avaliar no Google (perfil da empresa no Google Meu Negócio).
// No Google Maps: abra o perfil da empresa > "Pedir avaliações" > copie o link. Deixe vazio até ter.
const GOOGLE_AVALIAR_URL = "";

// AVALIAÇÕES REAIS de clientes do próprio chaveiro (copie do perfil dele no Google, com autorização
// do cliente quando possível). Não use avaliações de outra empresa. Modelo de uma avaliação:
//   { nome: "Maria S.", servico: "Abertura de porta", bairro: "Boa Viagem", estrelas: 5, texto: "..." },
const AVALIACOES = [];

// Valores e tempos são EXEMPLOS: troque pelos reais do chaveiro.
const SITUACOES = [
  { id: "porta",   grupo: "casa",  rotulo: "Fiquei trancado fora de casa", preco: "R$ 80 a R$ 150",  tempo: "20 a 40 min", nota: "Abertura sem danificar a fechadura." },
  { id: "miolo",   grupo: "casa",  rotulo: "Perdi a chave de casa",        preco: "R$ 90 a R$ 180",  tempo: "30 a 50 min", nota: "Abrimos, trocamos o miolo e entregamos chaves novas." },
  { id: "fechadura", grupo: "casa", rotulo: "Quero instalar uma fechadura", preco: "R$ 150 a R$ 350", tempo: "cerca de 1 hora", nota: "O valor depende do modelo escolhido." },
  { id: "copia",   grupo: "casa",  rotulo: "Preciso copiar uma chave",     preco: "R$ 10 a R$ 40",   tempo: "10 a 20 min", nota: "Cópia feita na hora, testada na sua frente." },
  { id: "carro",   grupo: "carro", rotulo: "Deixei a chave dentro do carro", preco: "R$ 100 a R$ 200", tempo: "20 a 40 min", nota: "Abertura sem arranhar a lataria." },
  { id: "codificada", grupo: "carro", rotulo: "Perdi a chave do carro",    preco: "R$ 200 a R$ 450", tempo: "1 a 2 horas", nota: "Chave codificada feita no local, programada para o seu carro." },
  { id: "quebrada", grupo: "carro", rotulo: "A chave quebrou na fechadura", preco: "R$ 100 a R$ 220", tempo: "30 a 60 min", nota: "Retiramos o pedaço e, se precisar, fazemos outra chave." }
];
// =======================================

const $ = (s) => document.querySelector(s);

function linkWhats(texto) {
  const msg = texto || "Olá! Preciso de um chaveiro.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function atualizarLinks() {
  document.querySelectorAll("[data-wa]").forEach((a) => {
    a.href = linkWhats();
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-wa-msg]").forEach((a) => {
    a.href = linkWhats(a.dataset.waMsg);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-call]").forEach((a) => {
    a.href = `tel:${TELEFONE}`;
  });
}

function desenharResultado(s) {
  const box = $("#result");
  box.replaceChildren();

  const preco = document.createElement("p");
  preco.className = "result-price";
  preco.textContent = s.preco;

  const tempo = document.createElement("p");
  tempo.className = "result-time";
  tempo.textContent = `O serviço leva ${s.tempo}.`;

  const nota = document.createElement("p");
  nota.className = "result-note";
  nota.textContent = s.nota;

  const botao = document.createElement("a");
  botao.className = "btn btn-blue";
  botao.target = "_blank";
  botao.rel = "noopener";
  botao.textContent = "Pedir esse serviço";
  botao.href = linkWhats(`Olá! ${s.rotulo}. Vi a estimativa de ${s.preco}. Pode me atender?`);

  box.append(preco, tempo, nota, botao);
}

function escolher(s, botaoClicado) {
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === botaoClicado)));
  desenharResultado(s);
}

function montarChips() {
  SITUACOES.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = s.rotulo;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => escolher(s, b));
    $(`#chips-${s.grupo}`).append(b);
  });
}

function montarTabela() {
  const titulos = { casa: "Em casa", carro: "No carro" };
  Object.keys(titulos).forEach((grupo) => {
    const corpo = $(`#tab-${grupo}`);
    const cab = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "colgroup";
    th.colSpan = 3;
    th.textContent = titulos[grupo];
    cab.append(th);
    corpo.append(cab);

    SITUACOES.filter((s) => s.grupo === grupo).forEach((s) => {
      const tr = document.createElement("tr");
      [s.rotulo, s.preco, s.tempo].forEach((txt, i) => {
        const td = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) td.scope = "row";
        td.textContent = txt;
        tr.append(td);
      });
      corpo.append(tr);
    });
  });
}

function formatarTelefone(numero) {
  const d = numero.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return numero;
}

function montarLocalizacao() {
  const busca = encodeURIComponent(ENDERECO);
  $("#mapa").src = `https://www.google.com/maps?q=${busca}&hl=pt-BR&z=15&output=embed`;
  $("#abrir-mapa").href = `https://www.google.com/maps/search/?api=1&query=${busca}`;
  $("#como-chegar").href = `https://www.google.com/maps/dir/?api=1&destination=${busca}`;
  $("#end-texto").textContent = ENDERECO;
  $("#end-rodape").textContent = ENDERECO;
  $("#tel-texto").textContent = formatarTelefone(WHATSAPP);
}

function montarAvaliacoes() {
  const grade = $("#review-grid");
  grade.replaceChildren();

  // Sem avaliações reais, a seção inteira (e o link do menu) fica escondida.
  const secao = $("#avaliacoes");
  const linkMenu = document.querySelector('#menu a[href="#avaliacoes"]');
  secao.hidden = AVALIACOES.length === 0;
  if (linkMenu) linkMenu.hidden = AVALIACOES.length === 0;
  if (AVALIACOES.length === 0) return;

  AVALIACOES.forEach((a) => {
    const fig = document.createElement("figure");

    const estrelas = document.createElement("p");
    estrelas.className = "stars";
    estrelas.setAttribute("role", "img");
    estrelas.setAttribute("aria-label", `${a.estrelas} de 5 estrelas`);
    estrelas.textContent = "★".repeat(a.estrelas) + "☆".repeat(5 - a.estrelas);

    const texto = document.createElement("blockquote");
    texto.textContent = a.texto;

    const legenda = document.createElement("figcaption");
    const nome = document.createElement("strong");
    nome.textContent = a.nome;
    legenda.append(nome, document.createTextNode([a.servico, a.bairro].filter(Boolean).join(", ")));

    fig.append(estrelas, texto, legenda);
    grade.append(fig);
  });

  if (GOOGLE_AVALIAR_URL) {
    const resumo = $("#aval-resumo");
    resumo.replaceChildren(document.createTextNode("Opiniões de clientes atendidos. "));
    const link = document.createElement("a");
    link.href = GOOGLE_AVALIAR_URL;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Avalie você também no Google";
    resumo.append(link);
  }
}

// No celular, a barra de baixo (WhatsApp e Ligar) só aparece depois que os botões do topo saem da tela.
function montarBarraDeBaixo() {
  document.documentElement.classList.add("js");
  const alvo = document.querySelector(".hero .actions");
  if (!("IntersectionObserver" in window) || !alvo) {
    document.documentElement.classList.add("dock-on");
    return;
  }
  new IntersectionObserver(([e]) => {
    document.documentElement.classList.toggle("dock-on", !e.isIntersecting);
  }).observe(alvo);
}

function montarMenu() {
  const topo = document.querySelector(".top");
  const botao = document.querySelector(".menu-btn");
  const fechar = () => {
    topo.classList.remove("open");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    botao.firstElementChild.firstElementChild.setAttribute("href", "#i-menu");
  };
  botao.addEventListener("click", () => {
    const abrir = !topo.classList.contains("open");
    topo.classList.toggle("open", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    botao.firstElementChild.firstElementChild.setAttribute("href", abrir ? "#i-fechar" : "#i-menu");
  });
  document.querySelectorAll("#menu a").forEach((a) => a.addEventListener("click", fechar));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechar(); });
}

// Dados para o Google entender o negócio (aparecem em buscas e no Maps). Não são visíveis na página.
function dadosParaGoogle() {
  const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const negocio = {
    "@context": "https://schema.org",
    "@type": "Locksmith",
    name: "Chaveiro Maré Alta",
    description: "Chaveiro 24 horas em Boa Viagem e Recife: abertura de portas e carros, troca de fechadura e chave codificada.",
    telephone: TELEFONE,
    address: { "@type": "PostalAddress", streetAddress: ENDERECO, addressLocality: "Recife", addressRegion: "PE", addressCountry: "BR" },
    areaServed: ["Recife", "Jaboatão dos Guararapes"],
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: dias, opens: "00:00", closes: "23:59" }]
  };
  const perguntas = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...document.querySelectorAll(".faq details")].map((d) => ({
      "@type": "Question",
      name: d.querySelector("summary").textContent.trim(),
      acceptedAnswer: { "@type": "Answer", text: d.querySelector("p").textContent.trim() }
    }))
  };
  [negocio, perguntas].forEach((obj) => {
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(obj);
    document.head.append(tag);
  });
}

atualizarLinks();
montarChips();
montarTabela();
montarLocalizacao();
montarAvaliacoes();
montarMenu();
montarBarraDeBaixo();
dadosParaGoogle();
