import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
// Configuration Supabase 
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);
// Initialisation des formulaires après le chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initSignupForm();
  initResetForm();
});
// Initialisation du formulaire de connexion
function initLoginForm() {
  // Récupération du formulaire
  const form = document.getElementById("login-form");
  // Si le formulaire n'existe pas, on quitte la fonction
  if (!form) return;
// Ajout de l'événement de soumission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupération des champs email et mot de passe
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    // Extraction et nettoyage des valeurs
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
  // Réinitialisation des styles d'erreur
    emailInput.classList.remove("champ-erreur");
    passwordInput.classList.remove("champ-erreur");
    // Validation des champs
    if (!email && !password) {
      emailInput.classList.add("champ-erreur");
      passwordInput.classList.add("champ-erreur");
      // Affichage du message d'erreur
      return afficherMessage(`
        <div class="erreur"><h3>Champs manquants</h3><p>Veuillez renseigner votre adresse email et votre mot de passe.</p></div>
      `, true, passwordInput, ".login.form");
    }
    // Validation email
    if (!email) {
      emailInput.classList.add("champ-erreur");
      // Affichage du message d'erreur
      return afficherMessage(`
        <div class="erreur"><h3>Email requis</h3><p>Veuillez renseigner votre adresse email.</p></div>
      `, true, emailInput, ".login.form");
    }

    // Validation mot de passe
    if (!password) {
      passwordInput.classList.add("champ-erreur");
      return afficherMessage(`
        <div class="erreur"><h3>Mot de passe requis</h3><p>Veuillez entrer votre mot de passe.</p></div>
      `, true, passwordInput, ".login.form");
    }
// Tentative de connexion avec Supabase 
    const { error } = await client.auth.signInWithPassword({ email, password });
  // Gestion des erreurs de connexion
    if (error) {
      // Marquer le champ mot de passe en erreur
      passwordInput.classList.add("champ-erreur");
      const msg = error.message.includes("Invalid login credentials")
        ? `<div class="erreur"><h3>Mot de passe incorrect</h3><p>Identifiants invalides. Veuillez vérifier votre mot de passe.</p></div>`
        : `<div class="erreur"><h3>Erreur technique</h3><p>${error.message}</p></div>`;
        // Affichage du message d'erreur
      return afficherMessage(msg, true, passwordInput, ".login.form");
    }
    // Connexion réussie - redirection vers la page admin
    window.location.href = "admin.html";
  });
}

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
    const champsVides = [];

    for (const key in fields) {
      const el = document.getElementById(fields[key]);
      const val = el.value.trim();
      values[key] = val;

      if (!val) {
        champsVides.push(fields[key]);
        afficherErreurChamp(el, "Ce champ est requis.");
      } else {
        supprimerErreurChamp(el);
      }
    }

    if (champsVides.length > 0) {
      const nomsLisibles = champsVides.map((id) => {
        const label = document.querySelector(`label[for="${id}"]`);
        return label ? label.textContent.trim() : id;
      });

      const liste = nomsLisibles.map((nom) => `<li>${nom}</li>`).join("");

      return afficherMessage(`
        <div class="erreur">
          <h3>Champs manquants</h3>
          <p>Veuillez remplir les champs suivants :</p>
          <ul>${liste}</ul>
        </div>
      `, true, null, ".registration.form");
    }

    // Vérification email
    if (!values.email.endsWith("@kazidomo.com")) {
      return afficherErreurChamp(document.getElementById("signup-email"), "Seuls les emails @kazidomo.com sont autorisés.");
    }

    // Vérification mot de passe
    if (values.password.length < 8) {
      return afficherErreurChamp(document.getElementById("signup-password"), "Le mot de passe doit contenir au moins 8 caractères.");
    }

    if (values.password !== values.confirm) {
      return afficherErreurChamp(document.getElementById("signup-confirm-password"), "Les mots de passe ne correspondent pas.");
    }

    // Vérification unicité du username
    const { data: existingUser } = await client
      .from("utilisateurs")
      .select("id")
      .eq("username", values.username)
      .single();

    if (existingUser) {
      return afficherMessage(`
        <div class="erreur">
          <h3>Nom d'utilisateur déjà utilisé</h3>
          <p>Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.</p>
        </div>
      `, true, document.getElementById("username"), ".registration.form");
    }

    // Création du compte Supabase
    // Création du compte
