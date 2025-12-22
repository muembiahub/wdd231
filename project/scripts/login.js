import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Configuration Supabase
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

// Initialisation des formulaires
document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initSignupForm();
  initResetForm();
});

// ---------------- Connexion ----------------
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    clearFieldError(form.email);
    clearFieldError(form.password);

    if (!email || !password) {
      if (!email) showFieldError(form.email, "Email requis");
      if (!password) showFieldError(form.password, "Mot de passe requis");
      return showMessage("Veuillez remplir tous les champs.", true, form.password, ".login.form");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showFieldError(form.password, "Identifiants invalides");
      return showMessage("Email ou mot de passe incorrect.", true, form.password, ".login.form");
    }

    showMessage("Connexion réussie ✅", false, null, ".login.form");
    setTimeout(() => window.location.href = "dashboard.html", 1000);
  });
}

// ---------------- Inscription ----------------

function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm = document.getElementById("signup-confirm-password").value.trim();

    clearFieldError(document.getElementById("signup-email"));
    clearFieldError(document.getElementById("signup-password"));
    clearFieldError(document.getElementById("signup-confirm-password"));

    // ✅ Validation email
    if (!email.endsWith("@kazidomo.com")) {
      return showFieldError(document.getElementById("signup-email"), "Seuls les emails @kazidomo.com sont autorisés.");
    }

    // ✅ Validation mot de passe
    if (password.length < 8) {
      return showFieldError(document.getElementById("signup-password"), "Mot de passe trop court.");
    }
    if (password !== confirm) {
      return showFieldError(document.getElementById("signup-confirm-password"), "Les mots de passe ne correspondent pas.");
    }

    // ✅ Création du compte dans Auth avec role par défaut
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "requerant" // ✅ seul champ attendu par ta table
        }
      }
    });

    if (signupError) {
      return showMessage(`Erreur Supabase : ${signupError.message}`, true, null, ".registration.form");
    }

    showMessage(`Bienvenue chez Kazidomo 🎉`, false, null, ".registration.form");
    setTimeout(() => window.location.href = "confirmationpage.html", 1500);
  });
}


// ---------------- Réinitialisation ----------------
function initResetForm() {
  const form = document.getElementById("reset-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form["reset-email"].value.trim();

    if (!email) {
      return showMessage("Email requis.", true, form["reset-email"], ".reset.form");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://kazidomo.com/reset-confirmation.html"
    });

    if (error) {
      return showMessage(`Erreur : ${error.message}`, true, form["reset-email"], ".reset.form");
    }

    showMessage(`Un lien a été envoyé à ${email}. ✅`, false, null, ".reset.form");
  });
}

// ---------------- Utilitaires ----------------
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

function clearFieldError(input) {
  input.classList.remove("champ-erreur");
  const errorMsg = input.parentNode.querySelector(".message-erreur");
  if (errorMsg) errorMsg.remove();
}

function showMessage(html, isError = false, target = null, scope = null) {
  const container = scope
    ? document.querySelector(scope)
    : target?.closest(".form") || document.querySelector(".form");

  if (!container) return;

  container.querySelectorAll(".erreur, .success").forEach(el => el.remove());

  const messageDiv = document.createElement("div");
  messageDiv.className = isError ? "erreur" : "success";

  messageDiv.style.borderRadius = "6px";
  messageDiv.style.padding = "12px";
  messageDiv.style.margin = "12px 0";
  messageDiv.style.fontSize = "14px";
  messageDiv.style.display = "flex";
  messageDiv.style.alignItems = "center";
  messageDiv.style.gap = "8px";

  if (isError) {
    messageDiv.style.backgroundColor = "#ffe5e5";
    messageDiv.style.border = "1px solid #ff4d4d";
    messageDiv.style.color = "#b30000";
    messageDiv.innerHTML = `<h3 style="margin:0;font-size:16px;font-weight:bold;">❌ Erreur</h3><p>${html}</p>`;
  } else {
    messageDiv.style.backgroundColor = "#e6ffed";
    messageDiv.style.border = "1px solid #4CAF50";
    messageDiv.style.color = "#006400";
    messageDiv.innerHTML = `<h3 style="margin:0;font-size:16px;font-weight:bold;">✅ Succès</h3><p>${html}</p>`;
  }

  if (target) {
    target.parentNode.insertBefore(messageDiv, target.nextSibling);
  } else {
    container.insertBefore(messageDiv, container.querySelector("form").nextSibling);
  }
}