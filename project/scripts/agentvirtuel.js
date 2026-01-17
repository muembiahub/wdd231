document.addEventListener("DOMContentLoaded", function () {
  // Styles du bouton flottant
  const style = document.createElement("style");
  style.innerHTML = `
    #kazidomo-chat-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #ffffff;
      border-radius: 50%;
      width: 70px;
      height: 70px;
      border: 2px solid #ff6600;
      cursor: pointer;
      z-index: 99999;
      padding: 0;
      animation: pulse 2s infinite;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: transform 0.2s ease-in-out;
    }
    #kazidomo-chat-btn:hover { transform: scale(1.1); }
    #kazidomo-chat-btn img { width: 100%; height: 100%; border-radius: 50%; }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,102,0,0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(255,102,0,0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,102,0,0); }
    }
    /* Responsive : plein écran sur mobile */
    @media (max-width: 600px) {
      .bp-widget-web {
        width: 100% !important;
        height: 100% !important;
        bottom: 0 !important;
        right: 0 !important;
        border-radius: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialiser Botpress WebChat
  if (
    window.botpressWebChat &&
    typeof window.botpressWebChat.init === "function"
  ) {
    window.botpressWebChat.init({
      configUrl:
        "https://files.bpcontent.cloud/2025/12/30/13/20251230131849-AY45NXSY.json", // 👉 ton fichier JSON
      botName: "Kazidomo Assistant",
      theme: "light",
      language: "fr",
      showCloseButton: true,
      showConversationsButton: true,
      layout: { position: "bottom-right" },
      hideWidget: true, // 👉 caché au départ
    });

    // Attacher l’événement au bouton flottant
    const btn = document.getElementById("kazidomo-chat-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        console.log("Bouton cliqué, ouverture/fermeture du chat…");
        window.botpressWebChat.sendEvent({ type: "toggle" }); // 👉 toggle ouvre/ferme
      });
    } else {
      console.error("Bouton Kazidomo introuvable !");
    }
  } else {
    console.error("Botpress WebChat n'est pas chargé !");
  }
});
