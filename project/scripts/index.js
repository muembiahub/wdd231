


document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const dotContainer = document.getElementById("dotContainer");

  let currentIndex = 0;
  const cards = [];

  fetch("data/categories.json")
    .then(res => res.json())
    .then(data => {
      const categories = data.categories;

      if (!Array.isArray(categories)) {
        throw new Error("Le JSON doit contenir un tableau 'categories'.");
      }

      categories.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = index;

        card.innerHTML = `
          <a href="${item.page_url}" target="_self">
            <img src="${item.logo}" alt="${item.category}">
            <h3>${item.category}</h3>
            <p><strong>${item.description}</strong></p>
          </a>
        `;

        track.appendChild(card);
        cards.push(card);

        const dot = document.createElement("div");
        dot.className = "dot";
        dot.dataset.index = index;
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => updateCarousel(index));
        dotContainer.appendChild(dot);
      });

      updateCarousel(0);

      document.querySelector(".nav-arrow.left")?.addEventListener("click", () => {
        updateCarousel(Math.max(currentIndex - 1, 0));
      });

      document.querySelector(".nav-arrow.right")?.addEventListener("click", () => {
        updateCarousel(Math.min(currentIndex + 1, cards.length - 1));
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
      track.innerHTML = `<p class="error">Impossible de charger les catégories.</p>`;
    });

  function updateCarousel(index) {
    currentIndex = index;

    cards.forEach((card, i) => {
      card.className = "card"; // Reset all classes

      if (i === index) card.classList.add("center");
      else if (i === index - 1) card.classList.add("left-1");
      else if (i === index - 2) card.classList.add("left-2");
      else if (i === index + 1) card.classList.add("right-1");
      else if (i === index + 2) card.classList.add("right-2");
      else card.classList.add("hidden");
    });

    document.querySelectorAll(".dot").forEach(dot => {
      dot.classList.remove("active");
    });

    const activeDot = document.querySelector(`.dot[data-index="${index}"]`);
    if (activeDot) activeDot.classList.add("active");
  }
});