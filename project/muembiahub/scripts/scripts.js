let birthdate = "1997-07-08"; // Format: YYYY-MM-DD
const spaceId = "2zcv3fyk4t5j";  
const accessToken = "8LDdntvKIFGlHs9vq8SSKJEG5iE-VpiVzKjtiaEAzIc"; // Content Delivery API token

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
const newsBar = document.querySelector('.news');
const siteHeader = document.querySelector('.site-header');
const closeBtn = document.querySelector('.news .close-btn');
const newsText = document.querySelector('.news .news-text');

let newsItems = [];
let currentIndex = 0;

const spaceId = "1qn0pj19e57q";
const accessToken = "qXklqR9QoXx1tU_gE5RAMg70luoLhpKYw1p3n9k0dPw"; 
const locale = "en-US"; // ajuste si ton espace utilise une autre locale

async function loadNews() {
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=updateMessage&include=1`
    );
    const data = await response.json();

    console.log("Premier item complet:", data.items[0]);
    console.log("Fields du premier item:", data.items[0].fields);

    const resolveAsset = (assetRef) => {
      if (!assetRef || !assetRef.sys) return null;
      const asset = data.includes?.Asset?.find(a => a.sys.id === assetRef.sys.id);
      return asset ? `https:${asset.fields.file.url}` : null;
    };

    newsItems = data.items.map(item => {
      const fields = item.fields || {};
      return {
        title: fields.title || "Sans titre", // direct string
        message: fields.message
        ? (fields.message["en-US"] || "Sans message") : "Sans message", // accès direct à la locale
        time: fields.publishedDate || null,
        image: Array.isArray(fields.image) && fields.image.length > 0
          ? resolveAsset(fields.image[0])
          : null
      };
    });

    if (newsItems.length > 0) {
      updateNewsTicker();
      setInterval(updateNewsTicker, 5000);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des news:", error);
  }
}


function updateNewsTicker() {
  if (newsItems.length === 0) return;
  const item = newsItems[currentIndex];

  newsText.innerHTML = `
    ${item.image ? `<img src="${item.image}" alt="${item.title}" style="height:20px;vertical-align:middle;margin-right:8px;">` : ""}
    <strong>${item.title}</strong> — ${item.message}
    ${item.time ? `<em style="margin-left:8px;">(${item.time})</em>` : ""}
  `;

  currentIndex = (currentIndex + 1) % newsItems.length;
}

closeBtn.addEventListener('click', () => {
  newsBar.style.display = 'none';
  siteHeader.style.top = "0";
});

loadNews();

//  Page landing content










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

  // work section for project2
  const project2 = document.querySelector('.project2');
  const project2Content = document.createElement('p');
  project2Content.textContent = `Kazidomo Confiance is a responsive and modern website built for Kazidomo Confiance, focusing on trust, clarity, and user-friendly navigation. The design emphasizes a clean layout with intuitive navigation to enhance user experience. 
  The site is optimized for performance and accessibility, ensuring it is usable across various devices and by users with different needs.
  Technologies used: HTML5, CSS3, JavaScript.
  `;
  const roleHighlight = document.createElement('strong');
  roleHighlight.textContent = "Role: Full-stack development and branding integration.";
  project2Content.appendChild(roleHighlight);

  const project2Link = document.createElement('a');
  project2Link.href = "https://kazidomo.com/";
  project2Link.target = "_blank";
  project2Link.textContent = "Visit Kazidomo Confiance";
  project2Link.classList.add('btn');
  project2Content.appendChild(project2Link);
  project2.appendChild(project2Content);

 





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


