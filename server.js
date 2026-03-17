const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Charge les questions depuis le fichier JSON
let allQuestions = [];
try {
  const raw = fs.readFileSync(path.join(__dirname, 'data', 'questions.json'), 'utf8');
  allQuestions = JSON.parse(raw);
  console.log(`✅ ${allQuestions.length} questions chargées.`);
} catch (err) {
  console.error('❌ Impossible de charger questions.json :', err.message);
}

// API : retourne 10 questions mélangées au hasard
app.get('/api/questions', (req, res) => {
  const session = shuffle(allQuestions).slice(0, 10);
  res.json(session);
});

// API : retourne toutes les questions (utile pour debug)
app.get('/api/questions/all', (req, res) => {
  res.json(allQuestions);
});

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

app.listen(PORT, () => {
  console.log(`🎮 Jeu de logique démarré sur http://localhost:${PORT}`);
});
