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

// === Titre dynamique ===
function injectTitle() {
  const title = document.createElement("title");
  title.textContent = getPageName();
  document.head.appendChild(title);

  if ($("#pageTitle")) {
    $("#pageTitle").textContent = getPageName();
  }
}



// function pour injecter CategoryCards sur Home page  sur Kazidomo.com
function injectHomePageCard(jsonPath = "../project/data/categories.json", containerId = "categoryHomepage") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Conteneur #${containerId} introuvable.`);
    return;
  }

  fetch(jsonPath)
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data.categories)) {
        throw new Error("Le fichier JSON doit contenir un tableau 'categories'.");
      }

      data.categories.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
         <img src="${item.logo}" alt="${item.category}">
          <h3>${item.category}</h3>
          <p>${item.description}</p>
          <a href="${item.page_url}" class="view-button">Consulter</a>
  `;

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.filter = "blur(4px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease";

        container.appendChild(card);

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.filter = "blur(0)";
        }, index * 1050); // décalage progressif
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
    });
}

// === 6. Chargement des cartes depuis JSON ===
function loadCards(jsonPath) {
  const pageName = getPageName();

  fetch(jsonPath)
    .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
    .then(data => {
      Object.values(data).flat().forEach(item => {
        const cardHTML = createCard(item, pageName);
        $("#category").insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch(err => {
      console.error("Erreur :", err);
      $("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
    });
}



// === 7. Génération HTML d’une carte ===
function createCard(item, pageName) {
  const title = item.category || item.type || item.title || "Service";
  const description = item.description || item.summary || "";
  const price = item.price || "—";
  const alt = item.alt || title;

  const imageName = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]/g, "") + ".webp";

  const image = `images/${imageName}`;

  return `
    <div class="card searchable" data-page="${pageName}">
      <img src="${image}" alt="${alt}">
      <h3>${title}</h3>
      <p>${description}</p>
      <p id="price"><strong> À partir de : ${price} $</strong></p>
      <button class="open-modal" data-category="${title}" data-price="${price}">
        <i class="fas fa-envelope"></i> Contacter un agent
      </button>
    </div>
  `;
}

// 
// === 4. Injection du formulaire ===
function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
     <div id="contactAgentModal" class="modal">
      <div class="modal-content">
      <div id="case">
       <div id="modalHeader">Déplacer ici</div>
       <button class="close-modal">Fermer</button>
      </div>
        <h3>Contacter un agent</h3>

        <form id="contactForm">
          <label for="name">Nom Complet :</label>
          <input type="text" id="name" required>

          <label for="clientEmail">Email :</label>
          <input type="email" id="clientEmail" required>

          <label for="clientWhatsApp">WhatsApp :</label>
          <input type="text" id="clientWhatsApp" required>

          <label for="gps">Ma position :</label>
          <input type="text" id="gps" readonly placeholder="Coordonnées GPS">
          <button type="button" id="detectGPS">📍 Détecter ma position</button>

          <!-- ✅ Champ caché pour stocker le lien Google Maps -->
          <input type="hidden" id="mapUrl">

          <!-- ✅ Conteneur pour afficher la carte -->
          <div id="gpsMapContainer"></div>

          <label for="message">Message :</label>
          <textarea id="message" rows="5" placeholder="Veuillez entrer votre message ici ou laisser votre préoccupation"></textarea>

          <button type="submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
        </form>
        <div class="confirmation-message" id="confirmationBanner" style="display: none;"></div>
      </div>
    </div>
  `;
  document.body.appendChild(formContainer);
}

function setupModal() {
  const modal = $("#contactAgentModal");

  const dragHandle = $("#modalHeader"); // Assure-toi que cet élément existe dans ton HTML

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle?.addEventListener("mousedown", e => {
    isDragging = true;
    const rect = modal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    modal.style.position = "absolute";
    modal.style.zIndex = 1000;
  });

  document.addEventListener("mousemove", e => {
    if (isDragging) {
      modal.style.left = `${e.clientX - offsetX}px`;
      modal.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("click", e => {
    if (e.target.classList.contains("open-modal")) {
      selectedCategory = e.target.dataset.category;
      selectedPrice = e.target.dataset.price;
      modal.style.display = "block";
    }
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal?.style.display === "block") {
      modal.style.display = "none";
    }
  });
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