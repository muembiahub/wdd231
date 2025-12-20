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

    window.location.href = "dashboard.html";
  });
}

// ---------------- Inscription ----------------
function initSignupForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fields = {
      surname: "surname",
      name: "name",
      username: "username",
      phone: "phone",
      gender: "gender",
      birthdate: "birthdate",
      email: "signup-email",
      password: "signup-password",
      confirm: "signup-confirm-password",
      domaine: "domaine",
      line: "line",
      quartier: "quartier",
      city: "city",
      country: "country"
    };

    const values = {};
    const missing = [];

    for (const key in fields) {
      const input = document.getElementById(fields[key]);
      const value = input?.value.trim();
      values[key] = value;
      if (!value) {
        missing.push(input);
        showFieldError(input, "Ce champ est requis.");
      } else {
        clearFieldError(input);
      }
    }

    if (missing.length > 0) {
      return showMessage("Veuillez remplir tous les champs obligatoires.", true, null, ".registration.form");
    }

    if (!values.email.endsWith("@kazidomo.com")) {
      return showFieldError(document.getElementById("signup-email"), "Seuls les emails @kazidomo.com sont autorisés.");
    }

    if (values.password.length < 8) {
      return showFieldError(document.getElementById("signup-password"), "Mot de passe trop court.");
    }

    if (values.password !== values.confirm) {
      return showFieldError(document.getElementById("signup-confirm-password"), "Les mots de passe ne correspondent pas.");
    }

    // Création du compte uniquement dans Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          prenom: values.surname,
          nom: values.name,
          username: values.username,
          domaine: values.domaine,
          genre: values.gender,
          birthdate: values.birthdate,
          telephone: values.phone,
          adresse: values.line,
          quartier: values.quartier,
          ville: values.city,
          pays: values.country,
          role: "requerant"
        }
      }
    });

    if (signupError) {
      return showMessage(`Erreur Supabase : ${signupError.message}`, true, null, ".registration.form");
    }

    showMessage(`Bienvenue chez Kazidomo, ${values.surname} 🎉`, false, null, ".registration.form");
    sessionStorage.setItem("prenom", values.surname);
    sessionStorage.setItem("domaine", values.domaine);

    setTimeout(() => {
      window.location.href = "confirmationpage.html";
    }, 1500);
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

    showMessage(`Un lien a été envoyé à ${email}.`, false, null, ".reset.form");
  });
}

// ---------------- Utilitaires ----------------
function showFieldError(input, message) {
  clearFieldError(input);
  input.classList.add("champ-erreur");
  const errorDiv = document.createElement("div");
  errorDiv.className = "message-erreur";
  errorDiv.textContent = message;
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
  messageDiv.innerHTML = `<h3>${isError ? "Erreur" : "Succès"}</h3><p>${html}</p>`;

  if (target) {
    target.parentNode.insertBefore(messageDiv, target.nextSibling);
  } else {
    container.insertBefore(messageDiv, container.querySelector("form").nextSibling);
  }
}