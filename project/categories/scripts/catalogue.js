// === 1. Initialisation ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

  injectFavicon();
  injectForm();
  injectConfirmationBanner();
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

// === 3. Variables globales ===
let selectedCategory = "";
let selectedPrice = "";

// === 4. Injection du formulaire ===
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
      </div>
    </div>
  `;
  document.body.appendChild(formContainer);
}

// === 5. Injection du message de confirmation hors modal ===
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
  document.body.appendChild(banner);
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

// === 7. Gestion du modal ===
function setupModal() {
  const modal = $("#contactModal");
  const closeBtn = $("#closeModal");
  const messageField = $("#message");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("open-modal")) {
      selectedCategory = e.target.dataset.category;
      selectedPrice = e.target.dataset.price;

      messageField.value = `Kazidomo Confiance Bonjour, je suis intéressé par "${selectedCategory}".\nPrix estimatif : ${selectedPrice} $`;
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

// === 8. Détection GPS ===
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

// === 9. Validation et envoi ===
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
      message: $("#message").value.trim(),
      category: selectedCategory,
      price: selectedPrice
    };

    console.log("📤 Données à envoyer :", formData);

    const success = await sendToSupabase(formData);

    if (success) {
      modal.style.display = "none";
      banner.style.display = "block";
      showClientBadge();

      setTimeout(() => {
        banner.style.display = "none";
        form.reset();
      }, 10000);
    }
  });
}

// === 10. Connexion à Supabase ===
async function sendToSupabase(formData) {
  const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
  const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kazidomo-demandes-services`, {
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
    await fetch("https://formspree.io/f/mayvkwjd", {
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