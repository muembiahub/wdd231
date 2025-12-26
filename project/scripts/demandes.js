// Variables globales
let toutesLesDemandes = [];
let pageCourante = 1;
const demandesParPage = 10;
let critereTri = "date";
let ordreTri = "desc";

// 🔹 Charger les demandes
async function afficherDemandes() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) return;

  panneau.innerHTML = `
    <h3>📋 Demandes</h3>
    <div class="filtres-demandes">
      <label>Statut :</label>
      <select id="filtre-statut" onchange="filtrerDemandes()">
        <option value="tous">Tous</option>
        <option value="en attente">En attente</option>
        <option value="traité">Traité</option>
        <option value="rejeté">Rejeté</option>
      </select>

      <label>Catégorie :</label>
      <input type="text" id="filtre-categorie" placeholder="Catégorie libre" oninput="filtrerDemandes()">

      <label>Recherche :</label>
      <input type="text" id="recherche-demande" placeholder="Nom ou email" oninput="filtrerDemandes()">

      <label>Tri :</label>
      <select id="tri-demandes" onchange="changerTri()">
        <option value="date-desc">Date ↓</option>
        <option value="date-asc">Date ↑</option>
        <option value="prix-desc">Prix ↓</option>
        <option value="prix-asc">Prix ↑</option>
        <option value="statut-asc">Statut A→Z</option>
        <option value="statut-desc">Statut Z→A</option>
      </select>
    </div>

    <div class="export-actions">
      <button class="btn" onclick="exportDemandesCSV()">📄 Exporter en CSV</button>
      <button class="btn" onclick="exportDemandesPDF()">🧾 Exporter en PDF</button>
    </div>

    <div class="loader">⏳ Chargement...</div>
  `;

  try {
    const { data, error } = await client
      .from("kazidomo_demandes_services")
      .select("*")
      .order("created_at", { ascending: false });

    document.querySelector(".loader")?.remove();

    if (error) {
      panneau.innerHTML += "<p class='erreur'>❌ Erreur de chargement.</p>";
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      panneau.innerHTML += "<p class='info'>ℹ️ Aucune demande trouvée.</p>";
      return;
    }

    toutesLesDemandes = data;
    pageCourante = 1;
    afficherDemandesFiltrees();
  } catch (err) {
    document.querySelector(".loader")?.remove();
    panneau.innerHTML += "<p class='erreur'>⚠️ Erreur inattendue.</p>";
    console.error(err);
  }
}

// 🔹 Changer critère de tri
function changerTri() {
  const valeur = document.getElementById("tri-demandes").value;
  [critereTri, ordreTri] = valeur.split("-");
  filtrerDemandes();
}

// 🔹 Filtrer les demandes
function filtrerDemandes() {
  pageCourante = 1;
  afficherDemandesFiltrees();
}

