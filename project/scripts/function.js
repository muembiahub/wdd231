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


// 
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
function injectFooter (targetId = 'footer', filename = 'footer.html', maxDepth = 5){
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