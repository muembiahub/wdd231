// Détection du nom de la page HTML
const pageName = window.location.pathname.split("/").pop().replace(".html", "");
const jsonPath = `data/${pageName}.json`;

// Chargement du JSON correspondant
fetch(jsonPath)
  .then(response => {
    if (!response.ok) throw new Error(`Fichier introuvable : ${jsonPath}`);
    return response.json();
  })
  .then(data => renderCatalogue(data))
  .catch(error => {
    console.error("Erreur de chargement :", error);
    document.querySelector("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
  });

// Fonction de rendu universel
function renderCatalogue(data) {
  for (const key in data) {
    const section = data[key];
    if (Array.isArray(section)) {
      section.forEach(item => {
        if (item.category && item.price) {
          renderSimpleCard(item);
        } else if (item.title && item.options) {
          renderMenuiserieCard(item);
        } else if (item.type && item.image) {
          renderServiceCard(item);
        }
      });
    }
  }
}

// Carte simple
function renderSimpleCard(item) {
  const card = `
    <div class="card simple">
      <img src="${item.logo}" alt="${item.category}">
      <h3>${item.category}</h3>
      <p>${item.description}</p>
      <strong>${item.price} $</strong>
      <button onclick="open-modal('${item.category}', ${item.price})">Contacter un agent</button>
    </div>
  `;
  document.querySelector("#category").innerHTML += card;
}

// Carte menuiserie
function renderMenuiserieCard(item) {
  const card = `
    <div class="card menu">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      ${item.options.map(opt => `
        <div class="option">
          <img src="${opt.image}" alt="${opt.name}">
          <p>${opt.name} — ${opt.dimensions} — ${opt.price} $</p>
          <button onclick="open-modal('${opt.name}', ${opt.price})">Contacter un agent</button>
        </div>
      `).join("")}
    </div>
  `;
  document.querySelector("#category").innerHTML += card;
}

// Carte service
function renderServiceCard(item) {
  const card = `
    <div class="card service">
      <img src="${item.image}" alt="${item.alt || item.type}">
      <h3>${item.type}</h3>
      <p>${item.description}</p>
      <strong>${item.price} $</strong>
      <button class="open-modal" data-category="${item.type}" data-price="${item.price}">Contacter un agent</button>
    </div>
  `;
  document.querySelector("#category").innerHTML += card;
}
// Ouvrir le formulaire de contact
// Modal de contact
const modal = document.getElementById('contactModal');
const messageField = modal.querySelector('#message');
const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
const sendEmailBtn = document.getElementById('sendEmail');
const sendLinks = modal.querySelector('.send-links');
const gpsInput = modal.querySelector('#gps');
const detectBtn = document.getElementById('detectGPS');

// Détection GPS
if (detectBtn) {
  detectBtn.addEventListener('click', () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const gpsCoords = `${lat}, ${lon}`;
        const mapURL = `https://www.google.com/maps?q=${lat},${lon}`;

        if (gpsInput) gpsInput.value = gpsCoords;
        if (messageField) {
          const gpsText = `📍 Ma Localisation : ${gpsCoords}\n🗺️ Carte : ${mapURL}\n\n`;
          messageField.value = gpsText + messageField.value;
        }

        detectBtn.disabled = true;
        detectBtn.textContent = "✅ Position détectée";
      }, error => {
        alert("⚠️ Impossible d'obtenir la position.");
      });
    } else {
      alert("🛑 GPS non pris en charge par votre navigateur.");
    }
  });
}

// Ouvrir le modal avec message personnalisé
document.addEventListener('click', e => {
  if (e.target.classList.contains('open-modal')) {
    const btn = e.target;
    const category = btn.dataset.category;
    const price = btn.dataset.price;

    const message = `Bonjour, je suis intéressé par la catégorie "${category}".\n\n` +
                    `Prix estimatif : ${price} $\n\n` +
                    `Merci de me fournir plus d'informations.`;

    if (messageField) messageField.value = message;
    sendLinks.classList.add('visible');
    modal.style.display = 'block';
  }
});

// Envoi WhatsApp
sendWhatsAppBtn.addEventListener('click', () => {
  const message = encodeURIComponent(messageField.value.trim());
  const url = `https://wa.me/243825267122?text=${message}`;
  window.open(url, '_blank');
  modal.style.display = 'none';
});

// Envoi Email
sendEmailBtn.addEventListener('click', () => {
  const message = encodeURIComponent(messageField.value.trim());
  const subject = encodeURIComponent("Demande d'information");
  const mailtoURL = `mailto:jonathanmuembia3@gmail.com?subject=${subject}&body=${message}`;
  window.location.href = mailtoURL;

  const gmailURL = `https://mail.google.com/mail/?view=cm&to=jonathanmuembia3@gmail.com&su=${subject}&body=${message}`;
  window.open(gmailURL, '_blank');
  modal.style.display = 'none';
});

// Fermer le modal
document.querySelector('.close').addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
