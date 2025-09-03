document.addEventListener('DOMContentLoaded', () => {
  // 1. Charger le JSON et injecter les cartes
  fetch('data/construction-reparation.json')
    .then(response => {
      if (!response.ok) throw new Error("Fichier JSON introuvable");
      return response.json();
    })
    .then(data => {
      const travaux = data.travaux;
      afficherTravaux(travaux.plomberie, 'plomberie-container');
      afficherTravaux(travaux.construction, 'construction-container');
    })
    .catch(error => {
      console.error("❌ Erreur JSON :", error);
    });

  // 2. Références du modal
  const modal = document.getElementById('contactModal');
  const messageField = modal?.querySelector('#message');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  const sendEmailBtn = document.getElementById('sendEmail');
  const sendLinks = modal?.querySelector('.send-links');
  const gpsInput = modal?.querySelector('#gps');
  const detectBtn = modal?.querySelector('#detectGPS');
  const mapLink = modal?.querySelector('#mapLink');

  // 3. Détection GPS
  detectBtn?.addEventListener('click', () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const gpsCoords = `${lat}, ${lon}`;
        const mapURL = `https://www.google.com/maps?q=${lat},${lon}`;

        if (gpsInput) gpsInput.value = gpsCoords;

        if (messageField) {
          const gpsText = `📍 Localisation : ${gpsCoords}\n🗺️ Carte : ${mapURL}\n\n`;
          messageField.value = gpsText + messageField.value;
        }

        detectBtn.disabled = true;
        detectBtn.textContent = "✅ Position détectée";
      }, () => {
        alert("⚠️ Impossible d'obtenir la position.");
      });
    } else {
      alert("🛑 GPS non pris en charge par votre navigateur.");
    }
  });

  // 4. Ouvrir le modal avec message personnalisé
  document.addEventListener('click', e => {
    if (e.target.classList.contains('open-modal')) {
      const btn = e.target;
      const produit = btn.dataset.produit || "Produit";
      const category = btn.dataset.title || "Catégorie";
      const price = btn.dataset.price || "N/A";
      const dimensions = btn.dataset.dimensions || "N/A";
      const custom = btn.dataset.custom === "true" ? "Oui" : "Non";

      const message = `Bonjour, je suis intéressé par "${produit}" dans la catégorie "${category}".\n\n` +
                      `Prix : ${price} €\nDimensions : ${dimensions}\nPersonnalisable : ${custom}\n\n` +
                      `Merci de me fournir plus d'informations.`;

      if (messageField) messageField.value = message;
      sendLinks?.classList.add('visible');
      if (modal) modal.style.display = 'block';
    }
  });

  // 5. Envoi WhatsApp
  sendWhatsAppBtn?.addEventListener('click', () => {
    const message = encodeURIComponent(messageField?.value.trim() || "");
    const url = `https://wa.me/243825267122?text=${message}`;
    window.open(url, '_blank');
    if (modal) modal.style.display = 'none';
  });

  // 6. Envoi Email
  sendEmailBtn?.addEventListener('click', () => {
    const message = encodeURIComponent(messageField?.value.trim() || "");
    const subject = encodeURIComponent("Demande d'assistance");
    const mailtoURL = `mailto:jonathanmuembia3@gmail.com?subject=${subject}&body=${message}`;
    window.location.href = mailtoURL;

    const gmailURL = `https://mail.google.com/mail/?view=cm&to=jonathanmuembia3@gmail.com&su=${subject}&body=${message}`;
    window.open(gmailURL, '_blank');
    if (modal) modal.style.display = 'none';
  });

  // 7. Fermer le modal avec le bouton
  document.querySelector('.close')?.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });

  // 8. Fermer le modal par clic à l’extérieur
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

/**
 * Injecte les travaux dans le conteneur HTML spécifié
 * @param {Array} liste - Liste des travaux
 * @param {string} containerId - ID du conteneur HTML
 */
function afficherTravaux(liste, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ Conteneur #${containerId} introuvable.`);
    return;
  }

  container.innerHTML = '';

  liste.forEach(item => {
    const card = document.createElement('div');
    card.className = 'carte-travail';

    const type = item.type || 'Travail';
    const prix = item.prix || 'N/A';
    const heure = item.heure || 'N/A';
    const image = item.image || 'images/default.jpg';
    const alt = item.alt || 'Image';
    const description = item.description || 'Pas de description.';

    card.innerHTML = `
      <h3>${type}</h3>
      <p><strong>Prix :</strong> ${prix} | <strong>Heure :</strong> ${heure}</p>
      <img src="${image}" alt="${alt}" style="max-width:200px; margin-top:10px;" />
      <p>${description}</p>
      <button class="open-modal"
              data-produit="${type}"
              data-title="${containerId === 'plomberie-container' ? 'Plomberie' : 'Construction'}"
              data-price="${prix.replace('$', '')}"
              data-dimensions="Standard"
              data-custom="true">
        Contacter un agent
      </button>
    `;

    container.appendChild(card);
  });
}