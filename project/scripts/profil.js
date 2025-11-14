function afficherProfil() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) {
    console.warn("contenu-carte introuvable");
    return;
  }

  panneau.innerHTML = "<p>Chargement du profil...</p>";

  client.auth.getSession().then(({ data: session }) => {
    const userId = session?.session?.user?.id;
    if (!userId) return;

    client
      .from("utilisateurs")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data: utilisateur, error }) => {
        if (error || !utilisateur) {
          panneau.innerHTML = "<p class='erreur'>Erreur de chargement du profil.</p>";
          return;
        }

        panneau.innerHTML = `
          <h3>👤 Mon profil</h3>
          <p><strong>Nom :</strong> ${utilisateur.nom}</p>
          <p><strong>Email :</strong> ${utilisateur.email}</p>
          <p><strong>Rôle :</strong> ${utilisateur.role}</p>
          <p><strong>Utilisateur ID :</strong> ${utilisateur.id}</p>
          <p><strong>Domaine :</strong> ${utilisateur.domaine}</p>
          <p><strong>Créé le  :</strong> ${new Date(utilisateur.created_at).toLocaleDateString()}</p>
        `;
      });
  });
}
// 
function parametresCompte() {
  const panneau = document.getElementById("contenu-carte");
  if (panneau) {
    panneau.innerHTML = `
      <h3>Paramètres du compte</h3>
      <p>Module en cours de développement. Ici vous pourrez modifier vos informations personnelles, votre mot de passe, et gérer vos préférences.</p>
    `;
  }
}