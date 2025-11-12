function afficherCartes() {
  const dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
    <div class="carte" onclick="afficherDemandes()">
      <h2>📋 Demandes</h2>
      <p>Voir les demandes de services</p>
    </div>

    <div class="carte ${estAdmin ? '' : 'disabled'}" ${estAdmin ? 'onclick="afficherUtilisateurs()"' : ''}>
      <h2>👥 Utilisateurs</h2>
      <p>${estAdmin ? 'Gérer les comptes utilisateurs' : 'Accès réservé aux administrateurs'}</p>
    </div>

    <div class="carte" onclick="afficherProfil()">
      <h2>👤 Mon profil</h2>
      <p>Voir mes informations personnelles</p>
    </div>
  `;
}