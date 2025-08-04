document.addEventListener('DOMContentLoaded', () => {
  // 1. Charger les données JSON et générer les cartes pour menuiserie page 
  fetch('data/menuiserie.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('catalogue-menuiserie');

      data.menuseries.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const features = item.features.map(f => `<li>${f}</li>`).join('');
        const options = item.options.map(opt => `
          <li>
            <strong>${opt.name}</strong><br />
            Prix : ${opt.price.toFixed(2)} €<br />
            Dimensions : ${opt.dimensions}<br />
            Personnalisable : ${opt.customizable ? "Oui" : "Non"}<br />
            Stock : ${opt.stock}<br />
            <button class="open-modal"
                    data-produit="${opt.name}"
                    data-title="${item.title}"
                    data-price="${opt.price}"
                    data-dimensions="${opt.dimensions}"
                    data-custom="${opt.customizable}">
              Contacter un agent
            </button>
          </li>
        `).join('');

        card.innerHTML = `
          <h2>${item.title}</h2>
          <p><strong>Résumé :</strong> ${item.summary}</p>
          <img src="../${item.image}" alt="${item.title}" />
          <p><strong>Détails :</strong> ${item.details}</p>
          <div><strong>Caractéristiques :</strong><ul>${features}</ul></div>
          <div><strong>Options disponibles :</strong><ul>${options}</ul></div>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => console.error("❌ Erreur lors du chargement du JSON :", error));

  // 2. Références du modal
  const modal = document.getElementById('contactModal');
  const messageField = modal.querySelector('#message');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  const sendEmailBtn = document.getElementById('sendEmail');
  const sendLinks = modal.querySelector('.send-links');
  const gpsInput = modal.querySelector('#gps');
  const detectBtn = modal.querySelector('#detectGPS');
  const mapLink = modal.querySelector('#mapLink');

  // 3. Détection GPS + Lien Google Maps
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
          const gpsText = `📍 Localisation : ${gpsCoords}\n🗺️ Carte : ${mapURL}\n\n`;
          messageField.value = gpsText + messageField.value;
        }

        // ✅ Désactiver le bouton après détection
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


  // 4. Ouvrir le modal avec message personnalisé
  document.addEventListener('click', e => {
    if (e.target.classList.contains('open-modal')) {
      const btn = e.target;
      const produit = btn.dataset.produit;
      const category = btn.dataset.title;
      const price = btn.dataset.price;
      const dimensions = btn.dataset.dimensions;
      const custom = btn.dataset.custom === "true" ? "Oui" : "Non";

      const message = `Bonjour, je suis intéressé par "${produit}" dans la catégorie "${category}".\n\n` +
                      `Prix : ${price} €\nDimensions : ${dimensions}\nPersonnalisable : ${custom}\n\n` +
                      `Merci de me fournir plus d'informations.`;

      if (messageField) messageField.value = message;
      sendLinks.classList.add('visible');
      modal.style.display = 'block';
    }
  });

  // 5. Envoi WhatsApp
  sendWhatsAppBtn.addEventListener('click', () => {
    const message = encodeURIComponent(messageField.value.trim());
    const url = `https://wa.me/243825267122?text=${message}`;
    window.open(url, '_blank');
    modal.style.display = 'none';
  });

  // 6. Envoi Email
  sendEmailBtn.addEventListener('click', () => {
    const message = encodeURIComponent(messageField.value.trim());
    const subject = encodeURIComponent("Demande d'assistance");
    const mailtoURL = `mailto:jonathanmuembia3@gmail.com?subject=${subject}&body=${message}`;
    window.location.href = mailtoURL;

    const gmailURL = `https://mail.google.com/mail/?view=cm&to=jonathanmuembia3@gmail.com&su=${subject}&body=${message}`;
    window.open(gmailURL, '_blank');
    modal.style.display = 'none';
  });

  // 7. Fermer le modal avec le bouton
  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 8. Fermer le modal par clic à l’extérieur
  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});





 