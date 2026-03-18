/* =============================================
   PROFIL.JS — Gestion des profils enfants
   localStorage, dragon, étoiles, badges, streak
   ============================================= */

const STORAGE_KEY = 'jeu_educatif_profils';
const STORAGE_ACTIF = 'jeu_educatif_profil_actif';

// ── Avatars disponibles ───────────────────────
const AVATARS = [
  { id: 'chat',       emoji: '🐱', label: 'Chat' },
  { id: 'chien',      emoji: '🐶', label: 'Chien' },
  { id: 'lapin',      emoji: '🐰', label: 'Lapin' },
  { id: 'renard',     emoji: '🦊', label: 'Renard' },
  { id: 'ours',       emoji: '🐻', label: 'Ours' },
  { id: 'lion',       emoji: '🦁', label: 'Lion' },
  { id: 'licorne',    emoji: '🦄', label: 'Licorne' },
  { id: 'dragon',     emoji: '🐲', label: 'Dragon' },
  { id: 'pingouin',   emoji: '🐧', label: 'Pingouin' },
  { id: 'hibou',      emoji: '🦉', label: 'Hibou' },
  { id: 'tigre',      emoji: '🐯', label: 'Tigre' },
  { id: 'grenouille', emoji: '🐸', label: 'Grenouille' },
];

// ── Stades du dragon ─────────────────────────
const DRAGON_STADES = [
  { min: 0,  label: 'Œuf',          svg: 'egg' },
  { min: 1,  label: 'Bébé dragon',  svg: 'baby' },
  { min: 5,  label: 'Dragonnet',    svg: 'small' },
  { min: 10, label: 'Jeune dragon', svg: 'medium' },
  { min: 20, label: 'Grand dragon', svg: 'large' },
  { min: 35, label: 'Dragon ailé',  svg: 'winged' },
];

// ── Badges disponibles ────────────────────────
const BADGES_DEF = [
  {
    id: 'explorateur',
    emoji: '🌍',
    label: 'Explorateur',
    desc: 'Jouer dans les 3 matières au moins une fois',
    check: (p) => {
      const matieres = new Set(p.parties.map(x => x.matiere));
      return matieres.has('maths') && matieres.has('francais') && matieres.has('anglais');
    }
  },
  {
    id: 'champion_jour',
    emoji: '⭐',
    label: 'Champion du jour',
    desc: '3 parties dans la même journée',
    check: (p) => {
      const parJour = {};
      p.parties.forEach(x => {
        const j = x.date.slice(0, 10);
        parJour[j] = (parJour[j] || 0) + 1;
      });
      return Object.values(parJour).some(n => n >= 3);
    }
  },
  {
    id: 'fidele',
    emoji: '🔥',
    label: 'Fidèle',
    desc: 'Jouer 3 jours de suite',
    check: (p) => p.streak >= 3
  },
  {
    id: 'perfect',
    emoji: '🎯',
    label: 'Parfait !',
    desc: 'Obtenir 10/10 dans une partie',
    check: (p) => p.parties.some(x => x.score === 10)
  },
  {
    id: 'maths_star',
    emoji: '🔢',
    label: 'As des maths',
    desc: '5 parties de maths complétées',
    check: (p) => p.parties.filter(x => x.matiere === 'maths').length >= 5
  },
  {
    id: 'francais_star',
    emoji: '📖',
    label: 'Plume d\'or',
    desc: '5 parties de français complétées',
    check: (p) => p.parties.filter(x => x.matiere === 'francais').length >= 5
  },
  {
    id: 'anglais_star',
    emoji: '🗣️',
    label: 'English speaker',
    desc: '5 parties d\'anglais complétées',
    check: (p) => p.parties.filter(x => x.matiere === 'anglais').length >= 5
  },
  {
    id: 'veteran',
    emoji: '🏅',
    label: 'Vétéran',
    desc: '25 parties complétées au total',
    check: (p) => p.parties.length >= 25
  },
  {
    id: 'semaine',
    emoji: '📅',
    label: 'Une semaine !',
    desc: 'Jouer 7 jours de suite',
    check: (p) => p.streak >= 7
  },
  {
    id: 'polyglotte',
    emoji: '🌐',
    label: 'Polyglotte',
    desc: '10 parties d\'anglais complétées',
    check: (p) => p.parties.filter(x => x.matiere === 'anglais').length >= 10
  },
];

// ── Déterminer la matière d'une banque ────────
function banqueToMatiere(banque) {
  if (!banque) return 'maths';
  if (banque.startsWith('fr_')) return 'francais';
  if (banque.startsWith('en_')) return 'anglais';
  return 'maths';
}

