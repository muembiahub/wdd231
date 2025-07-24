document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('serviceChoiceForm');
  const select = document.getElementById('serviceType');

  if (form && select) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const choice = select.value;

      if (choice === "offer") {
        window.location.href = "looking-job.html";
      } else if (choice === "receive") {
        window.location.href = "need-service.html";
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
      // Option par défaut
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "-- Choisir une catégorie --";
      defaultOption.value = "";
      select.appendChild(defaultOption);

      // Remplir le menu déroulant
      data.forEach(({ id, name, icon, summary }) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${icon} ${name}`;
        option.title = summary;
        select.appendChild(option);
      });

      // Au changement de sélection
      select.addEventListener("change", () => {
        const selectedId = select.value;
        const selected = data.find(item => item.id === selectedId);

        if (selected) {
          preview.innerHTML = `
            <div class="preview-block">
              <h3>${selected.icon} ${selected.name}</h3>
              <section><h4>Résumé</h4><p>${selected.summary}</p></section>
              <section><h4>Détails</h4><p>${selected.details}</p></section>
              <section><h4>Caractéristiques</h4>
                <ul>
                  ${selected.features.map(f => {
                    if (typeof f === "string") {
                      return `<li>${f}</li>`;
                    } else {
                      return f.link
                        ? `<li><a href="${f.link}" target="_blank" rel="noopener">${f.label}</a></li>`
                        : `<li>${f.label}</li>`;
                    }
                  }).join("")}
                </ul>
              </section>
            </div>
          `;
        } else {
          preview.innerHTML = `<p>Aucune information disponible pour cette catégorie.</p>`;
        }
      });
    })
    .catch(error => {
      console.error("Erreur de chargement :", error);
      preview.innerHTML = `<p>Erreur lors du chargement des données.</p>`;
    });
});










// Catalogue Téléphones & Tablettes
document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.getElementById("product-list");
  const cart = JSON.parse(localStorage.getItem("panier")) || [];

  // Style catalogue container
  catalog.style.display = "grid";
  catalog.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
  catalog.style.gap = "1em";
  catalog.style.padding = "2em";
  catalog.style.fontFamily = "Arial, sans-serif";
  catalog.style.backgroundColor = "#6d6ec3ff";

  // Créer bouton "Voir panier"
  const viewCartBtn = document.createElement("button");
  viewCartBtn.textContent = "🧺 Voir panier";
  Object.assign(viewCartBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "0.7em 1em",
    backgroundColor: "#0078d7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    zIndex: "999"
  });
  document.body.appendChild(viewCartBtn);

  // Créer le panneau panier
  const cartPanel = document.createElement("div");
  cartPanel.style.display = "none";
  cartPanel.style.position = "fixed";
  cartPanel.style.bottom = "80px";
  cartPanel.style.right = "20px";
  cartPanel.style.width = "320px";
  cartPanel.style.maxHeight = "400px";
  cartPanel.style.overflowY = "auto";
  cartPanel.style.backgroundColor = "#fff";
  cartPanel.style.border = "1px solid #ccc";
  cartPanel.style.borderRadius = "10px";
  cartPanel.style.padding = "1em";
  cartPanel.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  cartPanel.style.zIndex = "998";
  document.body.appendChild(cartPanel);

  // Fonction de mise à jour du panier
 function updateCartDisplay() {
  cartPanel.innerHTML = "";

  if (cart.length === 0) {
    cartPanel.innerHTML = "<p>Le panier est vide.</p>";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const entry = document.createElement("div");
    entry.textContent = `🛒 ${item.name} - ${item.price}`;
    entry.style.marginBottom = "0.5em";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✖";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.backgroundColor = "#f44336";
    removeBtn.style.color = "#fff";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "4px";
    removeBtn.style.cursor = "pointer";

    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      localStorage.setItem("panier", JSON.stringify(cart));
      updateCartDisplay();
    });

    entry.appendChild(removeBtn);
    cartPanel.appendChild(entry);

    total += parseFloat(item.price.replace("$", ""));
  });

  const totalDiv = document.createElement("div");
  totalDiv.textContent = `🧮 Total : $${total.toFixed(2)}`;
  totalDiv.style.fontWeight = "bold";
  totalDiv.style.marginTop = "1em";
  cartPanel.appendChild(totalDiv);

  // 👉 Ajouter le bouton "Payer maintenant"
  const oldPayBtn = document.getElementById("payBtn");
  if (oldPayBtn) {
    oldPayBtn.remove();
  }

  const payBtn = document.createElement("button");
  payBtn.id = "payBtn";
  payBtn.textContent = "💳 Payer maintenant";
  payBtn.style.marginTop = "1em";
  payBtn.style.backgroundColor = "#4caf50";
  payBtn.style.color = "#fff";
  payBtn.style.border = "none";
  payBtn.style.borderRadius = "6px";
  payBtn.style.padding = "0.5em 1em";
  payBtn.style.cursor = "pointer";

  payBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("🛒 Votre panier est vide !");
      return;
    }

    const total = cart.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace("$", ""));
    }, 0);

    alert(`✅ Paiement simulé de $${total.toFixed(2)} pour ${cart.length} article(s).\nMerci pour votre commande !`);

    localStorage.removeItem("panier");
    cart.length = 0;
    updateCartDisplay();
  });

  cartPanel.appendChild(payBtn);

  // 👉 Bouton "Vider le panier"
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🧹 Vider le panier";
  clearBtn.style.marginTop = "1em";
  clearBtn.style.backgroundColor = "#ff9800";
  clearBtn.style.color = "#fff";
  clearBtn.style.border = "none";
  clearBtn.style.borderRadius = "6px";
  clearBtn.style.padding = "0.5em 1em";
  clearBtn.style.cursor = "pointer";

  clearBtn.addEventListener("click", () => {
    localStorage.removeItem("panier");
    cart.length = 0;
    updateCartDisplay();
  });

  cartPanel.appendChild(clearBtn);
}

  viewCartBtn.addEventListener("click", () => {
    cartPanel.style.display = cartPanel.style.display === "none" ? "block" : "none";
    updateCartDisplay();
  });

  // Charger les produits
  fetch('scripts/telephones-tablettes.json')
    .then(response => {
      if (!response.ok) throw new Error("Données introuvables");
      return response.json();
    })
    .then(products => {
      catalog.innerHTML = "";

      products.forEach(product => {
        const card = document.createElement("div");
        Object.assign(card.style, {
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "1em",
          boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease"
        });
        card.addEventListener("mouseenter", () => card.style.transform = "scale(1.02)");
        card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");

        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.name;
        Object.assign(img.style, {
          width: "200px",
          borderRadius: "4px",
          marginBottom: "0.8em"
        });

        const name = document.createElement("h2");
        name.textContent = product.name;
        Object.assign(name.style, {
          fontSize: "1.1em",
          color: "#333",
          marginBottom: "0.2em"
        });

        const brand = document.createElement("div");
        brand.textContent = `Marque : ${product.brand}`;
        Object.assign(brand.style, {
          fontWeight: "bold",
          marginBottom: "0.3em",
          color: "#555"
        });

        const price = document.createElement("div");
        price.textContent = `Prix : ${product.price}`;
        Object.assign(price.style, {
          color: "#0078d7",
          marginBottom: "0.5em"
        });

        const desc = document.createElement("p");
        desc.textContent = product.description;
        Object.assign(desc.style, {
          fontSize: "0.9em",
          lineHeight: "1.4",
          color: "#444"
        });

        const button = document.createElement("button");
        button.textContent = "Ajouter au panier";
        Object.assign(button.style, {
          padding: "0.6em 1em",
          backgroundColor: "#0078d7",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "0.5em",
          transition: "background-color 0.3s ease"
        });
        button.addEventListener("mouseenter", () => button.style.backgroundColor = "#005bb5");
        button.addEventListener("mouseleave", () => button.style.backgroundColor = "#0078d7");
        button.addEventListener("click", () => {
          cart.push(product);
          localStorage.setItem("panier", JSON.stringify(cart));
          updateCartDisplay();
          alert(`✅ ${product.name} ajouté au panier !`);
        });

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(brand);
        card.appendChild(price);
        card.appendChild(desc);
        card.appendChild(button);
        catalog.appendChild(card);
      });
    })
    .catch(error => {
      catalog.innerHTML = "<p style='color:red'>⚠️ Échec du chargement des produits.</p>";
      console.error(error);
    });
});