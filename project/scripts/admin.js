// 🔊 Audio de validation
const sonValidation = new Audio("/media/sonvalidation.mp3");
sonValidation.onerror = () => {
  console.warn("Son de validation introuvable.");
  showBanner("Le son n’a pas été trouvé. Le silence aussi peut être une réponse.");
};

// 🔐 Supabase client
const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🧭 Connexion utilisateur
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validation éditoriale
  if (!email || !password) {
    afficherMessage(`
      <div class="erreur">
        <h3>Champs manquants</h3>
        <p>Veuillez renseigner votre adresse email et votre mot de passe.</p>
      </div>
    `, true);
    return;
  }

  try {
    const { error, data } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      const message = error.message.includes("Invalid login credentials")
        ? `
          <div class="erreur">
            <h3>Accès refusé</h3>
            <p>Identifiants incorrects. Les portes de Kazidomo restent fermées.</p>
          </div>
        `
        : `
          <div class="erreur">
            <h3>Erreur technique</h3>
            <p>Impossible de vous connecter pour le moment. Veuillez réessayer plus tard.</p>
          </div>
        `;
      afficherMessage(message, true);
    } else {
      afficherMessage(`
        <div class="banniere">
          <h2>Bienvenue, gardien de la mémoire Kazidomo.</h2>
          <p><strong>Connexion réussie.</strong></p>
        </div>
      `);
      document.getElementById("login-box").style.display = "none";
      document.getElementById("demandes-section").style.display = "block";
      afficherDemandes();
    }
  } catch (err) {
    afficherMessage(`
      <div class="erreur">
        <h3>Échec inattendu</h3>
        <p>Une erreur est survenue : ${err.message}</p>
      </div>
    `, true);
  }
});


// 🧾 Affichage des demandes
async function afficherDemandes() {
  const container = document.getElementById("demandes-container");
  container.innerHTML = "";

  try {
    const { data, error } = await client
      .from("kazidomo_demandes_services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    data.forEach(demande => container.appendChild(creerCarteDemande(demande)));
  } catch (err) {
    container.innerHTML = `<p class="erreur">Erreur : ${err.message}</p>`;
    console.error("Erreur lors de l'affichage :", err);
  }
}

// 🧩 Création d’une carte demande
function creerCarteDemande(demande) {
  const card = document.createElement("div");
  card.className = "card";
  if (demande.statut === "traité") card.classList.add("traitee");

  card.innerHTML = `
    <h4><span>Nom du Client :</span> ${demande.name}</h4>
    <p><strong>Catégorie :</strong> ${demande.category}</p>
    <p><strong>Prix :</strong> ${demande.price} $</p>
    <p><strong>Téléphone :</strong> ${demande.client_whatsapp}</p>
    <p><strong>Email :</strong> ${demande.client_email}</p>
    <p><strong>Soumis le :</strong> ${new Date(demande.created_at).toLocaleString()}</p>
    <p><strong>GPS :</strong> ${demande.gps}</p>
    <p><strong>Map URL :</strong> <a href="${demande.map_url}" target="_blank">Voir la localisation</a></p>
    <p><strong>Message :</strong> ${demande.message}</p>
  `;

  if (demande.statut !== "traité") {
    const button = document.createElement("button");
    button.textContent = "Marquer comme traité";
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Traitement...";
      const success = await changerStatut(demande.id, "traité");
      if (success) {
        sonValidation.play();
        button.textContent = "✅ Déjà traité";
        button.classList.add("statut-traite");
      } else {
        button.disabled = false;
        button.textContent = "Marquer comme traité";
      }
    });
    card.appendChild(button);
  } else {
    const statut = document.createElement("p");
    statut.className = "statut-traite";
    statut.textContent = "✅ Déjà traité";
    card.appendChild(statut);
  }

  return card;
}

// 🔄 Changement de statut
async function changerStatut(demandeId, nouveauStatut) {
  try {
    const { error } = await client
      .from("kazidomo_demandes_services")
      .update({ statut: nouveauStatut })
      .eq("id", demandeId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Erreur lors du changement de statut :", err);
    alert("Échec du traitement.");
    return false;
  }
}

// 🪞 Affichage de message
function afficherMessage(message, isError = false) {
  const container = document.getElementById("login-message");
  container.innerHTML = message;
  container.className = isError ? "erreur" : "message";
}

// 🚀 Initialisation
document.addEventListener("DOMContentLoaded", afficherDemandes);



// ------------------ Inscription d'un nouveau traitant ------------------

// 🔐 Supabase client pour l'inscription
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const category = document.getElementById("category").value;

  const { data: signUpData, error: signUpError } = await client.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    alert("Erreur : " + signUpError.message);
    return;
  }

  const userId = signUpData.user.id;

  // Enregistrer la catégorie choisie
  await client.from("categories_traitants").insert([
    {
      category,
      traitant_id: userId,
    },
  ]);

  alert("Compte créé. En attente de validation par un administrateur.");
});