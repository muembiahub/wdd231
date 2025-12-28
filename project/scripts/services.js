// Variables globales pour services
let toutesLesServices = [];
let pageCouranteServices = 1;
const servicesParPage = 10;
let critereTriServices = "date";
let ordreTriServices = "desc";

// 🔹 Afficher les services
async function afficherServices() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) return;

  panneau.innerHTML = `
    <h3><i class="fa-solid fa-screwdriver-wrench"></i> Services</h3>
    <div class="filtres-services">
      <label>Catégorie :</label>
      <input type="text" id="filtre-service-categorie" placeholder="Catégorie libre" oninput="filtrerServices()">

      <label>Recherche :</label>
      <input type="text" id="recherche-service" placeholder="Nom ou description" oninput="filtrerServices()">

      <label>Tri :</label>
      <select id="tri-services" onchange="changerTriServices()">
        <option value="date-desc">Date ↓</option>
        <option value="date-asc">Date ↑</option>
        <option value="prix-desc">Prix ↓</option>
        <option value="prix-asc">Prix ↑</option>
        <option value="nom-asc">Nom A→Z</option>
        <option value="nom-desc">Nom Z→A</option>
      </select>
    </div>

    <div class="export-actions">
      <button class="btn" onclick="exportServicesCSV()">📄 Exporter en CSV</button>
      <button class="btn" onclick="exportServicesPDF()">🧾 Exporter en PDF</button>
    </div>

    <div class="loader">⏳ Chargement...</div>
  `;

  try {
    const role = (sessionStorage.getItem("role") || "user").toLowerCase();
    const userCategory = (sessionStorage.getItem("category") || "").toLowerCase();

    let query = client.from("kazidomo_demandes_services").select("*").order("created_at", { ascending: false });

    // 🔹 Condition selon rôle
    if (role === "prestataire" && userCategory) {
      query = query.eq("category", userCategory);
    } else if (role === "user" || role === "requerant") {
      panneau.innerHTML = `<p class="info">🚫 Vous n'avez pas accès à la gestion des services.</p>`;
      return;
    }

    const { data, error } = await query;

    document.querySelector(".loader")?.remove();

    if (error) {
      panneau.innerHTML += "<p class='erreur'>❌ Erreur de chargement.</p>";
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      panneau.innerHTML += "<p class='info'>ℹ️ Aucun service trouvé.</p>";
      return;
    }

    toutesLesServices = data;
    pageCouranteServices = 1;
    afficherServicesFiltres();
  } catch (err) {
    document.querySelector(".loader")?.remove();
    panneau.innerHTML += "<p class='erreur'>⚠️ Erreur inattendue.</p>";
    console.error(err);
  }
}

// 🔹 Changer critère de tri
function changerTriServices() {
  const valeur = document.getElementById("tri-services").value;
  [critereTriServices, ordreTriServices] = valeur.split("-");
  filtrerServices();
}

// 🔹 Filtrer les services
function filtrerServices() {
  pageCouranteServices = 1;
  afficherServicesFiltres();
}

// 🔹 Appliquer tri
function trierServices(services) {
  return services.sort((a, b) => {
    if (critereTriServices === "date") {
      return ordreTriServices === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at);
    }
    if (critereTriServices === "prix") {
      return ordreTriServices === "asc"
        ? (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0)
        : (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    }
    if (critereTriServices === "nom") {
      return ordreTriServices === "asc"
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "");
    }
    return 0;
  });
}

