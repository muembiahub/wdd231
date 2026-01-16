document.addEventListener('DOMContentLoaded', () => {

    
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.title = 'Dynamic Page Title created by Jonathan Muembia';

const topBar = document.createElement('div');
  Object.assign(topBar.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#484545',
    color: 'white',
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
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.3s ease'
  });
  emailLink.innerHTML = '<i class="fa-solid fa-envelope" style="color:#2196F3;"></i>jonathanmuembia3@gmail.com';
  
  // Phone
  const phoneLink = document.createElement('a');
  phoneLink.href = 'tel:+243831709022';
  Object.assign(phoneLink.style, {
    color: 'white',
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

  socialLinks.forEach(({ href, icon, color }) => {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    Object.assign(link.style, { 
      color, 
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
  if (appMenu) {
    Object.assign(appMenu.style, {
      margin: '40px auto 1rem',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '2px solid #e0e0e0',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '1000px',
      fontSize: '16px',
      borderRadius: '12px',
      padding: '0.5rem 1rem',
      position: 'relative',
      backgroundColor: '#ffffff',
      color: '#333'
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
      fontSize: '0.8rem',
      color: '#1F4CAD',
      marginRight: '2rem',
      fontWeight: '700'
    });
    logoTitle.textContent = 'Kazidomo-Confiance';
    appMenu.appendChild(logoTitle);

    // Navigation
    const nav = document.createElement('nav');
    nav.style.flexGrow = '1';
    appMenu.appendChild(nav);

    const menuList = document.createElement('ul');
    Object.assign(menuList.style, {
      listStyle: 'none',
      margin: '0',
      padding: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem'
    });
    nav.appendChild(menuList);

    // ===== MENU ITEMS - TOUS IDENTIQUES ✅ =====
    const menuItems = [
      { text: 'Accueil', href: 'https://kazidomo.com/', icon: 'fa-solid fa-house', color: '#4CAF50' },
      { text: 'Services', href: '#https://kazidomo.com/services.html', icon: 'fa-solid fa-screwdriver-wrench', color: '#FF9800' },
      { text: 'Contact', href: 'https://kazidomo.com/contact.html', icon: 'fa-solid fa-phone', color: '#2196F3' },
      { text: 'À propos', href: 'https://kazidomo.com/about.html', icon: 'fa-solid fa-circle-info', color: '#9C27B0' },
      { text: 'Blog', href: '#https://kazidomo.com/blog.html', icon: 'fa-solid fa-blog', color: '#E91E63' },
      { text: 'Recherche', type: 'search', icon: 'fa-solid fa-magnifying-glass', color: '#666' }
    ];

    menuItems.forEach(item => {
      const li = document.createElement('li');
      li.style.position = 'relative';

      if (item.type === 'search') {
        // 🔍 RECHERCHE - IDENTIQUE AUX AUTRES LIENS
        const searchLink = document.createElement('a');
        Object.assign(searchLink.style, {
          color: '#333',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: '300',
          fontSize: '10px',
          transition: 'all 0.3s ease',
          position: 'relative'
        });

        // Icon
        const searchIcon = document.createElement('i');
        searchIcon.className = item.icon;
        Object.assign(searchIcon.style, { color: item.color, fontSize: '16px', width: '20px' });

        // Text
        const searchText = document.createElement('span');
        searchText.textContent = item.text;

        // Tooltip
        const searchTooltip = document.createElement('span');
        Object.assign(searchTooltip.style, {
          visibility: 'hidden',
          opacity: '0',
          position: 'absolute',
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%) translateX(10px)',
          background: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          zIndex: '100',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          display: 'none'
        });
        searchTooltip.textContent = 'Rechercher sur le site';

        searchLink.append(searchIcon, searchTooltip);

        // Input recherche
        const searchInput = document.createElement('input');
        Object.assign(searchInput.style, {
          padding: '10px 20px',
          border: '1px solid #ddd',
          borderRadius: '25px',
          fontSize: '14px',
          width: '200px',
          outline: 'none',
          position: 'absolute',
          top: '150%',
          right: '20%',
          transform: 'translateX(-50%)',
          zIndex: '100',
          display: 'none',
          transition: 'all 0.3s ease',
          marginTop: '10px'
        });
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher sur le site...';
        li.appendChild(searchInput);

        // Hover effects (IDENTIQUE aux autres)
        searchLink.addEventListener('mouseenter', () => {
          searchLink.style.backgroundColor = '#f8f9fa';
          searchLink.style.transform = 'translateY(-2px)';
          searchLink.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          searchTooltip.style.visibility = 'visible';
          searchTooltip.style.opacity = '1';
          searchTooltip.style.transform = 'translateY(-50%) translateX(5px)';
        });
        searchLink.addEventListener('mouseleave', () => {
          searchLink.style.backgroundColor = '';
          searchLink.style.transform = '';
          searchLink.style.boxShadow = '';
          searchTooltip.style.visibility = 'hidden';
          searchTooltip.style.opacity = '0';
        });

        // CLICK recherche
        let isSearchOpen = false;
        searchLink.addEventListener('click', (e) => {
          e.preventDefault();
          const targets = document.querySelectorAll('[data-search], h1, h2, h3, p, .content, [class*="content"]');
          
          if (!isSearchOpen) {
            searchInput.style.display = 'block';
            searchInput.focus();
            isSearchOpen = true;
          } else {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
              let found = false;
              targets.forEach(el => {
                const text = el.textContent.toLowerCase();
                el.classList.remove('search-highlight');
                if (text.includes(query)) {
                  el.classList.add('search-highlight');
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  found = true;
                }
              });
              if (!found) alert(`❌ Aucun résultat pour "${query}"`);
            }
            searchInput.style.display = 'none';
            searchInput.value = '';
            isSearchOpen = false;
          }
        });

        li.appendChild(searchLink);

      } else {
        // 🔗 LIENS NORMAUX
        const link = document.createElement('a');
        link.href = item.href;
        
    
        Object.assign(link.style, {
          color: '#333',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '15px',
          transition: 'all 0.3s ease',
          position: 'relative'
        });

        // Icon
        const icon = document.createElement('i');
        icon.className = item.icon;
        Object.assign(icon.style, { color: item.color, fontSize: '16px', width: '20px' });

        // Text
        const textSpan = document.createElement('span');
        textSpan.textContent = item.text;

        // Tooltip
        const tooltip = document.createElement('span');
        Object.assign(tooltip.style, { display: 'none',
          opacity: '0',
          position: 'absolute',
          top: '50%',
          left: '100%',
          transform: 'translateY(-50%) translateX(10px)',
          background: 'black',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          whiteSpace: 'nowrap',
          zIndex: '100',
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
        });

        link.append(icon, textSpan, tooltip);

        // Hover effects
        link.addEventListener('mouseenter', () => {
    
          link.style.transform = 'translateY(-2px)';
          link.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateY(-50%) translateX(5px)';
        });
        link.addEventListener('mouseleave', () => {
          link.style.backgroundColor = '';
          link.style.transform = '';
          link.style.boxShadow = '';
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
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
      // ===== Création des éléments =====
      const wrapper = document.createElement("div");      // conteneur global
      const chronoDiv = document.createElement("div");    // affichage du chrono
      const controls = document.createElement("div");     // zone des boutons
      const btnStart = document.createElement("button");
      const btnStop  = document.createElement("button");
      const btnReset = document.createElement("button");

      // ===== Insertion dans le DOM =====
      document.body.insertBefore(wrapper, document.getElementById('app'));
      wrapper.appendChild(chronoDiv);
      wrapper.appendChild(controls);
      controls.appendChild(btnStart);
      controls.appendChild(btnStop);
      controls.appendChild(btnReset);

      // ===== Styles (JS uniquement) =====
      wrapper.style.textAlign = "center";
      wrapper.style.margin = "20px 0";
      wrapper.style.border = "2px solid #444";
      wrapper.style.padding = "15px";
      wrapper.style.borderRadius = "10px";
      wrapper.style.backgroundColor = "#D3D3D3";
      wrapper.style.display = "inline-block";
      wrapper.style.minWidth = "250px";
      chronoDiv.style.fontSize = "28px";
      chronoDiv.style.fontWeight = "bold";
      chronoDiv.style.color = "darkred";
      chronoDiv.style.marginBottom = "12px";
      controls.style.display = "flex";
      controls.style.gap = "10px";
      controls.style.justifyContent = "center";


      [btnStart, btnStop, btnReset].forEach(b => {
        b.style.padding = "8px 14px";
        b.style.border = "1px solid #444";
        b.style.borderRadius = "6px";
        b.style.cursor = "pointer";
        b.style.background = "#969EAB";
      });

      btnStart.textContent = "Start";
      btnStop.textContent  = "Stop";
      btnReset.textContent = "Reset";

      // ===== Logique du chronomètre =====
      let totalSeconds = 0;
      let intervalId = null;

      const render = () => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formatted = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
        chronoDiv.textContent = "Chronomètre : " + formatted;
      };

      const tick = () => {
        render();
        totalSeconds++;
      };

      // État initial
      render();

      // ===== Contrôles =====
      btnStart.addEventListener("click", () => {
        btnStart.style.backgroundColor = 'green';
        if (!intervalId) intervalId = setInterval(tick, 1000);
      });

      btnStop.addEventListener("click", () => {
        btnStop.style.backgroundColor = 'red';
        clearInterval(intervalId);
        intervalId = null;
      });

      btnReset.addEventListener("click", () => {
        btnStop.style.backgroundColor = 'lightred';
        clearInterval(intervalId);
        intervalId = null;
        totalSeconds = 0;
        render();
      });





  


  // Conteneur
  const appDiv = document.getElementById('app');
  appDiv.style.color = 'blue';
  appDiv.style.textAlign = 'center';
  appDiv.style.marginTop = '5px';
  appDiv.style.marginBottom = '50px';
  appDiv.style.padding = '20px';
  appDiv.style.backgroundColor = '#A0BBD5';
  appDiv.style.borderRadius = '10px';

 
  const h1 = document.querySelector('#app h1');
    h1.style.fontSize = '48px';
    h1.style.fontWeight = 'bold';
    h1.style.color = 'blue';
    h1.textContent = 'Welcome to the Dynamic Page! now is managed by JavaScript.';
  const p1 = document.querySelector('#app p');
    p1.style.fontSize = '18px';
    p1.style.color = 'darkblue';
    p1.textContent = 'This content was added and styled using JavaScript. Enjoy the dynamic experience!';
  



  // Paragraphe
  const p = document.createElement('p');
  p.textContent = 'This is a dynamically added paragraph.';
  p.style.fontSize = '20px';
  p.style.fontWeight = 'bold';
  p.style.fontFamily = 'Cedarville Cursive, cursive';
  p.style.color = 'red'; // une seule couleur
  p.classList.add('hidden');
  appDiv.appendChild(p);

  // Indicateur d'attente
  const info = document.createElement('small');
  info.textContent = 'Le paragraphe apparaîtra dans 4 secondes...';
  appDiv.appendChild(info);

  // Afficher après 4 secondes
  const delayMs = 4000;
  setTimeout(() => {
    p.classList.remove('hidden');
    info.remove();
  }, delayMs);
    



const buttonDiv = document.createElement('div');
    buttonDiv.className = 'button';
    buttonDiv.style.marginTop = '20px';
    buttonDiv.style.padding = '10px';
    buttonDiv.style.border = '2px solid black';
    buttonDiv.style.display = 'inline-block';
    buttonDiv.style.cursor = 'pointer';
    buttonDiv.textContent = 'Click Me';

    appDiv.appendChild(buttonDiv);

    buttonDiv.addEventListener('click', () => {
        buttonDiv.style.backgroundColor = 'green';
        buttonDiv.style.borderColor = 'green';

    buttonDiv.addEventListener('mouseover',() => {
        buttonDiv.style.backgroundColor = 'red';
        buttonDiv.style.borderColor = 'red';

    buttonDiv.addEventListener('mouseout',() => {
        buttonDiv.style.backgroundColor = 'blue';
        buttonDiv.style.borderColor = 'blue';
    });
    });
    });
    







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