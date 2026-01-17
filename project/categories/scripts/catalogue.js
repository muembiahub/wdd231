// intialisation Appel principal au chargement de la page ===
document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();

  injectTitle();
  injectFavicon();

  injectCardsForPage();
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
