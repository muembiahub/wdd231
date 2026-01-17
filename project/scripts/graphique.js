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
        panneau.innerHTML =
          "<p class='erreur'>Erreur de chargement des statistiques.</p>";
        return;
      }

      // 📊 Calcul des stats globales
      const total = data.length;
      const traitees = data.filter((d) => d.statut === "traité").length;
      const en_attente = data.filter((d) => d.statut === "en attente").length;
      const en_cours = data.filter((d) => d.statut === "en cours").length;
      const rejetees = data.filter((d) => d.statut === "rejeté").length;

      const categoriesCount = data
        .map((d) => d.category)
        .filter(Boolean).length;
      const montantTotal = data.reduce(
        (sum, d) => sum + (parseFloat(d.price) || 0),
        0,
      );

      // 📋 Affichage des stats
      panneau.innerHTML = `
        <h3><i class="fa-solid fa-chart-bar"></i> Statistiques</h3>
        <p>Total demandes : ${total}</p>
        <p>Traitées : ${traitees}</p>
        <p>En attente : ${en_attente}</p>
        <p>En cours : ${en_cours}</p>
        <p>Rejetées : ${rejetees}</p>
        <p>Demandes par Catégories : ${categoriesCount}</p>
        <p>Montant total : ${montantTotal.toFixed(2)} $</p>
        <canvas id="chart-statut" width="200" height="200"></canvas>
        <canvas id="chart-categories" width= "200" height="200"></canvas>
      `;

      // 📊 Données par catégorie (nombre de demandes)
      const demandesParCategorie = data.reduce((acc, d) => {
        const cat = d.category || "Non spécifiée";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      // 📊 Nombre de services distincts par catégorie
      const servicesParCategorie = data.reduce((acc, d) => {
        const cat = d.category || "Non spécifiée";
        if (!acc[cat]) acc[cat] = new Set();
        if (d.service) acc[cat].add(d.service);
        return acc;
      }, {});

      const servicesCountParCategorie = {};
      for (const cat in servicesParCategorie) {
        servicesCountParCategorie[cat] = servicesParCategorie[cat].size;
      }

      // 📊 Données par statut
      const parStatut = {
        Traitées: traitees,
        "En attente": en_attente,
        "En cours": en_cours,
        Rejetées: rejetees,
      };

      // 🎨 Graphique statuts (doughnut compact)
      const ctxStatut = document
        .getElementById("chart-statut")
        .getContext("2d");
      new Chart(ctxStatut, {
        type: "doughnut",
        data: {
          labels: Object.keys(parStatut),
          datasets: [
            {
              data: Object.values(parStatut),
              backgroundColor: [
                "#16a34a", // vert traité
                "#2563eb", // bleu attente
                "#f59e0b", // orange en cours
                "#dc2626", // rouge rejeté
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { boxWidth: 12, font: { size: 12 } },
            },
            title: { display: true, text: "Répartition des statuts" },
          },
          cutout: "40%", // ✅ trou central pour alléger le rendu
        },
      });

      // 🎨 Graphique catégories (bar chart avec 2 datasets)
      const ctxCategories = document
        .getElementById("chart-categories")
        .getContext("2d");
      new Chart(ctxCategories, {
        type: "bar",
        data: {
          labels: Object.keys(demandesParCategorie),
          datasets: [
            {
              label: "categorie",
              data: Object.values(demandesParCategorie),
              backgroundColor: "#4CAF50",
            },
            {
              label: "Services par catégorie",
              data: Object.keys(demandesParCategorie).map(
                (cat) => servicesCountParCategorie[cat] || 0,
              ),
              backgroundColor: "#2563eb",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Demandes et services distincts par catégorie",
              position: "top",
            },
          },
          scales: {
            x: { title: { display: true, text: "Catégories" } },
            y: { beginAtZero: true, title: { display: true, text: "Nombre" } },
          },
        },
      });
    });
}
