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

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
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
});



// Contact form (demo)
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const payload = Object.fromEntries(data.entries());
  console.log('Contact form submitted:', payload);
  alert('Thanks! Your message has been sent (demo).');
  e.target.reset();
});
