// 1. Détection du fichier JSON selon la page
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const jsonPath = `data/${pageName}.json`;

// 2. Chargement du JSON et affichage des cartes
fetch(jsonPath)
  .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
  .then(data => {
    for (const key in data) {
      const section = data[key];
      if (Array.isArray(section)) {
        section.forEach(item => {
          const card = createCard(item);
          document.querySelector("#category").innerHTML += card;
        });
      }
    }
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
const messageField = modal.querySelector('#message');
const sendBtn = document.getElementById('sendToDatabase');
const gpsInput = modal.querySelector('#gps');
const detectBtn = document.getElementById('detectGPS');
const emailInput = document.getElementById('clientEmail');
const whatsappInput = document.getElementById('clientWhatsApp');

// 5. Détection GPS
detectBtn?.addEventListener('click', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);
      const coords = `${lat}, ${lon}`;
      gpsInput.value = coords;
      messageField.value = `📍 Localisation : ${coords}\n🗺️ Carte : https://www.google.com/maps?q=${coords}\n\n` + messageField.value;
      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  } else {
    alert("🛑 GPS non pris en charge.");
  }
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

// 7. Envoi des données vers Netlify Function
sendBtn.addEventListener('click', () => {
  const category = messageField.value.match(/"(.+?)"/)?.[1] || "Service";
  const price = messageField.value.match(/Prix estimatif : (.+?) \$\n/)?.[1] || "—";
  const gps = gpsInput.value.trim();
  const message = messageField.value.trim();
  const clientEmail = emailInput.value.trim();
  const clientWhatsApp = whatsappInput.value.trim();

  if (!clientEmail || !clientWhatsApp) {
    alert("📌 Email et WhatsApp sont requis.");
    return;
  }

  fetch('/.netlify/functions/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, price, message, gps, clientEmail, clientWhatsApp })
  })
  .then(res => res.json())
  .then(() => {
    showConfirmation("✅ Demande enregistrée avec succès !");
    modal.style.display = 'none';
  })
  .catch(err => {
    console.error("Erreur :", err);
    showConfirmation("❌ Échec de l'enregistrement.");
  });
});

// 8. Message de confirmation visuel
function showConfirmation(text) {
  const msg = document.createElement("div");
  msg.className = "confirmation-message";
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 4000);
  
}


// 9. Fermeture du modal
document.querySelector('.close')?.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});