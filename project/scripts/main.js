// Vérifie si le navigateur supporte les Service Workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker enregistré avec succès :', registration.scope);
      })
      .catch(error => {
        console.error('❌ Échec de l’enregistrement du Service Worker :', error);
      });
  });
}

// Optionnel : détecter l'installation de la PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Empêche l'affichage automatique
  window.deferredPrompt = e; // Stocke l'événement pour plus tard
  console.log('📦 PWA installable détectée');
  // Tu peux afficher un bouton "Installer l'app" ici
});

// Optionnel : message après installation
window.addEventListener('appinstalled', () => {
  console.log('🎉 Kazidomo a été installée comme application');
  // Tu peux afficher un message de bénédiction ou de bienvenue ici
});