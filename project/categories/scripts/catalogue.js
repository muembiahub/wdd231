// intialisation
// Appel principal au chargement de la page ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();

  injectTitle();
  injectFavicon();
  injectHeader();
  injectCardsForPage(); // ← appel unique, logique fusionnée
  injectFooter();
  injectPageSearch(pageName);
});





// === Barre de recherche limitée à la page ===
function injectPageSearch(pageName) {
  // Crée le conteneur principal
  const wrapper = document.createElement("div");
  wrapper.className = "search-wrapper";
  wrapper.style.cssText = `
    position: fixed;
    top: 9vh;
    right: 10px;
    z-index: 9999;
    display: flex;
    gap: 5px;
    padding: 0.5em;
    align-items: center;
  `;

  // Champ de recherche
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `🔍 Rechercher dans ${pageName}...`;
  input.style.cssText = `
    padding: 0.5em;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 3px;
    flex: 1;
  `;

  // Bouton pour effacer
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "❌";
  clearBtn.style.cssText = `
    font-size: 1em;
    cursor: pointer;
    background: none;
    border: none;
  `;

  // Message "aucun résultat"
  const message = document.createElement("div");
  message.textContent = "Aucun résultat trouvé.";
  message.style.cssText = `
    position: fixed;
    top: calc(9vh + 50px);
    right: 10px;
    background-color: #f8d7da;
    color: #721c24;
    padding: 0.5em 1em;
    border: 1px solid #f5c6cb;
    border-radius: 6px;
    font-size: 0.9em;
    display: none;
    z-index: 9999;
  `;

  // Ajoute les éléments au DOM
  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);
  document.body.appendChild(wrapper);
  document.body.appendChild(message);

  // Événement de recherche
  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    const targets = document.querySelectorAll(`[data-page="${pageName}"]`);
    let found = false;

    targets.forEach(el => {
      const text = el.textContent.toLowerCase();
      const match = text.includes(query);
      el.style.display = match ? "" : "none";
      el.style.backgroundColor = match ? "#1a7ec0ff" : "";
      if (match) found = true;
    });

    message.style.display = query && !found ? "block" : "none";
  });

  // Bouton pour réinitialiser
  clearBtn.addEventListener("click", () => {
    input.value = "";
    resetHighlights();
    message.style.display = "none";
  });

  // Fonction pour réinitialiser les styles
  function resetHighlights() {
    document.querySelectorAll(`[data-page="${pageName}"]`).forEach(el => {
      el.style.display = "";
      el.style.backgroundColor = "";
    });
  }

  // Style responsive injecté
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 600px) {
      .search-wrapper {
        top: 5vh !important;
        right: 1px;

        flex-direction: row;
        align-items: stretch;
      }
    }
  `;
  document.head.appendChild(style);
}





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


function setupGPS() {
  const detectBtn = $("#detectGPS");
  const gpsInput = $("#gps");
  const mapUrlInput = $("#mapUrl"); // 👈 récupère le champ caché

  detectBtn?.addEventListener("click", () => {
    if (!navigator.geolocation) return alert("🛑 GPS non pris en charge.");

    navigator.geolocation.getCurrentPosition(pos => {
      const coords = {
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
        map_url: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
      };

      gpsInput.value = `${coords.latitude}, ${coords.longitude}`;

      // ✅ ENREGISTRE le lien dans le champ caché
      mapUrlInput.value = coords.map_url;

      // ✅ Affiche la carte dans le conteneur prévu
      renderResponsiveMap(coords.map_url, $("#gpsMapContainer"));

      detectBtn.disabled = true;
      detectBtn.textContent = "✅ Position détectée";
    }, () => alert("⚠️ Position non détectée."));
  });
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