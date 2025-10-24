// intialisation Appel principal au chargement de la page ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();

  injectTitle();
  injectFavicon();
  injectHeader();

  injectCardsForPage();
  injectFooter();
  injectElegantSearchBar(pageName);
  removeSearchBarOnForm(pageName);

  // Exemple : après clic sur un bouton
  const submitBtn = document.querySelector("#submitBtn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      // Récupération des données du formulaire
      showConfirmationBanner();
    });
  }
});


// === 3. Variables globales ===
let selectedCategory = "";
let selectedPrice = "";






function renderResponsiveMap(mapUrl, container) {
  const existingMap = document.getElementById("gpsMap");
  if (existingMap) existingMap.remove();

  const mapWrapper = document.createElement("div");
  mapWrapper.id = "gpsMap";
  mapWrapper.style.position = "relative";
  mapWrapper.style.paddingBottom = "56.25%"; // format 16:9
  mapWrapper.style.height = "0";
  mapWrapper.style.overflow = "hidden";
  mapWrapper.style.marginTop = "1em";
  mapWrapper.style.borderRadius = "8px";
  mapWrapper.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";

  const mapFrame = document.createElement("iframe");
  mapFrame.src = `${mapUrl}&output=embed`;
  mapFrame.style.position = "absolute";
  mapFrame.style.top = "0";
  mapFrame.style.left = "0";
  mapFrame.style.width = "100%";
  mapFrame.style.height = "100%";
  mapFrame.style.border = "0";
  mapFrame.loading = "lazy";
  mapFrame.referrerPolicy = "no-referrer-when-downgrade";

  mapWrapper.appendChild(mapFrame);
  container.appendChild(mapWrapper);
}





// === 10. Connexion à Supabase ===
async function sendToSupabase(formData) {
  const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bWRuZHdueGpxZG9sYnBjeXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE4NjcsImV4cCI6MjA3Mzc5Nzg2N30.tcRLYK-2MI4hOr8zzg_hfBnxF0GWgcOP1uSo-ZRr5yw";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kazidomo_demandes_services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify([formData])
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur Supabase :", errorText);
      alert(`Échec Supabase : ${errorText}`);
      return false;
    }

    console.log("✅ Données envoyées à Supabase.");
    return true;
  } catch (error) {

    console.error("❌ Erreur lors de l’envoi :", error);
    alert(`Erreur lors de l’envoi : ${error.message}`);
    return false;
  }
}