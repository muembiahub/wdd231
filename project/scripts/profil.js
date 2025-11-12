function afficherProfil() {
  const container = document.getElementById("demandes-container");
  const statsBox = document.getElementById("stats-box");
  const chart = document.getElementById("chart-categories");
  const panel = document.getElementById("admin-panel");

  container.innerHTML = "";
  statsBox.innerHTML = "";
  chart.style.display = "none";
  panel.innerHTML = "";

  client.auth.getSession().then(({ data: session }) => {
    const userId = session?.session?.user?.id;
    if (!userId) return;

    client.from("utilisateurs").select("*").eq("id", userId).single().then(({ data, error }) => {
      if (error || !data) {
        container.innerHTML = `<p class="erreur">Impossible de charger le profil.</p>`;
        return;
      }

      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `
        <h3>👤 Mon profil</h3>
        <p><strong>Nom :</strong> ${data.nom}</p>
        <p><strong>Prénom :</strong> ${data.prenom}</p>
        
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Rôle :</strong> ${data.role}</p>
        <p><strong>Domaine :</strong> ${data.domaine || "Non attribué"}</p>
      `;
      container.appendChild(card);
    });
  });
}
