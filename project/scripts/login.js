import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ---------------- Configuration Supabase ----------------
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

// ---------------- Initialisation des formulaires ----------------
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
    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Connexion en cours...";

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    clearFieldError(form.email);
    clearFieldError(form.password);

    if (!validateField(form.email, email, "Email requis") || 
        !validateField(form.password, password, "Mot de passe requis")) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Se connecter";
      return showMessage("Veuillez remplir tous les champs.", true, form.password, ".login.form");
    }

    // ✅ Connexion Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    submitBtn.disabled = false;
    submitBtn.textContent = "Se connecter";

    if (error) {
      showFieldError(form.password, "Identifiants invalides");
      return showMessage("Email ou mot de passe incorrect.", true, form.password, ".login.form");
    }

    // ✅ Récupérer le rôle depuis Supabase
    const user = data.user;
    const role = user?.user_metadata?.role || "user";

    // ✅ Sauvegarder le rôle dans sessionStorage
    sessionStorage.setItem("role", role);

    // ✅ Feedback visuel
    showFieldSuccess(form.email, "Email valide ✅");
    showFieldSuccess(form.password, "Mot de passe correct ✅");
    showMessage(`Connexion réussie ✅ (Rôle : ${role})`, false, null, ".login.form");

    // ✅ Redirection vers dashboard
    setTimeout(() => window.location.href = "dashboard.html", 1000);
  });
}



// ---------------- Inscription ----------------
function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Création en cours...";

    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm = document.getElementById("signup-confirm-password").value.trim();

    clearFieldError(document.getElementById("signup-email"));
    clearFieldError(document.getElementById("signup-password"));
    clearFieldError(document.getElementById("signup-confirm-password"));

    // ✅ Validation email
    if (!email.endsWith("@kazidomo.com")) {
      submitBtn.disabled = false;
      submitBtn.textContent = "S'inscrire";
      return showFieldError(document.getElementById("signup-email"), "Seuls les emails @kazidomo.com sont autorisés.");
    } else {
      showFieldSuccess(document.getElementById("signup-email"), "Email valide ✅");
    }

    // ✅ Validation mot de passe
    if (password.length < 8) {
      submitBtn.disabled = false;
      submitBtn.textContent = "S'inscrire";
      return showFieldError(document.getElementById("signup-password"), "Mot de passe trop court.");
    } else {
      showFieldSuccess(document.getElementById("signup-password"), "Mot de passe correct ✅");
    }

    if (password !== confirm) {
      submitBtn.disabled = false;
      submitBtn.textContent = "S'inscrire";
      return showFieldError(document.getElementById("signup-confirm-password"), "Les mots de passe ne correspondent pas.");
    } else {
      showFieldSuccess(document.getElementById("signup-confirm-password"), "Confirmation correcte ✅");
    }

    // ✅ Création du compte avec rôle par défaut
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: "requerant" }
      }
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "S'inscrire";

    if (signupError) {
      return showMessage(`Erreur Supabase : ${signupError.message}`, true, null, ".registration.form");
    }

    // ✅ Récupérer le rôle et le stocker
    const user = data.user;
    const role = user?.user_metadata?.role || "user";
    sessionStorage.setItem("role", role);

    // ✅ Feedback visuel
    showMessage(`Bienvenue chez Kazidomo 🎉 (Rôle : ${role})`, false, null, ".registration.form");

    // ✅ Redirection vers confirmation ou dashboard
    setTimeout(() => window.location.href = "confirmationpage.html", 1500);
  });
}


// ---------------- Réinitialisation ----------------
function initResetForm() {
  const form = document.getElementById("reset-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours...";

    const email = form["reset-email"].value.trim();

    if (!validateField(form["reset-email"], email, "Email requis")) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Réinitialiser";
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://kazidomo.com/reset-confirmation.html"
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Réinitialiser";

    if (error) {
      return showMessage(`Erreur : ${error.message}`, true, form["reset-email"], ".reset.form");
    }

    showFieldSuccess(form["reset-email"], "Email valide ✅");
    showMessage(`Un lien a été envoyé à ${email}. ✅`, false, null, ".reset.form");
  });
}

// ---------------- Utilitaires ----------------
function validateField(input, value, errorMessage) {
  if (!value) {
    showFieldError(input, errorMessage);
    return false;
  }
  return true;
}

function showFieldError(input, message) {
  clearFieldError(input);
  input.classList.add("champ-erreur");
  const errorDiv = document.createElement("div");
  errorDiv.className = "message-erreur";
  errorDiv.style.color = "#b30000";
  errorDiv.style.fontSize = "12px";
  errorDiv.style.marginTop = "4px";
  errorDiv.style.display = "flex";
  errorDiv.style.alignItems = "center";
  errorDiv.style.gap = "6px";
  errorDiv.style.animation = "fadeIn 0.3s ease";
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
  successDiv.style.display = "flex";
  successDiv.style.alignItems = "center";
  successDiv.style.gap = "6px";
  successDiv.style.animation = "fadeIn 0.3s ease";
  successDiv.innerHTML = `✅ ${message}`;
  input.parentNode.insertBefore(successDiv, input.nextSibling);
}

function clearFieldError(input) {
  input.classList.remove("champ-erreur", "champ-succes");
  const msg = input.parentNode.querySelector(".message-erreur, .message-succes");
  if (msg) msg.remove();
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
  messageDiv.style.animation = "fadeIn 0.3s ease";

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

// ---------------- Animation CSS ----------------
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .champ-erreur {
    border: 1px solid #ff4d4d !important;
    background-color: #fff5f5;
  }

  .champ-succes {
    border: 1px solid #4CAF50 !important;
    background-color: #f5fff5;
  }

  .message-erreur, .message-succes {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .erreur, .success {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
`;
document.head.appendChild(style);

