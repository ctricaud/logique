/* =============================================
   GAME.JS — Jeu éducatif complet
   Profils · Quiz · Dragon · Badges · Étoiles
   ============================================= */

const LETTERS = ['A', 'B', 'C', 'D'];

let questions   = [];
let currentIndex = 0;
let score        = 0;
let results      = [];
let banqueActive = null;

// File d'attente des badges à afficher
let badgeQueue = [];

// ── Éléments DOM ─────────────────────────────
const screens = {
  profil:   document.getElementById('screen-profil'),
  welcome:  document.getElementById('screen-welcome'),
  game:     document.getElementById('screen-game'),
  score:    document.getElementById('screen-score'),
  loading:  document.getElementById('loading'),
  tableau:  document.getElementById('screen-tableau'),
};

const els = {
  // Profil
  profilListe:      document.getElementById('profil-liste'),
  btnNouveauProfil: document.getElementById('btn-nouveau-profil'),
  formCreation:     document.getElementById('form-creation'),
  inputPrenom:      document.getElementById('input-prenom'),
  avatarGrid:       document.getElementById('avatar-grid'),
  btnCreer:         document.getElementById('btn-creer'),

  // Accueil
  accueilAvatar:    document.getElementById('accueil-avatar'),
  accueilNom:       document.getElementById('accueil-nom'),
  accueilSous:      document.getElementById('accueil-sous'),
  btnOuvrirTableau: document.getElementById('btn-ouvrir-tableau'),
  btnChangerProfil: document.getElementById('btn-changer-profil'),
  etoilesMaths:     document.getElementById('etoiles-maths'),
  etoilesFrancais:  document.getElementById('etoiles-francais'),
  etoilesAnglais:   document.getElementById('etoiles-anglais'),

  // Jeu
  changeBtn:        document.getElementById('btn-change'),
  progressFill:     document.getElementById('progress-fill'),
  progressLabel:    document.getElementById('progress-label'),
  questionCat:      document.getElementById('question-cat'),
  questionNiveau:   document.getElementById('question-niveau'),
  questionText:     document.getElementById('question-text'),
  optionsGrid:      document.getElementById('options-grid'),
  feedbackBox:      document.getElementById('feedback-box'),
  feedbackText:     document.getElementById('feedback-text'),
  feedbackExplic:   document.getElementById('feedback-explication'),
  nextBtn:          document.getElementById('btn-next'),

  // Score
  scoreEmoji:   document.getElementById('score-emoji'),
  scoreTitle:   document.getElementById('score-title'),
  scoreNum:     document.getElementById('score-num'),
  scoreDots:    document.getElementById('score-dots'),
  scoreMessage: document.getElementById('score-message'),
  replayBtn:    document.getElementById('btn-replay'),
  homeBtn:      document.getElementById('btn-home'),

  // Tableau
  btnRetourTableau: document.getElementById('btn-retour-tableau'),
  dragonSvg:        document.getElementById('dragon-svg'),
  dragonNom:        document.getElementById('dragon-nom'),
  dragonLabel:      document.getElementById('dragon-label'),
  dragonFill:       document.getElementById('dragon-fill'),
  dragonNextLabel:  document.getElementById('dragon-next-label'),
  streakEmoji:      document.getElementById('streak-emoji'),
  streakVal:        document.getElementById('streak-val'),
  rowMaths:         document.getElementById('row-maths'),
  rowFrancais:      document.getElementById('row-francais'),
  rowAnglais:       document.getElementById('row-anglais'),
  countMaths:       document.getElementById('count-maths'),
  countFrancais:    document.getElementById('count-francais'),
  countAnglais:     document.getElementById('count-anglais'),
  badgesGrid:       document.getElementById('badges-grid'),

  // Popup badge
  badgePopup:  document.getElementById('badge-popup'),
  popupEmoji:  document.getElementById('popup-emoji'),
  popupNom:    document.getElementById('popup-nom'),
  popupDesc:   document.getElementById('popup-desc'),
  btnPopupOk:  document.getElementById('btn-popup-ok'),
};

