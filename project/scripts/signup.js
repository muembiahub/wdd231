// 📦 Connexion à Supabase
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🚀 Écoute du formulaire d'inscription
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  if (!form) {
    console.error("❌ Formulaire introuvable !");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔎 Récupération des champs du formulaire
    const surname = document.getElementById("surname").value.trim();
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const genre = document.getElementById("gender").value;
    const birthdate = document.getElementById("birthdate").value;
    const email = document.getElementById("email").value
      .trim()
      .normalize("NFKC")
      .replace(/[^\x00-\x7F]/g, "");

    const password = document.getElementById("password").value.trim();
    const domaine = document.getElementById("domaine").value;

    const line = document.getElementById("line").value.trim();
    const quartier = document.getElementById("quartier").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();

    // 🔐 Validation du mot de passe
    if (password.length < 8) {
      alert("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    // 🔒 Vérification du domaine email
    if (!email.endsWith("@kazidomo.com")) {
      alert("❌ Seuls les emails @kazidomo.com sont autorisés.");
      return;
    }

    // ✅ Création du compte utilisateur
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert("❌ Erreur lors de la création du compte : " + error.message);
      console.error("Erreur signUp :", error);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      alert("❌ ID utilisateur introuvable.");
      return;
    }

    // 🧾 Insertion dans la table utilisateurs
    const { error: insertError } = await supabase.from("utilisateurs").insert([
      {
        id: userId,
        email,
        nom: name,
        prenom: surname,
        birthdate,
        genre,
        telephone: phone,
        adresse: line,
        quartier,
        ville: city,
        pays: country,
        username,
        role: "user",     // rôle d’accès par défaut
        domaine           // domaine métier choisi
      }
    ]);

    if (insertError) {
      alert("❌ Erreur lors de l'enregistrement dans utilisateurs : " + insertError.message);
      console.error(insertError);
      return;
    }

    // 🎉 Succès
    alert("✅ Compte créé avec succès !");
    sessionStorage.setItem("prenom", surname);
    sessionStorage.setItem("domaine", domaine);
    window.location.href = "confirmationpage.html";
  });
});

// 🔑 Réinitialisation du mot de passe si l'utilisateur a oublié
document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value.trim();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://kazidomo.com/reset-confirmation.html"
  });

  if (error) {
    alert("❌ Erreur : " + error.message);
    return;
  }

  alert("📧 Un email de réinitialisation a été envoyé à " + email);
});

// 🔄 Mise à jour du mot de passe après réinitialisation 
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("new-password-form");

  if (!form) {
    console.error("❌ Formulaire introuvable !");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    // 🔐 Vérification
    if (newPassword.length < 8) {
      alert("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    // 🔄 Mise à jour via Supabase
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("❌ Erreur : " + error.message);
      console.error(error);
      return;
    }

    alert("✅ Mot de passe mis à jour avec succès !");
    window.location.href = "login.html"; // Redirection vers la page de connexion
  });
});