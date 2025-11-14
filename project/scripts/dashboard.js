function toggleMenu() {
  const nav = document.getElementById("dashboard");
  if (nav) nav.classList.toggle("hidden");
}

function afficherBadgeRole() {
  const badge = document.getElementById("role-badge");
  const role = sessionStorage.getItem("role")?.toLowerCase() || "user";

  const couleurs = {
    superadmin: "#dc2626",
    admin: "#22c55e",
    prestataire: "#f59e0b",
    requerant: "#3b82f6",
  };

  badge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  badge.style.backgroundColor = couleurs[role] || "#6b7280";
}

function toggleCarte(element, callback) {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) return;

  const estActive = element.classList.contains("active");

  document.querySelectorAll(".navigateur").forEach(carte => {
    carte.classList.remove("active", "disabled");
  });

  if (!estActive) {
    element.classList.add("active");
    document.querySelectorAll(".navigateur").forEach(carte => {
      if (carte !== element) carte.classList.add("disabled");
    });
    panneau.innerHTML = "<p>Chargement...</p>";
    panneau.style.display = "block";
    if (typeof callback === "function") callback();
  } else {
    panneau.style.display = "none";
  }
}

function afficherCartes() {
  const dashboard = document.getElementById("dashboard");
  const role = sessionStorage.getItem("role")?.toLowerCase() || "user";

  const cartes = [
    {
      titre: "📋 Demandes",
      description: "Voir toutes les demandes",
      action: afficherDemandes,
      roles: ["admin", "superadmin"]
    },
    {
      titre: "🛠️ Services",
      description: "Gérer les services",
      action: () => {
        document.getElementById("contenu-carte").innerHTML =
          "<h3>Services</h3><p>Module en cours de développement...</p>";
      },
      roles: ["admin", "superadmin", "prestataire"]
    },
    {
      titre: "👥 Utilisateurs",
      description: "Gérer les comptes",
      action: afficherUtilisateurs,
      roles: ["admin", "superadmin"]
    },
    {
      titre: "🔒 Paramètres",
      description: "Paramètres du compte",
      action: parametresCompte,
      roles: ["admin", "superadmin", "prestataire", "requerant"]
    },
    {
      titre: "👤 Mon profil",
      description: "Mes informations",
      action: afficherProfil,
      roles: ["admin", "superadmin", "prestataire", "requerant"]
    },
    {
      titre: "📊 Statistiques",
      description: "Voir les graphiques",
      action: afficherGraphiquesEtStats,
      roles: ["admin", "superadmin", "prestataire"]
    },
    {
      titre: "📤 Export",
      description: "Exporter les données",
      action: exporterDemandes,
      roles: ["admin", "superadmin", "prestataire"]
    },
    {
      titre: "🚪 Déconnexion",
      description: "Se déconnecter",
      action: () => {
        document.getElementById("contenu-carte").innerHTML =
          "<h3>Déconnexion</h3><p>Redirection en cours...</p>";
        client.auth.signOut().then(() => {
          window.location.href = "login.html";
        });
      },
      roles: ["admin", "superadmin", "prestataire", "requerant"]
    },
    {
      titre: "🆘 Support",
      description: "Contacter le support",
      action: () => {
        document.getElementById("contenu-carte").innerHTML =
          "<h3>Support</h3><p>Contactez-nous à <a href='mailto:contact@kazidomo.com'>contact@kazidomo.com</a></p>";
      },
      roles: ["admin", "superadmin", "prestataire", "requerant"]
    },
    {
      titre: "❓ Aide",
      description: "Obtenir de l'aide",
      action: () => {
        document.getElementById("contenu-carte").innerHTML =
          "<h3>Aide</h3><p>Consultez la FAQ ou la documentation.</p>";
      },
      roles: ["admin", "superadmin", "prestataire", "requerant"]
    }
  ];

  dashboard.innerHTML = "";

  cartes.forEach(carte => {
    const autorise = carte.roles.includes(role);
    const div = document.createElement("div");
    div.className = "navigateur" + (autorise ? "" : " disabled");
    div.innerHTML = `
      <h2>${carte.titre}</h2>
      <p>${autorise ? carte.description : "Accès restreint à votre rôle.<br><strong>Veuillez contacter un administrateur.</strong>"}</p>
    `;
    if (autorise) {
      div.addEventListener("click", () => toggleCarte(div, carte.action));
    }
    dashboard.appendChild(div);
  });
}

window.onload = () => {
  afficherBadgeRole();
  afficherCartes();
};