// 🔹 Appliquer tri
function trierDemandes(demandes) {
  return demandes.sort((a, b) => {
    if (critereTri === "date") {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return ordreTri === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (critereTri === "prix") {
      const prixA = parseFloat(a.price) || 0;
      const prixB = parseFloat(b.price) || 0;
      return ordreTri === "asc" ? prixA - prixB : prixB - prixA;
    }
    if (critereTri === "statut") {
      return ordreTri === "asc"
        ? (a.statut || "").localeCompare(b.statut || "")
        : (b.statut || "").localeCompare(a.statut || "");
    }
    return 0;
  });
}

// 🔹 Afficher avec pagination + filtres + tri + actions
function afficherDemandesFiltrees() {
  const statut = (document.getElementById("filtre-statut")?.value || "tous").toLowerCase();
  const categorie = (document.getElementById("filtre-categorie")?.value || "").toLowerCase();
  const recherche = (document.getElementById("recherche-demande")?.value || "").toLowerCase();

  let demandesFiltres = toutesLesDemandes.filter(d => {
    const s = d.statut?.toLowerCase() || "";
    const c = d.category?.toLowerCase() || "";
    const n = d.name?.toLowerCase() || "";
    const e = d.client_email?.toLowerCase() || "";

    const statutOK = statut === "tous" || s === statut;
    const categorieOK = !categorie || c.includes(categorie);
    const rechercheOK = !recherche || n.includes(recherche) || e.includes(recherche);

    return statutOK && categorieOK && rechercheOK;
  });

  demandesFiltres = trierDemandes(demandesFiltres);

  // 🔹 Calcul des statistiques
  const stats = {
    total: demandesFiltres.length,
    en_attente: demandesFiltres.filter(d => d.statut?.toLowerCase() === "en attente").length,
    traitees: demandesFiltres.filter(d => d.statut?.toLowerCase() === "traité").length,
    rejetees: demandesFiltres.filter(d => d.statut?.toLowerCase() === "rejeté").length,
    supprimees: toutesLesDemandes.length - demandesFiltres.length
  };

  // 🔹 Résumé HTML
  const resumeHTML = `
  <div class="resume-stats">
  <p class="total"><strong>Total :</strong> <span>${stats.total}</span></p>
  <p class="attente"><strong>En attente :</strong> <span>${stats.en_attente}</span></p>
  <p class="traitees"><strong>Traitées :</strong> <span>${stats.traitees}</span></p>
  <p class="rejetees"><strong>Rejetées :</strong> <span>${stats.rejetees}</span></p>
  <p class="supprimees"><strong>Supprimées :</strong> <span>${stats.supprimees}</span></p>
</div>

  `;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(demandesFiltres.length / demandesParPage));
  const startIndex = (pageCourante - 1) * demandesParPage;
  const endIndex = startIndex + demandesParPage;
  const demandesPage = demandesFiltres.slice(startIndex, endIndex);

  // Cartes avec actions
  const listeHTML = demandesPage.map(d => `
<div class="demande-card">
  <h3>Demande</h3>
  
  <p><strong>Nom :</strong> ${d.name || "Pas de nom"}</p>
  
  <p><strong>Email :</strong> 
    ${d.client_email 
      ? `<a href="mailto:${d.client_email}">${d.client_email}</a>` 
      : "Pas d'email"}
  </p>
  
  <p><strong>WhatsApp :</strong> 
    ${d.client_whatsapp 
      ? `<a href="tel:${d.client_whatsapp}">${d.client_whatsapp}</a>` 
      : "Pas de numéro"}
  </p>
  
  <p><strong>Message :</strong> ${d.message || "Pas de message"}</p>
  <p><strong>Catégorie :</strong> ${d.category || "Non spécifié"}</p>
  <p><strong>Service :</strong> ${d.service || "Non spécifié"}</p>
  <p><strong>Prix :</strong> ${d.price ? d.price + " $" : "Non spécifié"}</p>
  <p><strong>Statut :</strong> 
  <span class="statut ${d.statut?.toLowerCase() || 'inconnu'}">
    ${d.statut || "Non spécifié"}
  </span>
</p>

  
  <p><strong>Localisation :</strong> 
    ${d.map_url 
      ? `<a href="${d.map_url}" target="_blank">📍 Voir la carte</a>` 
      : "—"}
  </p>
  
  <div class="action-buttons">
    <button class="btn btn-success" onclick="changerStatut('${d.id}', 'traité')">✅ Traiter</button>
    <button class="btn btn-warning" onclick="changerStatut('${d.id}', 'rejeté')">🚫 Rejeter</button>
    <button class="btn btn-danger" onclick="supprimerDemande('${d.id}')">🗑️ Supprimer</button>
  </div>
</div>

  `).join("");

  // Nettoyage ancien contenu
  document.querySelector(".resume-stats")?.remove();
  document.querySelector(".demandes-liste")?.remove();
  document.querySelector(".pagination")?.remove();

  // Injection résumé
  const resume = document.createElement("div");
  resume.className = "resume-stats";
  resume.innerHTML = resumeHTML;
  document.querySelector(".export-actions")?.insertAdjacentElement("afterend", resume);

  // Injection liste
  const container = document.createElement("div");
  container.className = "demandes-liste";
  container.innerHTML = demandesPage.length > 0 ? listeHTML : `<p class="info">ℹ️ Aucune demande trouvée.</p>`;

  // Injection pagination
  const pagination = document.createElement("div");
  pagination.className = "pagination";
  pagination.innerHTML = `
    <button class="btn" onclick="changerPage(${pageCourante - 1})" ${pageCourante <= 1 ? "disabled" : ""}>⬅️ Précédent</button>
    <span>Page ${pageCourante} / ${totalPages}</span>
    <button class="btn" onclick="changerPage(${pageCourante + 1})" ${pageCourante >= totalPages ? "disabled" : ""}>Suivant ➡️</button>
  `;

  resume.insertAdjacentElement("afterend", container);
  container.insertAdjacentElement("afterend", pagination);

  console.log("Cartes affichées :", demandesPage.length);
}


