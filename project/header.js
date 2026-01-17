document.addEventListener("DOMContentLoaded", () => {
  // ===== TOP BAR - Contact & Social =====
  const topBar = document.createElement("div");
  Object.assign(topBar.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#484545",
    color: "white",
    padding: "10px 20px",
    position: "fixed",
    width: "100%",
    top: "0",
    left: "0",
    height: "50px",
    zIndex: "1001",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  });

  // Contact Info (Email + Phone)
  const contactInfo = document.createElement("div");
  Object.assign(contactInfo.style, {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    fontSize: "14px",
  });

  // Email
  const emailLink = document.createElement("a");
  emailLink.href = "mailto:contact@kazidomo.com";
  emailLink.target = "_blank";
  Object.assign(emailLink.style, {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "all 0.3s ease",
  });
  emailLink.innerHTML =
    '<i class="fa-solid fa-envelope" style="color:#2196F3;"></i>contact@kazidomo.com';

  // Phone
  const phoneLink = document.createElement("a");
  phoneLink.href = "tel:+243825267122";
  Object.assign(phoneLink.style, {
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "all 0.3s ease",
  });
  phoneLink.innerHTML =
    '<i class="fa-solid fa-phone" style="color:#4CAF50;"></i>+243 825 267 122';

  contactInfo.append(emailLink, phoneLink);

  // Social Icons
  const socialIcons = document.createElement("div");
  Object.assign(socialIcons.style, { display: "flex", gap: "15px" });

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61578830991597",
      icon: "fa-brands fa-facebook",
      color: "#1877F2",
    },
    {
      href: "https://www.linkedin.com/in/kazidomo-confiance-287846383",
      icon: "fa-brands fa-linkedin",
      color: "#0A66C2",
    },
    {
      href: "https://www.tiktok.com/@kazidomo3?_t=ZM-8zPu75OCnCP&_r=1",
      icon: "fa-brands fa-tiktok",
      color: "#E1306C",
    },
  ];

  socialLinks.forEach(({ href, icon, color }) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    Object.assign(link.style, {
      color,
      fontSize: "20px",
      textDecoration: "none",
      transition: "all 0.3s ease",
    });
    link.innerHTML = `<i class="${icon}"></i>`;
    link.addEventListener(
      "mouseenter",
      () => (link.style.transform = "translateY(-2px) scale(1.1)"),
    );
    link.addEventListener("mouseleave", () => (link.style.transform = ""));
    socialIcons.appendChild(link);
  });

  topBar.append(contactInfo, socialIcons);
  document.body.prepend(topBar);

  // ===== MAIN HEADER =====
  const appMenu = document.getElementById("header");
  if (appMenu) {
    Object.assign(appMenu.style, {
      margin: "40px auto 1rem",
      display: "flex",
      alignItems: "center",
      borderBottom: "2px solid #e0e0e0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      maxWidth: "1000px",
      fontSize: "16px",
      borderRadius: "12px",
      padding: "0.5rem 1rem",
      position: "relative",
      backgroundColor: "#ffffff",
      color: "#333",
    });

    // Logo
    const logo = document.createElement("img");
    Object.assign(logo.style, {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      marginRight: "1.5rem",
      transition: "all 0.3s ease",
      cursor: "pointer",
    });
    logo.src =
      "https://raw.githubusercontent.com/muembiahub/wdd231/main/project/images/logo-white.png";
    logo.alt = "Kazidomo-Confiance Logo";
    logo.addEventListener(
      "mouseenter",
      () => (logo.style.transform = "rotate(10deg) scale(1.05)"),
    );
    logo.addEventListener("mouseleave", () => (logo.style.transform = ""));
    appMenu.appendChild(logo);

    // Logo Title
    const logoTitle = document.createElement("h1");
    Object.assign(logoTitle.style, {
      margin: "0",
      fontFamily: "'Cedarville Cursive', cursive",
      fontSize: "0.8rem",
      color: "#1F4CAD",
      marginRight: "2rem",
      fontWeight: "700",
    });
    logoTitle.textContent = "Kazidomo-Confiance";
    appMenu.appendChild(logoTitle);

    // Navigation
    const nav = document.createElement("nav");
    nav.style.flexGrow = "1";
    appMenu.appendChild(nav);

    const menuList = document.createElement("ul");
    Object.assign(menuList.style, {
      listStyle: "none",
      margin: "0",
      padding: "0",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
    });
    nav.appendChild(menuList);

    // ===== MENU ITEMS - TOUS IDENTIQUES ✅ =====
    const menuItems = [
      {
        text: "Accueil",
        href: "https://kazidomo.com/",
        icon: "fa-solid fa-house",
        color: "#4CAF50",
      },
      {
        text: "Services",
        href: "#https://kazidomo.com/services.html",
        icon: "fa-solid fa-screwdriver-wrench",
        color: "#FF9800",
      },
      {
        text: "Contact",
        href: "https://kazidomo.com/contact.html",
        icon: "fa-solid fa-phone",
        color: "#2196F3",
      },
      {
        text: "À propos",
        href: "https://kazidomo.com/about.html",
        icon: "fa-solid fa-circle-info",
        color: "#9C27B0",
      },
      {
        text: "Blog",
        href: "#https://kazidomo.com/blog.html",
        icon: "fa-solid fa-blog",
        color: "#E91E63",
      },
      {
        text: "Recherche",
        type: "search",
        icon: "fa-solid fa-magnifying-glass",
        color: "#666",
      },
    ];

    menuItems.forEach((item) => {
      const li = document.createElement("li");
      li.style.position = "relative";

      if (item.type === "search") {
        // 🔍 RECHERCHE - IDENTIQUE AUX AUTRES LIENS
        const searchLink = document.createElement("a");
        Object.assign(searchLink.style, {
          color: "#333",
          textDecoration: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "8px",
          fontWeight: "300",
          fontSize: "10px",
          transition: "all 0.3s ease",
          position: "relative",
        });

        // Icon
        const searchIcon = document.createElement("i");
        searchIcon.className = item.icon;
        Object.assign(searchIcon.style, {
          color: item.color,
          fontSize: "16px",
          width: "20px",
        });

        // Text
        const searchText = document.createElement("span");
        searchText.textContent = item.text;

        // Tooltip
        const searchTooltip = document.createElement("span");
        Object.assign(searchTooltip.style, {
          visibility: "hidden",
          opacity: "0",
          position: "absolute",
          top: "50%",
          left: "100%",
          transform: "translateY(-50%) translateX(10px)",
          background: "#333",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "13px",
          whiteSpace: "nowrap",
          zIndex: "100",
          transition: "all 0.3s ease",
          pointerEvents: "none",
          display: "none",
        });
        searchTooltip.textContent = "Rechercher sur le site";

        searchLink.append(searchIcon, searchTooltip);

        // Input recherche
        const searchInput = document.createElement("input");
        Object.assign(searchInput.style, {
          padding: "10px 20px",
          border: "1px solid #ddd",
          borderRadius: "25px",
          fontSize: "14px",
          width: "200px",
          outline: "none",
          position: "absolute",
          top: "150%",
          right: "20%",
          transform: "translateX(-50%)",
          zIndex: "100",
          display: "none",
          transition: "all 0.3s ease",
          marginTop: "10px",
        });
        searchInput.type = "text";
        searchInput.placeholder = "Rechercher sur le site...";
        li.appendChild(searchInput);

        // Hover effects (IDENTIQUE aux autres)
        searchLink.addEventListener("mouseenter", () => {
          searchLink.style.backgroundColor = "#f8f9fa";
          searchLink.style.transform = "translateY(-2px)";
          searchLink.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          searchTooltip.style.visibility = "visible";
          searchTooltip.style.opacity = "1";
          searchTooltip.style.transform = "translateY(-50%) translateX(5px)";
        });
        searchLink.addEventListener("mouseleave", () => {
          searchLink.style.backgroundColor = "";
          searchLink.style.transform = "";
          searchLink.style.boxShadow = "";
          searchTooltip.style.visibility = "hidden";
          searchTooltip.style.opacity = "0";
        });

        // CLICK recherche
        let isSearchOpen = false;
        searchLink.addEventListener("click", (e) => {
          e.preventDefault();
          const targets = document.querySelectorAll(
            '[data-search], h1, h2, h3, p, .content, [class*="content"]',
          );

          if (!isSearchOpen) {
            searchInput.style.display = "block";
            searchInput.focus();
            isSearchOpen = true;
          } else {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
              let found = false;
              targets.forEach((el) => {
                const text = el.textContent.toLowerCase();
                el.classList.remove("search-highlight");
                if (text.includes(query)) {
                  el.classList.add("search-highlight");
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  found = true;
                }
              });
              if (!found) alert(`❌ Aucun résultat pour "${query}"`);
            }
            searchInput.style.display = "none";
            searchInput.value = "";
            isSearchOpen = false;
          }
        });

        li.appendChild(searchLink);
      } else {
        // 🔗 LIENS NORMAUX
        const link = document.createElement("a");
        link.href = item.href;

        Object.assign(link.style, {
          color: "#333",
          textDecoration: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          borderRadius: "8px",
          fontWeight: "500",
          fontSize: "15px",
          transition: "all 0.3s ease",
          position: "relative",
        });

        // Icon
        const icon = document.createElement("i");
        icon.className = item.icon;
        Object.assign(icon.style, {
          color: item.color,
          fontSize: "16px",
          width: "20px",
        });

        // Text
        const textSpan = document.createElement("span");
        textSpan.textContent = item.text;

        // Tooltip
        const tooltip = document.createElement("span");
        Object.assign(tooltip.style, {
          display: "none",
          opacity: "0",
          position: "absolute",
          top: "50%",
          left: "100%",
          transform: "translateY(-50%) translateX(10px)",
          background: "black",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "13px",
          whiteSpace: "nowrap",
          zIndex: "100",
          transition: "all 0.3s ease",
          pointerEvents: "none",
        });

        link.append(icon, textSpan, tooltip);

        // Hover effects
        link.addEventListener("mouseenter", () => {
          link.style.transform = "translateY(-2px)";
          link.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          tooltip.style.visibility = "visible";
          tooltip.style.opacity = "1";
          tooltip.style.transform = "translateY(-50%) translateX(5px)";
        });
        link.addEventListener("mouseleave", () => {
          link.style.backgroundColor = "";
          link.style.transform = "";
          link.style.boxShadow = "";
          tooltip.style.visibility = "hidden";
          tooltip.style.opacity = "0";
        });

        li.appendChild(link);
      }
      menuList.appendChild(li);
    });

    // 🍔 Hamburger Mobile
    const hamburger = document.createElement("button");
    Object.assign(hamburger.style, {
      background: "none",
      border: "none",
      color: "#333",
      fontSize: "24px",
      cursor: "pointer",
      padding: "10px",
      borderRadius: "8px",
      display: "none",
      transition: "all 0.3s ease",
      marginLeft: "auto",
    });
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    hamburger.className = "hamburger";
    hamburger.title = "Menu";

    hamburger.addEventListener("mouseenter", () => {
      hamburger.style.backgroundColor = "#f8f9fa";
      hamburger.style.transform = "scale(1.1)";
    });
    hamburger.addEventListener("mouseleave", () => {
      hamburger.style.backgroundColor = "";
      hamburger.style.transform = "";
    });

    appMenu.appendChild(hamburger);

    // 📱 Mobile Responsiveness
    function updateMobileMenu() {
      if (window.innerWidth <= 768) {
        hamburger.style.display = "block";
        Object.assign(menuList.style, {
          flexDirection: "column",
          position: "absolute",
          top: "100%",
          left: "0",
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          borderRadius: "0 0 12px 12px",
          padding: "1rem",
          gap: "1rem",
          display: "none",
          zIndex: "999",
        });
      } else {
        hamburger.style.display = "none";
        Object.assign(menuList.style, {
          flexDirection: "row",
          position: "static",
          width: "auto",
          backgroundColor: "",
          boxShadow: "",
          padding: "0",
          display: "flex",
          zIndex: "",
        });
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
    updateMobileMenu();

    // GLOBAL ESCAPE pour recherche
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const searchInputs = appMenu.querySelectorAll('input[type="text"]');
        searchInputs.forEach((input) => {
          input.style.display = "none";
          input.style.marginTop = "0";

          input.value = "";
        });
      }
    });
  }

  // ===== FOOTER =====
  // Création du footer
  const footer = document.createElement("footer");

  Object.assign(footer.style, {
    textAlign: "center",
    width: "100%",
    padding: "2rem 1rem",
    background: "linear-gradient(135deg, #1F4CAD 0%, #0e4a8e 100%)",
    color: "white",
    fontSize: "15px",
    boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
    marginTop: "3rem",
  });

  footer.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <p style="font-weight: bold; font-size: 16px; margin: 0;">
        <i class="fa-regular fa-copyright" style="margin-right: 8px;"></i>
        ${new Date().getFullYear()} Kazidomo-Confiance
      </p>
    </div>
    <div style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; margin-bottom: 1rem;">
      <p><i class="fa-solid fa-bolt" style="color:#FFD700; margin-right:8px;"></i>
        Propulsé par  <a href=" https://kazidomo.com/muembiahub/home-page.html" target="_blank" style="color:#2196F3; text-decoration:none; font-weight:600;">Muembia Hub</a>
      </p>
      <p><i class="fa-solid fa-globe" style="color:#4CAF50; margin-right:8px;"></i>Designed by Kazidomo</p>
      <p><i class="fa-solid fa-shield-halved" style="color:#E91E63; margin-right:8px;"></i>Tous droits réservés</p>
    </div>
    <button id="kazidomo-chat-btn" aria-label="Ouvrir le chat Kazidomo" style="
      color:blue; background-color: white;
      padding:5px 10px;
      font-size:15px;
      font-weight:bold;
      cursor:pointer;
      display:flex;
      justify-content:center;
      align-items:center;
      gap:8px;
    ">
      <i class="fa-solid fa-comments"></i> Besoin d'aide ?
    </button>
  `;

  document.body.appendChild(footer);

  // Injection du script Botpress
  const chantbot = document.createElement("script");
  chantbot.src = "https://cdn.botpress.cloud/webchat/v0/inject.js";
  chantbot.onload = function () {
    var CONFIG_URL =
      "https://files.bpcontent.cloud/2025/12/30/13/20251230131849-AY45NXSY.json";

    // Initialisation du chat Botpress
    window.botpressWebChat.init({
      configUrl: CONFIG_URL,
      hostUrl: "https://cdn.botpress.cloud/webchat/v0",
      botName: "Kazidomo Assistant",
      theme: "light",
      language: "fr",
      enableReset: true,
      showUserNameInput: true,
      showCloseButton: true,
      showConversationsButton: true,
      layout: { position: "bottom-right" },
      hideWidget: true, // caché au départ
    });

    // Toggle du chat au clic sur le bouton
    document.getElementById("kazidomo-chat-btn").onclick = function () {
      window.botpressWebChat.sendEvent({ type: "toggle" });
    };
  };

  document.body.appendChild(chantbot);
});
