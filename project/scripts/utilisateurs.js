async function afficherUtilisateurs() {
  const container = document.getElementById("demandes-container");
  const statsBox = document.getElementById("stats-box");
  const chart = document.getElementById("chart-categories");
  const panel = document.getElementById("admin-panel");

  container.innerHTML = "";
  statsBox.innerHTML = "";
  chart.style.display = "none";
  panel.innerHTML = "";

  const domaines = [
    "informatique-et-technologie", "plomberie", "électricité", "nettoyage", "menuiserie",
    "construction-et-réparation", "manifestations-et-cérémonies", "mécanique", "formation",
    "mode", "beauté", "hôtels-et-restaurants", "santé", "immobilier", "animaux",
    "agriculture", "autres-services"
  ];

  const { data, error } = await client.from("utilisateurs").select("*");

  if (error || !data) {
    container.innerHTML = `<p class="erreur">Erreur : ${error?.message || "Aucune donnée"}</p>`;
    return;
  }

  data.forEach(user => {
    const card = document.createElement("div");
    card.className = "profil-card";
    card.innerHTML = `
      <h4>👤 ${user.nom || user.email}</h4>
      <p><strong>Email :</strong> ${user.email}</p>
      <p><strong>Rôle :</strong> ${user.role}</p>
      <p><strong>Domaine :</strong> ${user.domaine || "Non attribué"}</p>
    `;

    const select = document.createElement("select");
    select.innerHTML = `<label>Changer domaine :</label>
    <option value="">-- Domaine --</option>` +
      domaines.map(d => `<option value="${d}">${d.replace(/-/g, " ")}</option>`).join("");
    select.value = user.domaine || "";
    select.onchange = async () => {
      await client.from("utilisateurs").update({ domaine: select.value }).eq("id", user.id);
      alert("✅ Domaine mis à jour !");
      afficherUtilisateurs();
    };
    card.appendChild(select);

    if (user.role !== "admin") {
      const btnAdmin = document.createElement("button");
      btnAdmin.textContent = "👑 Promouvoir admin";
      btnAdmin.className = "btn";
      btnAdmin.onclick = async () => {
        await client.from("utilisateurs").update({ role: "admin" }).eq("id", user.id);
        alert("✅ Utilisateur promu !");
        afficherUtilisateurs();
      };
      card.appendChild(btnAdmin);
    }

    container.appendChild(card);
  });

  // ➕ Ajout manuel d’un utilisateur
  const ajoutCard = document.createElement("div");
  ajoutCard.className = "ajout-user-card";
  ajoutCard.innerHTML = `
    <h3>➕ Ajouter un utilisateur</h3>
    <label>Email</label>
    <input type="email" id="nouvel-email" placeholder="Email" required>
    <label>Nom</label>
    <input type="text" id="nouvel-nom" placeholder="Nom" required>
    <label>Prénom</label>
    <input type="text" id="nouvel-prenom" placeholder="Prénom" required>
    <label>Rôle par défaut</label>
    <select id="nouvel-role">
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
    <label>Domaine</label>
    <select id="nouvel-domaine">
      <option value="">-- Domaine --</option>
      ${domaines.map(d => `<option value="${d}">${d.replace(/-/g, " ")}</option>`).join("")}
    </select>
    <button class="btn" onclick="ajouterUtilisateur()">Créer</button>
  `;
  container.appendChild(ajoutCard);
}

async function ajouterUtilisateur() {
  const email = document.getElementById("nouvel-email").value.trim();
  const nom = document.getElementById("nouvel-nom").value.trim();
  const prenom = document.getElementById("nouvel-prenom").value.trim();
  const role = document.getElementById("nouvel-role").value;
  const domaine = document.getElementById("nouvel-domaine").value;

  if (!email || !nom || !prenom || !domaine) {
    alert("Tous les champs sont requis.");
    return;
  }

  // 🔐 Récupérer le token d’accès de l’admin connecté
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;

  if (!token) {
    alert("Session expirée ou non connectée. Veuillez vous reconnecter.");
    return;
  }

  // 📡 Appel sécurisé vers la Edge Function
  const response = await fetch("https://eumdndwnxjqdolbpcyrp.supabase.co/functions/v1/cree_utilisateur", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ email, nom, prenom, role, domaine })
  });

  const result = await response.json();

  if (result.error) {
    alert("Erreur : " + result.error);
  } else {
    alert("✅ Utilisateur créé avec succès !");
    afficherUtilisateurs();
  }
}