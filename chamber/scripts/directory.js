const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});

const gridBtn = document.getElementById("grid");
const listBtn = document.getElementById("list");
const container = document.getElementById("companies");

async function fetchCompanies() {
  try {
    const response = await fetch("data/members.json"); // Adjust path if needed
    if (!response.ok) throw new Error("Network error");
    const companies = await response.json();
    displayCompanies(companies);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function displayCompanies(companies) {
  container.innerHTML = "";
  companies.forEach(company => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${company.logo}" alt="${company.name} Logo" width="80"><br>
      <strong>${company.name}</strong><br>
      <p><strong>Description : </strong>${company.description}</p>
      <p><strong>Address:</strong> ${company.address}<br>
         <strong>Phone:</strong> ${company.phone}<br>
         <strong>Website:</strong> <a href="${company.website}" target="_blank">${company.website}</a><br>
         <strong>Membership:</strong> ${company.membershipLevel}<br>
         <strong>Location:</strong> ${company.location}</p>
    `;
    container.appendChild(div);
  });
}

gridBtn.addEventListener("click", () => container.className = "grid");
listBtn.addEventListener("click", () => container.className = "list");

fetchCompanies();



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
            <p><strong>Date:</strong> ${item.date}</p>
            <p>${item.content}</p>
        </div>
    `).join('');


   const myTown = document.querySelector('#town');
const weathericon = document.querySelector('#graphic');
const description = document.querySelector('#description');
const temperature = document.querySelector('#temperature');

// Your API credentials and location
const myKey = "fa51adddeaeb447604f750ef9f7eb3f3";
const myLat = "49.752146489351716";
const myLong = "6.651155582360723";

// Construct the API URL
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;

// Fetch weather data and display it
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // For debugging
      displayResults(data); // This now works!
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log("Fetch error:", error);
    alert("Weather data couldn't load. Please try again later.");
  }
}

// Display weather info in HTML
function displayResults(data) {
  myTown.textContent = data.name;
  weathericon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weathericon.alt = data.weather[0].description;
  description.textContent = data.weather[0].description;
  temperature.textContent = `${data.main.temp}°F`;

  const weatherTitle = `${data.name} Weather — ${data.weather[0].description}, ${data.main.temp}°F`;
  document.getElementById("weather-title").textContent = weatherTitle;
}

// Call the function to fetch data
apiFetch();




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
        Powered by <a href="https://www.jonathanmuembia.com" target="_blank">Jonathan Muembia</a><br>
        Last updated: <span id="last-modified">${document.lastModified}</span>`;
    }
});