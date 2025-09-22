const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Connexion
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await client.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById("login-message").textContent = "Erreur : " + error.message;
  } else {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("login-message").innerHTML = `   <div class=banniere><h2> Bienvenue, gardien de la mémoire Kazidomo.</h2>
    <p><strong>Connexion réussie.</strong>  </p></div>`;

    document.getElementById("demandes-section").style.display = "block";
    afficherDemandes();
  }
});


// Affichage des demandes
async function afficherDemandes() {
  const { data, error } = await client
    .from("kazidomo-demandes-services")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("demandes-container");
  container.innerHTML = " ";

  if (error) {
    container.innerHTML = `<p class="erreur">Erreur : ${error.message}</p>`;
    return;
  }

  data.forEach(demande => {
    const card = document.createElement("div");
    card.className = "demande-card";
    card.innerHTML = `
      <h4>${demande.nom}</h4>
      <p><strong>Catégorie :</strong> ${demande.categorie}</p>
      <p>${demande.message}</p>
      <span class="badge badge-${demande.statut}">${demande.statut}</span>
      <button onclick="changerStatut('${demande.id}', 'traité')">Marquer comme traité</button>
    `;
    container.appendChild(card);
  });
}

// Mise à jour du statut
async function changerStatut(id, nouveauStatut) {
  const { error } = await client
    .from("kazidomo-demandes-services")
    .update({ statut: nouveauStatut })
    .eq("id", id);

  if (!error) afficherDemandes();
}
