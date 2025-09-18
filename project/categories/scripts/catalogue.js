// === 1. Initialisation ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

  injectFavicon();
  injectForm();
  loadCards(jsonPath);
  setupModal();
  setupGPS();
  setupFormValidation();
});

// === 2. Fonctions utilitaires ===
function getPageName() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

function $(selector) {
  return document.querySelector(selector);
}

function injectFavicon(path = "images/favicon.ico") {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = path;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}

// === 3. Injection du formulaire ===
function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
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

          <label for="message">Message :</label>
          <textarea id="message" rows="5" required></textarea>

          <button type="submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
        </form>

        <div class="confirmation-message" id="confirmationMessage" style="display: none;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(formContainer);
}

// === 4. Chargement des cartes ===
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

// === 5. Gestion du modal ===
function setupModal() {
  const modal = $("#contactModal");
  const closeBtn = $("#closeModal");
  const messageField = $("#message");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("open-modal")) {
      const category = e.target.dataset.category;
      const price = e.target.dataset.price;
      messageField.value = `Kazidomo Confiance Bonjour, je suis intéressé par "${category}".\nPrix estimatif : ${price} $`;
      modal.style.display = "block";
    }
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// === 6. Détection GPS ===
function setupGPS() {
  const detectBtn = $("#detectGPS");
  const gpsInput = $("#gps");
  const messageField = $("#message");

  detectBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
      gpsInput.value = coords;
      messageField.value += `\n\n📍 Localisation : ${coords}\n🗺️ Carte : https://www.google.com/maps?q=${coords}\n\nMerci de me recontacter.`;
      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
}

// === 7. Validation et envoi vers Supabase ===
function setupFormValidation() {
  const form = $("#contactForm");
  const confirmation = $("#confirmationMessage");
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
      message: $("#message").value.trim()
    };

    await sendToSupabase(formData);

    confirmation.innerHTML = `
      <h3>🙏 Merci pour votre demande !</h3>
      <p>Votre message a été transmis avec succès.</p>
      <p>Un agent Kazidomo vous contactera sous peu.</p>
    `;
    confirmation.style.display = "block";
    form.reset();
  });
}

// === 8. Connexion à Supabase ===
async function sendToSupabase(formData) {
  const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co"; // ← remplace par ton URL
  const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO"; // ← remplace par ta clé publique

  const response = await fetch(`${SUPABASE_URL}/rest/v1/kazidomo_demandes_services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    },
    body: JSON.stringify([formData]) // tableau requis
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erreur Supabase :", errorText);
    alert(`❌ Échec Supabase : ${errorText}`);
  } else {
    console.log("✅ Données envoyées à Supabase.");
  }  
}

