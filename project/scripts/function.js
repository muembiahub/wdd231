// Function to inject the header on all pages
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

// Function to inject the footer on all pages
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
          console.warn(`Élément #${targetId} introuvable pour injecter le footer.`);
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

// Function to inject the favicon dynamically
function injectFavicon(path = "images/favicon.ico") {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = path;
  link.type = "image/x-icon";
  document.head.appendChild(link);
}

// Function to inject the title dynamically
function injectTitle() {
  const title = document.createElement("title");
  title.textContent = getPageName();
  document.head.appendChild(title);

  if (document.querySelector("#pageTitle")) {
    document.querySelector("#pageTitle").textContent = getPageName();
  }
}

// Function to get the current page name
function getPageName() {
  return window.location.pathname.split("/").pop().replace(".html", "");
}

// Function to inject cards on the homepage
function injectHomePageCard(jsonPath = "../project/data/categories.json", containerId = "categoryHomepage") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`⚠️ Conteneur #${containerId} introuvable.`);
    return;
  }

  fetch(jsonPath)
    .then(response => {
      if (!response.ok) throw new Error(`Fichier JSON introuvable : ${jsonPath}`);
      return response.json();
    })
    .then(data => {
      const categories = data.categories;
      if (!Array.isArray(categories)) {
        throw new Error("Le fichier JSON doit contenir un tableau 'categories'.");
      }

      if (categories.length === 0) {
        container.innerHTML = `<p class="fallback">Aucune catégorie disponible pour le moment.</p>`;
        return;
      }

      categories.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";

        const logo = item.logo || "images/default.webp";
        const category = item.category || "Service";
        const description = item.description || "Description indisponible.";
        const pageUrl = item.page_url || "#";

        card.innerHTML = `
          <img src="${logo}" alt="${category}">
          <h3>${category}</h3>
          <p>${description}</p>
          <a href="${pageUrl}" class="view-button">Consulter</a>
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
        }, index * 1050);
      });
    })
    .catch(error => {
      console.error("💥 Erreur lors du chargement du JSON :", error);
      container.innerHTML = `
        <div class="error-message">
          <p>📦 Le contenu de la page d’accueil est temporairement indisponible.</p>
          <p style="font-style: italic;">Veuillez vérifier le fichier JSON ou réessayer plus tard.</p>
        </div>
      `;
    });
}

// Function to load cards dynamically from JSON
function loadCards(jsonPath) {
  const pageName = getPageName();

  fetch(jsonPath)
    .then(res => res.ok ? res.json() : Promise.reject(`Fichier introuvable : ${jsonPath}`))
    .then(data => {
      Object.values(data).flat().forEach(item => {
        const cardHTML = createCard(item, pageName);
        document.querySelector("#category").insertAdjacentHTML("beforeend", cardHTML);
      });
    })
    .catch(err => {
      console.error("Erreur :", err);
      document.querySelector("#category").innerHTML = `<p>Contenu indisponible pour cette page.</p>`;
    });
}

// Function to create a card's HTML
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
// Existing functions like injectHeader, injectFooter, etc.
// ...

// Function to inject a form
function injectForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "formContainer";
  formContainer.innerHTML = `
    <form id="contactForm">
      <label for="name">Nom:</label>
      <input type="text" id="name" name="name" required>
      <label for="clientEmail">Email:</label>
      <input type="email" id="clientEmail" name="clientEmail" required>
      <label for="message">Message:</label>
      <textarea id="message" name="message" required></textarea>
      <button type="submit">Envoyer</button>
    </form>
  `;
  document.body.appendChild(formContainer);
}

// Function to inject a confirmation banner
function injectConfirmationBanner() {
  const banner = document.createElement("div");
  banner.id = "confirmationBanner";
  banner.style.display = "none";
  banner.style.background = "#e6ffe6";
  banner.style.border = "1px solid #00aa00";
  banner.style.padding = "1em";
  banner.style.textAlign = "center";
  banner.style.margin = "1em auto";
  banner.style.maxWidth = "600px";
  banner.style.fontFamily = "sans-serif";
  banner.style.borderRadius = "8px";
  banner.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  banner.innerHTML = `
    <h3>🙏 Merci pour votre demande !</h3>
    <p>Votre message a été transmis avec succès.</p>
    <p>Un agent Kazidomo vous contactera sous peu.</p>
  `;

  const target = document.querySelector("#category") || document.body;
  target.parentElement.insertBefore(banner, target);
}

// Function to set up the modal
function setupModal() {
  const modal = document.querySelector("#contactAgentModal");
  const dragHandle = document.querySelector("#modalHeader");

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

// Function to set up GPS detection
function setupGPS() {
  const detectBtn = document.querySelector("#detectGPS");
  const gpsInput = document.querySelector("#gps");
  const mapUrlInput = document.querySelector("#mapUrl");

  detectBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = {
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
        map_url: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
      };

      gpsInput.value = `${coords.latitude}, ${coords.longitude}`;
      mapUrlInput.value = coords.map_url;

      renderResponsiveMap(coords.map_url, document.querySelector("#gpsMapContainer"));

      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
}

// Function to set up form validation
function setupFormValidation() {
  const form = document.querySelector("#contactForm");
  const modal = document.querySelector("#contactAgentModal");
  const banner = document.querySelector("#confirmationBanner");
  const requiredFields = ["#name", "#clientEmail", "#clientWhatsApp", "#message"].map(selector => document.querySelector(selector));

  form?.addEventListener("submit", async e => {
    e.preventDefault();

    const missing = requiredFields.filter(field => !field?.value.trim());
    if (missing.length > 0) {
      alert("📌 Remplis tous les champs avant d’envoyer.");
      return;
    }

    const formData = {
      name: document.querySelector("#name").value.trim(),
      client_email: document.querySelector("#clientEmail").value.trim(),
      client_whatsapp: document.querySelector("#clientWhatsApp").value.trim(),
      gps: document.querySelector("#gps").value.trim(),
      map_url: document.querySelector("#mapUrl")?.value.trim(),
      message: document.querySelector("#message").value.trim(),
      category: selectedCategory,
      price: selectedPrice
    };

    console.log("📤 Données à envoyer :", formData);

    const success = await sendToSupabase(formData);

    if (success) {
      modal.style.display = "none";
      banner.style.display = "block";

      setTimeout(() => {
        banner.style.display = "none";
        form.reset();
      }, 10000);
    }
  });
}

// Function to inject a page-specific search bar
function injectPageSearch(pageName) {
  const wrapper = document.createElement("div");
  wrapper.className = "search-wrapper";
  wrapper.style.cssText = `
    position: fixed;
    top: 9vh;
    right: 10px;
    z-index: 9999;
    display: flex;
    gap: 5px;
    padding: 0.5em;
    align-items: center;
  `;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `🔍 Rechercher dans ${pageName}...`;
  input.style.cssText = `
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
    flex: 1;
  `;

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "❌";
  clearBtn.style.cssText = `
    font-size: 1em;
    cursor: pointer;
    background: none;
    border: none;
  `;

  const message = document.createElement("div");
  message.textContent = "Aucun résultat trouvé.";
  message.style.cssText = `
    position: fixed;
    top: calc(9vh + 50px);
    right: 10px;
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.5em 1em;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    font-size: 0.9em;
    display: none;
    z-index: 9999;
  `;

  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  document.body.appendChild(wrapper);
  document.body.appendChild(message);

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const targets = document.querySelectorAll(`[data-page="${pageName}"]`);
    let found = false;

    targets.forEach(el => {
      const text = el.textContent.toLowerCase();
      const match = text.includes(query);
      el.style.display = match ? "" : "none";
      el.style.backgroundColor = match ? "#1a7ec0ff" : "";
      if (match) found = true;
    });

    message.style.display = query && !found ? "block" : "none";
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    resetHighlights();
    message.style.display = "none";
  });

  function resetHighlights() {
    document.querySelectorAll(`[data-page="${pageName}"]`).forEach(el => {
      el.style.display = "";
      el.style.backgroundColor = "";
    });
  }
}

