const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});




fetch('data/membershipLevel.json')
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector('.membership-cards');

    data.forEach(membership => {
      const card = document.createElement('div');
      card.className = 'membership';

      const title = document.createElement('h3');
      title.textContent = membership.title;
      card.appendChild(title);

      const viewBtn = document.createElement('button');
      viewBtn.textContent = 'View More';
      viewBtn.className = 'view-more-btn';

      const list = document.createElement('ul');
      list.className = 'membership-description';
      list.style.display = 'none'; // Initially hidden

      membership.description.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });

      viewBtn.addEventListener('click', () => {
        const isVisible = list.style.display === 'block';
        list.style.display = isVisible ? 'none' : 'block';
        viewBtn.textContent = isVisible ? 'View More' : 'View Less';
      });

      card.appendChild(viewBtn);
      card.appendChild(list);
      container.appendChild(card);
    });
  })
  .catch(error => console.error('Error loading memberships:', error));






document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // Auto-generate timestamp if field exists
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    const now = new Date();
    timestampField.value = now.toLocaleString(); // Customize format if needed
  }

  // Handle form submission and store data
  if (form) {
    form.addEventListener("submit", function () {
      const fields = ["firstName", "lastName", "email", "mobile", "businessName", "timestamp"];

      fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          localStorage.setItem(id, input.value);
        }
      });
    });
  }

  // Display data on thankyou.html
  const dataDisplayIds = {
    showFirstName: "firstName",
    showLastName: "lastName",
    showEmail: "email",
    showMobile: "mobile",
    showBusinessName: "businessName",
    showTimestamp: "timestamp"
  };

  for (const [spanId, storedKey] of Object.entries(dataDisplayIds)) {
    const outputElement = document.getElementById(spanId);
    const value = localStorage.getItem(storedKey);

    if (outputElement && value) {
      outputElement.textContent = value;
    }
  }

  // Optionally clear localStorage after displaying
  // localStorage.clear();
});


// animation on thankfull page after submit form

 window.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    container.classList.add("visible");

    // Trigger confetti burst
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random()}s`;
      container.appendChild(confetti);
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
        <p><h2>${item.name}</h2>
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