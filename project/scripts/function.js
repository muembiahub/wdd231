// === Favicon dynamique ===
function injectFavicon(path = "images/favicon.ico") {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = path;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}

function injectTitle(prefix = "Kazidomo Confiance") {
  try {
    const pageName = typeof getPageName === "function" ? getPageName() : "Page";

    if (typeof pageName !== "string" || !pageName.trim()) {
      console.warn("injectTitle: Nom de page invalide.");
      return;
    }

    // Supprimer tous les <title> existants
    document.querySelectorAll("title").forEach((t) => t.remove());

    // Créer et injecter un nouveau <title>
    const newTitle = document.createElement("title");
    newTitle.textContent = `${prefix} - ${pageName} page`;
    document.head.appendChild(newTitle);

    // Mettre à jour l’élément visible dans le corps de la page
    const pageTitleElement = document.querySelector("#pageTitle");
    if (pageTitleElement) {
      pageTitleElement.textContent = `${prefix} - ${pageName} page`;
    } else {
      console.info("injectTitle: Aucun élément du page titre trouvé.");
    }
  } catch (error) {
    console.error("injectTitle: Erreur lors de l’injection du titre", error);
  }
}

// === 1. Déduction du nom de la page ===
function getPageName() {
  const path = window.location.pathname;
  const file = path.split("/").pop();
  const name = file.replace(".html", "");
  return name || "index"; // fallback si vide
}

// === 2. Sélecteur simplifié ===
function $(selector) {
  return document.querySelector(selector);
}

// === 3. Génération du nom d’image ===
function generateImageName(title) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w-]/g, "") + ".webp"
  );
}

// Ajout d'une animation bounce pour le badge
const style = document.createElement("style");
style.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-15px);}
    60% {transform: translateY(-8px);}
  }
  .bounce {
    animation: bounce 1s;
  }