// ══════════════════════════════════════════════
//   NAVIGATION
// ══════════════════════════════════════════════
function showScreen(name) {
  Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
  if (screens[name]) screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

// ══════════════════════════════════════════════
//   ÉCRAN PROFIL
// ══════════════════════════════════════════════
let avatarSelectionne = null;

function initEcranProfil() {
  // Construire la grille d'avatars
  els.avatarGrid.innerHTML = '';
  Profil.AVATARS.forEach(av => {
    const div = document.createElement('div');
    div.className = 'avatar-option';
    div.dataset.id = av.id;
    div.innerHTML = `<span class="avatar-option-emoji">${av.emoji}</span>
                     <span class="avatar-option-label">${av.label}</span>`;
    div.addEventListener('click', () => {
      document.querySelectorAll('.avatar-option').forEach(d => d.classList.remove('selected'));
      div.classList.add('selected');
      avatarSelectionne = av.id;
      mettreAJourBtnCreer();
    });
    els.avatarGrid.appendChild(div);
  });

  // Afficher profils existants
  rafraichirListeProfils();
}

function rafraichirListeProfils() {
  const profils = Profil.chargerProfils();
  els.profilListe.innerHTML = '';

  profils.forEach(p => {
    const av = Profil.AVATARS.find(a => a.id === p.avatar) || Profil.AVATARS[0];
    const { stade } = Profil.getDragonStade(p);
    const n = p.parties.length;
    const div = document.createElement('div');
    div.className = 'profil-card';
    div.innerHTML = `
      <div class="profil-card-avatar">${av.emoji}</div>
      <div class="profil-card-info">
        <div class="profil-card-nom">${p.prenom}</div>
        <div class="profil-card-stats">${n} partie${n > 1 ? 's' : ''} · ${stade.label}${p.streak > 1 ? ` · 🔥 ${p.streak} jours` : ''}</div>
      </div>
      <div class="profil-card-arrow">▶</div>`;
    div.addEventListener('click', () => choisirProfil(p.id));
    els.profilListe.appendChild(div);
  });
}

function choisirProfil(id) {
  Profil.setProfilActif(id);
  allerAccueil();
}

function allerAccueil() {
  const profil = Profil.getProfilActif();
  if (!profil) { showScreen('profil'); return; }

  const av = Profil.AVATARS.find(a => a.id === profil.avatar) || Profil.AVATARS[0];
  const { stade } = Profil.getDragonStade(profil);
  const n = profil.parties.length;

  els.accueilAvatar.textContent = av.emoji;
  els.accueilNom.textContent    = profil.prenom;
  els.accueilSous.textContent   = `${n} partie${n > 1 ? 's' : ''} · ${stade.label}${profil.streak > 1 ? ` · 🔥 ${profil.streak} jours` : ''}`;

  // Étoiles mini dans les colonnes
  const etoiles = Profil.getEtoilesParMatiere(profil);
  afficherEtoilesMini(els.etoilesMaths,    etoiles.maths,    '#00c864');
  afficherEtoilesMini(els.etoilesFrancais, etoiles.francais, '#ffa000');
  afficherEtoilesMini(els.etoilesAnglais,  etoiles.anglais,  '#00a0ff');

  showScreen('welcome');
}

function afficherEtoilesMini(container, count, couleur) {
  container.innerHTML = '';
  const max = Math.min(count, 20); // max 20 étoiles affichées
  for (let i = 0; i < max; i++) {
    const s = document.createElement('span');
    s.style.cssText = `font-size:0.8rem;line-height:1;color:${couleur};`;
    s.textContent = '★';
    container.appendChild(s);
  }
  if (count > 20) {
    const s = document.createElement('span');
    s.style.cssText = 'font-size:0.7rem;color:#666;';
    s.textContent = `+${count - 20}`;
    container.appendChild(s);
  }
}

// Validation formulaire création
function mettreAJourBtnCreer() {
  const prenom = els.inputPrenom.value.trim();
  els.btnCreer.disabled = !(prenom.length >= 1 && avatarSelectionne);
}

els.inputPrenom.addEventListener('input', mettreAJourBtnCreer);

els.btnNouveauProfil.addEventListener('click', () => {
  els.formCreation.classList.add('visible');
  els.btnNouveauProfil.style.display = 'none';
  els.inputPrenom.focus();
});

els.btnCreer.addEventListener('click', () => {
  const prenom = els.inputPrenom.value.trim();
  if (!prenom || !avatarSelectionne) return;
  const profil = Profil.creerProfil(prenom, avatarSelectionne);
  Profil.setProfilActif(profil.id);
  // Reset formulaire
  els.inputPrenom.value = '';
  avatarSelectionne = null;
  document.querySelectorAll('.avatar-option').forEach(d => d.classList.remove('selected'));
  els.formCreation.classList.remove('visible');
  els.btnNouveauProfil.style.display = '';
  allerAccueil();
});

els.btnChangerProfil.addEventListener('click', () => {
  rafraichirListeProfils();
  showScreen('profil');
});

// ══════════════════════════════════════════════
//   QUIZ
// ══════════════════════════════════════════════
document.querySelectorAll('input[name="banque"]').forEach(radio => {
  radio.addEventListener('change', () => {
    banqueActive = radio.value;
    startGame();
  });
});

async function startGame() {
  if (!banqueActive) return;
  showScreen('loading');
  try {
    const res = await fetch('/api/questions?banque=' + banqueActive);
    if (!res.ok) throw new Error('Erreur serveur');
    questions = await res.json();
    if (!questions.length) throw new Error('Aucune question reçue');
    currentIndex = 0; score = 0; results = [];
    showScreen('game');
    renderQuestion();
  } catch (err) {
    alert('Impossible de charger les questions. (' + err.message + ')');
    showScreen('welcome');
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;
  const pct = Math.round((currentIndex / total) * 100);
  els.progressFill.style.width = pct + '%';
  els.progressLabel.textContent = `Question ${currentIndex + 1} / ${total}`;

  els.questionCat.textContent = q.categorie;
  const { label, cssClass } = niveauInfo(q.niveau);
  els.questionNiveau.textContent = label;
  els.questionNiveau.className = 'badge ' + cssClass;
  els.questionText.textContent = q.question;

  els.optionsGrid.innerHTML = '';
  shuffle([...q.options]).forEach((opt, i) => {
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
}

function selectAnswer(btn, question) {
  els.optionsGrid.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  const isCorrect = btn.dataset.value === question.reponse;
  if (isCorrect) {
    btn.classList.add('correct'); score++; results.push(true);
  } else {
    btn.classList.add('wrong'); results.push(false);
    els.optionsGrid.querySelectorAll('.option-btn').forEach(b => {
      if (b.dataset.value === question.reponse) b.classList.add('revealed');
    });
  }
  showFeedback(isCorrect, question.explication);
  els.nextBtn.classList.add('show');
  els.nextBtn.textContent = (currentIndex === questions.length - 1)
    ? '🏁 Voir mes résultats' : 'Question suivante →';
}

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

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) showScore();
  else renderQuestion();
}

// ══════════════════════════════════════════════
//   SCORE + ENREGISTREMENT
// ══════════════════════════════════════════════
function showScore() {
  showScreen('score');
  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  let emoji, titre, message;
  if (pct === 100) { emoji='🏆'; titre='Parfait !';    message='Tu as tout juste ! Bravo champion !'; }
  else if (pct>=80){ emoji='⭐'; titre='Excellent !';   message='Super travail ! Tu maîtrises très bien !'; }
  else if (pct>=60){ emoji='👍'; titre='Bien joué !';   message='Tu t\'en sors bien ! Continue !'; }
  else if (pct>=40){ emoji='💪'; titre='Continue !';    message='C\'est un bon début ! Rejoue pour progresser !'; }
  else             { emoji='🌱'; titre='Tu apprends !'; message='Ne te décourage pas, ça s\'apprend !'; }

  els.scoreEmoji.textContent   = emoji;
  els.scoreTitle.textContent   = titre;
  els.scoreNum.textContent     = score;
  els.scoreMessage.textContent = message;

  els.scoreDots.innerHTML = '';
  results.forEach((ok, i) => {
    const dot = document.createElement('div');
    dot.className = 'score-dot ' + (ok ? 'ok' : 'ko');
    dot.textContent = ok ? '✓' : '✗';
    dot.title = `Question ${i+1} : ${ok ? 'correcte' : 'incorrecte'}`;
    els.scoreDots.appendChild(dot);
  });

  // Enregistrer dans le profil
  const result = Profil.enregistrerPartie(banqueActive, score);
  if (result && result.nouveauxBadges.length > 0) {
    badgeQueue = [...result.nouveauxBadges];
    // Lancer la file après un délai pour laisser l'écran score s'afficher
    setTimeout(afficherProchainBadge, 1200);
  }

  // Mettre à jour l'accueil en arrière-plan
  allerAccueilSilencieux();
}

function allerAccueilSilencieux() {
  // Mise à jour du header accueil sans changer d'écran
  const profil = Profil.getProfilActif();
  if (!profil) return;
  const av = Profil.AVATARS.find(a => a.id === profil.avatar) || Profil.AVATARS[0];
  const { stade } = Profil.getDragonStade(profil);
  const n = profil.parties.length;
  els.accueilAvatar.textContent = av.emoji;
  els.accueilNom.textContent    = profil.prenom;
  els.accueilSous.textContent   = `${n} partie${n > 1 ? 's' : ''} · ${stade.label}${profil.streak > 1 ? ` · 🔥 ${profil.streak} jours` : ''}`;
  const etoiles = Profil.getEtoilesParMatiere(profil);
  afficherEtoilesMini(els.etoilesMaths,    etoiles.maths,    '#00c864');
  afficherEtoilesMini(els.etoilesFrancais, etoiles.francais, '#ffa000');
  afficherEtoilesMini(els.etoilesAnglais,  etoiles.anglais,  '#00a0ff');
}

// ══════════════════════════════════════════════
//   POPUP BADGES
// ══════════════════════════════════════════════
function afficherProchainBadge() {
  if (badgeQueue.length === 0) return;
  const badge = badgeQueue.shift();
  els.popupEmoji.textContent = badge.emoji;
  els.popupNom.textContent   = badge.label;
  els.popupDesc.textContent  = badge.desc;
  els.badgePopup.classList.add('visible');
}

els.btnPopupOk.addEventListener('click', () => {
  els.badgePopup.classList.remove('visible');
  if (badgeQueue.length > 0) {
    setTimeout(afficherProchainBadge, 400);
  }
});

// ══════════════════════════════════════════════
//   TABLEAU DE BORD
// ══════════════════════════════════════════════
function ouvrirTableau() {
  const profil = Profil.getProfilActif();
  if (!profil) return;

  // Dragon
  const { stade, suivant, total, partiesManquantes } = Profil.getDragonStade(profil);
  els.dragonSvg.innerHTML = Profil.dragonSVG(stade.svg, 100);
  els.dragonNom.textContent = stade.label;
  els.dragonLabel.textContent = `${total} partie${total > 1 ? 's' : ''} jouée${total > 1 ? 's' : ''}`;

  if (suivant) {
    const progress = total - stade.min;
    const range    = suivant.min - stade.min;
    const pct      = Math.round((progress / range) * 100);
    els.dragonFill.style.width = pct + '%';
    els.dragonNextLabel.textContent = `Encore ${partiesManquantes} partie${partiesManquantes > 1 ? 's' : ''} pour devenir "${suivant.label}" !`;
  } else {
    els.dragonFill.style.width = '100%';
    els.dragonNextLabel.textContent = '🐉 Niveau maximum atteint !';
  }

  // Streak
  const s = profil.streak || 0;
  els.streakEmoji.textContent = s >= 7 ? '🔥' : s >= 3 ? '🔥' : s >= 1 ? '⚡' : '💤';
  els.streakVal.textContent   = s > 0
    ? `${s} jour${s > 1 ? 's' : ''} de suite !`
    : 'Pas encore de série — joue aujourd\'hui !';

  // Étoiles par matière
  const etoiles = Profil.getEtoilesParMatiere(profil);
  afficherEtoilesTableau(els.rowMaths,    els.countMaths,    etoiles.maths,    '#00c864');
  afficherEtoilesTableau(els.rowFrancais, els.countFrancais, etoiles.francais, '#ffa000');
  afficherEtoilesTableau(els.rowAnglais,  els.countAnglais,  etoiles.anglais,  '#00a0ff');

  // Badges
  els.badgesGrid.innerHTML = '';
  Profil.BADGES_DEF.forEach(def => {
    const obtenu = profil.badges.includes(def.id);
    const div = document.createElement('div');
    div.className = 'badge-card ' + (obtenu ? 'obtenu' : 'verrou');
    div.innerHTML = `<span class="badge-emoji">${def.emoji}</span>
                     <div class="badge-label">${def.label}</div>
                     <div class="badge-desc">${def.desc}</div>`;
    els.badgesGrid.appendChild(div);
  });

  showScreen('tableau');
}

function afficherEtoilesTableau(rowEl, countEl, count, couleur) {
  rowEl.innerHTML = '';
  countEl.textContent = count;
  const max = Math.min(count, 30);
  for (let i = 0; i < max; i++) {
    const s = document.createElement('span');
    s.style.cssText = `font-size:0.95rem;line-height:1;color:${couleur};`;
    s.textContent = '★';
    rowEl.appendChild(s);
  }
  if (count > 30) {
    const s = document.createElement('span');
    s.style.cssText = 'font-size:0.8rem;color:#666;margin-left:2px;';
    s.textContent = `+${count - 30}`;
    rowEl.appendChild(s);
  }
  if (count === 0) {
    const s = document.createElement('span');
    s.style.cssText = 'font-size:0.8rem;color:#444;font-style:italic;';
    s.textContent = 'Pas encore joué';
    rowEl.appendChild(s);
  }
}

// ══════════════════════════════════════════════
//   UTILITAIRES
// ══════════════════════════════════════════════
function niveauInfo(niveau) {
  if (niveau === 1 || niveau === '1') return { label: 'CE1 ★',    cssClass: 'badge-n1' };
  if (niveau === 2 || niveau === '2') return { label: 'CE2 ★★',  cssClass: 'badge-n2' };
  if (niveau === 3 || niveau === '3') return { label: 'CM1 ★★★', cssClass: 'badge-n3' };
  const map = {
    'fr_ce1': { label: 'FR · CE1', cssClass: 'badge-fr1' },
    'fr_ce2': { label: 'FR · CE2', cssClass: 'badge-fr2' },
    'en_ce1': { label: 'EN · CE1', cssClass: 'badge-en1' },
    'en_ce2': { label: 'EN · CE2', cssClass: 'badge-en2' },
  };
  return map[niveau] || { label: String(niveau), cssClass: 'badge-n1' };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════
//   ÉVÉNEMENTS
// ══════════════════════════════════════════════
els.changeBtn.addEventListener('click', () => showScreen('welcome'));
els.nextBtn.addEventListener('click', nextQuestion);
els.replayBtn.addEventListener('click', startGame);
els.homeBtn.addEventListener('click', () => showScreen('welcome'));
els.btnOuvrirTableau.addEventListener('click', ouvrirTableau);
els.btnRetourTableau.addEventListener('click', () => showScreen('welcome'));

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && els.nextBtn.classList.contains('show')
      && screens.game.classList.contains('active')) {
    nextQuestion();
  }
});

// ══════════════════════════════════════════════
//   DÉMARRAGE
// ══════════════════════════════════════════════
(function init() {
  initEcranProfil();
  const profil = Profil.getProfilActif();
  if (profil) {
    allerAccueil();
  } else {
    showScreen('profil');
  }
})();