const { data, error } = await client.auth.signUp({
  email: values.email,
  password: values.password
});

if (error) {
  return afficherMessage(`<div class="erreur"><h3>Erreur Supabase</h3><p>${error.message}</p></div>`, true, null, ".registration.form");
}

// 🔒 Récupérer l'utilisateur confirmé
const { data: userData } = await client.auth.getUser();
const userId = userData?.user?.id;

if (!userId) {
  return afficherMessage(`<div class="erreur"><h3>ID utilisateur introuvable</h3></div>`, true, null, ".registration.form");
}

// ✅ Insertion dans la table utilisateurs
const { error: insertError } = await client.from("utilisateurs").insert([{
  id: userId,
  email: values.email,
  nom: values.name,
  prenom: values.surname,
  birthdate: values.birthdate,
  genre: values.gender,
  telephone: values.phone,
  adresse: values.line,
  quartier: values.quartier,
  ville: values.city,
  pays: values.country,
  username: values.username,
  role: "user",
  domaine: values.domaine
}]);

    if (insertError) {
      return afficherMessage(`<div class="erreur"><h3>Erreur d'enregistrement</h3><p>${insertError.message}</p></div>`, true, null, ".registration.form");
    }

    // Succès
    afficherMessage(`<div class="success"><h3>Compte créé avec succès !</h3><p>Bienvenue chez Kazidomo, ${values.surname} 🎉</p></div>`, false, null, ".registration.form");
    sessionStorage.setItem("prenom", values.surname);
    sessionStorage.setItem("domaine", values.domaine);

    setTimeout(() => {
      window.location.href = "confirmationpage.html";
    }, 1500);
  });
}

function initResetForm() {
  const form = document.getElementById("reset-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("reset-email");
    const email = emailInput.value.trim();

    if (!email) {
      return afficherMessage(`
        <div class="erreur"><h3>Email requis</h3><p>Veuillez entrer votre adresse email.</p></div>
      `, true, emailInput, ".reset.form");
    }

    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: "https://kazidomo.com/reset-confirmation.html"
    });

    if (error) {
      return afficherMessage(`<div class="erreur"><h3>Erreur</h3><p>${error.message}</p></div>`, true, emailInput, ".reset.form");
    }

    afficherMessage(`<div class="success"><h3>Email envoyé</h3><p>Un lien de réinitialisation a été envoyé à ${email}.</p></div>`, false, null, ".reset.form");
  });
}

function afficherErreurChamp(cible, message) {
  supprimerErreurChamp(cible);
  cible.classList.add("champ-erreur");

  const div = document.createElement("div");
  div.className = "message-erreur";
  div.textContent = message;

  cible.parentNode.insertBefore(div, cible.nextSibling);
}

function supprimerErreurChamp(cible) {
  cible.classList.remove("champ-erreur");
  const msg = cible.parentNode.querySelector(".message-erreur");
  if (msg) msg.remove();
}

function afficherMessage(html, isError = false, cible = null, scope = null) {
  let container;

  if (scope) {
    container = document.querySelector(scope);
  } else if (cible) {
    container = cible.closest(".form");
  } else {
    container = document.querySelector(".form");
  }

  if (!container) return;

  const oldMsg = container.querySelectorAll(".erreur, .success");
  oldMsg.forEach((el) => el.remove());

  const div = document.createElement("div");
  div.innerHTML = html;

  if (cible) {
    cible.parentNode.insertBefore(div, cible.nextSibling);
  } else {
    container.insertBefore(div, container.querySelector("form").nextSibling);
  }
}