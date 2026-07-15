document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ======================================================
     REEL (elemento visual do hero)
     ====================================================== */
  const SYMBOLS = ["💰", "🪙", "💵", "📈", "💎"];
  const FINAL_SYMBOL = "💰"; // todos os rolos param aqui
  const ITEM_HEIGHT = 92; // precisa bater com a altura definida em .reel-strip span no CSS

  const strips = document.querySelectorAll(".reel-strip");

  function randomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  function buildReel(stripEl, delayMs) {
    if (prefersReduced) {
      stripEl.innerHTML = `<span>${FINAL_SYMBOL}</span>`;
      return;
    }

    const spins = 16 + Math.floor(Math.random() * 6);
    let html = "";
    for (let i = 0; i < spins; i++) {
      html += `<span>${randomSymbol()}</span>`;
    }
    html += `<span>${FINAL_SYMBOL}</span>`;
    stripEl.innerHTML = html;

    const totalItems = spins + 1;
    const targetY = -(totalItems - 1) * ITEM_HEIGHT;

    stripEl.style.transition = "none";
    stripEl.style.transform = "translateY(0)";

    requestAnimationFrame(() => {
      setTimeout(() => {
        stripEl.style.transition = "transform 2.1s cubic-bezier(0.1, 0.8, 0.15, 1)";
        stripEl.style.transform = `translateY(${targetY}px)`;
      }, delayMs);
    });
  }

  strips.forEach((strip, index) => buildReel(strip, index * 220));

  // Realce simples no rótulo "SALDO" quando os rolos terminam de girar
  const label = document.querySelector(".slot-label");
  if (label && !prefersReduced) {
    setTimeout(() => {
      label.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      label.style.transform = "scale(1.08)";
      setTimeout(() => { label.style.transform = "scale(1)"; }, 300);
    }, 2400);
  }

  /* ======================================================
     MENU HAMBÚRGUER / SIDEBAR
     ====================================================== */
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarClose = document.getElementById("sidebar-close");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.contains("open");
      isOpen ? closeSidebar() : openSidebar();
    });
  }

  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

  sidebarLinks.forEach((link) => link.addEventListener("click", closeSidebar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  /* ======================================================
     ACCORDION DE COMANDOS
     ====================================================== */
  const accItems = document.querySelectorAll(".acc-item");

  function toggleAccItem(item, forceOpen) {
    const header = item.querySelector(".acc-header");
    const shouldOpen = forceOpen !== undefined ? forceOpen : !item.classList.contains("open");
    item.classList.toggle("open", shouldOpen);
    if (header) header.setAttribute("aria-expanded", String(shouldOpen));
  }

  accItems.forEach((item) => {
    const header = item.querySelector(".acc-header");
    if (header) header.addEventListener("click", () => toggleAccItem(item));
  });

  // Abre e rola até a categoria certa quando o link vem de uma âncora (#economia, #loja, #ranking...)
  function openFromHash() {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;
    const item = target.classList.contains("acc-item") ? target : target.closest(".acc-item");
    if (item) {
      toggleAccItem(item, true);
      setTimeout(() => target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" }), 60);
    }
  }

  window.addEventListener("hashchange", openFromHash);
  if (window.location.hash) setTimeout(openFromHash, 50);

  /* ======================================================
     ANIMAÇÃO SUAVE NO SCROLL (reveal)
     ====================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }
});

/*
  ATENÇÃO, DAVID:
  Os botões de convite (#invite-top, #invite-hero, #invite-sidebar, #invite-bottom) estão
  apontando para "#" no HTML. Troque o href de cada um pelo link real de convite do bot, algo como:

  https://discord.com/api/oauth2/authorize?client_id=SEU_CLIENT_ID&permissions=SUA_PERMISSAO&scope=bot%20applications.commands
*/