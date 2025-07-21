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




// needType selection sur Formulaire 

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("needType");
  const preview = document.getElementById("preview");

  fetch('scripts/services.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(({ id, name, icon, description }) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${icon} ${name}`;
        option.title = description;
        select.appendChild(option);
      });

     select.addEventListener("change", () => {
  const selected = data.find(item => item.id === select.value);
  preview.innerHTML = "";

  if (selected) {
    const card = document.createElement("div");
    card.className = "preview-card";
    card.style.padding = "1em";
    card.style.borderRadius = "8px";
    card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    card.style.backgroundColor = "#f0f0f0";
    card.style.border = "1px solid #ccc";

    const title = document.createElement("h2");
    title.textContent = `${selected.icon} ${selected.name}`;
    title.style.marginBottom = "0.5em";

    const desc = document.createElement("p");
    desc.textContent = selected.description;
    desc.style.marginBottom = "1em";

    const link = document.createElement("a");
    link.href = `${selected.id}.html`; // 🔗 chemin vers la page dédiée
    link.textContent = "Voir les détails";
    link.style.display = "inline-block";
    link.style.padding = "0.5em 1em";
    link.style.backgroundColor = "#0078d7";
    link.style.color = "#fff";
    link.style.borderRadius = "4px";
    link.style.textDecoration = "none";

    link.addEventListener("mouseover", () => link.style.backgroundColor = "#005bb5");
    link.addEventListener("mouseout", () => link.style.backgroundColor = "#0078d7");

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);
    preview.appendChild(card);

    // Animation d’apparition
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 10);
  }
});
    })
    .catch(error => {
      preview.innerHTML = `<p style="color: red;">⚠️ Erreur de chargement.</p>`;
      console.error(error);
    });
});




// Catalogue Téléphones & Tablettes

 const title = document.getElementById("page-title");
    title.style.color = "#0078d7";
    title.style.marginBottom = "1em";
    title.style.fontFamily = "Arial, sans-serif";

    const container = document.getElementById("product-list");
    container.style.fontFamily = "Arial, sans-serif";
    container.style.padding = "1em";
    container.style.backgroundColor = "#f9f9f9";

    fetch('scripts/telephones-tablettes.json') // ajuste le chemin selon ton projet
      .then(response => {
        if (!response.ok) throw new Error("Fichier JSON introuvable");
        return response.json();
      })
      .then(products => {
        container.innerHTML = "";

        products.forEach(({ name, price }) => {
          const card = document.createElement("div");
          card.style.backgroundColor = "#fff";
          card.style.border = "1px solid #ddd";
          card.style.borderRadius = "8px";
          card.style.padding = "1em";
          card.style.marginBottom = "1em";
          card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
          card.style.transition = "transform 0.3s ease";

          card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.02)";
          });
          card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
          });

          const nameDiv = document.createElement("div");
          nameDiv.textContent = name;
          nameDiv.style.fontWeight = "bold";
          nameDiv.style.fontSize = "1.1em";
          nameDiv.style.marginBottom = "0.3em";

          const priceDiv = document.createElement("div");
          priceDiv.textContent = `Prix : ${price}`;
          priceDiv.style.color = "#444";

          card.appendChild(nameDiv);
          card.appendChild(priceDiv);
          container.appendChild(card);
        });
      })
      .catch(error => {
        container.innerHTML = `<p style="color:red;">⚠️ Erreur de chargement des produits.</p>`;
        console.error(error);
      });