`;
document.head.appendChild(style);

// Fonction réutilisable
function createOrUpdateBanner(
  targetSelector,
  bannerId,
  messageHTML,
  buttonText,
  buttonAction,
) {
  // Vérifie si le banner existe déjà
  let banner = document.getElementById(bannerId);

  if (!banner) {
    banner = document.createElement("div");
    banner.id = bannerId;
    banner.style.background = "#f0f8ff";
    banner.style.padding = "20px";
    banner.style.textAlign = "center";
    banner.style.fontSize = "18px";
    banner.style.color = "#333";
    banner.style.borderRadius = "10px";
    banner.style.margin = "10px 0";
    banner.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    banner.style.transition = "opacity 1s ease-in-out";
    banner.style.opacity = "0";
    banner.style.position = "relative"; // nécessaire pour la croix ✖

    const target = document.querySelector(targetSelector);
    if (target) target.appendChild(banner);
  }

  // Nettoyage du contenu
  banner.innerHTML = "";

  // Croix de fermeture
  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "20px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "18px";
  closeBtn.style.color = "#0078d7";
  closeBtn.title = "Fermer le banner";
  closeBtn.onclick = () => {
    banner.style.display = "none";
  };
  banner.appendChild(closeBtn);

  // Message principal (HTML accepté)
  const bannerMessage = document.createElement("div");
  bannerMessage.innerHTML = messageHTML;
  bannerMessage.style.fontWeight = "bold";
  banner.appendChild(bannerMessage);

  // Bouton CTA
  if (buttonText) {
    const ctaButton = document.createElement("button");
    ctaButton.textContent = buttonText;
    ctaButton.style.background = "#0078d7";
    ctaButton.style.color = "#fff";
    ctaButton.style.border = "none";
    ctaButton.style.padding = "10px 20px";
    ctaButton.style.fontSize = "16px";
    ctaButton.style.fontWeight = "bold";
    ctaButton.style.borderRadius = "8px";
    ctaButton.style.cursor = "pointer";
    ctaButton.style.marginTop = "10px";

    ctaButton.onmouseover = () => (ctaButton.style.background = "#005a9e");
    ctaButton.onmouseout = () => (ctaButton.style.background = "#0078d7");

    if (buttonAction) ctaButton.onclick = buttonAction;

    banner.appendChild(ctaButton);
  }

  // --- Compteur de visites uniques ---
  const VISIT_INTERVAL = 30 * 60 * 1000; // 30 min
  let visits = localStorage.getItem("visits");
  let lastVisit = localStorage.getItem("lastVisit");

  visits = visits ? parseInt(visits, 10) : 0;
  const now = Date.now();

  let isNewVisit = false;
  if (!lastVisit || now - parseInt(lastVisit, 10) > VISIT_INTERVAL) {
    visits++;
    localStorage.setItem("visits", visits);
    localStorage.setItem("lastVisit", now);
    isNewVisit = true;
  }

  const lastVisitDate = new Date(
    parseInt(localStorage.getItem("lastVisit"), 10),
  ).toLocaleString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Container compteur
  const visitContainer = document.createElement("div");
  visitContainer.style.display = "flex";
  visitContainer.style.alignItems = "center";
  visitContainer.style.justifyContent = "center";
  visitContainer.style.marginTop = "10px";

  // Badge
  const badge = document.createElement("span");
  badge.textContent = visits;
  badge.style.background = "#0078d7";
  badge.style.color = "#fff";
  badge.style.borderRadius = "50%";
  badge.style.padding = "8px 14px";
  badge.style.fontWeight = "bold";
  badge.style.marginRight = "10px";
  badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";

  // Animation bounce si nouvelle visite
  if (isNewVisit) {
    badge.classList.add("bounce");
    setTimeout(() => badge.classList.remove("bounce"), 1000);
  }

  // Texte
  const visitText = document.createElement("span");
  visitText.textContent = `Visites uniques — Dernière : ${lastVisitDate}`;
  visitText.style.color = "#333";
  visitText.style.fontSize = "14px";

  visitContainer.appendChild(badge);
  visitContainer.appendChild(visitText);
  banner.appendChild(visitContainer);

  // Fade-in
  setTimeout(() => {
    banner.style.opacity = "1";
  }, 100);
}

// Exemple d’utilisation
createOrUpdateBanner(
  "header", // endroit cible
  "kazidomoBannerHeader", // id unique
  `<h1>Bienvenue chez Kazidomo Confiance!</h1>
   <p>Nous offrons des services de confiance et de qualité.</p>
   <p>Découvrez nos services de confiance et de qualité.</p>`, // message HTML
  "Découvrir maintenant", // texte bouton
  () => (window.location.href = "#categoryHomepage"), // action bouton
);

// === 4. Génération HTML d’une carte pour les pages hors accueil ===
function createCard(item, pageName) {
  const title = item.category || item.type || item.title || "Service";
  const description =
    item.description || item.summary || "Description indisponible.";
  const price = item.price || "—";
  const alt = item.alt || title;
  const image = `images/${generateImageName(title)}`;

  return `
    <div class="card searchable" data-page="${pageName}">
      <img src="${image}" alt="${alt}">
      <h3><strong>Service :</strong> ${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
     <button onclick="loadContactView('${encodeURIComponent(title)}', '${encodeURIComponent(price)}')" id="contactAgentBtn">
  <i class="fas fa-envelope"></i> Contacter un agent
</button>
    </div>
  `;
}

// === Function pour afficher et charger la vue de contact ===
function loadContactView(title, price) {
  selectedCategory = decodeURIComponent(title);
  selectedPrice = decodeURIComponent(price);

  previousScrollY = window.scrollY;
  previousPageName = getPageName();

  const main = document.querySelector("main") || document.body;
  main.innerHTML = "";

  injectForm();
  populateCountryCodes();
  setupGPS();
  if (typeof setupFormValidation === "function") {
    setupFormValidation();
  }

  setupReturnToServicesButton("backToServices"); // bouton statique si présent

  window.scrollTo({ top: 0, behavior: "smooth" });

  const form = document.getElementById("contactAgentForm");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("submitBtn");
    const originalHTML = btn?.innerHTML;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> <span>Envoi en cours…</span>`;
    }

    const formData = sanitizeFormData(form);
    const success = await sendToSupabase(formData);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
    const formView = document.querySelector(".form-view");
    if (formView) {
      formView.style.display = "none";
      showConfirmationBanner();
      createReturnToServicesButton();
    }
  });
}
//
function createReturnToServicesButton() {
  if (document.getElementById("returnToServicesBtn")) return;

  const btn = document.createElement("button");
  btn.id = "returnToServicesBtn";
  btn.textContent = "↩ Retour aux services";
  btn.style.marginTop = "2em"; // en plus du style CSS
  btn.style.cssText = `
    margin: 2em auto 1em auto; 
    display: block;
    padding: 0.8em 1.2em;
    font-size: 1em;
    background: #00aa00;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: background 3s ease;
  `;

  const banner = document.getElementById("confirmationBanner");
  banner?.insertAdjacentElement("afterend", btn);

  setupReturnToServicesButton("returnToServicesBtn");
}
// === 4. Configuration du bouton de retour aux services ===

function setupReturnToServicesButton(buttonId = "returnToServicesBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", () => {
    const main = document.querySelector("main") || document.body;
    main.innerHTML = "";

    const pageName = previousPageName || getPageName();
    const isHomePage = pageName === "index" || pageName === "home";
    const containerId = isHomePage ? "categoryHomepage" : "category";

    const container = document.createElement("div");
    container.id = containerId;
    main.appendChild(container);

    if (typeof injectCardsForPage === "function") {
      injectCardsForPage();
    } else {
      console.error("⚠️ injectCardsForPage non définie.");
    }

    window.scrollTo({ top: previousScrollY || 0, behavior: "smooth" });
    btn.remove(); // ✅ ca supprime le bouton après retour
  });
}

