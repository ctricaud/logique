===================================================
  JEU DE LOGIQUE - CE1 à CM1
  Version 1.0
===================================================

DESCRIPTION
-----------
Jeu éducatif de logique pour enfants du CE1 au CM1.
10 questions par partie, choix multiples, score sur 10.
200 questions dans la base de données.

Interface haute contraste : fond noir, texte blanc,
police Atkinson Hyperlegible (très lisible).

CATÉGORIES DE QUESTIONS
------------------------
- Comparaisons (taille, poids, âge, vitesse...)
- Suites logiques (nombres, lettres, motifs...)
- Énigmes
- Déduction (qui a quoi, qui dit vrai...)
- Catégories (classification d'objets ou animaux)
- Temps et calendrier (jours, mois, saisons...)
- Espace et positions (avant, après, devant...)
- Analogies (A est à B ce que C est à...)

PRÉREQUIS
---------
- Node.js installé (version 14 ou supérieure)
  Télécharger : https://nodejs.org

INSTALLATION
------------
1. Extraire le ZIP dans un dossier de votre choix

2. Ouvrir un terminal (invite de commandes) dans ce dossier

3. Installer les dépendances :
   npm install

4. Démarrer le serveur :
   npm start
   (ou : node server.js)

5. Ouvrir le navigateur à l'adresse :
   http://localhost:3000

UTILISATION
-----------
- Cliquer sur "▶ Jouer !" pour démarrer une partie
- Lire la question et cliquer sur la réponse choisie
- Un feedback immédiat s'affiche (bonne / mauvaise réponse)
- La touche ENTRÉE permet de passer à la question suivante
- À la fin : score sur 10 avec un message d'encouragement
- Cliquer "Rejouer" pour une nouvelle partie avec de nouvelles questions

STRUCTURE DES FICHIERS
----------------------
jeu-logique/
├── package.json          Configuration Node.js
├── server.js             Serveur Express
├── README.txt            Ce fichier
├── public/
│   ├── index.html        Interface du jeu
│   ├── style.css         Styles haute contraste
│   └── game.js           Logique du jeu (côté client)
└── data/
    └── questions.json    Base de 200 questions

PERSONNALISATION
----------------
Les questions sont dans data/questions.json
Vous pouvez en ajouter ou en modifier facilement.

Format d'une question :
{
  "id": 201,
  "categorie": "Comparaisons",
  "niveau": 1,
  "question": "Votre question ici ?",
  "options": ["Choix A", "Choix B", "Choix C"],
  "reponse": "Choix A",
  "explication": "Explication de la bonne réponse."
}

Niveaux : 1 = CE1, 2 = CE2, 3 = CM1

CHANGER LE PORT
---------------
Par défaut le jeu tourne sur le port 3000.
Pour changer : PORT=8080 node server.js

===================================================
