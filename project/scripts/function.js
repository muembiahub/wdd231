// Helper function for querySelector
function $(selector) {
  return document.querySelector(selector);
}

// Helper function for querySelectorAll
function $$(selector) {
  return document.querySelectorAll(selector);
}

// Function to load a file and inject its content into a target element
function loadFile(targetId, filename, maxDepth = 5) {
  function tryPath(depth) {
    const prefix = '../'.repeat(depth);
    const path = `${prefix}${filename}`;
    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.text();
      })
      .then(html => {
        const target = $(`#${targetId}`);
        if (target) {
          target.innerHTML = html;
        } else {
          console.warn(`Élément #${targetId} introuvable pour injecter le contenu de ${filename}.`);
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

// Function to inject the header
function injectHeader(targetId = 'header', filename = 'header.html', maxDepth = 5) {
  loadFile(targetId, filename, maxDepth);
}

// Function to inject the footer
function injectFooter(targetId = 'footer', filename = 'footer.html', maxDepth = 5) {
  loadFile(targetId, filename, maxDepth);
}

// Function to load category cards from a JSON file
function loadCategoryCards(jsonPath = "../project/data/categories.json", containerId = "categoryHomepage") {
  const container = $(`#${containerId}`);
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

        // Add animation
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.filter = "blur(4px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease";

        container.appendChild(card);

        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.filter = "blur(0)";
        }, index * 1050); // Staggered delay
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
    });
}

// Function to inject the contact agent form
function injectForm(formPath = "contact-form.html") {
  fetch(formPath)
    .then(response => response.text())
    .then(html => {
      const formContainer = document.createElement("div");
      formContainer.innerHTML = html;
      document.body.appendChild(formContainer);
      setupModal(); // Call setupModal after injecting the form
    })
    .catch(error => {
      console.error("Erreur lors du chargement du formulaire :", error);
    });
}

// Function to set up the modal
function setupModal() {
  const modal = $("#contactAgentModal");
  const dragHandle = $("#modalHeader");

  if (!modal || !dragHandle) {
    console.error("Modal or drag handle not found.");
    return;
  }

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  dragHandle.addEventListener("mousedown", e => {
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

  $$(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  });

  window.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
}