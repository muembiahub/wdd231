// 🔹 Fonction pour basculer le menu hamburger
function toggleMenu() {
  const menu = document.getElementById("hamburger-menu");
  const overlay = document.getElementById("menu-overlay");
  const btn = document.getElementById("hamburger-btn");

  menu.classList.toggle("hidden");
  overlay.classList.toggle("hidden");

  const isOpen = !menu.classList.contains("hidden");
  btn.setAttribute("aria-expanded", isOpen);

  if (isOpen) {
    const firstItem = menu.querySelector("ul li");
    if (firstItem) firstItem.focus();
  }
}

// 🔹 Affiche le badge du rôle
function afficherBadgeRole() {
  const badge = document.getElementById("role-badge");
  const role = (sessionStorage.getItem("role") || "user").toLowerCase();

  const couleurs = {
    superadmin: "#dc2626",
    admin: "#16a34a",
    prestataire: "#f59e0b",
    requerant: "#2563eb",
    user: "#6b7280"
  };

  badge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  badge.style.backgroundColor = couleurs[role] || couleurs.user;
  badge.style.color = "#fff";
  badge.style.padding = "6px 12px";
  badge.style.borderRadius = "8px";
  badge.style.fontWeight = "bold";
}

// 🔹 Affiche du contenu dans le panneau principal
function afficherContenu(titre, contenu) {
  const panneau = document.getElementById("contenu-carte");
  panneau.innerHTML = `<h3>${titre}</h3><div>${contenu}</div>`;
  panneau.style.display = "block";
}

// 🔹 Fonction utilitaire pour récupérer le vrai rôle
async function getUserRole(client, user) {
  const { data, error } = await client
    .from("utilisateurs")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!error && data) {
    return data.role.toLowerCase();
  }

  if (user.app_metadata?.role) {
    return user.app_metadata.role.toLowerCase();
  } else if (user.user_metadata?.role) {
    return user.user_metadata.role.toLowerCase();
  }
  return "user";
}

// 🔹 Fonction pour afficher le tableau de bord
function afficherTableauDeBord(nomComplet, role, email) {
  const rolesDescription = {
    superadmin: "Vous avez accès à toutes les fonctionnalités, y compris la gestion des utilisateurs et des rôles.",
    admin: "Vous pouvez gérer les demandes, les services et les utilisateurs.",
    prestataire: "Vous pouvez gérer vos services, consulter les statistiques et exporter des données.",
    requerant: "Vous pouvez gérer vos demandes et consulter votre profil.",
    user: "Vous pouvez consulter votre profil et accéder aux options de base."
  };

  const avatars = {
    superadmin: { icon: "fa-solid fa-crown", color: "#dc2626" },
    admin: { icon: "fa-solid fa-shield-halved", color: "#16a34a" },
    prestataire: { icon: "fa-solid fa-screwdriver-wrench", color: "#f59e0b" },
    requerant: { icon: "fa-solid fa-file-lines", color: "#2563eb" },
    user: { icon: "fa-solid fa-user", color: "#6b7280" }
  };

  const avatar = avatars[role] || avatars.user;

  afficherContenu(
    `Bienvenue ${nomComplet} 👋`,
    `
      <div class="welcome-layout">
        <div class="avatar default-avatar" style="background:${avatar.color}">
          <i class="${avatar.icon}"></i>
        </div>
        <div class="welcome-text">
          <p>Vous êtes connecté en tant que <strong>${role.charAt(0).toUpperCase() + role.slice(1)}</strong>.</p>
          <p>Votre email est <strong><a href="mailto:${email}">${email}</a></strong></p>
          <h2>Voici un aperçu de vos permissions :</h2>
          <p>${rolesDescription[role] || rolesDescription.user}</p>
          <ul>
            <li>Accédez aux modules via le menu hamburger</li>
            <li>Modifiez vos informations personnelles</li>
            <li>Gérez vos paramètres de compte</li>
            <li>Contactez le support si besoin</li>
          </ul>
        </div>
      </div>
    `
  );
}

