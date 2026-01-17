document.addEventListener('DOMContentLoaded', () => {

    
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.title = 'Muembiahub page';

const topBar = document.createElement('div');
topBar.className = 'top-bar';
  Object.assign(topBar.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    position: 'fixed',
    width: '100%',
    top: '0',
    left: '0',
    height: '50px',
    zIndex: '1001',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  });

  // Contact Info (Email + Phone)
  const contactInfo = document.createElement('div');
  Object.assign(contactInfo.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '14px'
  });

  // Email
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:jonathanmuembia3@gmail.com';
  emailLink.target = '_blank';
  Object.assign(emailLink.style, {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.3s ease'
  });
  emailLink.innerHTML = '<i class="fa-solid fa-envelope" style="color:#E4340C;"></i>jonathanmuembia3@gmail.com';
  
  // Phone
  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:+243831709022';
  Object.assign(phoneLink.style, {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.3s ease'
  });
  phoneLink.innerHTML = '<i class="fa-solid fa-phone" style="color:#4CAF50;"></i>+243 83 1709022';

  contactInfo.append(emailLink, phoneLink);

  // Social Icons
  const socialIcons = document.createElement('div');
  Object.assign(socialIcons.style, { display: 'flex', gap: '15px' });

  const socialLinks = [
    { href: '#https://www.facebook.com/profile.php?id=61578830991597', icon: 'fa-brands fa-facebook', color: '#1877F2' },
    { href: '#https://www.linkedin.com/in/kazidomo-confiance-287846383', icon: 'fa-brands fa-linkedin', color: '#0A66C2' },
    { href: '#https://www.tiktok.com/@kazidomo3?_t=ZM-8zPu75OCnCP&_r=1', icon: 'fa-brands fa-tiktok', color: '#E1306C' }
  ];

  socialLinks.forEach(({ href, icon, }) => {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    Object.assign(link.style, { 
      fontSize: '20px',
      textDecoration: 'none',
      transition: 'all 0.3s ease'
    });
    link.innerHTML = `<i class="${icon}"></i>`;
    link.addEventListener('mouseenter', () => link.style.transform = 'translateY(-2px) scale(1.1)');
    link.addEventListener('mouseleave', () => link.style.transform = '');
    socialIcons.appendChild(link);
  });

  topBar.append(contactInfo, socialIcons);
  document.body.prepend(topBar);

  // ===== MAIN HEADER =====
  const appMenu = document.getElementById('header');
  appMenu.className = 'app-menu'
  if (appMenu) {
    Object.assign(appMenu.style, {
      margin: '40px auto 1rem',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid #e0e0e0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '1250px',
      fontSize: '16px',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      position: 'relative',
    });

    // Logo
    const logo = document.createElement('img');
    Object.assign(logo.style, {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '1.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    });
    logo.src = 'https://raw.githubusercontent.com/muembiahub/wdd231/main/project/muembiahub/images/logo-hub.webp';
    logo.alt = 'Muembia hub';
    logo.addEventListener('mouseenter', () => logo.style.transform = 'rotate(10deg) scale(1.05)');
    logo.addEventListener('mouseleave', () => logo.style.transform = '');
    appMenu.appendChild(logo);

    // Logo Title
    const logoTitle = document.createElement('h1');
    Object.assign(logoTitle.style, {
      margin: '0',
      fontFamily: "'Cedarville Cursive', cursive",
      fontSize: '2rem',
      color: '#1F4CAD',
      marginRight: '1rem',
      fontWeight: '700'
    });
    logoTitle.textContent = 'Muembia hub';
    appMenu.appendChild(logoTitle);

    const nav = document.createElement('nav');
    nav.style.flexGrow = '1';
    appMenu.appendChild(nav);

// Créer une liste de menu
const menuList = document.createElement('ul');
menuList.className = 'navigation'; // correction : utiliser menuList.className
nav.appendChild(menuList);

menuList.style.listStyle = 'none';
menuList.style.margin = '0';
menuList.style.padding = '0';
menuList.style.display = 'flex';
menuList.style.justifyContent = 'center';
menuList.style.gap = '50px';


    // ===== MENU ITEMS - TOUS IDENTIQUES ✅ =====
    const menuItems = [
      { text: 'Accueil', href: 'https://kazidomo.com/muembiahub/home-page.html', icon: 'fa-solid fa-house', color: '#4CAF50' },
      { text: 'Services', href: '#https://kazidomo.com/services.html', icon: 'fa-solid fa-briefcase', color: '#FF9800' },
      { text: 'Site web creer', href: '#https://kazidomo.com/contact.html', icon: 'fa-solid fa-globe', color: '#2196F3' },
      { text: 'À propos', href: '#https://kazidomo.com/about.html', icon: 'fa-solid fa-circle-info', color: '#9C27B0' },
      { text: 'Blog', href: '#https://kazidomo.com/blog.html', icon: 'fa-solid fa-blog', color: '#E91E63' },
      { text: 'Recherche', type: 'search', icon: 'fa-solid fa-magnifying-glass', color: '#666' }
    ];

    menuItems.forEach(item => {
      const li = document.createElement('li');

      if (item.type === 'search') {
    const form = document.createElement('form');
    form.id = 'searchForm';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Rechercher...';
    input.style.borderRadius = '20px';
    input.style.padding = '5px';
    input.style.display = 'none'; // caché par défaut

    const button = document.createElement('button');
    button.type = 'button'; // bouton cliquable
    button.innerHTML = `<i class="${item.icon}"></i>`;
    button.style.background = 'none';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.color = 'blue';

    form.appendChild(button);
    form.appendChild(input);
    li.appendChild(form);

    let inputVisible = false;

    // clic sur l’icône
   button.addEventListener('click', () => {
      if (!inputVisible) {
        // première fois : afficher l’input
        input.style.display = 'inline-block';
        input.focus();
        inputVisible = true;
      } else {
        // si déjà visible : vérifier contenu
        const query = input.value.trim();
        if (query) {
          alert("Recherche : " + query);
          // Ici tu peux ajouter ta logique : filtrer des éléments, appeler une API, etc.
        } else {
          // si vide → fermer l’input
          input.style.display = 'none';
          inputVisible = false;
        }
      }
    });

  } else {
    const link = document.createElement('a');
    link.href = item.href;
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.cursor = 'pointer';

    const icon = document.createElement('i');
    icon.className = item.icon;

    switch(item.text) {
      case 'Accueil': icon.style.color = '#4CAF50'; break;
      case 'Services': icon.style.color = '#FF9800'; break;
      case 'Site web creer': icon.style.color = '#2196F3'; break;
      case 'À propos': icon.style.color = '#9C27B0'; break;
      case 'Blog': icon.style.color = '#E91E63'; break;
      case 'Recherche': icon.style.color = '#000'; break;
    }

    const span = document.createElement('span');
    span.textContent = item.text;
    span.style.marginLeft = '5px';

    link.appendChild(icon);
    link.appendChild(span);

    link.addEventListener('mouseover', () => {
      link.style.fontFamily = 'times new roman, serif';
    });
    link.addEventListener('mouseout', () => {
      link.style.textDecoration = 'none';
    });

    li.appendChild(link);
  }

  menuList.appendChild(li);
});

    // 🍔 Hamburger Mobile
    const hamburger = document.createElement('button');
    Object.assign(hamburger.style, {
      background: 'none',
      border: 'none',
      color: '#333',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '8px',
      display: 'none',
      transition: 'all 0.3s ease',
      marginLeft: 'auto'
    });
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    hamburger.className = 'hamburger';
    hamburger.title = 'Menu';
    
    hamburger.addEventListener('mouseenter', () => {
      hamburger.style.backgroundColor = '#f8f9fa';
      hamburger.style.transform = 'scale(1.1)';
    });
    hamburger.addEventListener('mouseleave', () => {
      hamburger.style.backgroundColor = '';
      hamburger.style.transform = '';
    });

    appMenu.appendChild(hamburger);

    // 📱 Mobile Responsiveness
    function updateMobileMenu() {
      if (window.innerWidth <= 768) {
        hamburger.style.display = 'block';
        Object.assign(menuList.style, {
          flexDirection: 'column',
          position: 'absolute',
          top: '100%',
          left: '0',
          width: '100%',
          backgroundColor: 'white',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: '0 0 12px 12px',
          padding: '1rem',
          gap: '1rem',
          display: 'none',
          zIndex: '999'
        });
      } else {
        hamburger.style.display = 'none';
        Object.assign(menuList.style, {
          flexDirection: 'row',
          position: 'static',
          width: 'auto',
          backgroundColor: '',
          boxShadow: '',
          padding: '0',
          display: 'flex',
          zIndex: ''
        });
      }
    }

    hamburger.addEventListener('click', () => {
      const isVisible = menuList.style.display === 'flex';
      menuList.style.display = isVisible ? 'none' : 'flex';
      hamburger.innerHTML = isVisible ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
    });

    window.addEventListener('resize', updateMobileMenu);
    updateMobileMenu();

    // GLOBAL ESCAPE pour recherche
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const searchInputs = appMenu.querySelectorAll('input[type="text"]');
        searchInputs.forEach(input => {
          input.style.display = 'none';
          input.style.marginTop = '0';

          input.value = '';
        });
      }
    });
  }


    








