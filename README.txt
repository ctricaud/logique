===================================================
  JEU ÉDUCATIF - CE1 à CM1
  Version 2.0 — Maths · Français · Anglais
===================================================

DESCRIPTION
-----------
Jeu éducatif pour enfants du CE1 au CM1.
10 questions par partie, choix multiples, score sur 10.

Interface haute contraste : fond noir, texte blanc,
police Atkinson Hyperlegible (très lisible).
Sélecteur en 3 colonnes : Maths · Français · Anglais.

MATIÈRES ET BANQUES DE QUESTIONS
----------------------------------

🔢 MATHS
  - CE1        : 200 questions (calcul, géométrie, problèmes…)
  - CE2        : 200 questions (niveau intermédiaire)
  - CE1 + CE2  : 400 questions mélangées (en mémoire)
  - CE1→CM1    : 200 questions tous niveaux

🇫🇷 FRANÇAIS
  - CE1        : 200 questions (grammaire, orthographe, conjugaison)
  - CE2        : 200 questions (niveau avancé)
  - CE1 + CE2  : 400 questions mélangées (en mémoire)

🇬🇧 ANGLAIS (questions en anglais, réponses en anglais)
  - CE1        : 200 questions (vocabulaire, bases, vie quotidienne)
  - CE2        : 200 questions (grammaire, lecture, expressions)
  - CE1 + CE2  : 400 questions mélangées (en mémoire)

TOTAL : 1 400 questions disponibles (1 000 en fichiers + 400 en mémoire)

PRÉREQUIS
---------
- Node.js installé (version 14 ou supérieure)
  Télécharger : https://nodejs.org

INSTALLATION
------------
1. Extraire le ZIP dans un dossier de votre choix

2. Ouvrir un terminal dans ce dossier

3. Installer les dépendances :
   npm install

4. Démarrer le serveur :
   npm start
   (ou : node server.js)

5. Ouvrir le navigateur à l'adresse :
   http://localhost:3000

UTILISATION
-----------
- Choisir une matière et un niveau sur l'écran d'accueil
- Cliquer sur "▶ Jouer !" pour démarrer
- Lire la question et cliquer sur la réponse choisie
- Un feedback immédiat s'affiche (bonne / mauvaise réponse)
- La touche ENTRÉE permet de passer à la question suivante
- À la fin : score sur 10 avec un message d'encouragement
- Cliquer "Rejouer" ou "Accueil" pour continuer

STRUCTURE DES FICHIERS
----------------------
jeu-logique/
├── package.json                     Configuration Node.js
├── server.js                        Serveur Express
├── README.txt                       Ce fichier
├── public/
│   ├── index.html                   Interface (3 colonnes)
│   ├── style.css                    Styles haute contraste
│   └── game.js                      Logique du jeu (côté client)
└── data/
    ├── questions_ce1.json           200 questions Maths CE1
    ├── questions_ce2.json           200 questions Maths CE2
    ├── questions_ce1_ce2_cm1.json   200 questions Maths mixtes
    ├── questions_fr_ce1.json        200 questions Français CE1
    ├── questions_fr_ce2.json        200 questions Français CE2
    ├── questions_en_ce1.json        200 questions Anglais CE1
    └── questions_en_ce2.json        200 questions Anglais CE2

FORMAT D'UNE QUESTION
---------------------
{
  "id": 1,
  "categorie": "Grammaire",
  "niveau": "fr_ce1",
  "question": "Texte de la question ?",
  "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
  "reponse": "Choix A",
  "explication": "Explication de la bonne réponse."
}

Niveaux :
  - Maths     : 1 = CE1, 2 = CE2, 3 = CM1
  - Français  : "fr_ce1", "fr_ce2"
  - Anglais   : "en_ce1", "en_ce2"

CHANGER LE PORT
---------------
Par défaut le jeu tourne sur le port 3000.
Pour changer : PORT=8080 node server.js

===================================================
