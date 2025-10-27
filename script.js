/* === Sempre começar no topo === */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

/* ================== LOADER TURBO ================== */
(function loaderBoot() {
  const loader = document.getElementById("loader");
  const typing = document.getElementById("typing");
  if (!loader) return;

  // Texto mais curto para acelerar a percepção
  const FULL_TEXT = "CYBERSERVER – Soluções em Tecnologia";
  const SHORT_TEXT = "CYBERSERVER";
  const isMobile = window.innerWidth < 480;
  const text = isMobile ? SHORT_TEXT : FULL_TEXT;

  // Pula o loader em visitas seguintes
  const seen = sessionStorage.getItem("seenLoader") === "1";

  // Fecha rápido em qualquer interação
  const skipEvents = ["click","scroll","keydown","touchstart"];
  skipEvents.forEach(ev => window.addEventListener(ev, forceHideLoader, { once:true, passive:true }));

  // Respeita prefers-reduced-motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || seen) return forceHideLoader(true);

  let hidden = false;
  let rafId = null;

  // Duração alvo do typing (dinâmica conforme tamanho do texto)
  const TYPE_MS = Math.min(900, Math.max(500, text.length * 22)); // 500–900ms
  const FADE_MS = 250; // fade mais curto
  const HARD_MAX = TYPE_MS + 400; // garante fechamento

  const t0 = performance.now();
  if (typing) typing.textContent = "";

  function tick(now) {
    if (hidden) return;
    const elapsed = now - t0;
    // Progresso 0..1 do typing
    const p = Math.min(1, elapsed / TYPE_MS);
    if (typing) {
      const chars = Math.ceil(p * text.length);
      typing.textContent = text.slice(0, chars);
    }
    if (p < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      // terminou de "digitar": fecha rapidinho
      setTimeout(forceHideLoader, 100);
    }
  }

  function forceHideLoader(immediate = false) {
    if (hidden) return;
    hidden = true;
    if (rafId) cancelAnimationFrame(rafId);
    try {
      if (immediate) {
        loader.remove();
      } else {
        loader.classList.add("fadeout-fast");
        setTimeout(() => loader.remove(), FADE_MS);
      }
    } catch {}
    // marca que já mostramos uma vez
    try { sessionStorage.setItem("seenLoader", "1"); } catch {}
  }

  // garante que não passe de HARD_MAX mesmo se algo travar
  setTimeout(() => forceHideLoader(), HARD_MAX);

  // Inicia digitação quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(tick));
  } else {
    requestAnimationFrame(tick);
  }

  // Volta do bfcache? Não mostra loader.
  window.addEventListener("pageshow", (e) => { if (e.persisted) forceHideLoader(true); });
})();

/* ================== FADE-UP ================== */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));

/* ================== CONTADOR ================== */
function animateNumbers() {
  document.querySelectorAll(".number").forEach((num) => {
    const target = parseFloat(num.getAttribute("data-target"));
    if (isNaN(target)) return;
    const duration = 1500;
    const start = performance.now();
    const isFloat = String(target).includes(".");
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const val = target * p;
      num.textContent = isFloat ? val.toFixed(1) : Math.round(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
const metricsSection = document.querySelector("#resultados");
if (metricsSection) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateNumbers();
        obs.disconnect();
      }
    });
  }, { threshold: 0.35 });
  obs.observe(metricsSection);
}

/* ================== MENU RESPONSIVO (SIDE DRAWER) ================== */
const menuBtn = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
(function menuBoot(){
  if (!menuBtn || !navMenu) return;

  // estado inicial
  navMenu.classList.remove("active");
  document.body.classList.remove("menu-open");
  menuBtn.textContent = "☰";

  // toggle
  menuBtn.addEventListener("click", () => {
    const willOpen = !navMenu.classList.contains("active");
    navMenu.classList.toggle("active", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    menuBtn.textContent = willOpen ? "✕" : "☰";
  });

  // fecha ao clicar em link
  document.querySelectorAll("#nav-menu a").forEach(a=>{
    a.addEventListener("click", ()=>{
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      menuBtn.textContent = "☰";
    });
  });

  // ao sair do mobile, reseta
  const MQ = window.matchMedia("(min-width: 821px)");
  MQ.addEventListener("change", () => {
    if (MQ.matches) {
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      menuBtn.textContent = "☰";
    }
  });
})();

/* ================== ENVIO WHATSAPP ================== */
function sendWhats(e) {
  e.preventDefault();
  const num = "5517991672067"; // troque pelo seu número
  const nome = (document.getElementById("fNome")?.value || "").trim();
  const email = (document.getElementById("fEmail")?.value || "").trim();
  const fone  = (document.getElementById("fFone")?.value  || "").trim();
  const empresa = (document.getElementById("fEmpresa")?.value || "").trim();
  const msg   = (document.getElementById("fMsg")?.value   || "").trim();

  if (!nome || !email || !fone || !msg) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return false;
  }

  const texto =
    `Olá! Gostaria de atendimento.\n\n` +
    ` Nome: ${nome}\n` +
    ` E-mail: ${email}\n` +
    ` Telefone: ${fone}\n` +
    (empresa ? ` Empresa: ${empresa}\n` : "") +
    ` Mensagem: ${msg}`;

  const url = `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
  const status = document.getElementById("form-status");
  if (status) status.textContent = "✅ Mensagem aberta no WhatsApp!";
  return false;
}
