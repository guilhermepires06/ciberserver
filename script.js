/* === Sempre começar no topo === */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

/* ================== LOADER ROBUSTO ================== */
(function loaderBoot() {
  const text = "CiberServer Soluções em Tecnologia";
  const loader = document.getElementById("loader");
  const typing = document.getElementById("typing");
  if (!loader) return;

  const LOADER_MAX = 6000;
  let hidden = false;
  setTimeout(forceHideLoader, LOADER_MAX);

  function forceHideLoader() {
    if (hidden) return;
    hidden = true;
    loader.classList.add("fadeout");
    setTimeout(() => loader.remove(), 600);
  }

  function startTyping() {
    if (!typing) return forceHideLoader();
    let i = 0;
    (function typeText() {
      try {
        if (i < text.length) {
          typing.textContent += text.charAt(i++);
          setTimeout(typeText, 70);
        } else {
          setTimeout(forceHideLoader, 500);
        }
      } catch { forceHideLoader(); }
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startTyping);
  } else {
    startTyping();
  }
  window.addEventListener("pageshow", (e) => { if (e.persisted) forceHideLoader(); });
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
  const num = "5517999999999"; // troque pelo seu número
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
    `👤 Nome: ${nome}\n` +
    `📧 E-mail: ${email}\n` +
    `📞 Telefone: ${fone}\n` +
    (empresa ? `🏢 Empresa: ${empresa}\n` : "") +
    `💬 Mensagem: ${msg}`;

  const url = `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
  const status = document.getElementById("form-status");
  if (status) status.textContent = "✅ Mensagem aberta no WhatsApp!";
  return false;
}
