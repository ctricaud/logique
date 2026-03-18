/* =============================================
   JEU ÉDUCATIF - Logique côté client
   Maths · Français · Anglais — CE1/CE2/CM1
   ============================================= */

const LETTERS = ['A', 'B', 'C', 'D'];

let questions = [];
let currentIndex = 0;
let score = 0;
let results = [];

// ── Éléments du DOM ──────────────────────────
const screens = {
  welcome: document.getElementById('screen-welcome'),
  game:    document.getElementById('screen-game'),
  score:   document.getElementById('screen-score'),
  loading: document.getElementById('loading'),
};

const els = {
  changeBtn:      document.getElementById('btn-change'),
  nextBtn:        document.getElementById('btn-next'),
  replayBtn:      document.getElementById('btn-replay'),
  homeBtn:        document.getElementById('btn-home'),
  progressFill:   document.getElementById('progress-fill'),
  progressLabel:  document.getElementById('progress-label'),
  questionNum:    document.getElementById('question-num'),
  questionCat:    document.getElementById('question-cat'),
  questionNiveau: document.getElementById('question-niveau'),
  questionText:   document.getElementById('question-text'),
  optionsGrid:    document.getElementById('options-grid'),
  feedbackBox:    document.getElementById('feedback-box'),
  feedbackText:   document.getElementById('feedback-text'),
  feedbackExplic: document.getElementById('feedback-explication'),
  scoreEmoji:     document.getElementById('score-emoji'),
  scoreTitle:     document.getElementById('score-title'),
  scoreNum:       document.getElementById('score-num'),
  scoreDots:      document.getElementById('score-dots'),
  scoreMessage:   document.getElementById('score-message'),
};

// ── Lecture de la banque sélectionnée ─────────
function getBanqueChoisie() {
  const radio = document.querySelector('input[name="banque"]:checked');
  return radio ? radio.value : null;
}

// Démarrer directement au clic sur un radio
document.querySelectorAll('input[name="banque"]').forEach(radio => {
  radio.addEventListener('change', () => {
    startGame();
  });
});

// ── Navigation entre écrans ───────────────────
function showScreen(name) {
  Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
  if (screens[name]) screens[name].classList.add('active');
}

// ── Démarrage d'une partie ────────────────────
async function startGame() {
  const banqueChoisie = getBanqueChoisie();
  if (!banqueChoisie) return;

  showScreen('loading');
  try {
    const res = await fetch('/api/questions?banque=' + banqueChoisie);
    if (!res.ok) throw new Error('Erreur serveur');
    questions = await res.json();
    if (!questions.length) throw new Error('Aucune question reçue');
    currentIndex = 0;
    score = 0;
    results = [];
    showScreen('game');
    renderQuestion();
  } catch (err) {
    alert('Impossible de charger les questions. Vérifiez que le serveur tourne. (' + err.message + ')');
    showScreen('welcome');
  }
}

// ── Affichage d'une question ──────────────────
function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;

  const pct = Math.round((currentIndex / total) * 100);
  els.progressFill.style.width = pct + '%';
  els.progressLabel.textContent = `Question ${currentIndex + 1} / ${total}`;

  els.questionCat.textContent = q.categorie;

  // Badge niveau — gère maths (1/2/3) et nouvelles matières (fr_ce1 etc.)
  const { label, cssClass } = niveauInfo(q.niveau);
  els.questionNiveau.textContent = label;
  els.questionNiveau.className = 'badge ' + cssClass;

  els.questionText.textContent = q.question;

  // ── Rendu des options (jusqu'à 4 choix) ──
  els.optionsGrid.innerHTML = '';
  const shuffledOptions = shuffle([...q.options]);
  shuffledOptions.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.setAttribute('data-letter', LETTERS[i]);
    btn.dataset.value = opt;
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(btn, q));
    els.optionsGrid.appendChild(btn);
  });

  els.feedbackBox.className = 'feedback-box';
  els.feedbackBox.style.display = 'none';
  els.nextBtn.className = 'btn btn-large';

  window.scrollTo(0, 0);
}

