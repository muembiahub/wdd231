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
      link.href = 'data/jonathanmuembiacv.pdf';
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


const footer = document.querySelector("footer");
  footer.innerHTML = `
  
    <div id = "year" >
      <p><i class="fa-regular fa-copyright"></i>
      ${new Date().getFullYear()} Jonathan M. Muembia</p>
    </div>
    <div>
      <p id = "bolt"><i class="fa-solid fa-bolt"></i> Propulsé par <a href="https://kazidomo.com/muembiahub/portifio.html" target="_blank">Muembia Hub</a></p>
      <p id = 'globe'><i class="fa-solid fa-globe"></i> Designed by Muembia Designer</p>
      <p id = "halved"><i class="fa-solid fa-shield-halved"></i> Tous droits réservés</p>
    </div>
    <button id ="kazidomo-chat-btn" aria-label="Ouvrir le chat">
      <i class="fa-solid fa-blog"></i>
    </button>
  `;
  document.body.appendChild(footer);
  // ===== BOTPRESS CHAT =====
  const chantbot = document.createElement("script");
  chantbot.src = "https://cdn.botpress.cloud/webchat/v0/inject.js";
  chantbot.onload = function () {
    var CONFIG_URL = "https://files.bpcontent.cloud/2025/12/30/13/20251230131849-AY45NXSY.json";
    window.botpressWebChat.init({
      configUrl: CONFIG_URL,
      hostUrl: "https://cdn.botpress.cloud/webchat/v0",
      botName: "Kazidomo Assistant",
      theme: "light",
      language: "fr",
      layout: { position: "bottom-right" },
      hideWidget: true,
    });
    document.getElementById("kazidomo-chat-btn").onclick = function () {
      window.botpressWebChat.sendEvent({ type: "toggle" });
    };
  };
  document.body.appendChild(chantbot);
});

