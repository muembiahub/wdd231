document.addEventListener('DOMContentLoaded', () => {
// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (toggle) {
  toggle.addEventListener('click', () => {
    navList.classList.toggle('show');
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navList.classList.remove('show');
    }
  });
});




  const btn = document.getElementById('downloadCV');

  if (btn) {
    const msg = document.createElement('p');
    msg.style.color = 'green';
    msg.style.fontWeight = 'bold';
    msg.style.display = 'none';
    btn.after(msg);

    btn.addEventListener('click', () => {
      // Crée un lien invisible avec l'attribut download
      const link = document.createElement('a');
      link.href = '/data/jonathanmuembiacv.pdf';
      link.download = 'Jonathan_Muembia_CV.pdf'; // nom du fichier téléchargé
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Message de confirmation
      msg.textContent = '✅ My Resume is downloaded';
      msg.style.fontSize = '1.2rem';
      msg.style.marginTop = '0.5rem';
      msg.style.display = 'block';
    });
  }




// Contact form (demo)
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const payload = Object.fromEntries(data.entries());
  console.log('Contact form submitted:', payload);
  alert('Thanks! Your message has been sent (demo).');
  e.target.reset();
});


// Créer le footer
const footer = document.createElement("footer");

// Contenu du footer
const yearDiv = document.createElement("div");
yearDiv.id = "year";
yearDiv.innerHTML = `<p><i class="fa-regular fa-copyright"></i> 
  ${new Date().getFullYear()} Jonathan M. Muembia</p>`;

const infoDiv = document.createElement("div");
infoDiv.innerHTML = `
  <p id="bolt"><i class="fa-solid fa-bolt"></i> Propulsé par 
    <a href="https://kazidomo.com/muembiahub/portifio.html" target="_blank">Muembia Hub</a>
  </p>
  <p id="globe"><i class="fa-solid fa-globe"></i> Designed by Muembia Designer</p>
  <p id="halved"><i class="fa-solid fa-shield-halved"></i> Tous droits réservés</p>
`;

// Créer le bouton WhatsApp
const chatButton = document.createElement("button");
chatButton.id = "kazidomo-chat-btn";
chatButton.ariaLabel = "Ouvrir le chat";
chatButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';

// Action au clic
chatButton.addEventListener("click", () => {
  window.open("whatsapp://send?phone=+243831709022&text=Bonjour", "_blank");
});

// Ajouter les éléments au footer
footer.appendChild(yearDiv);
footer.appendChild(infoDiv);
footer.appendChild(chatButton);

// Ajouter le footer au body
document.body.appendChild(footer);

// Afficher le bouton après 2 minutes
setTimeout(() => {
  chatButton.style.display = "inline-block";

  // Ensuite lancer le cycle répétitif
  setInterval(() => {
    // Disparaît après 1 minute
    chatButton.style.display = "none";

    // Réapparaît après 4 secondes
    setTimeout(() => {
      chatButton.style.display = "inline-block";
    }, 2000);

  }, 4000); // 1 minute (60000 ms) + 4 secondes (4000 ms) = 64000 ms
}, 20000); // 120000 ms = 2 minutes


});