const SUPABASE_URL = "https://eumdndwnxjqdolbpcyrp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PRp1AmuEtEsGhWnZktlK0Q_uJmipcrO";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🔐 Récupération de la session utilisateur
    const { data: sessionData, error: sessionError } =
      await client.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.warn("Aucun utilisateur connecté.");
      window.location.href = "login.html";
      return;
    }

    // 👤 Récupération des infos utilisateur
    const { data: utilisateur, error: userError } = await client
      .from("utilisateurs")
      .select("role, domaine")
      .eq("id", userId)
      .single();

    if (userError || !utilisateur) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur :",
        userError,
      );
      alert(
        "Erreur : votre compte n'est pas correctement configuré. Contactez l'administrateur.",
      );
      return;
    }

    // 🔍 Détection du rôle
    const role = utilisateur.role?.toLowerCase();
    const domaineAutorisé = utilisateur.domaine;

    // 🛡️ Définition des rôles
    const estSuperadmin = role === "superadmin";
    const estAdmin = ["admin", "superadmin"].includes(role);
    const estPrestataire = role === "prestataire";
    const estRequerant = role === "requerant";

    // 💾 Stockage dans sessionStorage
    sessionStorage.setItem("role", role);
    sessionStorage.setItem("domaineAutorisé", domaineAutorisé);
    sessionStorage.setItem("estSuperadmin", estSuperadmin);
    sessionStorage.setItem("estAdmin", estAdmin);
    sessionStorage.setItem("estPrestataire", estPrestataire);
    sessionStorage.setItem("estRequerant", estRequerant);

    // 🧭 Log de contrôle
    console.log("Rôle :", role);
    console.log("Domaine autorisé :", domaineAutorisé);
    console.log("estSuperadmin =", estSuperadmin);
    console.log("estAdmin =", estAdmin);
    console.log("estPrestataire =", estPrestataire);
    console.log("estRequerant =", estRequerant);

    // 🚀 Initialisation de l'interface
    afficherBadgeRole();
    afficherMenu();
  } catch (err) {
    console.error("Erreur inattendue :", err);
    alert("Une erreur est survenue. Veuillez réessayer plus tard.");
  }
});
