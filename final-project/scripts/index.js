const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
	navigation.classList.toggle('open');
	hamButton.classList.toggle('open');
});

fetch("data/community-voices.json")
  .then(response => response.json())
  .then(testimonials => {
    const container = document.getElementById("testimonials");

    testimonials.forEach(person => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${person.image}" alt="${person.name}" loading="lazy">
        <h3>${person.name}</h3>
        <p class="address"><strong>Adresse : ${person.location}</strong></p>
        <p class="service"><strong>Service : ${person.service}</strong></p>
        <p class="quote"><strong>${person.quote}</strong></p>
      `;

      container.appendChild(card);
    });
  })
  .catch(error => console.error("Error loading testimonials:", error));



  // Load items from JSON and display them service page html 
  fetch("data/health-services.json")
    .then(response => response.json())
    .then(services => {
      const container = document.getElementById("services");

      services.forEach(service => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <h3>${service.name}</h3>
          <img src="${service.image}" alt="${service.name}" loading="lazy">
          
          <p class="quote"><strong> Introduction : </strong>${service.quote}</p>
          <p class="address"><strong>Address:</strong> ${service.address}</p>
          <p class="service"><strong>Treatment:</strong> ${service.service}</p>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading services:", error));

  

// Directory functionality  
const currentPage = location.pathname.split("/").pop(); 
document.querySelectorAll(".navigation a").forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});






document.addEventListener("DOMContentLoaded", () => {
  fetch("data/footercontent.json")
    .then(response => response.json())
    .then(data => renderFooter(data))
    .catch(error => console.error("Footer load error:", error));
});

function renderFooter(data) {
  const footer = document.querySelector(".footer-content");
  if (!footer) {
    console.error("Footer element not found");
    return;
  }
  

  // 📍 Address
  footer.innerHTML += `<p class="address">${data.organization} | ${data.location.city}, ${data.location.country}</p>`;

  // 🌐 Social Media Icons
  const socialDiv = document.createElement("div");
  socialDiv.className = "social-icons";
  socialDiv.style.margin = "10px 0";
  data.socialMedia.forEach(platform => {
    const a = document.createElement("a");
    a.href = platform.url;
    a.target = "_blank";
    a.title = platform.name;

    const img = document.createElement("img");
    img.src = platform.icon;
    img.alt = `${platform.name} icon`;
    img.width = 32;
    img.height = 32;
    img.loading = "lazy";
    img.style.marginRight = "8px";

    a.appendChild(img);
    socialDiv.appendChild(a);
  });
  footer.appendChild(socialDiv);

  // 📍 Location & Availability
  footer.innerHTML += `<p>📍 ${data.location.note}</p>`;
  footer.innerHTML += `<p>🕒 Availability: ${data.availability.days} — ${data.availability.hours}</p>`;

  // 📄 Legal Links
  footer.innerHTML += `
    <p style="margin-top: 10px;">
      <a href="${data.legal.privacyPolicy}">Privacy Policy</a> —
      <a href="${data.legal.termsOfUse}">Terms of Use</a>
    </p>
  `;

  // © Copyright & Credits
  const copyright = document.createElement("p");
  copyright.className = "copyright";
  const year = new Date().getFullYear();
  const lastModified = document.lastModified;

  copyright.innerHTML = `
    <style>
      .copyright {
        font-size: 0.8rem;
        color: #000;
        border-top: #0e120fff 1px solid;
        padding-top: 0.5rem;
        margin-top: 10px;
      }
    </style>
    &copy; ${year} ${data.organization}. All rights reserved.<br>
    Powered by <a href="${data.credits.poweredBy.url}" target="_blank">${data.credits.poweredBy.name}</a><br>
    Last updated: ${lastModified}
  `;
  footer.appendChild(copyright);

  // Inject into page
  document.body.appendChild(footer);
}



// Visit Message 

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



//2. Références du modal

const gpsInput = document.getElementById('gps');
const detectBtn = document.getElementById('detectGPS');
const mapContainer = document.getElementById('map');
const mapStatus = document.getElementById('mapStatus');
let mapInstance = null;

if (detectBtn) {
  detectBtn.addEventListener('click', () => {
    if ("geolocation" in navigator) {
      // Show loading message
      mapStatus.innerHTML =  "📡 Locating<span class='dots'>...</span>";

      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const gpsCoords = `${lat}, ${lon}`;
        const mapURL = `https://www.google.com/maps?q=${lat},${lon}`;

        if (gpsInput) gpsInput.value = gpsCoords;

        detectBtn.disabled = true;
        detectBtn.textContent = "✅ Location detected";

        // Initialize or update map
        if (!mapInstance) {
          mapInstance = L.map('map').setView([lat, lon], 15);

          // Wait for tiles to load before hiding status
          mapInstance.on('load', () => {
            mapStatus.textContent = "";
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(mapInstance);
        } else {
          mapInstance.setView([lat, lon], 15);
          mapStatus.textContent = ""; // Hide status immediately if map already exists
        }

        // Add marker
        L.marker([lat, lon]).addTo(mapInstance)
          .bindPopup("📍 You are here")
          .openPopup();

      }, error => {
        mapStatus.textContent = "";
        alert("⚠️ Unable to retrieve your location.");
      });
    } else {
      alert("🛑 Geolocation is not supported by your browser.");
    }
  });
}