// === 1. Initialisation ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

  injectForm();
  injectFavicon();
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

        <form name="Demandes-services-kazidomo" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="contactForm">
          <input type="hidden" name="form-name" value="Demandes-services-kazidomo">
          <input type="hidden" name="bot-field">

          <label for="name">Nom Complet :</label>
          <input type="text" name="name" id="name" required>

          <label for="clientEmail">Email :</label>
          <input type="email" name="clientEmail" id="clientEmail" required>

          <label for="clientWhatsApp">WhatsApp :</label>
          <input type="text" name="clientWhatsApp" id="clientWhatsApp" required>

          <label for="gps">Ma position :</label>
          <input type="text" name="gps" id="gps" readonly placeholder="Coordonnées GPS">
          <button type="button" id="detectGPS">📍 Détecter ma position</button>

          <label for="message">Message :</label>
          <textarea name="message" id="message" rows="5" required></textarea>

          <button type="submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
        </form>

        <div class="confirmation-message" id="confirmationMessage" style="display: none;">
          <h3>Merci pour votre demande!</h3>
          <p>Nous avons bien reçu votre message et vous contacterons sous peu.</p>
        </div>
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
      <p id="price"><strong> A partir de : ${price} $</strong></p>
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
      messageField.value = `Kazidomo Confiance Bonjour,Je m'appeles "${nameField.value}", je suis intéressé par "${category}".\nPrix estimatif : ${price} $\n\nMerci de me recontacter.`;
      modal?.style && (modal.style.display = "block");
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
      messageField.value = `${messageField.value} Et Ma 📍 Localisation : ${coords}\n🗺️ Carte : https://www.google.com/maps?q=${coords}\n\n` ;
      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
}

// === 7. Validation du formulaire ===
function setupFormValidation() {
  const form = $("#contactForm");
  const confirmation = $("#confirmationMessage");
  const requiredFields = ["#name", "#clientEmail", "#clientWhatsApp", "#message"].map($);

  form?.addEventListener("submit", e => {
    const missing = requiredFields.filter(field => !field?.value.trim());

    if (missing.length > 0) {
      e.preventDefault();
      alert("📌 Remplis tous les champs avant d’envoyer.");
      return;
    }

    confirmation.style.display = "block";
  });
}