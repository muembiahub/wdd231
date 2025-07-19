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



async function fetchData() {
  try {
    const response = await fetch("data/top_categories.json");
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


const address = [
    {
        name: "Kazidomo Chamber of Commerce",
        address: "546 Industrial Way, Lubumbashi, ID 576440",
        phone: "(243) 83170-1234",
        website: "https://www.kazidomo.com",
        email: "info@kazidomo.com"
    }
];
const news = [
    {
        title: "New Chamber of Commerce Website Launched",
        date: "2023-10-01",
        content: "We are excited to announce the launch of our new website, designed to better serve our members and the community."
    },
    {
        title: "Annual Business Expo Coming Soon",
        date: "2023-10-15",
        content: "Join us for our annual business expo on November 5th. It's a great opportunity to network and showcase your business."
    }
];


















// worldTimeZones is an array of objects, each representing a city with its time zone and current time.
// It is used to display the current time in different parts of the world.
const worldTimeZones = [
    {
        city: "New York",
        timeZone: "America/New_York",
        currentTime: "2023-10-01T12:00:00-04:00"
    },
    {
        city: "London",
        timeZone: "Europe/London",
        currentTime: "2023-10-01T17:00:00+01:00"
    },
    {
        city: "Tokyo",
        timeZone: "Asia/Tokyo",
        currentTime: "2023-10-02T02:00:00+09:00"
    }
];

// The data is rendered into the HTML structure of the directory page using JavaScript.
// socialIcons is an array of objects, each representing a social media platform with its URL and icon.
// It is used to display social media links on the directory page.
const socialIcons = [
    {
        platform: "Facebook",
        url: "https://facebook.com/kazidomo",
        icon: "images/facebook.svg"
    },
    {
        platform: "Twitter",
        url: "https://twitter.com/kazidomo",
        icon: "images/linkedin.svg"
    },
    {
        platform: "Instagram",
        url: "https://instagram.com/kazidomo",
        icon: "images/instagram.svg"
    }
];

// This script dynamically populates the directory page with data from the provided arrays and objects.
// It uses the DOMContentLoaded event to ensure the HTML is fully loaded before executing the script
// and renders the address, news, events, weather, world time zones, social media icons, and copyright information.
// It also includes the last updated date of the document.
document.addEventListener('DOMContentLoaded', () => {
    // Address
    const addressContainer = document.querySelector('.address');
    addressContainer.innerHTML = address.map(item => `
        <p><h4>${item.name}</h4>
        <p>${item.address}<br>
        <strong>Phone:</strong> ${item.phone}<br>
        <strong>Email:</strong> <a href="mailto:${item.email}">${item.email}</a><br>
        <strong>Website:</strong> <a href="${item.website}" target="_blank">${item.website}</a></p>
    `).join('');

    // News/Events (put news in .news, events in .event-list)
    const newsContainer = document.querySelector('.news');
    newsContainer.innerHTML += news.map(item => `
        <div class="news-item">
            <h3>${item.title}</h3>
            <p><strong>Date:</strong> ${item.date}<br>${item.content}</p>
        </div>
    `).join('');

    // World Time Zone (show first city as example)
    const worldTimeZoneContainer = document.querySelector('.world-time-zone');
    if (worldTimeZones.length > 0) {
        const zone = worldTimeZones[0];
        worldTimeZoneContainer.innerHTML += `
            <p>Location: <span class="location">${zone.city}</span></p>
            <p>Current Time: <span class="current-time">${zone.currentTime}</span></p>
            <p>Time Zone: <span class="time-zone">${zone.timeZone}</span></p>
        `;
    }

    // Social Icons
    const socialIconsContainer = document.querySelector('.social-icons');
    socialIconsContainer.innerHTML = `
        ${socialIcons.map(icon => `
            <a href="${icon.url}" target="_blank">
                <img src="${icon.icon}" alt="${icon.platform} icon" style="width:32px;height:32px;">
            </a>
        `).join('')}
    `;

    // Copyright and Last Updated
    const copyrightContainer = document.querySelector('.copyright');
    const currentYear = new Date().getFullYear();
    if (copyrightContainer) {
        copyrightContainer.innerHTML = `&copy; ${currentYear} Kazidomo . <br>
         All rights reserved.<br>
        Powered by <a href="https://www.byu.edu" target="_blank">BYU</a><br>
        Last updated: <span id="last-modified">${document.lastModified}</span>`;
    }
});