// 4) Fonction pour créer une rangée
function createRow(columns, isLarge = false) {
  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gap = '16px';

  if (columns === 1) {
    row.style.gridTemplateColumns = '1fr';
    if (isLarge) {
      row.style.minHeight = '100px'; // ✅ carte plus grande
    }
  } else if (columns === 2) {
    row.style.gridTemplateColumns = '1fr 1fr';
  }
  return row;
}

// Fonction pour créer une carte
function createCard({ title, accent = '#2563eb' }) {
  const card = document.createElement('section');
  card.className = 'card';

  // Header
  const header = document.createElement('h2');
  header.textContent = title;
  header.style.color = accent;
  header.style.fontSize = '1.5rem';
  header.style.fontWeight = '600';
  header.style.marginBottom = '2rem';
  header.style.marginLeft = '10px';
  header.style.marginTop = '10px';
  header.style.textAlign = 'center';
  header.style.textTransform = 'uppercase';
  header.style.letterSpacing = '0.1em';
  header.style.fontFamily = 'sans-serif';
  header.style.textShadow = '2px 2px 4px rgba(0,0,0,0.1)';
  card.appendChild(header);

  // Content
  const content = document.createElement('div');
  content.style.color = '#374151';
  content.style.fontSize = '14px';
  content.style.lineHeight = '1.6';
  content.style.margin = '0 10px';
  content.style.textAlign = 'center';
  content.style.fontFamily = 'sans-serif';
  content.style.textShadow = '2px 2px 4px rgba(0,0,0,0.1)';
  card.appendChild(content);

  // Helpers
  card.addText = (text) => {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.margin = '0 0 8px';
    p.style.fontSize = '16px';

    content.appendChild(p);
    return p;
  };

  card.addList = (items) => {
    const ul = document.createElement('ul');
    ul.style.margin = '0';
    ul.style.paddingLeft = '18px';
    items.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      li.style.marginBottom = '6px';
      ul.appendChild(li);
    });
    content.appendChild(ul);
    return ul;
  };

  card.addCTA = (label, onClick, type = 'primary') => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = `cta-btn ${type}`;
    btn.addEventListener('click', onClick);
    content.classList.add('card-actions');
    content.appendChild(btn);
    return btn;
  };

  card.addImage = (src, alt = '', full = true) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;


    if (full) {
      img.style.width = '300px';
      img.style.height = '200px';
      img.style.borderRadius = '0';
    } else {
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.borderRadius = '50%';
    }

    content.appendChild(img);
    return img;
  };

  // Nouvelle méthode pour actions
  card.addActions = (actions) => {
    actions.forEach(action => {
      card.addCTA(action.label, action.handler);
    });
  };

  return card;
}

