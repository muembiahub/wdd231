let toutesLesDemandes = [];

function afficherDemandes() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) return;

  panneau.innerHTML = `
    <h3>📋 Demandes</h3>
    <div class="filtres-demandes">
      <label>Statut :</label>
      <select id="filtre-statut">
        <option value="tous">Tous</option>
        <option value="en attente">En attente</option>
        <option value="traitée">Traité</option>
        <option value="rejetée">Rejetée</option>
      </select>

      <label>Catégorie :</label>
      <select id="filtre-categorie">
        <option value="toutes">Toutes</option>
        <option value="plomberie">Plomberie</option>
        <option value="électricité">Électricité</option>
        <option value="nettoyage">Nettoyage</option>
        <option value="menuiserie">Menuiserie</option>
        <option value="informatique-et-technologie">Informatique</option>
        <option value="santé">Santé</option>
        <option value="construction-et-réparation">Construction et réparation</option>
        <option value="manifestations-et-cérémonies">Manifestations et cérémonies</option>
        <option value="mécanique">Mécanique</option>
        <option value="formation">Formation</option>
        <option value="mode">Mode</option>
        <option value="beauté">Beauté</option>
        <option value="hôtels-et-restaurants">Hôtels et restaurants</option>
        <option value="animaux">Animaux</option>
        <option value="agriculture">Agriculture</option>
        <option value="immobilier">Immobilier</option>
        <option value="autres-services">Autres services</option>
      </select>

      <label>Recherche :</label>
      <input type="text" id="recherche-demande" placeholder="Nom ou email">
      <button class="btn" onclick="filtrerDemandes()">🔍 Filtrer</button>
    </div>

    <div class="export-actions">
      <button class="btn" onclick="exportDemandesCSV()">📄 Exporter en CSV</button>
      <button class="btn" onclick="exportDemandesPDF()">🧾 Exporter en PDF</button>
    </div>

    <div class="loader">Chargement des demandes...</div>
  `;

  client
    .from("kazidomo_demandes_services")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      document.querySelector(".loader")?.remove();
      if (error || !data) {
        panneau.innerHTML += "<p class='erreur'>Erreur de chargement des demandes.</p>";
        return;
      }
      toutesLesDemandes = data;
      afficherDemandesFiltrees();
    });
}

function filtrerDemandes() {
  afficherDemandesFiltrees();
}

