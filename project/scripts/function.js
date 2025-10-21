// function pour injecter Header sur toutes les pages sur Kazidomo.com

function injectHeader(targetId = 'header', filename = 'header.html', maxDepth = 5) {
  function tryPath(depth) {
    const prefix = '../'.repeat(depth);
    const path = `${prefix}${filename}`;
    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.text();
      })
      .then(html => {
        const target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = html;
        } else {
          console.warn(`Élément #${targetId} introuvable pour injecter le header.`);
        }
      })
      .catch(() => {
        if (depth < maxDepth) {
          tryPath(depth + 1);
        } else {
          console.error(`Échec du chargement de ${filename} après ${maxDepth} tentatives.`);
        }
      });
  }

  tryPath(0);
}



// === Favicon dynamique ===
function injectFavicon(path = "images/favicon.ico") {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = path;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}

function injectTitle() {
  const pageName = getPageName();

  // Supprimer tous les <title> existants
  const existingTitles = document.head.querySelectorAll("title");
  existingTitles.forEach(t => t.remove());

  // Créer et injecter un nouveau <title>
  const newTitle = document.createElement("title");
  newTitle.textContent = pageName;
  document.head.appendChild(newTitle);

  // Mettre à jour l’élément visible dans le corps de la page
  const pageTitleElement = $("#pageTitle");
  if (pageTitleElement) {
    pageTitleElement.textContent = "kazidomo Confiance - " + pageName;
  }
}

// === 1. Déduction du nom de la page ===
function getPageName() {
  const path = window.location.pathname;
  const file = path.split("/").pop();
  const name = file.replace(".html", "");
  return name || "index"; // fallback si vide
}

// === 2. Sélecteur simplifié ===
function $(selector) {
  return document.querySelector(selector);
}

// === 3. Génération du nom d’image ===
function generateImageName(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "") + ".webp";
}

// === 4. Génération HTML d’une carte pour les pages hors accueil ===
function createCard(item, pageName) {
  const title = item.category || item.type || item.title || "Service";
  const description = item.description || item.summary || "Description indisponible.";
  const price = item.price || "—";
  const alt = item.alt || title;
  const image = `images/${generateImageName(title)}`;

  return `
    <div class="card searchable" data-page="${pageName}">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
     <button onclick="loadContactView('${encodeURIComponent(title)}', '${encodeURIComponent(price)}')" id="contactAgentBtn">
  <i class="fas fa-envelope"></i> Contacter un agent
</button>
    </div>
  `;
}
// function sendToSupabase(formData) 

function sanitizeFormData(form) {
  const get = (selector) => form.querySelector(selector)?.value.trim() || "";

  const rawPrice = get("#servicePrice");
  const price = rawPrice ? parseFloat(rawPrice) : null;

  return {
    name: get("#clientName"),
    client_email: get("#clientEmail"),
    client_whatsapp: get("#countryCode") + get("#clientWhatsApp"),
    category: get("#serviceCategory"),
    price: price,
    message: get("#clientMessage"),
    gps: get("#gpsField")
  };
}


