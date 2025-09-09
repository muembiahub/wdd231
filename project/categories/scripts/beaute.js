document.addEventListener('DOMContentLoaded', () => {
  // 1. Charger le JSON des catégories beauté
  fetch('data/coiffure.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('catalogue-coiffure');

      data.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.category = cat.category;
        card.dataset.price = cat.price;

        card.innerHTML = `
  <img src="${cat.logo}" alt="${cat.category}" class="category-logo" />
  <h3>${cat.category}</h3>
  <p>${cat.description}</p>
  <div class="card-bottom">
    <p><strong id="price">À partir de ${cat.price.toFixed(2)} $</strong></p>
    <button class="open-modal"
            data-category="${cat.category}"
            data-price="${cat.price}">
      Contacter un agent
    </button>
  </div>
      `;
container.appendChild(card);
      });
    })
    .catch(error => console.error("❌ Erreur lors du chargement du JSON :", error));

  // 2. Modal de contact
  const modal = document.getElementById('contactModal');
  const messageField = modal.querySelector('#message');
  const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
  const sendEmailBtn = document.getElementById('sendEmail');
  const sendLinks = modal.querySelector('.send-links');
  const gpsInput = modal.querySelector('#gps');
  const detectBtn = document.getElementById('detectGPS');

  // 3. Détection GPS
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

  // 4. Ouvrir le modal avec message personnalisé
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
    const subject = encodeURIComponent("Demande d'information");
    const mailtoURL = `mailto:jonathanmuembia3@gmail.com?subject=${subject}&body=${message}`;
    window.location.href = mailtoURL;

    const gmailURL = `https://mail.google.com/mail/?view=cm&to=jonathanmuembia3@gmail.com&su=${subject}&body=${message}`;
    window.open(gmailURL, '_blank');
    modal.style.display = 'none';
  });

  // 7. Fermer le modal
  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});