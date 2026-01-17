import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ---------------- Configuration Supabase ----------------
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- Initialisation des formulaires ----------------
document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initSignupForm();
  initResetForm();
});

// ---------------- Utilitaires ----------------
function toggleButton(btn, isLoading, loadingText, defaultText) {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? loadingText : defaultText;
}

function clearMessages(scope = null) {
  const container = scope
    ? document.querySelector(scope)
    : document.querySelector(".form");
  if (!container) return;
  container
    .querySelectorAll(".erreur, .success")
    .forEach((msg) => msg.remove());
}

function showMessage(html, isError = false, scope = null) {
  clearMessages(scope);
  const container = scope
    ? document.querySelector(scope)
    : document.querySelector(".form");
  if (!container) return;
  const messageDiv = document.createElement("div");
  messageDiv.className = isError ? "erreur" : "success";
  messageDiv.innerHTML = isError ? `❌ ${html}` : `✅ ${html}`;
  container.insertBefore(
    messageDiv,
    container.querySelector("form").nextSibling,
  );
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

function showFieldSuccess(input, message) {
  clearFieldError(input);
  input.classList.add("champ-succes");
  const successDiv = document.createElement("div");
  successDiv.className = "message-succes";
  successDiv.style.color = "#006400";
  successDiv.style.fontSize = "12px";
  successDiv.style.marginTop = "4px";
  successDiv.innerHTML = `✅ ${message}`;
  input.parentNode.insertBefore(successDiv, input.nextSibling);
}

function clearFieldError(input) {
  input.classList.remove("champ-erreur", "champ-succes");
  const msg = input.parentNode.querySelector(
    ".message-erreur, .message-succes",
  );
  if (msg) msg.remove();
}

function validateField(input, value, errorMessage) {
  if (!value) {
    showFieldError(input, errorMessage);
    return false;
  }
  return true;
}

function handleError(input, message, scope = null) {
  if (input) {
    showFieldError(input, message);
  } else {
    showMessage(message, true, scope);
  }
}

// ---------------- Connexion ----------------
async function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    toggleButton(submitBtn, true, "Connexion en cours...", "Se connecter");

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    clearFieldError(form.email);
    clearFieldError(form.password);

    // ✅ Validation des champs
    if (
      !validateField(form.email, email, "Email requis") ||
      !validateField(form.password, password, "Mot de passe requis")
    ) {
      toggleButton(submitBtn, false, "", "Se connecter");
      return showMessage(
        "Veuillez remplir tous les champs.",
        true,
        ".login.form",
      );
    }

    try {
      // ✅ Connexion Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      toggleButton(submitBtn, false, "", "Se connecter");

      if (error) {
        return handleError(
          form.password,
          "Identifiants invalides",
          ".login.form",
        );
      }

      const user = data?.user;
      if (!user)
        return showMessage(
          "Erreur: utilisateur introuvable.",
          true,
          ".login.form",
        );

      // ✅ Récupérer le vrai profil depuis la table utilisateurs
      const { data: profile, error: profileError } = await supabase
        .from("utilisateurs")
        .select("id, role, name, surname, email, domaine")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur récupération profil:", profileError);
        return showMessage(
          "Impossible de récupérer le profil.",
          true,
          ".login.form",
        );
      }

      // ✅ Stocker les infos utiles en sessionStorage
      sessionStorage.setItem("prenom", profile.name || "");
      sessionStorage.setItem("nom", profile.surname || "");
      sessionStorage.setItem("email", profile.email || "");
      sessionStorage.setItem("domaine", profile.domaine || "");
      sessionStorage.setItem("role", profile.role || "requerant");

      // ✅ Feedback visuel
      showFieldSuccess(form.email, "Email valide ✅");
      showFieldSuccess(form.password, "Mot de passe correct ✅");
      showMessage(
        `Connexion réussie ✅ (Rôle : ${profile.role})`,
        false,
        ".login.form",
      );

      // ✅ Redirection vers dashboard
      setTimeout(() => window.location.replace("dashboard.html"), 1000);
    } catch (err) {
      toggleButton(submitBtn, false, "", "Se connecter");
      console.error("Erreur réseau:", err);
      showMessage("Erreur réseau. Réessayez plus tard.", true, ".login.form");
    }
  });
}

