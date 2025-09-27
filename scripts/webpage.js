 
 const ListePhrases = ["Bonjour le monde", "JavaScript est amusant", "J'aime coder"];
 const listeMots = ["Cachalot", "Pétunia", "Serviette"];
 let score = 0;
 let choix = prompt("Voulez-vous jouer au jeu des phrases (1) ou au jeu des mots (2) ? Entrez 1 ou 2");
 while (choix !== "1" && choix !== "2") {
   choix = prompt("Choix invalide. Veuillez entrer 1 pour le jeu des phrases ou 2 pour le jeu des mots.");
 }
 if (choix === "1") {
     for (let i = 0; i < listeMots.length; i++) {
     motUtilisateur = prompt("Entrez le mot : " +[listeMots[i]])
   if (listeMots[i].includes(motUtilisateur)) {
     score++;
     console.log("Mot correct ! Votre score est de : " + score);
   } else {
       console.log("Désolé, le mot est incorrect");
     }
  }
  console.log("Votre score final est de : " + score + " sur " + listeMots.length);

}

else if (choix ==="2"){


     
       for (let i = 0; i < ListePhrases.length; i++ ){
        motUtilisateur = prompt("Entrez le mot : " + [ListePhrases[i]])
        if (ListePhrases[i].includes(motUtilisateur)){
            score++;
            console.log('Mot correct ! Votre score est de : ' + score);
        }else{
            console.log("Desole, la phrase est incorrect");
        }
        }
        console.log('Votre score final est de ' + score + ' sur '+ ListePhrases.length)
    }

 






