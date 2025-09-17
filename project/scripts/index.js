document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("category");

  fetch("data/categories.json")
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data.categories)) {
        throw new Error("Le fichier JSON doit contenir un tableau 'categories'.");
      }

      data.categories.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${item.logo}" alt="${item.category}">
          <h3>${item.category}</h3>
          <p>${item.description}</p>
          <a href="${item.page_url}" class="view-button">Consulter</a>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
      container.innerHTML = `<p class="error">Impossible de charger les données.</p>`;
    });
});