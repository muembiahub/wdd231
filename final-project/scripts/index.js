const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});

const gridBtn = document.getElementById("grid");
const listBtn = document.getElementById("list");
const container = document.getElementById("companies");

// Basculer entre grid et list
gridBtn.addEventListener("click", () => {
  container.className = "grid";
});
listBtn.addEventListener("click", () => {
  container.className = "list";
});

async function fetchData() {
  try {
    const response = await fetch("data/categories.json");
    if (!response.ok) throw new Error("Network response failed");
    const data = await response.json();

    displayCompanies(data.categories);
    displayImages(data.images);
  } catch (err) {
    console.error("Data fetch error:", err);
    container.innerHTML = `<p>Error loading data.</p>`;
  }
}

function displayCompanies(categories) {
  container.innerHTML = "";
  categories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${cat.logo}" alt="Logo ${cat.category}">
      <div>
        <h3><a href="${cat.page_url}" target="_blank">${cat.category}</a></h3>
      </div>
    `;
    container.appendChild(card);
  });
}

function displayImages(images = []) {
  const extraImagesDiv = document.getElementById("extra-images");
  if (!extraImagesDiv) return;
  extraImagesDiv.innerHTML = "";

  images.forEach(img => {
    const el = document.createElement("img");
    el.src = img;
    el.alt = "Extra";
    el.width = 60;
    el.height = 60;
    extraImagesDiv.appendChild(el);
  });
}

// Charger les données au lancement
fetchData();

const url = 'data/top_categories.json';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const top_categories = data.top_categories;
    const cards = document.querySelector('#top-categories');

    top_categories.forEach(top_categorie => {
      const card = document.createElement('section');
      card.setAttribute('class', 'card');

      const h2 = document.createElement('h2');
      h2.textContent = `${top_categorie.category}`;
      card.appendChild(h2);


      const image = document.createElement('img');
      image.setAttribute('src', top_categorie.page_url);
      image.setAttribute('alt', ` ${top_categorie.logo}`);
    card.appendChild(image);
    // Make the image responsive with inline styles


      cards.appendChild(card);
    });
  })
  // Handle errors
  .catch(error => console.error('Error fetching data:', error));


