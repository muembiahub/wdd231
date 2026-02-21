 let birthdate = "1997-07-08"; // Format: YYYY-MM-DD

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
// Calculate and display age

const birthDate = new Date(birthdate);
const today = new Date();

let age = today.getFullYear() - birthDate.getFullYear();

// Vérifier si l'anniversaire est déjà passé cette année
const hasBirthdayPassed = 
  today.getMonth() > birthDate.getMonth() || 
  (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

if (!hasBirthdayPassed) {
  age--;
}

// Insérer l'âge calculé dans le span.meta
const metaInfo = document.querySelector('.info .meta');
if (metaInfo) {
  metaInfo.textContent = `Age ${age}`;
}






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
  //  work section for project1
  const project1 = document.querySelector('.project1');
  const project1Content = document.createElement('p');
  project1Content.textContent = `Portfolio MuembiaHub is a responsive and 
  modern website built to showcase the design and development work of Jonathan M. Muembia. 
  The site features a clean and professional layout, highlighting Jonathan’s skills, experience, and portfolio of projects. 
  It is designed to provide an engaging user experience while effectively communicating Jonathan’s expertise in web design and development.
  Technologies used: HTML5, CSS3, JavaScript.
  `;
  const project1Link = document.createElement('a');
  project1Link.href = "https://kazidomo.com/muembiahub/portifio.html";
  project1Link.target = "_blank";
  project1Link.textContent = "View Project";
  project1Link.classList.add('btn');
  project1Content.appendChild(project1Link);
  project1.appendChild(project1Content);

  

 





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