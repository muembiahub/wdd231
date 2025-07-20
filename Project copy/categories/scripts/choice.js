document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('serviceChoiceForm');
  const select = document.getElementById('serviceType');

  if (form && select) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const choice = select.value;

      if (choice === "offer") {
        window.location.href = "offer-form.html";
      } else if (choice === "receive") {
        window.location.href = "receive-form.html";
      } else {
        alert("Veuillez sélectionner une option avant de continuer.");
      }
    });
  }
});











 document.addEventListener("DOMContentLoaded", function () {
  // Initialise la carte sur Lubumbashi
  const map = L.map("map").setView([-11.67, 27.48], 13);

  // Ajoute les tuiles OSM
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Crée le marqueur draggable
  const marker = L.marker(map.getCenter(), { draggable: true }).addTo(map);

  // Fonction centrale pour remplir les champs
  async function updateFields(lat, lon) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const address = data.address || {};

      document.getElementById("searchLocation").value = data.display_name || `${lat}, ${lon}`;
      document.getElementById("province").value = address.state || address.region || "";
      document.getElementById("quartier").value =
        address.suburb || address.neighbourhood || address.city_district || address.city || "";
    } catch (error) {
      console.error("Géocodage inverse échoué :", error);
    }
  }

  // Événement lors du déplacement du marqueur
  marker.on("dragend", function () {
    const pos = marker.getLatLng();
    updateFields(pos.lat, pos.lng);
  });

  // Recherche par texte
  document.getElementById("searchLocation").addEventListener("change", async function () {
    const query = this.value;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const results = await response.json();
      if (results.length > 0) {
        const loc = results[0];
        const lat = loc.lat;
        const lon = loc.lon;
        map.setView([lat, lon], 15);
        marker.setLatLng([lat, lon]);
        updateFields(lat, lon);
      }
    } catch (error) {
      console.error("Erreur de recherche :", error);
    }
  });

  // Détection via le navigateur
  window.getLocation = function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon], 15);
        marker.setLatLng([lat, lon]);
        updateFields(lat, lon);
      }, function (error) {
        alert("Position non détectée. Veuillez autoriser l’accès à la localisation.");
      });
    } else {
      alert("La géolocalisation n’est pas prise en charge sur ce navigateur.");
    }
  };
});









document.addEventListener("DOMContentLoaded", async function () {
  const select = document.getElementById("countryCode");
  const phoneContainer = document.getElementById("phoneContainer");

  try {
    const response = await fetch("scripts/countries.json");
    const countries = await response.json();

    countries.forEach(c => {
      const option = document.createElement("option");
      option.value = c.dial_code;
      option.innerHTML = `
        <span style="display: flex; align-items: center;">
          <img src="https://flagcdn.com/24x18/${c.iso}.png" alt="${c.country}" style="margin-right: 6px;" />
          ${c.country} (${c.dial_code})
        </span>`;
      option.setAttribute("data-iso", c.iso);
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      if (select.value !== "") {
        phoneContainer.style.display = "block"; // Affiche le champ numéro
      } else {
        phoneContainer.style.display = "none"; // Cache si aucun pays
      }
    });

  } catch (error) {
    console.error("Erreur de chargement du fichier countries.json :", error);
  }
});