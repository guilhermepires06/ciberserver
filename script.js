/* === Sempre começar no topo === */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

/* === Loader (digitando) === */
document.addEventListener("DOMContentLoaded", () => {
  const text = ">CiberServer Soluções em Tecnologia";
  const typing = document.getElementById("typing");
  const loader = document.getElementById("loader");
  if (!typing || !loader) return;
  let i = 0;
  (function typeText() {
    if (i < text.length) {
      typing.textContent += text.charAt(i);
      i++;
      setTimeout(typeText, 70);
    } else {
      setTimeout(() => {
        loader.classList.add("fadeout");
        setTimeout(() => loader.remove(), 600);
      }, 500);
    }
  })();
});

/* === Fade-up === */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("show");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));

/* === Contador === */
function animateNumbers() {
  document.querySelectorAll(".number").forEach((num) => {
    const target = parseFloat(num.getAttribute("data-target"));
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

/* === Menu responsivo === */
const menuBtn = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
    menuBtn.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
  });
  document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      document.body.classList.remove("menu-open");
      menuBtn.textContent = "☰";
    });
  });
}

/* === Envio WhatsApp === */
function sendWhats(e) {
  e.preventDefault();
  const num = "5517999999999"; // <-- troque pelo seu número
  const nome = document.getElementById("fNome").value.trim();
  const email = document.getElementById("fEmail").value.trim();
  const fone = document.getElementById("fFone").value.trim();
  const empresa = document.getElementById("fEmpresa").value.trim();
  const msg = document.getElementById("fMsg").value.trim();

  if (!nome || !email || !fone || !msg) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return false;
  }

  const texto = `Olá! Gostaria de atendimento.\n\n👤 Nome: ${nome}\n📧 E-mail: ${email}\n📞 Telefone: ${fone}\n${empresa ? `🏢 Empresa: ${empresa}\n` : ""}💬 Mensagem: ${msg}`;
  const url = `https://wa.me/${num}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
  document.getElementById("form-status").textContent = "✅ Mensagem aberta no WhatsApp!";
  return false;
}
