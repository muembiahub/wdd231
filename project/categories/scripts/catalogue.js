// === 1. Initialisation ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;
  injectTitle();
  injectFavicon();
  injectForm();
  loadCards(jsonPath); // 👈 injecte #category
  injectConfirmationBanner(); // 👈 maintenant il peut le trouver
  setupModal();
  setupGPS();
  setupFormValidation();
});

// === 2. Fonctions utilitaires trouver la pages selon son URL ===
function getPageName() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

function $(selector) {
  return document.querySelector(selector);
}
// === Injection du favicon a chaque pages connecter sur catalogue.js ===
function injectFavicon(path = "images/favicon.ico") {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = path;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}
// === Injection du titre  a chaque pages selon son contenu ===
function injectTitle() {
  const title = document.createElement("title");
  title.textContent = getPageName();
  document.head.appendChild(title);
  if ($("#pageTitle")) {
    $("#pageTitle").textContent = getPageName();
  }

}

// === 3. Variables globales ===
let selectedCategory = "";
let selectedPrice = "";

// === 4. Injection du formulaire ===
function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `  <style>
      #contactForm {
        display: flex;
        flex-direction: column;
        gap: 1em;
        padding: 0.2em;
        box-sizing: border-box;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
      }

      #contactForm input,
      #contactForm textarea,
      #contactForm button {
        width: 100%;
        padding: 0.75em;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-sizing: border-box;
      }

      #contactForm button {
        background-color: #00aa00;
        color: black;
        border: none;
        cursor: pointer;
        max-width: 200px;
        align-self: center;
        transition: background-color 0.3s ease;
      }

      #contactForm button:hover {
        background-color: #008800;
      }

      @media (max-width: 480px) {
        #contactForm {
          width: 75%;
        
        }
        
        #contactModal{
          width: 79%;

        }

        #contactForm input,
        #contactForm textarea,
        #contactForm button {
          font-size: 0.95em;
        }
      }
    </style>
    <div id="contactModal" class="modal">
      <div class="modal-content">
        <span class="close" id="closeModal">&times;</span>
        <h3>Contacter un agent</h3>

        <form id="contactForm">
          <label for="name">Nom Complet :</label>
          <input type="text" id="name" required>

          <label for="clientEmail">Email :</label>
          <input type="email" id="clientEmail" required>

          <label for="clientWhatsApp">WhatsApp :</label>
          <input type="text" id="clientWhatsApp" required>

          <label for="gps">Ma position :</label>
          <input type="text" id="gps" readonly placeholder="Coordonnées GPS">
          <button type="button" id="detectGPS">📍 Détecter ma position</button>

          <!-- ✅ Champ caché pour stocker le lien Google Maps -->
          <input type="hidden" id="mapUrl">

          <!-- ✅ Conteneur pour afficher la carte -->
          <div id="gpsMapContainer"></div>

          <label for="message">Message :</label>
          <textarea id="message" rows="5" placeholder="Veuillez entrer votre message ici ou laisser votre préoccupation"></textarea>

          <button type="submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
        </form>
        <div class="confirmation-message" id="confirmationBanner" style="display: none;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(formContainer);
}


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
  fetch(jsonPath)
    .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
    .then(data => {
      Object.values(data).flat().forEach(item => {
        const card = createCard(item);
        $("#category").insertAdjacentHTML("beforeend", card);
      });
    })
    .catch(err => {
      console.error("Erreur :", err);
      $("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
    });
}

function createCard(item) {
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
    <div class="card">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
      <button class="open-modal" data-category="${title}" data-price="${price}">Contacter un agent</button>
    </div>
  `;
}

function setupModal() {
  const modal = $("#contactModal");
  const closeBtn = $("#closeModal");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("open-modal")) {
      selectedCategory = e.target.dataset.category;
      selectedPrice = e.target.dataset.price;

      // ❌ Supprimé : message.value = ...
      modal.style.display = "block";
   
 }
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

 window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const modal = $("#contactModal");
    if (modal?.style.display === "block") {
      modal.style.display = "none";
    }
  }
});

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
  const modal = $("#contactModal");
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