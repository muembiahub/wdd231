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
    document.querySelector("#catalogue").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
  });

// Fonction de rendu universel
function renderCatalogue(data) {
  for (const key in data) {
    const section = data[key];
    if (Array.isArray(section)) {
      section.forEach(item => {
        if (item.category && item.price) {
          renderSimpleCard(item); // Beauté, mécanique, cérémonies
        } else if (item.title && item.options) {
          renderMenuiserieCard(item); // Menuiseries
        } else if (item.type && item.image) {
          renderServiceCard(item); // Réparation, construction
        }
      });
    }
  }
}

// Carte simple : category + logo + description + price
function renderSimpleCard(item) {
  const card = `
    <div class="card simple">
      <img src="${item.logo}" alt="${item.category}">
      <h3>${item.category}</h3>
      <p>${item.description}</p>
      <strong>${item.price} $</strong>
    </div>
  `;
  document.querySelector("#catalogue").innerHTML += card;
}

// Carte menuiserie avec options
function renderMenuiserieCard(item) {
  const card = `
    <div class="card menu">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      ${item.options.map(opt => `
        <div class="option">
          <img src="${opt.image}" alt="${opt.name}">
          <p>${opt.name} — ${opt.dimensions} — ${opt.price} $</p>
        </div>
      `).join("")}
    </div>
  `;
  document.querySelector("#catalogue").innerHTML += card;
}

// Carte service : type + image + description + price
function renderServiceCard(item) {
  const card = `
    <div class="card service">
      <img src="${item.image}" alt="${item.alt || item.type}">
      <h3>${item.type}</h3>
      <p>${item.description}</p>
      <strong>${item.price} $</strong>
    </div>
  `;
  document.querySelector("#catalogue").innerHTML += card;
}