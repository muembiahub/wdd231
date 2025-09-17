fetch('data/about.json')
  .then(response => response.json())
  .then(data => {
    injectAbout(data.plateforme);
    injectServices(data.plateforme);
  });

function injectAbout(data) {
  const section = document.getElementById("about-section");

  section.innerHTML = `
    <h2>Plateforme communautaire et annuaire de services</h2>
    <p><strong>${data.nom}</strong> est une application mobile et plateforme web qui met en relation les talents locaux avec leur communauté.</p>
    <p>${data.description}</p>
    <p><strong>Notre mission :</strong> ${data.mission}</p>
    <p><strong>Notre philosophie :</strong> ${data.philosophie}</p>
<p><strong>Localisation :</strong> ${data.localisation.ville}, ${data.localisation.province}, ${data.localisation.pays}</p>
    <p><strong>Disponibilité :</strong> ${data.disponibilite}</p>
    <p><strong>Nos valeurs :</strong></p>
    <ul>
      ${data.valeurs.map(val => `<li>${val}</li>`).join("")}
    </ul>
  `;
}

function injectServices(data) {
  const section = document.getElementById("services-section");
  section.innerHTML = ``;
  data.services.forEach(service => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.borderLeft = `6px solid ${service.overlay.couleur}`;
    card.style.padding = "1em";
    card.style.marginBottom = "1em";
    card.style.background = "#f9f9f9";
    card.style.borderRadius = "8px";

    card.innerHTML = `
      <i class="${service.icone}" style="font-size: 24px; color: ${service.overlay.couleur};"></i>
      <h4>${service.nom}</h4>
      <p>${service.description}</p>
      <span style="background:${service.overlay.couleur}; color:white; padding:4px 8px; border-radius:4px;">
        ${service.overlay.badge}
      </span>
      <small style="display:block; margin-top:4px; color:#555;">${service.overlay.symbolique}</small>
    `;

    section.appendChild(card);
  });
}