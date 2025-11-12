function exporterCSV() {
  client
    .from("kazidomo_demandes_services")
    .select("*")
    .then(({ data, error }) => {
      if (error) return alert("Erreur export CSV");

      const lignes = [
        ["Nom", "Catégorie", "Prix", "Email", "Téléphone", "Statut", "Date"]
      ];

      data.forEach(d => {
        lignes.push([
          d.name,
          d.category,
          d.price,
          d.client_email,
          d.client_whatsapp,
          d.statut,
          new Date(d.created_at).toLocaleString()
        ]);
      });

      const csvContent = lignes.map(l => l.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "demandes_kazidomo.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

function exporterPDF() {
  window.print();
}