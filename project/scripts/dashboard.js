
// 📦 Connexion à Supabase
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let estAdmin = false;


// 🚀 Initialisation après chargement
document.addEventListener("DOMContentLoaded", async () => {
  const { data: session } = await client.auth.getSession();
  const userId = session?.session?.user?.id;

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  try {
    const { data: utilisateur, error } = await client
  .from("utilisateurs")
  .select("role")
  .eq("id", userId)
  .single();

    if (error || !utilisateur) {
      console.warn("Rôle non trouvé ou erreur :", error);
      estAdmin = false;
    } else {
      estAdmin = utilisateur.role === "admin";
    }

    document.getElementById("badge-role").textContent = estAdmin ? "🛡️ Administrateur" : "👤 Utilisateur";
    document.getElementById("badge-role").className = estAdmin ? "badge admin" : "badge utilisateur";

    document.getElementById("filtre-categorie").addEventListener("change", afficherDemandes);
    document.getElementById("filtre-statut").addEventListener("change", afficherDemandes);

    afficherDemandes();
  } catch (err) {
    console.error("Erreur lors de la détection du rôle :", err);
  }
});

// 🧾 Affichage des demandes
async function afficherDemandes() {
  const container = document.getElementById("demandes-container");
  const statsBox = document.getElementById("stats-box");
  container.innerHTML = "";
  statsBox.innerHTML = "";

  const filtreCat = document.getElementById("filtre-categorie").value;
  const filtreStatut = document.getElementById("filtre-statut").value;

  try {
    let query = client.from("kazidomo_demandes_services").select("*").order("created_at", { ascending: false });
    if (filtreCat) query = query.eq("category", filtreCat);
    if (filtreStatut) query = query.eq("statut", filtreStatut);

    const { data, error } = await query;
    if (error) throw error;

    data.forEach(demande => container.appendChild(creerCarteDemande(demande)));
    afficherStats(data);
  } catch (err) {
    container.innerHTML = `<p class="erreur">Erreur : ${err.message}</p>`;
    console.error("Erreur lors de l'affichage :", err);
  }
}

// 📊 Statistiques
function afficherStats(demandes) {
  const total = demandes.length;
  const traitées = demandes.filter(d => d.statut === "traité").length;
  const categories = [...new Set(demandes.map(d => d.category))];
  const repartition = categories.map(cat => {
    const count = demandes.filter(d => d.category === cat).length;
    return `${cat}: ${count}`;
  }).join(" | ");

  document.getElementById("stats-box").innerHTML = `
    <div class="stats">
      <p>📋 Total : ${total}</p>
      <p>✅ Traitées : ${traitées}</p>
      <p>❌ Non traitées : ${nonTraitees}</p>
      <p>📅 Dernière demande : ${derniereDemande}</p>
      <p>🗑️ Supprimées : ${supprimees}</p>
      <p>📊 Répartition : ${repartition}</p>
    </div>
  `;
}

// 🧩 Carte demande
function creerCarteDemande(demande) {
  const card = document.createElement("div");
  card.className = "service-card";
  if (demande.statut === "traité") card.classList.add("traitee");

  card.innerHTML = `
    <h4><span>Nom du Client :</span> ${demande.name}</h4>
    <h5><strong>Catégorie :</strong> ${demande.category}</h5>
    <p><strong>Prix :</strong> ${demande.price} $</p>
    <p><strong>Téléphone :</strong> ${demande.client_whatsapp}</p>
    <p><strong>Email :</strong> ${demande.client_email}</p>
    <p><strong>Soumis le :</strong> ${new Date(demande.created_at).toLocaleString()}</p>
    <p><strong>GPS :</strong> ${demande.gps}</p>
    <p><strong>Map URL :</strong> <a href="${demande.map_url}" target="_blank">Voir la localisation</a></p>
    <p><strong>Message :</strong> ${demande.message}</p>
  `;

  // 🔄 Bouton "traiter"
  if (demande.statut !== "traité" && estAdmin) {
    const boutonTraiter = document.createElement("button");
    boutonTraiter.textContent = "Marquer comme traité";
    boutonTraiter.className = "btn-traiter";
    boutonTraiter.addEventListener("click", async () => {
      boutonTraiter.disabled = true;
      boutonTraiter.textContent = "Traitement...";
      const success = await changerStatut(demande.id, "traité");
      if (success) {
        boutonTraiter.textContent = "✅ Déjà traité";
        boutonTraiter.classList.add("statut-traite");
        await afficherDemandes();
      } else {
        boutonTraiter.disabled = false;
        boutonTraiter.textContent = "Marquer comme traité";
      }
    });
    card.appendChild(boutonTraiter);
  } else if (demande.statut === "traité") {
    const statut = document.createElement("p");
    statut.className = "statut-traite";
    statut.textContent = "✅ Déjà traité";
    card.appendChild(statut);
  }

  // 🗑️ Bouton "supprimer"
  if (estAdmin) {
    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.textContent = "🗑️ Supprimer";
    boutonSupprimer.className = "btn-supprimer";
    boutonSupprimer.addEventListener("click", async () => {
      if (confirm("Confirmer la suppression définitive de cette demande ?")) {
        boutonSupprimer.disabled = true;
        boutonSupprimer.textContent = "Suppression...";
        const success = await supprimerDemande(demande.id);
        if (success) {
          card.style.opacity = 0.5;

          const boutonAnnuler = document.createElement("button");
          boutonAnnuler.textContent = "↩️ Annuler";
          boutonAnnuler.className = "btn-annuler";
          boutonAnnuler.addEventListener("click", async () => {
            const restored = await restaurerDemande(demande);
            if (restored) {
              card.remove();
              afficherDemandes();
            } else {
              alert("Échec de la restauration.");
            }
          });

          card.appendChild(boutonAnnuler);
        } else {
          boutonSupprimer.disabled = false;
          boutonSupprimer.textContent = "🗑️ Supprimer";
        }
      }
    });
    card.appendChild(boutonSupprimer);
  }

  return card;
}

// 🔄 Changement de statut
async function changerStatut(demandeId, nouveauStatut) {
  try {
    const { error } = await client
      .from("kazidomo_demandes_services")
      .update({ statut: nouveauStatut })
      .eq("id", demandeId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erreur lors du changement de statut :", err);
    alert("Échec du traitement.");
    return false;
  }
}

// 🗑️ Suppression réelle
async function supprimerDemande(demandeId) {
  try {
    const { error } = await client
      .from("kazidomo_demandes_services")
      .delete()
      .eq("id", demandeId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erreur JS :", err);
    return false;
  }
}

// ↩️ Restauration immédiate
async function restaurerDemande(demande) {
  try {
    const { error } = await client.from("kazidomo_demandes_services").insert([{
      name: demande.name,
      category: demande.category,
      price: demande.price,
      client_whatsapp: demande.client_whatsapp,
      client_email: demande.client_email,
      gps: demande.gps,
      map_url: demande.map_url,
      message: demande.message,
      statut: demande.statut || "en attente"
    }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erreur lors de la restauration :", err);
    return false;
  }
}