// =======================
// Cartes
// =======================

// Actions pour la carte CV
const actions = [
  { 
    label: 'Télécharger CV', 
    handler: () => window.open('data/jonathanmuembiacv.pdf', '_blank')
  },
  {
    label: 'Contactez-moi',
    handler: () => {
      const mailUrl = new URL('https://mail.google.com/mail/');
      mailUrl.search = new URLSearchParams({
        view: 'cm',
        fs: '1',
        to: 'jonathanmuembia3@gmail.com',
        su: 'Demande de contact',
        body: 'Bonjour Jonathan Muembia Le Développeur Web\n\n'
      }).toString();
      window.open(mailUrl.toString(), '_blank');
    }
  }
];

const resumeCard = createCard({
  title: 'Jonathan Muembia',
  icon: 'fa-solid fa-user',
  accent: '#6B46C1'
});
resumeCard.addText('Innovation, design, et services IT — en temps réel.');
resumeCard.addActions(actions);

// Record card
const recordCard = createCard({ title: '', icon: '', accent: '' });
recordCard.addText('');
recordCard.addImage('images/portifio.jpg', 'Record', true);

// About card
const aboutCard = createCard({ title: 'A propos de moi', icon: 'fa-solid fa-code-branch', accent: '#0ea5e9' });
aboutCard.addText("Je suis Jonathan Mukuta Muembia, IT team lead, technicien et bâtisseur. Je suis passionné par les technologies et j'aime résoudre des problèmes complexes. Je suis toujours à la recherche de nouvelles opportunités pour apprendre et grandir dans mon domaine.");
aboutCard.addText("Je suis un passionné de technologies et j'aime résoudre des problèmes complexes. Je suis toujours à la recherche de nouvelles opportunités pour apprendre et grandir dans mon domaine.");  

