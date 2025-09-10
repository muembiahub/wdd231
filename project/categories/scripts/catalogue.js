// 1. Détection du fichier JSON selon la page
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const jsonPath = `data/${pageName}.json`;

// 2. Chargement du JSON et affichage des cartes
fetch(jsonPath)
  .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
  .then(data => {
    Object.values(data).flat().forEach(item => {
      const card = createCard(item);
      document.querySelector("#category").insertAdjacentHTML("beforeend", card);
    });
  })
  .catch(err => {
    console.error("Erreur :", err);
    document.querySelector("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
  });

// 3. Génération d'une carte
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
      <button class="open-modal" data-category="${title}" data-price="${price}">Contactez un Agent</button>
    </div>
  `;
}

// 4. Références du formulaire
const modal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const gpsInput = document.getElementById('gps');
const detectBtn = document.getElementById('detectGPS');
const emailInput = document.getElementById('clientEmail');
const whatsappInput = document.getElementById('clientWhatsApp');
const messageField = document.getElementById('message');
const sendBtn = document.getElementById('sendToDatabase');

// 5. Détection GPS
detectBtn?.addEventListener('click', () => {
  if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

  navigator.geolocation.getCurrentPosition(pos => {
    const coords = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
    gpsInput.value = coords;
    messageField.value = `📍 Localisation : ${coords}\n🗺️ Carte : https://www.google.com/maps?q=${coords}\n\n` + messageField.value;
    detectBtn.disabled = true;
    detectBtn.textContent = "✅ Position détectée";
  }, () => alert("⚠️ Position non détectée."));
});

// 6. Ouverture du modal avec message prérempli
document.addEventListener('click', e => {
  if (e.target.classList.contains('open-modal')) {
    const category = e.target.dataset.category;
    const price = e.target.dataset.price;
    messageField.value = `Bonjour, je suis intéressé par "${category}".\nPrix estimatif : ${price} $\n\nMerci de me recontacter.`;
    modal.style.display = 'block';
  }
});

// 7. Empêche le formulaire de se soumettre automatiquement
contactForm.addEventListener('submit', e => e.preventDefault());

// 8. Envoi des données vers Google Sheets via Apps Script
sendBtn.addEventListener('click', () => {
  const name = nameInput?.value.trim();
  const gps = gpsInput?.value.trim();
  const message = messageField?.value.trim();
  const clientEmail = emailInput?.value.trim();
  const clientWhatsApp = whatsappInput?.value.trim();

  if (!name || !clientEmail || !clientWhatsApp) {
    alert("📌 Tous les champs requis doivent être remplis.");
    return;
  }

  const payload = {
    page: pageName,
    name,
    gps,
    message,
    clientEmail,
    clientWhatsApp
  };

  console.log("📤 Envoi en cours :", payload);

  fetch("https://script.google.com/macros/s/AKfycbznHpE1ihrFGFgxNNqUbClT1295wt8YC_EpdA6RF9AHqPs4FR0fTmTPXJ6F1YGpeY5dSQ/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(() => {
    showConfirmation("✅ Demande enregistrée et notifications envoyées !");
    modal.style.display = "none";
    contactForm.reset();
    detectBtn.disabled = false;
    detectBtn.textContent = "📍 Détecter la position";
  })
  .catch(err => {
    console.error("❌ Erreur d’envoi :", err);
    showConfirmation("❌ Échec de l'enregistrement.");
  });
});

// 9. Message de confirmation visuel
function showConfirmation(text) {
  const msg = document.createElement("div");
  msg.className = "confirmation-message";
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 4000);
}

// 10. Fermeture du modal
document.querySelector('.close')?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});