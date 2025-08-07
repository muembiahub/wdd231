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
      card.className = "testimonial-card";
      card.innerHTML = `
        <p><img src="${person.image}" alt="${person.name}"</p>
        <h3>${person.name}</h3>
        <p><strong>${person.quote}</strong></p>
        <p>${person.location} <br><em>${person.service}</em></p>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => console.error("Error loading testimonials:", error));




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