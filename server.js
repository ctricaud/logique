const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// ── Chargement des banques de questions ───────
function loadJSON(filename) {
  const filepath = path.join(__dirname, 'data', filename);
  try {
    const raw = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(raw);
    console.log(`✅ ${data.length} questions chargées depuis ${filename}`);
    return data;
  } catch (err) {
    console.error(`❌ Impossible de charger ${filename} :`, err.message);
    return [];
  }
}

const banques = {
  // ── Maths ─────────────────────────────────
  ce1:   loadJSON('questions_ce1.json'),
  ce2:   loadJSON('questions_ce2.json'),
  mixte: loadJSON('questions_ce1_ce2_cm1.json'),

  // ── Français ──────────────────────────────
  fr_ce1: loadJSON('questions_fr_ce1.json'),
  fr_ce2: loadJSON('questions_fr_ce2.json'),

  // ── Anglais ───────────────────────────────
  en_ce1: loadJSON('questions_en_ce1.json'),
  en_ce2: loadJSON('questions_en_ce2.json'),
};

// Banques combinées CE1+CE2 construites en mémoire
banques.ce1ce2    = [...banques.ce1,    ...banques.ce2];
banques.fr_ce1ce2 = [...banques.fr_ce1, ...banques.fr_ce2];
banques.en_ce1ce2 = [...banques.en_ce1, ...banques.en_ce2];

console.log(`
📚 Banques disponibles :
  ── Maths ──────────────────────
  - ce1      : ${banques.ce1.length} questions
  - ce2      : ${banques.ce2.length} questions
  - ce1ce2   : ${banques.ce1ce2.length} questions
  - mixte    : ${banques.mixte.length} questions
  ── Français ───────────────────
  - fr_ce1   : ${banques.fr_ce1.length} questions
  - fr_ce2   : ${banques.fr_ce2.length} questions
  - fr_ce1ce2: ${banques.fr_ce1ce2.length} questions
  ── Anglais ────────────────────
  - en_ce1   : ${banques.en_ce1.length} questions
  - en_ce2   : ${banques.en_ce2.length} questions
  - en_ce1ce2: ${banques.en_ce1ce2.length} questions
`);

// ── API : retourne 10 questions selon la banque choisie ──
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
