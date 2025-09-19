const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dossierImages = path.join(__dirname, "images");

// Fonction pour normaliser les noms de fichiers
function normaliserNom(nom) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .replace(/\s+/g, "_")            // espaces → underscore
    .replace(/[^\w-]/g, "")          // supprime caractères spéciaux
    .replace(/\.(jpg|jpeg|png|webp)$/i, ""); // retire extension
}

// Lecture du dossier
fs.readdir(dossierImages, (err, fichiers) => {
  if (err) {
    console.error("❌ Erreur lecture dossier :", err);
    return;
  }

  fichiers.forEach(fichier => {
    const ext = path.extname(fichier).toLowerCase();
    const nomSansExt = path.basename(fichier, ext);
    const nouveauNom = normaliserNom(nomSansExt) + ".webp";

    const ancienChemin = path.join(dossierImages, fichier);
    const nouveauChemin = path.join(dossierImages, nouveauNom);

    // Vérifie que le fichier est lisible
    fs.access(ancienChemin, fs.constants.R_OK, err => {
      if (err) {
        console.error(`❌ Fichier inaccessible : ${fichier}`);
        return;
      }

      // Si déjà .webp → juste renommer
      if (ext === ".webp") {
        if (fichier !== nouveauNom) {
          fs.rename(ancienChemin, nouveauChemin, err => {
            if (err) {
              console.error(`⚠️ Échec renommage ${fichier} →`, err.message);
            } else {
              console.log(`🔄 Renommé sans conversion : ${fichier} → ${nouveauNom}`);
            }
          });
        } else {
          console.log(`⏩ Déjà bien nommé : ${fichier}`);
        }
        return;
      }

      // Conversion + redimensionnement fixe
      sharp(ancienChemin)
        .resize({
 		 width: 400,
 		 height: 300,
 		 fit: "contain",
 		 background: { r: 255, g: 255, b: 255, alpha: 1 } // fond blanc
		})
        .webp({ quality: 80 })
        .toFile(nouveauChemin, err => {
          if (err) {
            console.warn(`⚠️ Échec conversion ${fichier} →`, err.message);
          } else {
            console.log(`✅ Converti : ${fichier} → ${nouveauNom}`);
            fs.unlink(ancienChemin, err => {
              if (err) console.error(`⚠️ Échec suppression ${fichier}`);
            });
          }
        });
    });
  });
});