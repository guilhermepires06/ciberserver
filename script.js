/* === Sempre começar no topo === */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

/* ================== LOADER TURBO  ================== */
(function loaderBoot() {
  try {
    const loader = document.getElementById("loader");
    const typing = document.getElementById("typing");
    if (!loader) return;

    // Helpers para storage seguro
    const safeSession = {
      get(k){ try { return sessionStorage.getItem(k); } catch { return null; } },
      set(k,v){ try { sessionStorage.setItem(k,v); } catch {} }
    };

    // Detecta reload (para mostrar o loader de novo no F5)
    const navEntry = (performance.getEntriesByType && performance.getEntriesByType("navigation")[0]) || null;
    const isReload = navEntry ? navEntry.type === "reload"
                              : (performance.navigation && performance.navigation.type === 1);

    // Texto responsivo (duas linhas no mobile)
    const FULL_TEXT   = "CYBERSERVER – Soluções em Tecnologia";
    const MOBILE_TEXT = "CYBERSERVER\nSoluções em Tecnologia";
    const isNarrow = window.innerWidth < 480;
    const text = isNarrow ? MOBILE_TEXT : FULL_TEXT;

    // Pula somente navegação intra-aba (não em reload)
    const seenOnce = safeSession.get("seenLoader") === "1";
    const shouldSkip = !isReload && seenOnce;

    let hidden = false;
    let rafId = null;

    function reallyRemove(el){
      try { el.remove(); }
      catch { try { el.parentNode && el.parentNode.removeChild(el); } catch {} }
    }

    function forceHideLoader(immediate = false) {
      if (hidden) return;
      hidden = true;
      if (rafId) cancelAnimationFrame(rafId);
      try {
        if (immediate) {
          reallyRemove(loader);
        } else {
          loader.classList.add("fadeout-fast");
          setTimeout(() => reallyRemove(loader), FADE_MS);
        }
      } catch {}
      safeSession.set("seenLoader", "1");
    }

    if (shouldSkip) return forceHideLoader(true);

    // Fecha ao interagir
    ["click","scroll","keydown","touchstart"].forEach(ev =>
      window.addEventListener(ev, () => forceHideLoader(), { once:true, passive:true })
    );

    // Respeita prefers-reduced-motion
    const prefersReduced = (() => {
      try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
      catch { return false; }
    })();
    if (prefersReduced) return forceHideLoader(true);

    // 🔔 Ajuste “um pouco mais lento”
    // antes (~1.5–2.3s), agora ~1.7–2.6s
    const TYPE_MS   = Math.min(2600, Math.max(1700, text.length * 48));
    const LINGER_MS = 500;   // pausa ao terminar
    const FADE_MS   = 400;   // fade um pouco mais demorado
    const HARD_MAX  = TYPE_MS + LINGER_MS + 900;

    const t0 = performance.now();
    if (typing) typing.textContent = "";

    function tick(now) {
      if (hidden) return;
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / TYPE_MS);
      if (typing) {
        const chars = Math.ceil(p * text.length);
        typing.textContent = text.slice(0, chars);
      } else {
        return forceHideLoader(true);
      }
      if (p < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(forceHideLoader, LINGER_MS);
      }
    }

    // Mata-motor garantido
    setTimeout(() => forceHideLoader(true), HARD_MAX);

    // Inicia digitação quando o DOM estiver pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(tick), { once:true });
    } else {
      requestAnimationFrame(tick);
    }

    // Volta do bfcache? Some imediatamente.
    window.addEventListener("pageshow", (e) => { if (e.persisted) forceHideLoader(true); });

    // Perdeu foco? Some para não travar
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") forceHideLoader(true);
    });

  } catch {
    try {
      const loader = document.getElementById("loader");
      if (loader) {
        loader.classList.add("fadeout-fast");
        setTimeout(() => { try { loader.remove(); } catch {} }, 300);
      }
    } catch {}
  }
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
