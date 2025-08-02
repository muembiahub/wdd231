const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});




 async function loadItems() {
    try {
      const response = await fetch('data/interest-erea.json'); // adjust path if needed
      if (!response.ok) throw new Error('Failed to load items');
      const items = await response.json();

      const container = document.getElementById('allplaces');
      container.innerHTML = ''; // Clear any existing content

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <h3>${item.name}</h3>
          <p><strong> Description:</strong> ${item.description}</p>
          <p><strong>Address:</strong> ${item.address}</p>
          
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  loadItems();






  (function () {
  const messageContainer = document.getElementById("visit-message");
  const lastVisitKey = "lastVisitDate";
  const now = new Date();
  const storedDate = localStorage.getItem(lastVisitKey);

  let message = "";

  if (!storedDate) {
    // First visit
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const previousDate = new Date(storedDate);
    const timeDiff = now - previousDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 1) {
      message = "Back so soon! Awesome!";
    } else if (daysDiff === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${daysDiff} days ago.`;
    }
  }

  // Display the message
  messageContainer.textContent = message;

  // Update localStorage with current visit
  localStorage.setItem(lastVisitKey, now.toISOString());
})();











// 

const currentPage = location.pathname.split("/").pop(); // e.g. 'about.html'
document.querySelectorAll(".navigation a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});






const address = [
    {
        name: "Kazidomo Chamber of Commerce",
        address: "546 Industrial Way, Lubumbashi, ID 576440",
        phone: "(243) 83170-1234",
        website: "https://www.kazidomo.com",
        email: "info@kazidomo.com"
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
        Powered by <a href="https://www.jonathanmuembia.com" target="_blank">Jonathan Muembia</a><br>
        Last updated: <span id="last-modified">${document.lastModified}</span>`;
    }
});