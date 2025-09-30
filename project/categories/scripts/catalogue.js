// intialisation
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

  injectTitle();
  injectFavicon(); // injecte Favicon
  injectHeader(); // injecte dans #header depuis header.html
  injectForm();
  loadCards(jsonPath); // injecte les services ou catégories
  injectConfirmationBanner();
  setupModal();
  setupGPS();
  setupFormValidation();
  injectPageSearch(pageName); // barre de recherche limitée à cette page
  loadCategoryCards()
  injectFooter()
});

// === Fonctions utilitaires ===
function getPageName() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

function $(selector) {
  return document.querySelector(selector);
}

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

// === Titre dynamique ===
function injectTitle() {
  const title = document.createElement("title");
  title.textContent =  getPageName();
  document.head.appendChild(title);

  if ($("#pageTitle")) {
    $("#pageTitle").textContent = getPageName();
  }
}


// === Barre de recherche limitée à la page ===
function injectPageSearch(pageName) {
  // Crée le conteneur principal
  const wrapper = document.createElement("div");
  wrapper.className = "search-wrapper";
  wrapper.style.cssText = `
    position: fixed;
    top: 9vh;
    right: 10px;
    z-index: 9999;
    display: flex;
    gap: 5px;
    padding: 0.5em;
    align-items: center;
  `;

  // Champ de recherche
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `🔍 Rechercher dans ${pageName}...`;
  input.style.cssText = `
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
    flex: 1;
  `;

  // Bouton pour effacer
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "❌";
  clearBtn.style.cssText = `
    font-size: 1em;
    cursor: pointer;
    background: none;
    border: none;
  `;

  // Message "aucun résultat"
  const message = document.createElement("div");
  message.textContent = "Aucun résultat trouvé.";
  message.style.cssText = `
    position: fixed;
    top: calc(9vh + 50px);
    right: 10px;
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.5em 1em;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    font-size: 0.9em;
    display: none;
    z-index: 9999;
  `;

  // Ajoute les éléments au DOM
  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  document.body.appendChild(wrapper);
  document.body.appendChild(message);

  // Événement de recherche
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const targets = document.querySelectorAll(`[data-page="${pageName}"]`);
    let found = false;

    targets.forEach(el => {
      const text = el.textContent.toLowerCase();
      const match = text.includes(query);
      el.style.display = match ? "" : "none";
      el.style.backgroundColor = match ? "#1a7ec0ff" : "";
      if (match) found = true;
    });

    message.style.display = query && !found ? "block" : "none";
  });

  // Bouton pour réinitialiser
  clearBtn.addEventListener("click", () => {
    input.value = "";
    resetHighlights();
    message.style.display = "none";
  });

  // Fonction pour réinitialiser les styles
  function resetHighlights() {
    document.querySelectorAll(`[data-page="${pageName}"]`).forEach(el => {
      el.style.display = "";
      el.style.backgroundColor = "";
    });
  }

  // Style responsive injecté
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 600px) {
      .search-wrapper {
        top: 5vh !important;
        right: 1px;

        flex-direction: row;
        align-items: stretch;
      }
    }
  `;
  document.head.appendChild(style);
}

// === 6. Chargement des cartes depuis JSON ===
function loadCards(jsonPath) {
  const pageName = getPageName();

  fetch(jsonPath)
    .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
    .then(data => {
      Object.values(data).flat().forEach(item => {
        const cardHTML = createCard(item, pageName);
        $("#category").insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch(err => {
      console.error("Erreur :", err);
      $("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
    });
}

// === 7. Génération HTML d’une carte ===
function createCard(item, pageName) {
  const title = item.category || item.type || item.title || "Service";
  const description = item.description || item.summary || "";
  const price = item.price || "—";
  const alt = item.alt || title;

  const imageName = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "") + ".webp";

  const image = `images/${imageName}`;

  return `
    <div class="card searchable" data-page="${pageName}">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
      <button class="open-modal" data-category="${title}" data-price="${price}">
        <i class="fas fa-envelope"></i> Contacter un agent
      </button>
    </div>
  `;
}



// === 3. Variables globales ===
let selectedCategory = "";
let selectedPrice = "";



/// === 5. Injection de la bannière de confirmation ===
function injectConfirmationBanner() {
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
  banner.innerHTML = `
    <h3>🙏 Merci pour votre demande !</h3>
    <p>Votre message a été transmis avec succès.</p>
    <p>Un agent Kazidomo vous contactera sous peu.</p>
  `;

  const target = document.querySelector("#category") || document.body;
  target.parentElement.insertBefore(banner, target); // 👈 insère avant les cartes
}

// === 6. Chargement des cartes ===
function loadCards(jsonPath) {
  const pageName = getPageName(); // 👈 récupère le nom de la page

  fetch(jsonPath)
    .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
    .then(data => {
      Object.values(data).flat().forEach(item => {
        const cardHTML = createCard(item, pageName); // 👈 passe pageName
        $("#category").insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch(err => {
      console.error("Erreur :", err);
      $("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
    });
}

function createCard(item, pageName) {
  const title = item.category || item.type || item.title || "Service";
  const description = item.description || item.summary || "";
  const price = item.price || "—";
  const alt = item.alt || title;

  const imageName = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "") + ".webp";

  const image = `images/${imageName}`;

  return `
    <div class="card searchable" data-page="${pageName}">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
      <button class="open-modal" data-category="${title}" data-price="${price}">
        <i class="fas fa-envelope"></i> Contacter un agent
      </button>
    </div>
  `;
}




function renderResponsiveMap(mapUrl, container) {
  const existingMap = document.getElementById("gpsMap");
  if (existingMap) existingMap.remove();

  const mapWrapper = document.createElement("div");
  mapWrapper.id = "gpsMap";
  mapWrapper.style.position = "relative";
  mapWrapper.style.paddingBottom = "56.25%"; // format 16:9
  mapWrapper.style.height = "0";
  mapWrapper.style.overflow = "hidden";
  mapWrapper.style.marginTop = "1em";
  mapWrapper.style.borderRadius = "8px";
  mapWrapper.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";

  const mapFrame = document.createElement("iframe");
  mapFrame.src = `${mapUrl}&output=embed`;
  mapFrame.style.position = "absolute";
  mapFrame.style.top = "0";
  mapFrame.style.left = "0";
  mapFrame.style.width = "100%";
  mapFrame.style.height = "100%";
  mapFrame.style.border = "0";
  mapFrame.loading = "lazy";
  mapFrame.referrerPolicy = "no-referrer-when-downgrade";

  mapWrapper.appendChild(mapFrame);
  container.appendChild(mapWrapper);
}


function setupGPS() {
  const detectBtn = $("#detectGPS");
  const gpsInput = $("#gps");
  const mapUrlInput = $("#mapUrl"); // 👈 récupère le champ caché

  detectBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = {
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
        map_url: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
      };

      gpsInput.value = `${coords.latitude}, ${coords.longitude}`;

      // ✅ ENREGISTRE le lien dans le champ caché
      mapUrlInput.value = coords.map_url;

      // ✅ Affiche la carte dans le conteneur prévu
      renderResponsiveMap(coords.map_url, $("#gpsMapContainer"));

      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
}


function setupFormValidation() {
  const form = $("#contactForm");
  const modal = $("#contactAgentModal");
  const banner = $("#confirmationBanner");
  const requiredFields = ["#name", "#clientEmail", "#clientWhatsApp", "#message"].map($);

  form?.addEventListener("submit", async e => {
    e.preventDefault();

    const missing = requiredFields.filter(field => !field?.value.trim());
    if (missing.length > 0) {
      alert("📌 Remplis tous les champs avant d’envoyer.");
      return;
    }

    const formData = {
      name: $("#name").value.trim(),
      client_email: $("#clientEmail").value.trim(),
      client_whatsapp: $("#clientWhatsApp").value.trim(),
      gps: $("#gps").value.trim(),
      map_url: $("#mapUrl")?.value.trim(), // ✅ ajout du lien Google Maps
      message: $("#message").value.trim(),
      category: selectedCategory,
      price: selectedPrice
    };

    console.log("📤 Données à envoyer :", formData);

    const success = await sendToSupabase(formData);

    if (success) {
      modal.style.display = "none";
      banner.style.display = "block";
      showClientBadge?.(); // ✅ sécurise l’appel si la fonction n’est pas définie

      setTimeout(() => {
        banner.style.display = "none";
        form.reset();
      }, 10000);
    }
  });
}
// === 9. Badge client ===
function showClientBadge() {
  if (document.getElementById("clientBadge")) return; // évite les doublons

  const badge = document.createElement("div");
  badge.id = "clientBadge";
  badge.textContent = "✅ Client identifié";
  badge.style.position = "fixed";
  badge.style.top = "10px";
  badge.style.right = "10px";
  badge.style.padding = "10px 20px";
  badge.style.backgroundColor = "#4CAF50";
  badge.style.color = "white";
  badge.style.borderRadius = "5px";
  badge.style.zIndex = "1000";

  document.body.appendChild(badge);
}

// === 10. Connexion à Supabase ===
async function sendToSupabase(formData) {
  const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bWRuZHdueGpxZG9sYnBjeXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE4NjcsImV4cCI6MjA3Mzc5Nzg2N30.tcRLYK-2MI4hOr8zzg_hfBnxF0GWgcOP1uSo-ZRr5yw";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kazidomo_demandes_services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify([formData])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur Supabase :", errorText);
      alert(`Échec Supabase : ${errorText}`);
      return false;
    }

    console.log("✅ Données envoyées à Supabase.");

    const emailPayload = {
      email: formData.client_email,
      name: formData.name,
      category: formData.category,
      price: formData.price,
      message: formData.message,
      gps: formData.gps,
      client_whatsapp: formData.client_whatsapp
    };
    await fetch("https://formspree.io/f/mqayzdrb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload)
    });
    console.log("✅ Email envoyé via Formspree.");

    return true;
  } catch (error) {

    console.error("❌ Erreur lors de l’envoi :", error);
    alert(`Erreur lors de l’envoi : ${error.message}`);
    return false;
  }
}