// ── CRUD profils ──────────────────────────────
function chargerProfils() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function sauvegarderProfils(profils) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profils));
}

function creerProfil(prenom, avatarId) {
  const profils = chargerProfils();
  const profil = {
    id: Date.now().toString(),
    prenom: prenom.trim(),
    avatar: avatarId,
    parties: [],
    badges: [],
    streak: 0,
    dernierJour: null,
    cree: new Date().toISOString(),
  };
  profils.push(profil);
  sauvegarderProfils(profils);
  return profil;
}

function getProfilActif() {
  const id = localStorage.getItem(STORAGE_ACTIF);
  if (!id) return null;
  return chargerProfils().find(p => p.id === id) || null;
}

function setProfilActif(id) {
  localStorage.setItem(STORAGE_ACTIF, id);
}

function sauvegarderProfilActif(profil) {
  const profils = chargerProfils();
  const idx = profils.findIndex(p => p.id === profil.id);
  if (idx !== -1) {
    profils[idx] = profil;
    sauvegarderProfils(profils);
  }
}

// ── Enregistrer une partie jouée ──────────────
function enregistrerPartie(banque, score) {
  const profil = getProfilActif();
  if (!profil) return null;

  const aujourd = new Date().toISOString().slice(0, 10);
  const matiere = banqueToMatiere(banque);

  // Streak
  if (profil.dernierJour === aujourd) {
    // déjà joué aujourd'hui, streak inchangé
  } else if (profil.dernierJour === hierDate()) {
    profil.streak = (profil.streak || 0) + 1;
  } else {
    profil.streak = 1;
  }
  profil.dernierJour = aujourd;

  // Ajouter la partie
  profil.parties.push({
    banque,
    matiere,
    score,
    date: new Date().toISOString(),
  });

  // Vérifier les nouveaux badges
  const nouveauxBadges = verifierBadges(profil);

  sauvegarderProfilActif(profil);
  return { profil, nouveauxBadges };
}

function hierDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ── Vérification badges ───────────────────────
function verifierBadges(profil) {
  const nouveaux = [];
  BADGES_DEF.forEach(def => {
    if (!profil.badges.includes(def.id) && def.check(profil)) {
      profil.badges.push(def.id);
      nouveaux.push(def);
    }
  });
  return nouveaux;
}

// ── Calcul stade dragon ───────────────────────
function getDragonStade(profil) {
  const total = profil.parties.length;
  let stade = DRAGON_STADES[0];
  for (const s of DRAGON_STADES) {
    if (total >= s.min) stade = s;
  }
  const idx = DRAGON_STADES.indexOf(stade);
  const suivant = DRAGON_STADES[idx + 1] || null;
  const partiesManquantes = suivant ? suivant.min - total : 0;
  return { stade, suivant, total, partiesManquantes };
}

// ── Étoiles par matière ───────────────────────
function getEtoilesParMatiere(profil) {
  const matieres = { maths: 0, francais: 0, anglais: 0 };
  profil.parties.forEach(p => {
    if (matieres[p.matiere] !== undefined) matieres[p.matiere]++;
  });
  return matieres;
}

// ── SVG du dragon selon stade ─────────────────
function dragonSVG(stadeKey, size = 120) {
  const svgs = {
    egg: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="55" rx="28" ry="35" fill="#a855f7" opacity="0.9"/>
      <ellipse cx="50" cy="55" rx="28" ry="35" fill="none" stroke="#7c3aed" stroke-width="3"/>
      <ellipse cx="42" cy="45" rx="5" ry="7" fill="#c084fc" opacity="0.5"/>
      <text x="50" y="62" text-anchor="middle" font-size="28">🥚</text>
    </svg>`,

    baby: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="65" text-anchor="middle" font-size="52">🐣</text>
    </svg>`,

    small: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="65" text-anchor="middle" font-size="52">🦎</text>
    </svg>`,

    medium: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="65" text-anchor="middle" font-size="52">🐊</text>
    </svg>`,

    large: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="65" text-anchor="middle" font-size="52">🐲</text>
    </svg>`,

    winged: `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="65" text-anchor="middle" font-size="52">🐉</text>
    </svg>`,
  };
  return svgs[stadeKey] || svgs.egg;
}

// ── Export global ─────────────────────────────
window.Profil = {
  AVATARS,
  DRAGON_STADES,
  BADGES_DEF,
  chargerProfils,
  creerProfil,
  getProfilActif,
  setProfilActif,
  sauvegarderProfilActif,
  enregistrerPartie,
  getDragonStade,
  getEtoilesParMatiere,
  verifierBadges,
  banqueToMatiere,
  dragonSVG,
};
