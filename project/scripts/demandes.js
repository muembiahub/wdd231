// 🧭 Initialiser le panneau de filtres (une seule fois)
function initialiserFiltresDemandes() {
  const panel = document.getElementById("admin-panel");
  if (panel.dataset.initialisé === "true") return;

  panel.innerHTML = `
    ${estAdmin ? `
      <select id="filtre-categorie">
        <option value="">Toutes les catégories</option>
        ${[
          "informatique-et-technologie", "plomberie", "électricité", "nettoyage", "menuiserie",
          "construction-et-réparation", "manifestations-et-cérémonies", "mécanique", "formation",
          "mode", "beauté", "hôtels-et-restaurants", "santé", "immobilier", "animaux", "agriculture",
          "autres-services"
        ].map(cat => `<option value="${cat}">${cat.replace(/-/g, " ")}</option>`).join("")}
      </select>
      <select id="filtre-statut">
        <option value="">Tous les statuts</option>
        <option value="traité">Traité</option>
        <option value="en attente">En attente</option>
        <option value="en cours">En cours</option>
        <option value="rejeté">Rejeté</option>
      </select>
    ` : ""}
    <div class="filtres-rapides">
      <input type="text" id="filtre-recherche" placeholder="🔍 Nom ou téléphone">
      <input type="date" id="date-debut">
      <input type="date" id="date-fin">
      <button onclick="afficherDemandes()">Filtrer</button>
      <button onclick="exporterCSV()">📤 Exporter CSV</button>
      <button onclick="exporterPDF()">🖨️ Exporter PDF</button>
    </div>
  `;
  panel.classList.add("show");
  panel.dataset.initialisé = "true";
}

// 🔍 Appliquer les filtres
function appliquerFiltres(data) {
  const cat = document.getElementById("filtre-categorie")?.value.toLowerCase();
  const statut = document.getElementById("filtre-statut")?.value.toLowerCase();
  const recherche = document.getElementById("filtre-recherche")?.value.toLowerCase();
  const dateDebut = document.getElementById("date-debut")?.value;
  const dateFin = document.getElementById("date-fin")?.value;

  return data.filter(d => {
    return (!cat || d.category?.toLowerCase() === cat) &&
           (!statut || d.statut?.toLowerCase() === statut) &&
           (!recherche || d.name?.toLowerCase().includes(recherche) || d.client_whatsapp?.includes(recherche)) &&
           (!dateDebut || new Date(d.created_at) >= new Date(dateDebut)) &&
           (!dateFin || new Date(d.created_at) <= new Date(dateFin));
  });
}

// 🧾 Afficher les cartes de demandes
function afficherCartesDemandes(demandes) {
  const container = document.getElementById("demandes-container");
  container.innerHTML = "";

  demandes.forEach(demande => {
    const card = document.createElement("div");
    card.className = "demandes-service-card";

    const badge = document.createElement("span");
    badge.className = `statut-badge ${demande.statut.replace(/\s/g, "_").toLowerCase()}`;
    badge.textContent = demande.statut.charAt(0).toUpperCase() + demande.statut.slice(1);
    card.appendChild(badge);

    card.innerHTML += `
      <h4>👤 Nom : ${demande.name}</h4>
      <p><strong>Catégorie :</strong> ${demande.category}</p>
      <p><strong>Service :</strong> ${demande.service}</p>
      <p><strong>Prix :</strong> ${demande.price} $</p>
      <p><strong>Email :</strong> ${demande.client_email}</p>
      <p><strong>WhatsApp :</strong> ${demande.client_whatsapp}</p>
      <p><strong>Location :</strong> <a href="${demande.map_url}" target="_blank">Voir sur la carte</a></p>
      <p><strong>Soumis le :</strong> ${new Date(demande.created_at).toLocaleString()}</p>
      <p><strong>Message :</strong> ${demande.message}</p>
    `;

    if (estAdmin) {
      const btnStatut = document.createElement("button");
      btnStatut.className = "btn";
      if (demande.statut === "traité") {
        btnStatut.textContent = "❌ Marquer comme non traité";
        btnStatut.onclick = async () => {
          await client.from("kazidomo_demandes_services").update({ statut: "en attente" }).eq("id", demande.id);
          afficherDemandes();
        };
      } else {
        btnStatut.textContent = "✅ Marquer comme traité";
        btnStatut.onclick = async () => {
          await client.from("kazidomo_demandes_services").update({ statut: "traité" }).eq("id", demande.id);
          afficherDemandes();
        };
      }
      card.appendChild(btnStatut);

      const btnSupprimer = document.createElement("button");
      btnSupprimer.textContent = "🗑️ Supprimer";
      btnSupprimer.className = "btn";
      btnSupprimer.onclick = async () => {
        if (confirm("Supprimer cette demande ?")) {
          await client.from("kazidomo_demandes_services").delete().eq("id", demande.id);
          afficherDemandes();
        }
      };
      card.appendChild(btnSupprimer);
    }

    container.appendChild(card);
  });
}

// 📦 Charger les données et afficher
async function afficherDemandes() {
  const container = document.getElementById("demandes-container");
  const statsBox = document.getElementById("stats-box");
  const chart = document.getElementById("chart-categories");

  container.innerHTML = "";
  statsBox.innerHTML = "";
  chart.style.display = "none";

  initialiserFiltresDemandes();

  let query = client.from("kazidomo_demandes_services").select("*").order("created_at", { ascending: false });
  if (!estAdmin && domaineAutorisé) query = query.eq("category", domaineAutorisé);

  const { data, error } = await query;
  if (error) {
    container.innerHTML = `<p class="erreur">Erreur : ${error.message}</p>`;
    return;
  }

  const filtrées = estAdmin ? appliquerFiltres(data) : data;
  afficherCartesDemandes(filtrées);

  if (estAdmin) {
    afficherStats(filtrées);
    afficherGraphique(filtrées);
  }
}