// ---------------- Inscription ----------------
function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    toggleButton(submitBtn, true, "Création en cours...", "S'inscrire");

    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm = document
      .getElementById("signup-confirm-password")
      .value.trim();

    // Champs supplémentaires
    const surname = document.getElementById("surname").value.trim();
    const name = document.getElementById("name").value.trim();
    const birthdate = document.getElementById("birthdate").value.trim();
    const gender = document.getElementById("gender").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const line = document.getElementById("line").value.trim();
    const quartier = document.getElementById("quartier").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();
    const username = document.getElementById("username").value.trim();
    const domaine = document.getElementById("domaine").value.trim();

    // ✅ Validation email
    if (!email.endsWith("@kazidomo.com")) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      return showFieldError(
        document.getElementById("signup-email"),
        "Seuls les emails @kazidomo.com sont autorisés.",
      );
    }

    // ✅ Validation mot de passe
    if (password.length < 8) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      return showFieldError(
        document.getElementById("signup-password"),
        "Mot de passe trop court.",
      );
    }

    if (password !== confirm) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      return showFieldError(
        document.getElementById("signup-confirm-password"),
        "Les mots de passe ne correspondent pas.",
      );
    }

    // ✅ Validation birthdate et phone
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      return showFieldError(
        document.getElementById("birthdate"),
        "Format attendu: YYYY-MM-DD.",
      );
    }

    if (!/^\d+$/.test(phone)) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      return showFieldError(
        document.getElementById("phone"),
        "Le numéro doit contenir uniquement des chiffres.",
      );
    }

    try {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            surname,
            name,
            birthdate,
            gender,
            phone,
            line,
            quartier,
            city,
            country,
            username,
            domaine,
            // ❌ pas de role ici → Postgres applique DEFAULT 'requerant'
          },
        },
      });

      toggleButton(submitBtn, false, "", "S'inscrire");

      if (signupError) {
        console.error("Erreur Supabase Auth:", signupError);
        return showMessage(
          `Erreur Supabase : ${signupError.message}`,
          true,
          ".registration.form",
        );
      }

      sessionStorage.setItem("role", "requerant");
      showMessage(
        `Bienvenue chez Kazidomo 🎉 (Rôle : requerant)`,
        false,
        ".registration.form",
      );

      setTimeout(() => window.location.replace("confirmationpage.html"), 1500);
    } catch (err) {
      toggleButton(submitBtn, false, "", "S'inscrire");
      showMessage(
        "Erreur réseau. Réessayez plus tard.",
        true,
        ".registration.form",
      );
    }
  });
}

// ---------------- Réinitialisation ----------------
function initResetForm() {
  const form = document.getElementById("reset-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    toggleButton(submitBtn, true, "Envoi en cours...", "Réinitialiser");

    const email = form["reset-email"].value.trim();

    if (!validateField(form["reset-email"], email, "Email requis")) {
      toggleButton(submitBtn, false, "", "Réinitialiser");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://kazidomo.com/reset-confirmation.html",
      });

      toggleButton(submitBtn, false, "", "Réinitialiser");

      if (error) {
        return showMessage(`Erreur : ${error.message}`, true, ".reset.form");
      }

      showFieldSuccess(form["reset-email"], "Email valide ✅");
      showMessage(`Un lien a été envoyé à ${email}. ✅`, false, ".reset.form");
    } catch (err) {
      toggleButton(submitBtn, false, "", "Réinitialiser");
      showMessage("Erreur réseau. Réessayez plus tard.", true, ".reset.form");
    }
  });
}