// 🔹 Construit le menu en fonction du rôle
function afficherMenu() {
  const menuItems = document.getElementById("menu-items");
  const role = (sessionStorage.getItem("role") || "user").toLowerCase();

  const menus = [
    { 
      titre: "Tableau de bord", 
      icon: "fa-solid fa-house", 
      action: async () => {
        const nomComplet = sessionStorage.getItem("nomComplet") || "Utilisateur";
        const role = (sessionStorage.getItem("role") || "user").toLowerCase();
        const email = sessionStorage.getItem("email") || "";
        afficherTableauDeBord(nomComplet, role, email);
      }, 
      roles: ["admin","superadmin","prestataire","requerant"] 
    },
    { titre: "Demandes", icon: "fa-solid fa-file-lines", action: afficherDemandes, roles: ["admin","superadmin"] },
    { titre: " Services", icon: "fa-solid fa-screwdriver-wrench", action: () => afficherContenu("Services","Module en cours..."), roles: ["admin","superadmin","prestataire"] },
    { titre: " Paramètres", icon: "fa-solid fa-gear", action: parametresCompte, roles: ["admin","superadmin","prestataire","requerant"] },
    {titre : " Utilisateurs", icon: "fa-solide fa-users", action: afficherUtilisateurs, roles:["admin","superadmin"]} ,
    { titre: " Mon profil", icon: "fa-solid fa-id-badge", action: afficherProfil, roles: ["admin","superadmin","prestataire","requerant"] },
    { titre: " Statistiques", icon: "fa-solid fa-chart-pie", action: afficherGraphiquesEtStats, roles: ["admin","superadmin","prestataire"] },
    { titre: " Export", icon: "fa-solid fa-file-export", action: exporterDemandes, roles: ["admin","superadmin","prestataire"] },
    { titre: " Support", icon: "fa-solid fa-headset", action: () => afficherContenu("Support","Contactez-nous à <a href='mailto:contact@kazidomo.com'>contact@kazidomo.com</a>"), roles: ["admin","superadmin","prestataire","requerant"] },
    { titre: " Aide", icon: "fa-solid fa-circle-question", action: () => afficherContenu("Aide","Consultez la FAQ."), roles: ["admin","superadmin","prestataire","requerant"] },
    { 
      titre: " Déconnexion", 
      icon: "fa-solid fa-right-from-bracket", 
      action: async () => { 
        afficherContenu("Déconnexion","Redirection..."); 
        await client.auth.signOut();   
        window.location.href="login.html"; 
      }, 
      roles: ["admin","superadmin","prestataire","requerant"] 
    },
  ];

  menuItems.innerHTML = "";

  menus.forEach(menu => {
    const autorise = menu.roles.includes(role);
    const li = document.createElement("li");
    li.className = autorise ? "" : "disabled";

    li.innerHTML = `<i class="${menu.icon}"></i> ${menu.titre}`;

    if (autorise) {
      li.addEventListener("click", async () => {
        document.querySelectorAll("#menu-items li").forEach(item => item.classList.remove("active"));
        li.classList.add("active");
        toggleMenu();
        await menu.action();
      });
    }

    menuItems.appendChild(li);
  });
}

// 🔹 Initialisation au chargement
window.onload = async () => {
  document.getElementById("hamburger-btn").addEventListener("click", toggleMenu);
  document.getElementById("menu-overlay").addEventListener("click", toggleMenu);

  let nomComplet = "Utilisateur";
  let role = "user";
  let email = "";

  const { data: { user } } = await client.auth.getUser();
  if (user) {
    const surname = user.user_metadata?.surname || "";
    const name = user.user_metadata?.name || "";
    nomComplet = (surname + " " + name).trim() || "inconnu";

    role = await getUserRole(client, user);
    email = user.email || "";

    sessionStorage.set
      // 🔹 Affiche le badge et le menu
  afficherBadgeRole();
  afficherMenu();

  // 🔹 Affiche directement le tableau de bord au chargement
  afficherTableauDeBord(nomComplet, role, email);
};
}
