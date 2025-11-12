// 📦 Charger les données et afficher stats + graphique
async function afficherGraphiquesEtStats() {
  const { data, error } = await client
    .from("kazidomo_demandes_services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur de chargement des demandes :", error.message);
    document.getElementById("stats-box").innerHTML = "<p class='erreur'>Erreur de chargement des statistiques.</p>";
    return;
  }

  if (!data || data.length === 0) {
    document.getElementById("stats-box").innerHTML = "<p>Aucune demande trouvée.</p>";
    return;
  }

  afficherStats(data);
  afficherGraphique(data);
}

// 🧮 Afficher les statistiques globales
function afficherStats(demandes) {
  const total = demandes.length;
  const traitées = demandes.filter(d => d.statut === "traité").length;
  const nonTraitees = total - traitées;
  const montantTotal = demandes.reduce((sum, d) => sum + (parseFloat(d.price) || 0), 0);
  const derniereDemande = demandes[0]?.created_at
    ? new Date(demandes[0].created_at).toLocaleString()
    : "Aucune";

  document.getElementById("stats-box").innerHTML = `
    <div class="stats">
      <p><i class="fa-solid fa-clipboard"></i> Total : ${total}</p>
      <p><i class="fa-solid fa-check"></i> Traitées : ${traitées}</p>
      <p><i class="fa-solid fa-xmark"></i> Non traitées : ${nonTraitees}</p>
      <p><i class="fa-solid fa-calendar"></i> Dernière demande : ${derniereDemande}</p>
      <p><i class="fa-solid fa-dollar-sign"></i> Montant total : ${montantTotal.toFixed(2)} $</p>
    </div>
  `;
}

// 📈 Afficher le graphique des demandes par catégorie
function afficherGraphique(demandes) {
  const canvas = document.getElementById("chart-categories");
  if (!canvas) {
    console.warn("Canvas #chart-categories introuvable.");
    return;
  }

  const ctx = canvas.getContext("2d");

  // Regrouper les demandes par catégorie
  const parCategorie = demandes.reduce((acc, d) => {
    const cat = d.category || "Non spécifiée";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Détruire l'ancien graphique s'il existe
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  // Créer le graphique
  window.chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(parCategorie),
      datasets: [{
        label: "Demandes par catégorie",
        data: Object.values(parCategorie),
        backgroundColor: "#4CAF50"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { title: { display: true, text: "Catégories" } },
        y: { beginAtZero: true, title: { display: true, text: "Nombre de demandes" } }
      }
    }
  });

  // Afficher le canvas si masqué
  canvas.style.display = "block";
}