// 🔹 Changer de page
function changerPage(nouvellePage) {
  pageCourante = nouvellePage;
  afficherDemandesFiltrees();
}

/// 🔹 Changer le statut
async function changerStatut(id, nouveauStatut) {
  try {
    const { error } = await client
      .from("kazidomo_demandes_services")
      .update({ statut: nouveauStatut })
      .eq("id", id);

    if (error) {
      alert("❌ Échec de la mise à jour : " + error.message);
      return;
    }

    // Mettre à jour localement
    toutesLesDemandes = toutesLesDemandes.map(d =>
      d.id === id ? { ...d, statut: nouveauStatut } : d
    );

    alert("✅ Statut mis à jour : " + nouveauStatut);
    afficherDemandesFiltrees();
  } catch (err) {
    alert("⚠️ Erreur inattendue.");
    console.error(err);
  }
}

// 🔹 Supprimer une demande
async function supprimerDemande(id) {
  if (!confirm("❗ Voullez-vous Supprimer cette demande ?")) return;

  try {
    const { error } = await client
      .from("kazidomo_demandes_services")
      .delete()
      .eq("id", id);

    if (error) {
      alert("❌ Échec de la suppression : " + error.message);
      return;
    }

    // Supprimer localement
    toutesLesDemandes = toutesLesDemandes.filter(d => d.id !== id);
    alert("🗑️ Demande supprimée !");
    afficherDemandesFiltrees();
  } catch (err) {
    alert("⚠️ Erreur inattendue.");
    console.error(err);
  }
}

// 🔹 Export CSV
function exportDemandesCSV() {
  const rows = toutesLesDemandes.map(d => [
    d.name || "Pas de nom",
    d.client_email || "Pas d'email",
    d.client_whatsapp || "Pas de numéro",
    d.message || "—",
    d.category || "—",
    d.service || "—",
    d.price ? d.price + " $" : "Non spécifié",
    d.statut || "—",
    d.map_url || "—",
    d.id || "—"
  ].map(val => `"${val}"`).join(","));

  const header = [
    "Nom", "Email", "WhatsApp", "Message", "Catégorie", "Service",
    "Prix", "Statut", "Localisation", "Utilisateur ID"
  ].join(",");

  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "demandes_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 🔹 Export PDF
function exportDemandesPDF() {
  const contenu = document.querySelector(".demandes-liste");
  const win = window.open("", "", "width=800,height=600");
  win.document.write("<html><head><title>Export PDF</title>");
  win.document.write(`
    <style>
      body { font-family: Segoe UI, sans-serif; padding: 2rem; }
      .demande-card { margin-bottom: 2rem; border-bottom: 1px solid #ccc; padding-bottom: 1rem; }
      .statut-label { font-weight: bold; color: #2563eb; }
    </style>
  `);
  win.document.write("</head><body>");
  win.document.write("<h2>📋 Export des demandes filtrées</h2>");
  win.document.write(contenu?.innerHTML || "<p>Aucune demande à exporter.</p>");
  win.document.write("</body></html>");
  win.document.close();
  win.print();
}