function afficherDemandesFiltrees() {
  const statut = document.getElementById("filtre-statut")?.value || "tous";
  const categorie = document.getElementById("filtre-categorie")?.value || "toutes";
  const recherche = document.getElementById("recherche-demande")?.value.toLowerCase() || "";

  const demandesFiltres = toutesLesDemandes.filter(d => {
    const statutOK = statut === "tous" || d.statut === statut;
    const categorieOK = categorie === "toutes" || d.category === categorie;
    const rechercheOK =
      !recherche ||
      (d.name && d.name.toLowerCase().includes(recherche)) ||
      (d.client_email && d.client_email.toLowerCase().includes(recherche));
    return statutOK && categorieOK && rechercheOK;
  });

  const stats = {
    total: demandesFiltres.length,
    en_attente: demandesFiltres.filter(d => d.statut === "en attente").length,
    traitée: demandesFiltres.filter(d => d.statut === "traitée").length,
    rejetée: demandesFiltres.filter(d => d.statut === "rejetée").length
  };

  const resumeHTML = `
    <div class="resume-stats">
      <p><strong>Total :</strong> ${stats.total}</p>
      <p><strong>En attente :</strong> ${stats.en_attente}</p>
      <p><strong>Traitées :</strong> ${stats.traitée}</p>
      <p><strong>Rejetées :</strong> ${stats.rejetée}</p>
    </div>
  `;

  const listeHTML = demandesFiltres.map(d => `
    <div class="demande-card">
      <h3>🛠️ Service demandé</h3>
      <p><strong>Nom :</strong> ${d.name || "—"}</p>
      <p><strong>Email :</strong> <a href="mailto:${d.client_email}">${d.client_email || "—"}</a></p>
      <p><strong>WhatsApp :</strong> <a href="https://wa.me/${d.client_whatsapp}" target="_blank">${d.client_whatsapp || "—"}</a></p>
      <p><strong>Message :</strong> ${d.message || "—"}</p>
      <p><strong>Catégorie :</strong> ${d.category || "—"}</p>
      <p><strong>Service :</strong> ${d.service || "—"}</p>
      <p><strong>Prix :</strong> ${d.price ? d.price + " $" : "Non spécifié"}</p>
      <p><strong>Statut :</strong> <span class="statut-label">${d.statut || "—"}</span></p>
      <p><strong>Localisation :</strong> <a href="${d.map_url}" target="_blank">Voir sur la carte</a></p>
      <p><strong>Utilisateur ID :</strong> ${d.id || "—"}</p>
      <div class="action-buttons">
        <button class="btn btn-success" onclick="traiterDemande(${d.id})">✅ Marquer comme traité</button>
        <button class="btn btn-warning" onclick="rejeterDemande(${d.id})">🚫 Rejeter</button>
        <button class="btn btn-danger" onclick="supprimerDemande(${d.id})">🗑️ Supprimer</button>
      </div>
    </div>
  `).join("");

  document.querySelector(".resume-stats")?.remove();
  document.querySelector(".demandes-liste")?.remove();

  const resume = document.createElement("div");
  resume.className = "resume-stats";
  resume.innerHTML = resumeHTML;

  const container = document.createElement("div");
  container.className = "demandes-liste";
  container.innerHTML = demandesFiltres.length > 0 ? listeHTML : `<p class="info">Aucune demande trouvée pour ces critères.</p>`;

  document.querySelector(".export-actions")?.insertAdjacentElement("afterend", resume);
  resume.insertAdjacentElement("afterend", container);
}

function changerStatut(id, nouveauStatut) {
  if (!nouveauStatut) return;

  client
    .from("kazidomo_demandes_services")
    .update({ statut: nouveauStatut })
    .eq("id", parseInt(id))
    .select("id, statut")
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error("Erreur Supabase :", error);
        alert("❌ Échec de la mise à jour : " + error.message);
        return;
      }

      // Mise à jour locale
      toutesLesDemandes = toutesLesDemandes.map(d =>
        d.id === id ? { ...d, statut: nouveauStatut } : d
      );

      // Feedback visuel
      alert("✅ Statut mis à jour : " + nouveauStatut);
      afficherDemandesFiltrees();
    });
}

function supprimerDemande(id) {
  if (!confirm("❗ Supprimer cette demande ?")) return;

  client
    .from("kazidomo_demandes_services")
    .delete()
    .eq("id", parseInt(id))
    .select("id")
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error("Erreur Supabase :", error);
        alert("❌ Échec de la suppression : " + error.message);
        return;
      }

      toutesLesDemandes = toutesLesDemandes.filter(d => d.id !== id);
      alert("🗑️ Demande supprimée !");
      afficherDemandesFiltrees();
    });
}
function traiterDemande(id) {
  changerStatut(id, "traitée");
}

function rejeterDemande(id) {
  changerStatut(id, "rejetée");
}
function exportDemandesCSV() {
  const rows = Array.from(document.querySelectorAll(".demande-card")).map(card => {
    const cells = Array.from(card.querySelectorAll("p")).map(p => {
      const label = p.querySelector("strong")?.innerText || "";
      const value = p.innerText.replace(label, "").trim();
      return `"${value}"`;
    });
    return cells.join(",");
  });

  const header = [
    "Nom", "Email", "WhatsApp", "Adresse", "Message", "Catégorie", "Service",
    "Prix", "Statut", "Localisation", "Utilisateur ID"
  ].join(","
  );;
    const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "demandes_export.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

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
  win.document.write(contenu.innerHTML);
  win.document.write("</body></html>");
  win.document.close();
  win.print();
}