// === 5. Génération HTML d’une carte pour la page d’accueil ===
function createHomeCard(item) {
  const logo = item.logo || "images/default.webp";
  const category = item.category || "Service";
  const description = item.description || "Description indisponible.";
  const pageUrl = item.page_url || "#";

  return `
    <div class="card">
      <img src="${logo}" alt="${category}">
      <h3><strong>Category :</strong> ${category}</h3>
      <p>${description}</p>
      <a href="${pageUrl}" class="button">Consulter</a>
    </div>
  `;
}

// === 6. Injection dynamique des cartes selon la page ===
function injectCardsForPage() {
  const pageName = getPageName();
  const isHomePage = pageName === "index" || pageName === "home";

  const containerId = isHomePage ? "categoryHomepage" : "category";
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ Conteneur #${containerId} introuvable.`);
    return;
  }

  const jsonPath = isHomePage
    ? "data/categories.json"
    : `data/${pageName}.json`;

  fetch(jsonPath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Fichier JSON introuvable : ${jsonPath}`);
      }
      return response.json();
    })
    .then((data) => {
      const items = isHomePage
        ? data.categories
        : Array.isArray(data.categories)
          ? data.categories
          : Object.values(data).flat();

      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = `
          <div class="empty-message">
            <p>🌿 Aucun contenu disponible pour cette page.</p>
            <p style="font-style: italic;">Elle attend encore ses premières cartes…</p>
          </div>
        `;
        return;
      }

      items.forEach((item, index) => {
        const cardHTML = isHomePage
          ? createHomeCard(item)
          : createCard(item, pageName);

        const wrapper = document.createElement("div");
        wrapper.innerHTML = cardHTML;
        const card = wrapper.firstElementChild;
        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("💥 Erreur lors du chargement du JSON :", error);
      container.innerHTML = `
        <div class="error-message">
          <p>📦 Le contenu est temporairement indisponible.</p>
          <p style="font-style: italic;">Vérifiez le fichier JSON ou réessayez plus tard.</p>
        </div>
      `;
    });
}

// populate country codes in the select element
function populateCountryCodes() {
  fetch("data/countries.json")
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById("countryCode");
      const flagDisplay = document.getElementById("flagDisplay");

      data.forEach((entry) => {
        const option = document.createElement("option");
        option.value = entry.dial_code;
        option.textContent = `${entry.country} (${entry.dial_code})`;
        option.dataset.iso = entry.iso.toLowerCase(); // important pour le lien
        select.appendChild(option);
      });

      // Met à jour le drapeau au changement
      select.addEventListener("change", () => {
        const iso = select.selectedOptions[0].dataset.iso;
        flagDisplay.src = `https://flagcdn.com/${iso}.svg`;
      });

      // Initialise le drapeau
      const initialISO = select.options[0].dataset.iso;
      flagDisplay.src = `https://flagcdn.com/${initialISO}.svg`;
    })
    .catch((error) => {
      console.error("💥 Erreur lors du chargement des indicatifs :", error);
    });
}

