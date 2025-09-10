// === 1. Initialisation ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

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

// === 3. Chargement des cartes ===
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
  const image = item.logo || item.image || "";
  const alt = item.alt || title;

  return `
    <div class="card">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong>${price} $</strong></p>
      <button class="open-modal" data-category="${title}" data-price="${price}">Contacter un agent</button>
    </div>
  `;
}

// === 4. Gestion du modal ===
function setupModal() {
  const modal = $("#contactModal");
  const closeBtn = modal?.querySelector(".close");
  const messageField = $("#message");

  document.addEventListener("click", e => {
    if (e.target.classList.contains("open-modal")) {
      const category = e.target.dataset.category;
      const price = e.target.dataset.price;
      messageField.value = `Bonjour, je suis intéressé par "${category}".\nPrix estimatif : ${price} $\n\nMerci de me recontacter.`;
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

// === 5. Détection GPS ===
function setupGPS() {
  const detectBtn = $("#detectGPS");
  const gpsInput = $("#gps");
  const messageField = $("#message");

  detectBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
      gpsInput.value = coords;
      messageField.value = `📍 Localisation : ${coords}\n🗺️ Carte : https://www.google.com/maps?q=${coords}\n\n` + messageField.value;
      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
}

// === 6. Validation du formulaire ===
function setupFormValidation() {
  const form = $("#contactForm");
  const requiredFields = ["#name", "#clientEmail", "#clientWhatsApp", "#message"].map($);

  form?.addEventListener("submit", e => {
    const missing = requiredFields.filter(field => !field?.value.trim());

    if (missing.length > 0) {
      e.preventDefault();
      alert("📌 Remplis tous les champs avant d’envoyer.");
      return;
    }

    form.insertAdjacentHTML("beforeend", `<p class="confirmation">✅ Demande envoyée avec succès !</p>`);
  });
}