// 🔹 Afficher avec pagination + filtres + tri + actions conditionnelles
function afficherServicesFiltres() {
  const role = (sessionStorage.getItem("role") || "user").toLowerCase();

  const categorie = (document.getElementById("filtre-service-categorie")?.value || "").toLowerCase();
  const recherche = (document.getElementById("recherche-service")?.value || "").toLowerCase();

  let servicesFiltres = toutesLesServices.filter(s => {
    const c = s.category?.toLowerCase() || "";
    const n = s.name?.toLowerCase() || "";
    const d = s.description?.toLowerCase() || "";

    const categorieOK = !categorie || c.includes(categorie);
    const rechercheOK = !recherche || n.includes(recherche) || d.includes(recherche);

    return categorieOK && rechercheOK;
  });

  servicesFiltres = trierServices(servicesFiltres);

  const totalPages = Math.max(1, Math.ceil(servicesFiltres.length / servicesParPage));
  const startIndex = (pageCouranteServices - 1) * servicesParPage;
  const endIndex = startIndex + servicesParPage;
  const servicesPage = servicesFiltres.slice(startIndex, endIndex);

  const listeHTML = servicesPage.map(s => {
    let boutons = `
      <button class="btn btn-primary" onclick="modifierService('${s.id}')">✏️ Modifier</button>
      <button class="btn btn-info" onclick="mettreEnAttenteService('${s.id}')">⏳ Mettre en attente</button>
      <button class="btn btn-warning" onclick="changerStatutService('${s.id}', 'approuvé')">✅ Approuver</button>
      <button class="btn btn-secondary" onclick="changerStatutService('${s.id}', 'rejeté')">❌ Rejeter</button>
    `;

    if (role === "admin" || role === "superadmin") {
      boutons += `<button class="btn btn-danger" onclick="supprimerService('${s.id}')">🗑️ Supprimer</button>`;
    }

    return `
      <div class="demande-card">
        <h3><i class="fa-solid fa-screwdriver-wrench"></i> ${s.name || "<em><u>Pas de nom</u></em>"}</h3>
        <p><strong>Catégorie du service sollicité  :</strong> ${s.category || "<em><u>Non spécifié</u></em>"}</p>
        <p><strong>Service sollicité  :</strong> ${s.service || "<em><u>Non spécifié</u></em>"}</p>
        <p><strong>Statut  :</strong> ${s.statut || "<em><u>indefinie </u></em>"}</p>
        <p><strong>Prix :</strong> ${s.price ? s.price + " $" : "<em><u>Non spécifié</u></em>"}</p>
        <p><strong>Envoyé le  :</strong> ${new Date(s.created_at).toLocaleDateString()}</p>
        <div class="action-buttons">${boutons}</div>
      </div>
    `;
  }).join("");

  document.querySelector(".services-liste")?.remove();
  document.querySelector(".pagination-services")?.remove();

  const container = document.createElement("div");
  container.className = "services-liste";
  container.innerHTML = servicesPage.length > 0 ? listeHTML : `<p class="info">ℹ️ Aucun service trouvé.</p>`;

  const pagination = document.createElement("div");
  pagination.className = "pagination-services";
  pagination.innerHTML = `
    <button class="btn" onclick="changerPageServices(${pageCouranteServices - 1})" ${pageCouranteServices <= 1 ? "disabled" : ""}>⬅️ Précédent</button>
    <span>Page ${pageCouranteServices} / ${totalPages}</span>
    <button class="btn" onclick="changerPageServices(${pageCouranteServices + 1})" ${pageCouranteServices >= totalPages ? "disabled" : ""}>Suivant ➡️</button>
  `;

  document.querySelector(".export-actions")?.insertAdjacentElement("afterend", container);
  container.insertAdjacentElement("afterend", pagination);
}

// 🔹 Changer de page
function changerPageServices(nouvellePage) {
  pageCouranteServices = nouvellePage;
  afficherServicesFiltres();
}

// 🔹 Export CSV
function exportServicesCSV() {
  const rows = toutesLesServices.map(s => [
    s.name || "Pas de nom",
    s.description || "—",
    s.category || "—",
    s.price ? s.price + " $" : "Non spécifié",
    s.created_at || "—"
  ].map(val => `"${val}"`).join(","));

  const header = ["Nom", "Serices", "Catégorie", "Prix","Statut", "Date"].join(",");
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "services_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 🔹 Export PDF
function exportServicesPDF() {
  const contenu = document.querySelector(".services-liste");
  const win = window.open("", "", "width=800,height=600");
  win.document.write("<html><head><title>Export PDF</title>");
  win.document.write(`
    <style>
      body { font-family: Segoe UI, sans-serif; padding: 2rem; }
      .demande-card { margin-bottom: 2rem; border-bottom: 1px solid #ccc; padding-bottom: 1rem; }
      h3 { color: #2563eb; }
      .action-buttons { margin-top: 1rem; }
      .btn { margin-right: 8px; padding: 6px 12px; border-radius: 4px; }
    </style>
  `);
  win.document.write("</head><body>");
  win.document.write("<h2>📋 Export des services filtrés</h2>");
  win.document.write(contenu?.innerHTML || "<p>Aucun service à exporter.</p>");
  win.document.write("</body></html>");
  win.document.close();
  win.print();
}

// 🔹 Actions backend (à sécuriser côté Supabase aussi)
async function modifierService(id) {
  afficherContenu("Modifier service", `Formulaire de modification pour le service #${id}`);
  // Ici tu peux charger les données du service et afficher un formulaire
}

async function mettreEnAttenteService(id) {
  afficherContenu("Mettre en attente", `Le service #${id} est mis en attente.`);
   
  // Ici tu peux mettre à jour le champ status dans Supabase
}

async function changerStatutService(id, nouveauStatut) {
  afficherContenu("Changer statut", `Le statut du service #${id} est passé à ${nouveauStatut}.`);

  // Ici tu peux mettre à jour le champ status dans Supabase
}

async function supprimerService(id) {
  const role = (sessionStorage.getItem("role") || "user").toLowerCase();
  if (role !== "admin" && role !== "superadmin") {
    afficherAccesRefuse("Supprimer un service");
    return;
  }

  const { error } = await client.from("kazidomo_demandes_services").delete().eq("id", id);
  if (error) {
    afficherContenu("Erreur", "❌ Impossible de supprimer le service.");
    console.error(error);
  } else {
    afficherContenu("Suppression", "✅ Service supprimé avec succès.");
    afficherServices(); // recharger la liste
  }
}
