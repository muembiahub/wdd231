// Importer Supabase depuis le CDN
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Configuration Supabase
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";

// Création du client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Récupération des éléments
const form = document.forms["contact-kazidomo"];
const confirmationPage = document.getElementById("confirmation-page");
const confirmationText = document.getElementById("confirmation-text");
const returnBtn = document.getElementById("return-btn");

// Fonctions de gestion des erreurs
function clearFieldError(input) {
  input.classList.remove("champ-erreur");
  const next = input.nextSibling;
  if (next && next.className === "message-erreur") {
    next.remove();
  }
}

function showFieldError(input, message) {
  clearFieldError(input);
  input.classList.add("champ-erreur");
  const errorDiv = document.createElement("div");
  errorDiv.className = "message-erreur";
  errorDiv.style.color = "#b30000";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "4px";
  errorDiv.innerHTML = `❗ ${message}`;
  input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

// Gestion de la soumission du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Vérification des champs obligatoires
  let valid = true;
  form.querySelectorAll("[required]").forEach((input) => {
    if (!input.value.trim()) {
      valid = false;
      showFieldError(input, "Ce champ est obligatoire");
    } else {
      clearFieldError(input);
    }
  });

  if (!valid) return;

  // Préparation des données
  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    subject: form.subject.value,
    visitor_type: form["visitor-type"].value,
    lang: form.lang.value,
    message: form.message.value,
  };

  // Insertion dans Supabase
  const { error } = await supabase.from("kazidomo_message").insert([data]);

  if (error) {
    console.error("Erreur:", error);
    alert("Une erreur est survenue lors de l'envoi.");
  } else {
    // ✅ Bascule vers la page de confirmation
    form.classList.add("hidden");
    confirmationText.innerHTML = `Merci <strong>${data.name}</strong>, votre message a bien été enregistré. Nous vous répondrons bientôt.`;
    confirmationPage.classList.remove("hidden");
    form.reset();
  }
});

// Bouton retour
returnBtn.addEventListener("click", () => {
  confirmationPage.classList.add("hidden");
  form.classList.remove("hidden");
});
