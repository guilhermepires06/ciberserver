/* Começar no topo ao carregar ----------------------------------- */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.addEventListener("load", () => window.scrollTo(0, 0));

/* MENU MOBILE --------------------------------------------------- */
(function initMenu() {
  const btn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("open"))
  );
})();

/* REVEAL + CONTADORES ------------------------------------------ */
(function initRevealAndCounters() {
  const revealEls = document.querySelectorAll(".reveal");

  function animateNumbers(scope) {
    const selector = ".metric-number, .stat-number";
    const elements = scope
      ? scope.querySelectorAll(selector)
      : document.querySelectorAll(selector);

    elements.forEach((elem) => {
      if (elem.dataset._animated === "1") return;

      const target = parseFloat(elem.getAttribute("data-target"));
      if (isNaN(target)) return;

      elem.dataset._animated = "1";
      const isFloat = String(target).includes(".");
      const duration = 1500;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = target * progress;
        elem.textContent = isFloat ? value.toFixed(1) : Math.round(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("show"));
    animateNumbers();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("show");
        animateNumbers(el);
        io.unobserve(el);
      });
    },
    { threshold: 0.2 }
  );

  revealEls.forEach((el) => io.observe(el));
})();

/* FORM / WHATSAPP ---------------------------------------------- */
function sendWhats(ev) {
  ev.preventDefault();

  const nome = (document.getElementById("fNome") || {}).value?.trim() || "";
  const empresa = (document.getElementById("fEmpresa") || {}).value?.trim() || "";
  const email = (document.getElementById("fEmail") || {}).value?.trim() || "";
  const fone = (document.getElementById("fFone") || {}).value?.trim() || "";
  const tipo = (document.getElementById("fTipo") || {}).value?.trim() || "";
  const msg = (document.getElementById("fMsg") || {}).value?.trim() || "";

  const numero = "5517991672067";

  const texto =
    "Olá! Gostaria de atendimento com a CYBERSERVER.\n\n" +
    (nome ? `Nome: ${nome}\n` : "") +
    (empresa ? `Empresa: ${empresa}\n` : "") +
    (email ? `E-mail: ${email}\n` : "") +
    (fone ? `Telefone: ${fone}\n` : "") +
    (tipo ? `Serviço principal: ${tipo}\n` : "") +
    `\nDescrição do cenário:\n${msg}`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");

  const status = document.getElementById("form-status");
  if (status) {
    status.textContent =
      "✅ Abrimos a conversa no WhatsApp. É só enviar a mensagem por lá.";
  }

  return false;
}
