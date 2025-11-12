const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let estAdmin = false;
let domaineAutorisé = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const { data: session, error: sessionError } = await client.auth.getSession();
    const userId = session?.session?.user?.id;

    if (!userId) {
      console.warn("Aucun utilisateur connecté.");
      return (window.location.href = "login.html");
    }

    const { data: utilisateur, error: userError } = await client
      .from("utilisateurs")
      .select("role, domaine")
      .eq("id", userId)
      .single();

    if (userError || !utilisateur) {
      console.error("Erreur lors de la récupération de l'utilisateur :", userError);
      alert("Erreur : votre compte n'est pas correctement configuré. Contactez l'administrateur.");
      return;
    }

    estAdmin = utilisateur.role?.toLowerCase() === "admin";
    domaineAutorisé = utilisateur.domaine;

    console.log("Rôle :", utilisateur.role, "| estAdmin =", estAdmin);
    console.log("Domaine autorisé :", domaineAutorisé);

    afficherCartes(); // utilise la variable globale estAdmin

  } catch (err) {
    console.error("Erreur inattendue :", err);
    alert("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
});
