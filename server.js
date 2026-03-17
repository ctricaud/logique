const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// ── Chargement des banques de questions ───────
function loadJSON(filename) {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8');
    const data = JSON.parse(raw);
    console.log(`✅ ${data.length} questions chargées depuis ${filename}`);
    return data;
  } catch (err) {
    console.error(`❌ Impossible de charger ${filename} :`, err.message);
    return [];
  }
}

const banques = {
  ce1:     loadJSON('questions.json'),         // 200 questions CE1
  ce2:     loadJSON('questionsce2.json'),       // 200 questions CE2
  mixte:   loadJSON('questionsce1cm1.json'),    // 200 questions CE1+CE2+CM1
};

// Banque combinée CE1+CE2 (400 questions, construite en mémoire)
banques.ce1ce2 = [...banques.ce1, ...banques.ce2];

console.log(`📚 Banques disponibles :
  - ce1    : ${banques.ce1.length} questions
  - ce2    : ${banques.ce2.length} questions
  - ce1ce2 : ${banques.ce1ce2.length} questions
  - mixte  : ${banques.mixte.length} questions`);

// ── API : retourne 10 questions selon la banque choisie ──
// Paramètre GET : ?banque=ce1 | ce2 | ce1ce2 | mixte
app.get('/api/questions', (req, res) => {
  const banqueKey = req.query.banque || 'ce1';
  const pool = banques[banqueKey];

  if (!pool || pool.length === 0) {
    return res.status(400).json({ error: `Banque inconnue ou vide : ${banqueKey}` });
  }

  const session = shuffle(pool).slice(0, 10);
  res.json(session);
});

// ── API debug : toutes les questions d'une banque ──
app.get('/api/questions/all', (req, res) => {
  const banqueKey = req.query.banque || 'ce1';
  res.json(banques[banqueKey] || []);
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
