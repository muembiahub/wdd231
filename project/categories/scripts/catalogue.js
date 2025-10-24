// intialisation
// Appel principal au chargement de la page ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();

  injectTitle();
  injectFavicon();
  injectHeader();
  injectCardsForPage(); // ← appel unique, logique fusionnée
  injectFooter();
  injectElegantSearchBar(pageName);
  removeSearchBarOnForm(pageName);
});

// === 3. Variables globales ===
let selectedCategory = "";
let selectedPrice = "";

//

function showConfirmationBanner() {
  // Supprime l’ancienne bannière si elle existe
  document.getElementById("confirmationBanner")?.remove();

  const banner = document.createElement("div");
  banner.id = "confirmationBanner";
  banner.style.display = "none";
  banner.style.background = "#e6ffe6";
  banner.style.border = "1px solid #00aa00";
  banner.style.padding = "1em";
  banner.style.textAlign = "center";
  banner.style.margin = "1em auto";
  banner.style.maxWidth = "600px";
  banner.style.fontFamily = "sans-serif";
  banner.style.borderRadius = "8px";
  banner.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  banner.style.opacity = "0";
  banner.style.transition = "opacity 0.6s ease";

  banner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5em; flex-wrap: wrap;">
      <span style="font-size: 1.5em;">✅</span>
      <div>
        <h3 style="margin: 0;">🎉 Félicitations !</h3>
        <p style="margin: 0.3em 0;">" Votre message a été envoyé avec succès 🎊";</p>
        <p style="margin: 0;">Un agent Kazidomo vous contactera sous peu.<b> Merci pour votre confiance.</b>
        </p>
      </div>
    </div>
  `;

  const target = document.querySelector("#category");
  const container = target?.parentElement || document.body;
  container.insertBefore(banner, target || container.firstChild);

  // Affiche avec animation
  banner.style.display = "block";
  setTimeout(() => {
    banner.style.opacity = "1";
  }, 10);

  // ✅ Option sonore discrète
  const audio = new Audio("https://assets.mixkit.co/sfx/download/mixkit-achievement-bell-600.mp3");
  audio.volume = 0.3;
  audio.play().catch(() => {}); // ignore les erreurs silencieuses

  // Disparition automatique après 6 secondes
  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 600);
  }, 6000);
}






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