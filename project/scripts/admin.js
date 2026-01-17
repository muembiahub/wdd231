import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const client = createClient(
  "https://eumdndwnxjqdolbpcyrp.supabase.co",
  "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO",
);

document.addEventListener("DOMContentLoaded", () => {
  updateStatDemandesRecues();
  updateCategoryChart();
  chargerCategories();

  const statCard = document.getElementById("stat-demandes-recues");
  statCard?.addEventListener("click", () => {
    switchView("projects");
    afficherToutesLesDemandes();
  });

  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter?.addEventListener("change", () => {
    const selected = categoryFilter.value;
    afficherToutesLesDemandes(selected);
  });
});

function switchView(viewId) {
  document
    .querySelectorAll(".dashboard-view")
    .forEach((view) => view.classList.remove("active"));
  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.add("active");
}

async function updateStatDemandesRecues() {
  const valueEl = document.getElementById("total-demandes-value");
  const changeEl = document.getElementById("total-demandes-change");
  if (!valueEl || !changeEl) return;

  const { data, error } = await client
    .from("kazidomo_demandes_services")
    .select("id, created_at");

  if (error) {
    valueEl.textContent = "Erreur";
    changeEl.textContent = "";
    console.error(error);
    return;
  }

  valueEl.textContent = data.length;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekCount = data.filter(
    (d) => new Date(d.created_at) >= startOfWeek,
  ).length;
  changeEl.textContent = `+${thisWeekCount} cette semaine`;
}

async function updateCategoryChart() {
  const ctx = document.getElementById("categoryChart");
  if (!ctx) return;

  const { data, error } = await client
    .from("kazidomo_demandes_services")
    .select("category");

  if (error || !data) return;

  const counts = {};
  data.forEach((d) => {
    const cat = d.category || "Autre";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "#8b5cf6",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#3b82f6",
            "#ec4899",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    },
  });
}

async function chargerCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  const { data, error } = await client
    .from("kazidomo_demandes_services")
    .select("category");

  if (error || !data) {
    console.error("Erreur de chargement des catégories", error);
    return;
  }

  const uniqueCategories = [...new Set(data.map((d) => d.category || "Autre"))];

  uniqueCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

async function afficherToutesLesDemandes(categorie = "") {
  const container = document.getElementById("demandesContainer");
  if (!container) return;

  const { data, error } = await client
    .from("kazidomo_demandes_services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Erreur de chargement.</p>";
    console.error(error);
    return;
  }

  const filtered = categorie
    ? data.filter((d) => d.category === categorie)
    : data;

  if (filtered.length === 0) {
    container.innerHTML = "<p>Aucune demande pour cette catégorie.</p>";
    return;
  }

  container.innerHTML = filtered
    .map(
      (d) => `
    <div class="demande-card">
      <h3>${d.name}</h3>
      <p><strong>Email :</strong> <a href="mailto:${d.client_email}">${d.client_email}</a></p>
      <p><strong>Service :</strong> ${d.category}</p>
      <p><strong>Prix :</strong> ${d.price} USD</p>
      <p><strong>Téléphone :</strong> <a href="tel:${d.client_whatsapp}">${d.client_whatsapp}</a></p>
      <p><strong>Statut :</strong> ${d.statut}</p>
      <p><strong>Location :</strong> ${d.gps}</p>
      <p><strong>Map URL :</strong> <a href="${d.map_url}" target="_blank">Voir la localisation</a></p>
      <p><strong>Message :</strong> ${d.message}</p>
      <p><strong>Date :</strong> ${new Date(d.created_at).toLocaleDateString()}</p>
<p><strong>Heure :</strong> ${new Date(d.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
    </div>
  `,
    )
    .join("");
}

// 👥 Gestion des utilisateurs

async function afficherUtilisateurs() {
  const container = document.getElementById("usersContainer");
  if (!container) return;

  const { data, error } = await client
    .from("utilisateurs")
    .select("id,prenom, nom, email,genre,username, role, created_at,domaine");

  if (error) {
    container.innerHTML = "<p>Erreur de chargement des utilisateurs.</p>";
    console.error(error);
    return;
  }

  container.innerHTML = data
    .map(
      (u) => `
    <div class="demande-card">
      <h3>${u.prenom} ${u.nom}</h3>
      <p><strong>Username :</strong> ${u.username}</p>
      <p><strong>Genre :</strong> ${u.genre}</p>
      <p><strong>ID Utilisateur :</strong> <a href="utilisateur.html?id=${u.id}">${u.id}</a></p>
      <p><strong>Email :</strong> <a href="mailto:${u.email}">${u.email}</a></p>
      <p><strong>Rôle :</strong> <span class="role-label">${u.role}</span></p>
      <p><strong>Domaine :</strong> ${u.domaine}</p>
      <p><strong>Inscrit le :</strong> ${new Date(u.created_at).toLocaleDateString()}</p>

      <div class="demande-actions">
        <button onclick="modifierRole('${u.id}', '${u.email}')">Modifier rôle</button>
        <button onclick="modifierDomaine('${u.id}', '${u.email}')">Modifier domaine</button>
        <button onclick="modifierInscription('${u.id}', '${u.email}')">Modifier date d'inscription</button>
        <button onclick="supprimerUtilisateur('${u.id}')">Supprimer</button>
      </div>
    </div>
  `,
    )
    .join("");
}
// 🔄 Modifier rôle utilisateur
async function modifierRole(id, email) {
  const nouveauRole = prompt(
    `Nouveau rôle pour ${email} {${u.role}} {${u.domaine}} :`,
  );
  if (!nouveauRole) return;

  const { error } = await client
    .from("utilisateurs")
    .update({ role: nouveauRole })
    .eq("id", id);

  if (error) {
    alert("Erreur lors du changement de rôle.");
    console.error(error);
    return;
  }

  alert("Rôle mis à jour !");
  afficherUtilisateurs();
}
// 🗑️ Supprimer utilisateur

async function supprimerUtilisateur(id) {
  if (!confirm("Confirmer la suppression de cet utilisateur ?")) return;

  const { error } = await client.from("utilisateurs").delete().eq("id", id);

  if (error) {
    alert("Erreur lors de la suppression.");
    console.error(error);
    return;
  }

  alert("Utilisateur supprimé !");
  afficherUtilisateurs();
}
// Navigation admin
const adminNav = document.querySelector('[data-view="adminUsers"]');
adminNav?.addEventListener("click", () => {
  switchView("adminUsers");
  afficherUtilisateurs();
});
