

document.addEventListener("DOMContentLoaded", () => {
  const pageName = getPageName();
  const jsonPath = `data/${pageName}.json`;

  injectTitle();
  injectFavicon();
  injectHeader();

  if (pageName === "index") {
    injectHomePageCard();
  } else {
    loadCards(jsonPath);
  }

  injectFooter();
  injectForm();
  injectConfirmationBanner();
  setupModal();
  setupGPS();
  setupFormValidation();
  injectPageSearch(pageName);
});