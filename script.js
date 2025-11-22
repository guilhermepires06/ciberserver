// MENU MOBILE ----------------------------------------------------
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

// FORM / WHATSAPP -----------------------------------------------
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