// ── Sélection d'une réponse ───────────────────
function selectAnswer(btn, question) {
  const allBtns = els.optionsGrid.querySelectorAll('.option-btn');
  allBtns.forEach(b => { b.disabled = true; });

  const isCorrect = btn.dataset.value === question.reponse;

  if (isCorrect) {
    btn.classList.add('correct');
    score++;
    results.push(true);
    showFeedback(true, question.explication);
  } else {
    btn.classList.add('wrong');
    results.push(false);
    allBtns.forEach(b => {
      if (b.dataset.value === question.reponse) b.classList.add('revealed');
    });
    showFeedback(false, question.explication);
  }

  els.nextBtn.classList.add('show');
  els.nextBtn.textContent = (currentIndex === questions.length - 1)
    ? '🏁 Voir mes résultats'
    : 'Question suivante →';
}

// ── Feedback ─────────────────────────────────
function showFeedback(isCorrect, explication) {
  els.feedbackBox.style.display = 'block';
  if (isCorrect) {
    els.feedbackBox.className = 'feedback-box show correct-fb';
    els.feedbackText.innerHTML = '<span class="feedback-icon">✅</span> Bravo, bonne réponse !';
  } else {
    els.feedbackBox.className = 'feedback-box show wrong-fb';
    els.feedbackText.innerHTML = '<span class="feedback-icon">❌</span> Ce n\'est pas la bonne réponse.';
  }
  els.feedbackExplic.textContent = explication || '';
}

// ── Question suivante ou score ────────────────
function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    showScore();
  } else {
    renderQuestion();
  }
}

// ── Écran de score ────────────────────────────
function showScore() {
  showScreen('score');

  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  let emoji, titre, message;
  if (pct === 100) {
    emoji = '🏆'; titre = 'Parfait !';
    message = 'Tu as tout juste ! Tu es un champion !';
  } else if (pct >= 80) {
    emoji = '⭐'; titre = 'Excellent !';
    message = 'Super travail ! Tu maîtrises très bien !';
  } else if (pct >= 60) {
    emoji = '👍'; titre = 'Bien joué !';
    message = 'Tu t\'en sors bien ! Continue de t\'entraîner !';
  } else if (pct >= 40) {
    emoji = '💪'; titre = 'Continue !';
    message = 'C\'est un bon début ! Rejoue pour t\'améliorer !';
  } else {
    emoji = '🌱'; titre = 'Tu apprends !';
    message = 'Ne te décourage pas, ça s\'apprend avec de la pratique !';
  }

  els.scoreEmoji.textContent = emoji;
  els.scoreTitle.textContent = titre;
  els.scoreNum.textContent = score;
  els.scoreMessage.textContent = message;

  els.scoreDots.innerHTML = '';
  results.forEach((ok, i) => {
    const dot = document.createElement('div');
    dot.className = 'score-dot ' + (ok ? 'ok' : 'ko');
    dot.textContent = ok ? '✓' : '✗';
    dot.title = 'Question ' + (i + 1) + ' : ' + (ok ? 'correcte' : 'incorrecte');
    els.scoreDots.appendChild(dot);
  });

  window.scrollTo(0, 0);
}

// ── Utilitaires ───────────────────────────────

/**
 * Retourne { label, cssClass } pour le badge niveau.
 * Gère les anciens niveaux numériques (maths) et les nouveaux string (fr_ce1 etc.)
 */
function niveauInfo(niveau) {
  // Anciens codes numériques (Maths)
  if (niveau === 1 || niveau === '1') return { label: 'CE1 ★',     cssClass: 'badge-n1' };
  if (niveau === 2 || niveau === '2') return { label: 'CE2 ★★',   cssClass: 'badge-n2' };
  if (niveau === 3 || niveau === '3') return { label: 'CM1 ★★★',  cssClass: 'badge-n3' };

  // Nouveaux codes string
  const map = {
    'fr_ce1':   { label: 'FR · CE1',  cssClass: 'badge-fr1' },
    'fr_ce2':   { label: 'FR · CE2',  cssClass: 'badge-fr2' },
    'en_ce1':   { label: 'EN · CE1',  cssClass: 'badge-en1' },
    'en_ce2':   { label: 'EN · CE2',  cssClass: 'badge-en2' },
  };
  return map[niveau] || { label: String(niveau), cssClass: 'badge-n1' };
}

/** Ancienne signature conservée pour compatibilité */
function niveauLabel(n) {
  return niveauInfo(n).label;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Événements ────────────────────────────────
els.changeBtn.addEventListener('click', () => showScreen('welcome'));
els.nextBtn.addEventListener('click', nextQuestion);
els.replayBtn.addEventListener('click', startGame);
els.homeBtn.addEventListener('click', () => showScreen('welcome'));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (els.nextBtn.classList.contains('show') && screens.game.classList.contains('active')) {
      nextQuestion();
    }
  }
});
