document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const dotContainer = document.getElementById("dotContainer");

  let currentIndex = 0;
  let cards = [];

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
        card.setAttribute("data-index", index);

        card.innerHTML = `
          <a href="${item.page_url}" target="_self">
            <img src="${item.logo}" alt="${item.category}">
            <h3>${item.category}</h3>
          </a>
        `;

        track.appendChild(card);
        cards.push(card);

        const dot = document.createElement("div");
        dot.className = "dot";
        dot.setAttribute("data-index", index);
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => updateCarousel(index));
        dotContainer.appendChild(dot);
      });

      updateCarousel(0);

      document.querySelector(".nav-arrow.left").addEventListener("click", () => {
        updateCarousel(Math.max(currentIndex - 1, 0));
      });

      document.querySelector(".nav-arrow.right").addEventListener("click", () => {
        updateCarousel(Math.min(currentIndex + 1, cards.length - 1));
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du JSON :", error);
    });

  function updateCarousel(index) {
    currentIndex = index;

    cards.forEach((card, i) => {
      card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

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
    document.querySelector(`.dot[data-index="${index}"]`).classList.add("active");
  }
});