function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <div class="form-view">
      <h2>Contacter un agent</h2>
      <form id="contactAgentForm">
        <label for="clientName">Nom Complet :</label>
        <input type="text" id="clientName" name="clientName" placeholder="Saisissez votre nom complet" required>

        <label for="clientEmail">Email :</label>
        <input type="email" id="clientEmail" name="clientEmail" placeholder="Saisissez votre email" required>

        <label for="clientWhatsApp">Numéro WhatsApp :</label>
        <div style="display: flex; align-items: center; gap: 0.4em;">
          <img id="flagDisplay" src="" alt="Drapeau" style="width: 24px; height: 18px;">
          <select id="countryCode" required></select>
          <input type="text" id="clientWhatsApp" name="clientWhatsApp" placeholder="Votre numéro WhatsApp" required>
        </div>
        <label for="Category">Catégorie de service :</label>
        <input type="text" id="Category" name="Category" readonly>

        <label for="serviceCategory">Service sélectionné :</label>
        <input type="text" id="service" name="service" readonly>

        <label for="servicePrice">Prix :</label>
        <input type="text" id="servicePrice" name="servicePrice" readonly>

        <label for="gpsField">Ma position :</label>
        <input type="text" id="gpsField" name="gps" readonly placeholder="Coordonnées GPS" />

        <button type="button" id="detectGPS">📍 Détecter ma position</button>

        <input type="hidden" id="mapUrl" name="map_url" />

        <div id="gpsMapContainer"></div>


        <label for="clientMessage">Message :</label>
        <textarea id="clientMessage" name="clientMessage" rows="5" placeholder="Votre message ou préoccupation"></textarea>

        <button type="submit" id="submitBtn"><i class="fas fa-paper-plane"></i> Envoyer</button>
      </form>

      <button id="backToServices" style="margin-top: 1em;">⬅️ Retour aux services</button>
      <div class="confirmation-message" id="confirmationBanner" style="display: none;"></div>
    </div>
  `;

  const main = document.querySelector("main") || document.body;
  main.appendChild(formContainer);

  // 🧩 Injecte les valeurs dynamiques
  document.getElementById("Category").value = previousPageName || ""; // 🧩 Injecte les valeurs dynamiques
  document.getElementById("service").value = selectedCategory || "";
  document.getElementById("servicePrice").value = selectedPrice || "";
}
// === 6 setup Gps sur le formulaire de contact Agent  ===
function setupGPS() {
  const detectBtn = document.getElementById("detectGPS");
  const gpsField = document.getElementById("gpsField");
  const mapUrlField = document.getElementById("mapUrl");
  const mapContainer = document.getElementById("gpsMapContainer");

  if (!detectBtn || !gpsField || !mapUrlField || !mapContainer) {
    console.warn("⚠️ Éléments GPS manquants.");
    return;
  }

  detectBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      gpsField.value = "🛑 Géolocalisation non supportée.";
      return;
    }

    gpsField.value = "📡 Détection en cours…";
    detectBtn.disabled = true;
    detectBtn.textContent = "📡 En cours…";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        const coords = `${latitude}, ${longitude}`;

        gpsField.value = coords;

        const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        mapUrlField.value = mapUrl;

        mapContainer.innerHTML = `
          <iframe
            src="${mapUrl}&hl=fr&z=14&output=embed"
            width="100%"
            height="250"
            frameborder="0"
            style="border:0; border-radius: 8px;"
            allowfullscreen
            loading="lazy">
          </iframe>
        `;

        detectBtn.textContent = "✅ Position détectée";
      },
      (error) => {
        gpsField.value = "⚠️ Erreur : " + error.message;
        detectBtn.disabled = false;
        detectBtn.textContent = "📍 Réessayer";
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

// function sendToSupabase(formData)

function sanitizeFormData(form) {
  const get = (selector) => form.querySelector(selector)?.value.trim() || "";
  const rawPrice = get("#servicePrice");
  const price = rawPrice ? parseFloat(rawPrice) : null;

  return {
    name: get("#clientName"),
    client_email: get("#clientEmail"),
    client_whatsapp: get("#countryCode") + get("#clientWhatsApp"),
    category: get("#Category"),
    service: get("#service"),
    price: price,
    message: get("#clientMessage"),
    gps: get("#gpsField"),
    map_url: get("#mapUrl"),
  };
}

// === 6. Envoi des données à Supabase ===
async function sendToSupabase(formData) {
  const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
  const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/kazidomo_demandes_services`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify([formData]),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur Supabase :", errorText);
      alert(`Échec Supabase : ${errorText}`);
      return false;
    }

    console.log("✅ Données envoyées à Supabase.");
    return true;
  } catch (error) {
    console.error("❌ Erreur JS :", error);
    alert(`Erreur JS : ${error.message}`);
    return false;
  }
}

// === 7. Bannière de confirmation après envoi réussi ===

function showConfirmationBanner() {
  document.getElementById("confirmationBanner")?.remove();

  const banner = document.createElement("div");
  banner.id = "confirmationBanner";
  banner.style.display = "none";
  banner.style.background = "#e6ffe6";
  banner.style.border = "1px solid #00aa00";
  banner.style.padding = "1em";
  banner.style.textAlign = "center";
  banner.style.margin = "1em auto";
  banner.style.maxWidth = "600px";
  banner.style.fontFamily = "sans-serif";
  banner.style.borderRadius = "8px";
  banner.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  banner.style.opacity = "0";
  banner.style.transition = "opacity 0.6s ease";

  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5em; flex-wrap: wrap;">
      <span style="font-size: 1.5em;">✅</span>
      <div>
        <h3 style="margin: 0;">🎉 Félicitations !</h3>
        <p style="margin: 0.3em 0;">Votre message a été envoyé avec succès 🎊</p>
        <p style="margin: 0;">Un agent Kazidomo vous contactera sous peu.<b> Merci pour votre confiance.</b></p>
      </div>
    </div>
  `;

  const container = document.querySelector("main") || document.body;
  container.insertBefore(banner, container.firstChild);

  banner.style.display = "block";
  setTimeout(() => {
    banner.style.opacity = "1";
    banner.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      banner.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1000);
  }, 10);
}
