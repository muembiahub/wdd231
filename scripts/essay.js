// Select HTML elements
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
}

// Call the function to fetch data
apiFetch();


const spotlightContainer = document.querySelector('.spotlight-card-container');

// Sample JSON data (you'd typically fetch this)
const chamberData = data/members.json

// Filter spotlight-worthy members (e.g. Gold only)
const spotlightMembers = chamberData.members.filter(member => member.membership === "Gold");

// Shuffle & pick random 1 or 2
const shuffled = spotlightMembers.sort(() => 0.5 - Math.random());
const selected = shuffled.slice(0, 2); // adjust quantity here

// Render spotlight cards
selected.forEach(member => {
  const card = document.createElement('div');
  card.classList.add('spotlight-card');
  card.innerHTML = `
    <img src="${member.image}" alt="${member.name} logo">
    <h3>${member.name}</h3>
    <p class="membership">${member.membership} Member</p>
    <p>${member.description}</p>
    <a href="${member.url}" target="_blank">Visit Site</a>
  `;
  spotlightContainer.appendChild(card);
});