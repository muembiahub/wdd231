
document.addEventListener("DOMContentLoaded", () => {
  // ===== TOP BAR =====
  const topBar = document.createElement("div");
  topBar.id = "topBar";

  const contactInfo = document.createElement("div");
  contactInfo.className = "contactInfo";

  const emailLink = document.createElement("a");
  emailLink.className = "email";
  emailLink.href = "mailto:contact@kazidomo.com";
  emailLink.target = "_blank";
  emailLink.innerHTML = '<i class="fa-solid fa-envelope"></i> contact@kazidomo.com';

  const phoneLink = document.createElement("a");
  phoneLink.className = "phone";
  phoneLink.href = "tel:+243825267122";
  phoneLink.innerHTML = '<i class="fa-solid fa-phone"></i> +243 825 267 122';

  contactInfo.append(emailLink, phoneLink);
  topBar.append(contactInfo);

  const socialIcons = document.createElement("div");
  socialIcons.className = "socialIcons";

  const socialLinks = [
    { href: "https://www.facebook.com/profile.php?id=61578830991597", icon: "fa-brands fa-facebook" },
    { href: "https://www.linkedin.com/in/kazidomo-confiance-287846383", icon: "fa-brands fa-linkedin" },
    { href: "https://www.tiktok.com/@kazidomo3?_t=ZM-8zPu75OCnCP&_r=1", icon: "fa-brands fa-tiktok" },
  ];

  socialLinks.forEach(({ href, icon }) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.innerHTML = `<i class="${icon}"></i>`;
    socialIcons.appendChild(link);
  });

  topBar.append(contactInfo, socialIcons);
  document.body.prepend(topBar);

  // ===== HEADER =====
  const appMenu = document.getElementById("header");
  if (appMenu) {
    const logo = document.createElement("img");
    logo.src = "https://raw.githubusercontent.com/muembiahub/wdd231/main/project/images/logo-white.png";
    logo.alt = "Kazidomo-Confiance Logo";
    logo.className = "logo";
    appMenu.appendChild(logo);

    const logoTitle = document.createElement("h1");
    logoTitle.className = "logoTitle";
    logoTitle.textContent = "Kazidomo-Confiance";
    appMenu.appendChild(logoTitle);

    const nav = document.createElement("nav");
    const menuList = document.createElement("ul");
    nav.appendChild(menuList);
    appMenu.appendChild(nav);

    const menuItems = [
  { text: "Accueil", href: "https://kazidomo.com/", icon: "fa-solid fa-house", class: "menu-accueil" },
  { text: "Services", href: "https://kazidomo.com/services.html", icon: "fa-solid fa-screwdriver-wrench", class: "menu-services" },
  { text: "Contact", href: "https://kazidomo.com/contact.html", icon: "fa-solid fa-phone", class: "menu-contact" },
  { text: "À propos", href: "https://kazidomo.com/about.html", icon: "fa-solid fa-circle-info", class: "menu-apropos" },
  { text: "Blog", href: "https://kazidomo.com/blog.html", icon: "fa-solid fa-blog", class: "menu-blog" },
  { text: "Compte", href: "https://kazidomo.com/login.html", icon: "fa-solid fa-share-nodes", class: "menu-compte" },
  { text: "Recherche", type: "search",icon: "fa-solid fa-magnifying-glass", class: "menu-recherche" }

];

menuItems.forEach((item) => {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = item.href;
  link.className = item.class;
  link.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
  li.appendChild(link);
  menuList.appendChild(li);
});


    // ===== HAMBURGER =====
    const hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    appMenu.appendChild(hamburger);

    function updateMobileMenu() {
      if (window.innerWidth <= 768) {
        hamburger.style.display = "block";
        menuList.style.display = "none";
      } else {
        hamburger.style.display = "none";
        menuList.style.display = "flex";
      }
    }

    hamburger.addEventListener("click", () => {
      const isVisible = menuList.style.display === "flex";
      menuList.style.display = isVisible ? "none" : "flex";
      hamburger.innerHTML = isVisible
        ? '<i class="fa-solid fa-bars"></i>'
        : '<i class="fa-solid fa-xmark"></i>';
    });

    window.addEventListener("resize", updateMobileMenu);
    window.addEventListener("load", updateMobileMenu);
  }

  // ===== FOOTER =====
  const footer = document.querySelector("footer");
  footer.innerHTML = `
  
    <div id = "year" >
      <p><i class="fa-regular fa-copyright"></i>
      ${new Date().getFullYear()} Jonathan M. Muembia</p>
    </div>
    <div>
      <p id = "bolt"><i class="fa-solid fa-bolt"></i> Propulsé par <a href="https://kazidomo.com/muembiahub/portifio.html" target="_blank">Muembia Hub</a></p>
      <p id = 'globe'><i class="fa-solid fa-globe"></i> Designed by Muembia Designer</p>
      <p id = "halved"><i class="fa-solid fa-shield-halved"></i> Tous droits réservés</p>
    </div>
    <button id ="kazidomo-chat-btn" aria-label="Ouvrir le chat">
      <i class="fa-solid fa-blog"></i>
    </button>
  `;
  document.body.appendChild(footer);

  // ===== BOTPRESS CHAT =====
  const chantbot = document.createElement("script");
  chantbot.src = "https://cdn.botpress.cloud/webchat/v0/inject.js";
  chantbot.onload = function () {
    var CONFIG_URL = "https://files.bpcontent.cloud/2025/12/30/13/20251230131849-AY45NXSY.json";
    window.botpressWebChat.init({
      configUrl: CONFIG_URL,
      hostUrl: "https://cdn.botpress.cloud/webchat/v0",
      botName: "Kazidomo Assistant",
      theme: "light",
      language: "fr",
      layout: { position: "bottom-right" },
      hideWidget: true,
    });
    document.getElementById("kazidomo-chat-btn").onclick = function () {
      window.botpressWebChat.sendEvent({ type: "toggle" });
    };
  };
  document.body.appendChild(chantbot);
});
