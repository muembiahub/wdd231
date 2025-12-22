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