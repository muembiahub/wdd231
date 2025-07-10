// this script populates the json data for the directory page.
// It uses the Fetch API to retrieve data from a JSON file and dynamically generates HTML content.
async function fetchMembers() {
  try {
    const response = await fetch('data/members.json'); 
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error('Error fetching members:', error);
  }
}

function displayMembers(data) {
  const container = document.querySelector('.members');
  container.innerHTML = ''; // Clear any previous content

  data.forEach(member => {
    const memberElement = document.createElement('div');
    // add class to the member element 
    memberElement.classList.add('member-card');
    memberElement.innerHTML = `
      <h2>${member.name}</h2>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> ${member.phone}</p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
      <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
      <p><strong>Description:</strong> ${member.description}</p>
      <p><strong>Logo:</strong> <img src="${member.logo}" alt="${member.name} logo" style="width:100px;height:auto;"></p>
        <p><strong>Location:</strong> ${member.location}</p>
    `;
    container.appendChild(memberElement);
  })
}

fetchMembers();


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
// This script populates the directory page with data from the provided arrays and objects.
// It dynamically generates HTML content for the address, news, events, weather, world time zones
const weather = {
    location: "Lubumbashi, Democratic Republic of Congo",
    current: {
        temperature: 68,
        description: "Sunny",
        humidity: 30,
        windSpeed: 5
    },
    forecast: [
        {
            day: "Monday",
            high: 70,
            low: 50,
            description: "Partly cloudy"
        },
        {
            day: "Tuesday",
            high: 75,
            low: 55,
            description: "Sunny"
        }
    ]
};

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
// social media icons.
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

    // Weather
    const weatherContainer = document.querySelector('.weather');
    weatherContainer.innerHTML += `
        <p><strong>Description:</strong> ${weather.current.description}</p>
        <p>High: <span class="weather-high">${weather.forecast[0].high}°F</span></p>
        <p>Low: <span class="weather-low">${weather.forecast[0].low}°F</span></p>
        <p>Humidity: <span class="weather-humidity">${weather.current.humidity}%</span></p>
    `;

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