// Skills card
const skillsCard = createCard({ title: 'Compétences clés', icon: 'fa-solid fa-code', accent: '#22c55e' });
skillsCard.addList([
  'JavaScript & CSS modulaires',
  'UI/UX design (responsive)',
  'Gestion et support IT',
  'Brand-building (MuembiaHub, Kazidomo)'
]);

// Projects card
const projectsCard = createCard({ title: 'Projets', icon: 'fa-solid fa-briefcase', accent: '#a855f7' });
projectsCard.addText('MuembiaHub — plateforme d’innovation et de services digitaux.');
projectsCard.addText('Kazidomo — espace de créativité et de connexion.');
projectsCard.addCTA('Voir une démo', () => alert('Démo: horloge, bouton interactif, cartes dynamiques.'));

// Contact card
const contactCard = createCard({ title: 'Contact', icon: 'fa-solid fa-envelope', accent: '#f59e0b' });
contactCard.addText('Email: jonathan@muembiahub.com');
contactCard.addText('Ville: Lubumbashi, RDC');
contactCard.addCTA('Me contacter', () => alert('Merci pour votre message — réponse sous peu.'));

// =======================
// Layout en 4 rangées
// =======================
const grid = document.createElement('section');
grid.className = 'grid';
grid.style.display = 'flex';
grid.style.flexDirection = 'column';
grid.style.gap = '20px';
grid.style.padding = '20px';

// Rangée 1 : deux cartes côte à côte
const row1 = createRow(2);
row1.appendChild(resumeCard);
row1.appendChild(recordCard);
grid.appendChild(row1);

// Rangée 2 : une carte pleine largeur
const row2 = createRow(1, true);
row2.appendChild(aboutCard);
grid.appendChild(row2);

// Rangée 3 : une carte pleine largeur
const row3 = createRow(1, true);
row3.appendChild(contactCard);
grid.appendChild(row3);

// Rangée 4 : deux cartes côte à côte
const row4 = createRow(2);
row4.appendChild(aboutCard.cloneNode(true));
row4.appendChild(skillsCard.cloneNode(true));
grid.appendChild(row4);

// Ajout au container principal
document.getElementById('app').appendChild(grid);

// Clock badge
const clockBadge = document.createElement('div');
clockBadge.className = 'clock-badge';
clockBadge.style.position = 'fixed';
clockBadge.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
clockBadge.style.bottom = '10px';
clockBadge.style.right = '10px';
clockBadge.style.padding = '10px';
clockBadge.style.fontSize = '20px';
clockBadge.style.borderRadius = '5px';

clockBadge.style.color = 'blue';
document.body.appendChild(clockBadge);

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  clockBadge.textContent = `${timeStr} | ${dateStr}`;
}
updateClock();
setInterval(updateClock, 1000);

// Micro polish: page container card
const pageCard = document.createElement('div');
pageCard.style.borderRadius = '14px';
pageCard.style.boxShadow = '0 10px 28px rgba(0,0,0,0.08)';
pageCard.style.padding = '2px';

// Move existing elements into pageCard
pageCard.appendChild(grid);

// Replace app content with pageCard
app.innerHTML = '';
app.appendChild(pageCard);
    







// Fonction qui crée un label + input et les ajoute au formulaire
function createInputField(form, labelText, inputType, inputName, placeholder) {
  // Conteneur
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.marginBottom = '15px';
 

  // Label
  const label = document.createElement('label');
  label.textContent = labelText;
  label.htmlFor = inputName;
  label.style.marginBottom = '5px';
  label.style.fo
  label.style.fontfamily = 'Cedarville Cursive, cursive';
  label.style.fontsize =  '0.9rem ';

  // Input
  const input = document.createElement('input');
  input.type = inputType;
  input.id = inputName;
  input.name = inputName;
  input.placeholder = placeholder;
  input.style.padding = '10px';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '5px';

  

  // Ajouter au conteneur
  div.appendChild(label);
  div.appendChild(input);

  // Ajouter au formulaire
  form.style.marginBottom = '20px';
  form.style.border = '1px solid #ccc';
  form.style.padding = '10px';
  form.style.borderRadius = '5px';
  form.style.marginBottom = '70px';
  form.style.maxWidth = '400px';
  form.appendChild(div);
    return input; // Retourner l'input pour une utilisation ultérieure
}


