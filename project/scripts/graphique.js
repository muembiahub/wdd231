function afficherGraphiquesEtStats() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) {
    console.warn("contenu-carte introuvable");
    return;
  }

  panneau.innerHTML = "<p>Chargement des statistiques...</p>";

  client
    .from("kazidomo_demandes_services")
    .select("*")
    .order("created_at", { ascending: false })
    .then(({ data, error }) => {
      if (error || !data) {
        panneau.innerHTML = "<p class='erreur'>Erreur de chargement des statistiques.</p>";
        return;
      }

      const total = data.length;
      const traitées = data.filter(d => d.statut === "traité").length;
      const montantTotal = data.reduce((sum, d) => sum + (parseFloat(d.price) || 0), 0);

      panneau.innerHTML = `
        <h3>📊 Statistiques</h3>
        <p>Total : ${total}</p>
        <p>Traitées : ${traitées}</p>
        <p>Non traitées : ${total - traitées}</p>
        <p>Montant total : ${montantTotal.toFixed(2)} $</p>
        <canvas id="chart-categories" height="100"></canvas>
      `;

      const ctx = document.getElementById("chart-categories").getContext("2d");
      const parCategorie = data.reduce((acc, d) => {
        const cat = d.category || "Non spécifiée";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      new Chart(ctx, {
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
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Catégories" } },
            y: { beginAtZero: true, title: { display: true, text: "Nombre" } }
          }
        }
      });
    });
}