function loadContactView(title, price) {
  selectedCategory = decodeURIComponent(title);
  selectedPrice = decodeURIComponent(price);

  previousScrollY = window.scrollY;
  previousPageName = getPageName();

  const main = document.querySelector("main") || document.body;
  main.innerHTML = "";

  injectForm();
  populateCountryCodes();
  setupGPS();
  if (typeof setupFormValidation === "function") {
    setupFormValidation();
  }

  setupReturnToServicesButton("backToServices"); // bouton statique si présent

  window.scrollTo({ top: 0, behavior: "smooth" });

  const form = document.getElementById("contactAgentForm");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = document.getElementById("submitBtn");
    const originalHTML = btn?.innerHTML;

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> <span>Envoi en cours…</span>`;
    }

    const formData = sanitizeFormData(form);
    const success = await sendToSupabase(formData);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
    const formView = document.querySelector(".form-view");
    if (formView) {
    formView.style.display = "none";
    showConfirmationBanner();
    createReturnToServicesButton();
  }
  });
}
// 
function createReturnToServicesButton() {
  if (document.getElementById("returnToServicesBtn")) return;

  const btn = document.createElement("button");
  btn.id = "returnToServicesBtn";
  btn.textContent = "↩ Retour aux services";
  btn.style.cssText = `
    margin: 1em auto;
    display: block;
    padding: 0.8em 1.2em;
    font-size: 1em;
    background: #00aa00;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: background 3s ease;
  `;

  const banner = document.getElementById("confirmationBanner");
  banner?.insertAdjacentElement("afterend", btn);

  setupReturnToServicesButton("returnToServicesBtn");
}
// cre


function setupReturnToServicesButton(buttonId = "returnToServicesBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", () => {
    const main = document.querySelector("main") || document.body;
    main.innerHTML = "";

    const pageName = previousPageName || getPageName();
    const isHomePage = pageName === "index" || pageName === "home";
    const containerId = isHomePage ? "categoryHomepage" : "category";

    const container = document.createElement("div");
    container.id = containerId;
    main.appendChild(container);

    if (typeof injectCardsForPage === "function") {
      injectCardsForPage();
    } else {
      console.error("⚠️ injectCardsForPage non définie.");
    }

    window.scrollTo({ top: previousScrollY || 0, behavior: "smooth" });
     btn.remove(); // ✅ ca supprime le bouton après retour

  });
}

// === 5. Génération HTML d’une carte pour la page d’accueil ===
function createHomeCard(item) {
  const logo = item.logo || "images/default.webp";
  const category = item.category || "Service";
  const description = item.description || "Description indisponible.";
  const pageUrl = item.page_url || "#";

  return `
    <div class="card">
      <img src="${logo}" alt="${category}">
      <h3>${category}</h3>
      <p>${description}</p>
      <a href="${pageUrl}" class="view-button">Consulter</a>
    </div>
  `;
}

// === 6. Injection dynamique des cartes selon la page ===
function injectCardsForPage() {
  const pageName = getPageName();
  const isHomePage = pageName === "index" || pageName === "home";

  const containerId = isHomePage ? "categoryHomepage" : "category";
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ Conteneur #${containerId} introuvable.`);
    return;
  }

  const jsonPath = isHomePage
    ? "data/categories.json"
    : `data/${pageName}.json`;

  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Fichier JSON introuvable : ${jsonPath}`);
      }
      return response.json();
    })
    .then(data => {
      const items = isHomePage
        ? data.categories
        : Array.isArray(data.categories)
          ? data.categories
          : Object.values(data).flat();

      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = `
          <div class="empty-message">
            <p>🌿 Aucun contenu disponible pour cette page.</p>
            <p style="font-style: italic;">Elle attend encore ses premières cartes…</p>
          </div>
        `;
        return;
      }

      items.forEach((item, index) => {
        const cardHTML = isHomePage
          ? createHomeCard(item)
          : createCard(item, pageName);

        const wrapper = document.createElement("div");
        wrapper.innerHTML = cardHTML;
        const card = wrapper.firstElementChild;

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.filter = "blur(4px)";
        card.style.transition = "opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease";

        container.appendChild(card);

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.filter = "blur(0)";
        }, index * 1050);
      });
    })
    .catch(error => {
      console.error("💥 Erreur lors du chargement du JSON :", error);
      container.innerHTML = `
        <div class="error-message">
          <p>📦 Le contenu est temporairement indisponible.</p>
          <p style="font-style: italic;">Vérifiez le fichier JSON ou réessayez plus tard.</p>
        </div>
      `;
    });
}

// populate country codes in the select element
function populateCountryCodes() {
  fetch("data/countries.json")
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById("countryCode");
      const flagDisplay = document.getElementById("flagDisplay");

      data.forEach(entry => {
        const option = document.createElement("option");
        option.value = entry.dial_code;
        option.textContent = `${entry.country} (${entry.dial_code})`;
        option.dataset.iso = entry.iso.toLowerCase(); // important pour le lien
        select.appendChild(option);
      });

      // Met à jour le drapeau au changement
      select.addEventListener("change", () => {
        const iso = select.selectedOptions[0].dataset.iso;
        flagDisplay.src = `https://flagcdn.com/${iso}.svg`;
      });

      // Initialise le drapeau
      const initialISO = select.options[0].dataset.iso;
      flagDisplay.src = `https://flagcdn.com/${initialISO}.svg`;
    })
    .catch(error => {
      console.error("💥 Erreur lors du chargement des indicatifs :", error);
    });
}

// === 4. Injection du formulaire ===
function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <div class="form-view">
      <h2>Contacter un agent</h2>
      <form id="contactAgentForm">
        <label for="name">Nom Complet :</label>
        <input type="text" id="name" placeholder="Saisissez votre nom complet" required>

        <label for="clientEmail">Email :</label>
        <input type="email" id="clientEmail" placeholder="Saisissez votre email" required>
        <label for="clientWhatsApp">Numéro WhatsApp :</label>
         <div style="display: flex; align-items: center; gap: 0.2em;">
            <img id="flagDisplay" src="" alt="Drapeau" style="width: 24px; height: 18px;">
              <select id="countryCode" required></select>
                <input type="text" id="clientWhatsApp" placeholder="Saisissez votre numéro WhatsApp" required>
          </div>

        <label for="gps">Ma position :</label>
        <input type="text" id="gps" readonly placeholder="Coordonnées GPS">
        <button type="button" id="detectGPS">📍 Détecter ma position  </button>

        <input type="hidden" id="mapUrl">
        <div id="gpsMapContainer"></div>

        <label for="message">Message :</label>
        <textarea id="message" rows="5" placeholder="Votre message ou préoccupation"></textarea>

        <button type="submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
      </form>

      <button id="backToServices" style="margin-top: 1em;">⬅️ Retour aux services</button>
      <div class="confirmation-message" id="confirmationBanner" style="display: none;"></div>
    </div>
  `;

  const main = document.querySelector("main") || document.body;
  main.appendChild(formContainer);
}











// function pour injecter footer sur toutes les pages sur Kazidomo.com
function injectFooter(targetId = 'footer', filename = 'footer.html', maxDepth = 5) {
  function tryPath(depth) {
    const prefix = '../'.repeat(depth);
    const path = `${prefix}${filename}`;
    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.text();
      })
      .then(html => {
        const target = document.getElementById(targetId);
        if (target) {
          target.innerHTML = html;
        } else {
          console.warn(`Élément #${targetId} introuvable pour injecter le header.`);
        }
      })
      .catch(() => {
        if (depth < maxDepth) {
          tryPath(depth + 1);
        } else {
          console.error(`Échec du chargement de ${filename} après ${maxDepth} tentatives.`);
        }
      });
  }

  tryPath(0);

}