function createButtonField(form, buttonText, onClickAction) {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.justifyContent = 'center'; // centre le bouton
  div.style.marginBottom = '15px';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = buttonText;
  button.style.backgroundColor = '#F0E68C';
  button.style.fontSize = '15px';
  button.style.padding = '10px 15px';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';
  button.style.color = 'black';

  // Action personnalisée
  button.addEventListener('click', (event) => {
    event.preventDefault(); // bloque le submit par défaut
    onClickAction(button);  // ⚡ on passe le bouton à la fonction
  });

  div.appendChild(button);
  form.appendChild(div);

  return button; // ⚡ retourne le bouton pour pouvoir le manipuler
}


function getRegion(lat, lon) {
  if (lon > 180) lon -= 360; // normaliser longitude

  switch (true) {
    // Amérique du Nord (Canada, USA, Groenland)
    case lat >= 15 && lat <= 83 && lon >= -170 && lon <= -50:
      return "North America";

    // Amérique Centrale (Mexique, Caraïbes, Amérique centrale)
    case lat >= 5 && lat < 25 && lon >= -120 && lon <= -60:
      return "Central America";

    // Amérique du Sud
    case lat >= -60 && lat <= 15 && lon >= -85 && lon <= -30:
      return "South America";

    // Europe (incluant Russie européenne)
    case lat >= 35 && lat <= 72 && lon >= -25 && lon <= 60:
      return "Europe";

    // Afrique (élargi pour inclure toute l’Afrique)
    case lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55:
      return "Africa";

    // Asie (Moyen-Orient, Russie asiatique, Inde, Chine, Japon…)
    case lat >= -10 && lat <= 80 && lon >= 55 && lon <= 180:
      return "Asia";

    // Océanie (Australie, Nouvelle-Zélande, îles du Pacifique)
    case lat >= -50 && lat <= 0 && lon >= 110 && lon <= 180:
      return "Oceania";

    default:
      return "Not mapped";
  }
}



// Utilisation de la fonction pour créer plusieurs champs
createInputField(form, 'Username', 'text', 'username', 'Enter your username');
createInputField(form, 'Email', 'email', 'email', 'Enter your email');
createInputField(form,'Full Name', 'text', 'name', 'Enter your full name');
createInputField(form, 'Password', 'password', 'password', 'Enter your password');
createInputField(form, 'Age', 'number', 'age', 'Enter your age');
createInputField(form, 'Date of Birth', 'date', 'dob', 'Select your date of birth');


// Champ Location (vide au départ)
let locationInput = createInputField(form, 'Location', 'text', 'location', 'Click button to get location');
 locationInput.readOnly = true; // Rendre le champ en lecture seule

// Champ Region (vide au départ)
let locationName = createInputField(form, 'Region', 'text', 'region', 'Region will be displayed here');
 locationName.readOnly = true; // Rendre le champ en lecture seule

// Bouton qui remplit le champ Location
const getlocationButton =  createButtonField(form, 'Get Location', (button) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // Remplir le champ Location
      locationInput.value = `Lat: ${lat}, Lng: ${lon}`;

      // Passer lat et lon à getRegion
      locationName.value = getRegion(lat, lon);

     button.disable = true;
     button.textContent = 'Location found';
     button.style.backgroundColor = 'lightgreen';
    }, () => {
      locationInput.value = 'Impossible de récupérer la localisation';
    });
  } else {
    locationInput.value = 'Geolocation non supportée';
  }
});

// Champ Submit
createButtonField(form, 'Submit', () => {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;

  console.log('Username:', username);
  console.log('Email:', email);
  console.log('Full Name:', name);
    alert(`Thank you, ${name}! Your form has been submitted.`);
    form.reset();

})
// Champ Cancel
 createButtonField(form, 'Cancel', () => {
    alert('Form submission canceled.');
  form.reset();
});









// Footer


const curentDay = new Date();
    const year = curentDay.getFullYear();

    const footer = document.createElement('footer');
    footer.style.textAlign = 'center';
    footer.style.position = 'fixed';
    footer.style.width = '100%';
    footer.style.bottom = '0';
    footer.style.padding = '10px';
    footer.style.backgroundColor = '#D3D3D3';

// Utiliser les backticks et le symbole © directement
footer.textContent = `© ${year} \  ${curentDay} \
Jonathan Muembia. All rights reserved.`;

document.body.appendChild(footer);
});