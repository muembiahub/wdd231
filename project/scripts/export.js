function exporterDemandes() {
  const panneau = document.getElementById("contenu-carte");
  if (!panneau) {
    console.warn("contenu-carte introuvable");
    return;
  }

  panneau.innerHTML = `
    <h3>📤 Export des demandes</h3>
    <p>Cette fonctionnalité vous permet d’exporter les demandes en CSV ou PDF.</p>
    <button onclick="telechargerCSV()">Télécharger en CSV</button>
    <button onclick="telechargerPDF()">Télécharger en PDF</button>
  `;
}

function telechargerCSV() {
  const lignes = [
    ["ID", "Catégorie", "Statut", "Date"],
    ["1", "Agriculture", "traité", "2025-11-10"],
    ["2", "Éducation", "en attente", "2025-11-12"]
  ];

  const contenu = lignes.map(l => l.join(",")).join("\n");
  const blob = new Blob([contenu], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const lien = document.createElement("a");
  lien.href = url;
  lien.download = "demandes.csv";
  document.body.appendChild(lien);
  lien.click();
  document.body.removeChild(lien);
}

function telechargerPDF() {
  const panneau = document.getElementById("contenu-carte");
  if (panneau) {
    panneau.innerHTML += `<p style="color:red">📄 Export PDF en cours de développement...</p>`;
  }
}