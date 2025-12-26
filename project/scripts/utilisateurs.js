// scripts/utilisateurs.js — Gestion des utilisateurs (admin uniquement)
// Fait par : Jonathan Muembia

async function afficherUtilisateurs() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) return;

  panneau.innerHTML = "<h3>Gestion des utilisateurs</h3>";

  const domaines = [
    "informatique-et-technologie", "plomberie", "électricité", "nettoyage", "menuiserie",
    "construction-et-réparation", "manifestations-et-cérémonies", "mécanique", "formation",
    "mode", "beauté", "hôtels-et-restaurants", "santé", "immobilier", "animaux",
    "agriculture", "autres-services"
  ];

  const rolesDisponibles = ["tous", "requerant", "admin","superadmin", "prestataire"];
  const filtreActuel = sessionStorage.getItem("filtre-role") || "tous";

  // 🔍 Filtre par rôle
  panneau.innerHTML += `
    <label><strong>Filtrer par rôle :</strong></label>
    <select id="filtre-role" onchange="filtrerParRole()">
      ${rolesDisponibles.map(role => `
        <option value="${role}" ${filtreActuel === role ? "selected" : ""}>
          ${role.charAt(0).toUpperCase() + role.slice(1)}
        </option>`).join("")}
    </select>
    <hr>
  `;

  const { data, error } = await client.from("utilisateurs").select("*");

  if (error || !data) {
    panneau.innerHTML += `<p class="erreur">Erreur : ${error?.message || "Aucune donnée"}</p>`;
    return;
  }

  const utilisateursFiltres = data.filter(user => filtreActuel === "tous" || user.role === filtreActuel);

  let html = "";

  if (utilisateursFiltres.length === 0) {
    html += `<p class="info">Aucun utilisateur trouvé pour le rôle <strong>${filtreActuel}</strong>.</p>`;
  } else {
    utilisateursFiltres.forEach(user => {
      html += `
        <div class="profil-card" data-role="${user.role}">
          <h4> ${user.surname.toUpperCase() || user.name.toUpperCase() || "Utilisateur"} ${user.name.toUpperCase()|| user.surname || "Inconnu"}</h4>
          <p><strong>Rôle :</strong> ${user.role.toUpperCase()}</p>
          <p><strong>Email:</strong> <strong><a href="mailto:${user.email}">${user.email}</a></strong></p>
          <p><strong>Téléphone :</strong> ${user.phone || "Non spécifié"}</p>
          <p><strong>Genre :</strong> ${user.gender|| "Non spécifiée"}</p>
          <p><strong>Domaine :</strong> ${user.domaine || "Non attribué"}</p>
          <hr>` + `
          <p><strong>Utilisateur ID :</strong><a href="#"> ${user.id}</a></p>
          <p><strong>Créé le :</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
          <hr>` + `
          <label><strong>Changer domaine :</strong></label>
          <select onchange="changerDomaine('${user.id}', this.value)">
            <option value="">-- Domaine --</option>
            ${domaines.map(d => `<option value="${d}" ${user.domaine === d ? "selected" : ""}>${d.replace(/-/g, " ")}</option>`).join("")}
          </select>
          ${user.role === "user" ? `<button class="btn" onclick="promouvoir('${user.id}', 'moderateur')">🛡️ Promouvoir modérateur</button>` : ""}
          ${user.role === "moderateur" ? `<button class="btn" onclick="promouvoir('${user.id}', 'user')">↩️ Rétrograder en user</button>` : ""}
          ${user.role !== "admin" ? `<button class="btn" onclick="promouvoir('${user.id}', 'admin')">👑 Promouvoir admin</button>` : ""}
        </div>
      `;
    });
  }

  // ➕ Formulaire d’ajout
  html += `
    <div class="profil-card">
    <div class="ajout-user-card">
      <h3>➕ Ajouter un utilisateur</h3>
      <label>Email</label>
      <input type="email" id="nouvel-email" placeholder="Email" required>
      <label>Nom</label>
      <input type="text" id="nouvel-nom" placeholder="Nom" required>
      <label>Prénom</label>
      <input type="text" id="nouvel-prenom" placeholder="Prénom" required>
      <label>Rôle</label>
      <select id="nouvel-role">
        <option value="user">user</option>
        <option value="moderateur">moderateur</option>
        <option value="admin">admin</option>
      </select>
      <label>Domaine</label>
      <select id="nouvel-domaine">
        <option value="">-- Domaine --</option>
        ${domaines.map(d => `<option value="${d}">${d.replace(/-/g, " ")}</option>`).join("")}
      </select>
      <button class="btn" onclick="ajouterUtilisateur()">Créer</button>
    </div>
    </div>
  `;

  panneau.innerHTML += html;
}

function filtrerParRole() {
  const selected = document.getElementById("filtre-role").value;
  sessionStorage.setItem("filtre-role", selected);
  afficherUtilisateurs();
}

async function changerDomaine(id, nouveauDomaine) {
  await client.from("utilisateurs").update({ domaine: nouveauDomaine }).eq("id", id);
  alert("✅ Domaine mis à jour !");
  afficherUtilisateurs();
}

async function promouvoir(id, nouveauRole) {
  await client.from("utilisateurs").update({ role: nouveauRole }).eq("id", id);
  alert(`✅ Rôle mis à jour : ${nouveauRole}`);
  afficherUtilisateurs();
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

  const { data: sessionData } = await client.auth.getSession();
  const token = sessionData?.session?.access_token;

  if (!token) {
    alert("Session expirée ou non connectée. Veuillez vous reconnecter.");
    return;
  }

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