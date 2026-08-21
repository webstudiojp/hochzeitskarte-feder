(() => {
  'use strict';

  /* ---------------------------------------------------------
     Viewporthoehe messen statt sie CSS zu ueberlassen.
     dvh/svh liefern auf iOS beim ersten Laden gelegentlich einen
     zu kleinen Wert - dann lugt die naechste Section unten herein.
     Nur bei echter Breitenaenderung neu setzen, sonst springt das
     Layout jedes Mal, wenn Safari seine Leiste ein- und ausklappt.
     --------------------------------------------------------- */
  (function sichthoehe() {
    const setz = () => document.documentElement.style
      .setProperty('--sicht', window.innerHeight + 'px');
    setz();
    let breite = window.innerWidth;
    addEventListener('resize', () => {
      if (Math.abs(window.innerWidth - breite) > 2) { breite = window.innerWidth; setz(); }
    });
    addEventListener('orientationchange', () => setTimeout(setz, 260));
    // Nach dem vollstaendigen Laden noch einmal, falls Safari die Leiste
    // erst danach einblendet
    addEventListener('load', () => setTimeout(setz, 60));
  })();
  const C = window.HOCHZEIT;
  const SVG = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);

  const scene   = $('scene');
  const car     = $('car');
  const heartEl = $('heart');
  const maskR   = $('reveal-rect');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = k => k * (C.hero.tempo || 1);

  /* ---------------------------------------------------------
     1. Die Schreibflaeche
        Werte am Bild abgemessen (assets/img/schreibtisch.webp).
        Das Blatt liegt bei 28,5 bis 76,5 Prozent der Breite.
     --------------------------------------------------------- */
  let seed = 20270101;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const el = (tag, attrs) => {
    const n = document.createElementNS(SVG, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  const BLATT = { links: 300, rechts: 750, oben: 620, unten: 1270 };
  const ZEILE = 900;                       // Grundlinie der Namen
  const RAND  = 34;                        // Abstand zum Blattrand

  /* ---------------------------------------------------------
     2. Staub im Kerzenlicht
     --------------------------------------------------------- */
  (function staub() {
    if (reduced) return;
    const g = $('staub');
    for (let i = 0; i < 26; i++) {
      const k = el('circle', {
        cx: (rnd() * 620).toFixed(0),
        cy: (200 + rnd() * 1400).toFixed(0),
        r: (1 + rnd() * 2.4).toFixed(2),
        fill: '#ffe6bb',
      });
      k.style.opacity = (0.12 + rnd() * 0.3).toFixed(2);
      k.style.animation = 'staub-treiben ' + (14 + rnd() * 16).toFixed(1) + 's linear infinite';
      k.style.animationDelay = '-' + (rnd() * 24).toFixed(1) + 's';
      g.appendChild(k);
    }
  })();

  /* ---------------------------------------------------------
     3. Der Schriftzug auf dem Blatt
     --------------------------------------------------------- */
  function schriftSetzen() {
    const txt = (C.hero.schriftzug || C.namen || '').trim();
    const g = $('script-group');
    g.innerHTML = '';
    g.removeAttribute('transform');

    const t = el('text', {
      'text-anchor': 'middle', x: 0, y: 0,
      fill: '#2a1a12', stroke: 'none',
      'font-family': "'Great Vibes', cursive", 'font-size': 200,
    });
    t.textContent = txt;
    g.appendChild(t);

    const bb = t.getBBox();
    const platz = (BLATT.rechts - BLATT.links) - RAND * 2;
    const groesse = Math.min(200 * (platz / bb.width), 132);
    t.setAttribute('font-size', groesse);

    const bb2 = t.getBBox();
    const mitte = (BLATT.links + BLATT.rechts) / 2;
    t.setAttribute('transform',
      'translate(' + mitte + ',' + ZEILE + ') translate(0,' + (-(bb2.y + bb2.height / 2)).toFixed(1) + ')');

    // Der geschriebene Bereich, an dem sich die Feder orientiert
    const nach = t.getBBox();
    schrift = {
      links: mitte + nach.x - bb2.x * 0 - nach.width / 2 + nach.width / 2 - nach.width / 2,
      breite: nach.width,
      knoten: t,
    };
    schrift.links = mitte - nach.width / 2;
    schrift.rechts = mitte + nach.width / 2;

    heartEl.setAttribute('stroke-width', Math.max(3.4, groesse * 0.036).toFixed(2));
    if (!C.hero.herzZeigen) heartEl.style.display = 'none';
  }
  let schrift = { links: 340, rechts: 710, breite: 370 };

  /* ---------------------------------------------------------
     4. Die Feder folgt dem Schreibpunkt
     --------------------------------------------------------- */
  const federEl = $('feder');
  const easeIO = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function federSetzen(p, sichtbar) {         // p: 0..1 entlang der Zeile
    const x = schrift.links + (schrift.rechts - schrift.links) * p;
    // Die Hand hebt und senkt sich beim Schreiben, das laeuft nie schnurgerade
    const wippe = Math.sin(p * Math.PI * 9) * 7 + Math.sin(p * Math.PI * 23) * 2.5;
    const neigung = -22 + Math.sin(p * Math.PI * 6) * 2.5;
    federEl.setAttribute('transform',
      'translate(' + x.toFixed(1) + ',' + (ZEILE + wippe).toFixed(1) + ') rotate(' + neigung.toFixed(1) + ')');
    federEl.setAttribute('opacity', sichtbar.toFixed(2));
  }

  /* ---------------------------------------------------------
     5. Der Ablauf
     --------------------------------------------------------- */
  function maskeSetzen(p) {
    maskR.setAttribute('x', schrift.links - 20);
    maskR.setAttribute('width', ((schrift.rechts - schrift.links + 40) * p).toFixed(1));
  }

  function endzustand() {
    maskR.setAttribute('x', 0);
    maskR.setAttribute('width', 1000);
    federEl.setAttribute('opacity', 0);
    if (C.hero.herzZeigen) heartEl.setAttribute('opacity', 1);
    $('siegel-gruppe').setAttribute('opacity', 1);
    $('siegel-gruppe').style.transform = 'none';
    $('hero-caption').classList.add('show');
    $('scroll-cue').classList.add('show');
    $('skip').hidden = true;
    document.body.classList.remove('locked');
    weiterZurKarte();
  }

  // Sanft in die Einladung uebergehen - aber nur, wenn der Gast nicht
  // laengst selbst gescrollt hat. Sonst reisst man ihm die Seite weg.
  function weiterZurKarte() {
    if (reduced || abbruch) return;
    const startY = window.scrollY;
    setTimeout(() => {
      if (Math.abs(window.scrollY - startY) > 40) return;
      const ziel = $('sek-kopf');
      if (ziel) ziel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, T(1500));
  }

  let laeuft = false, abbruch = false;

  function fahrtStarten() {
    if (laeuft) return;
    laeuft = true;
    if (reduced) { endzustand(); return; }
    if (C.hero.ueberspringbar) $('skip').hidden = false;

    const t0 = performance.now();
    const ANSCHWEBEN = T(1150);                    // Feder kommt ins Bild
    const SCHREIBEN  = T(5200);                    // Namen entstehen
    const ABHEBEN    = T(900);                     // Feder verlaesst das Blatt
    const HERZ       = T(700);
    const SIEGEL     = T(900);
    const s1 = ANSCHWEBEN, s2 = s1 + SCHREIBEN, s3 = s2 + ABHEBEN,
          s4 = s3 + HERZ, s5 = s4 + SIEGEL;

    const siegel = $('siegel-gruppe');

    function frame(now) {
      if (abbruch) return;
      const t = now - t0;

      if (t < s1) {
        // Anschweben von rechts unten, noch neben dem Blatt
        const p = easeIO(t / s1);
        const x = schrift.rechts + 210 - (schrift.rechts + 210 - schrift.links) * p;
        const y = ZEILE + 260 - 260 * p;
        federEl.setAttribute('transform',
          'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + (-34 + 12 * p).toFixed(1) + ')');
        federEl.setAttribute('opacity', Math.min(1, p * 1.7).toFixed(2));
      } else if (t < s2) {
        // Schreiben: die Tinte reicht immer exakt bis zur Federspitze
        const p = (t - s1) / SCHREIBEN;
        maskeSetzen(p);
        federSetzen(p, 1);
      } else if (t < s3) {
        const p = (t - s2) / ABHEBEN;
        maskeSetzen(1);
        const x = schrift.rechts + 150 * p;
        const y = ZEILE - 150 * p;
        federEl.setAttribute('transform',
          'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') rotate(' + (-22 - 16 * p).toFixed(1) + ')');
        federEl.setAttribute('opacity', (1 - p).toFixed(2));
      } else if (t < s4) {
        federEl.setAttribute('opacity', 0);
        if (C.hero.herzZeigen) heartEl.setAttribute('opacity', ((t - s3) / HERZ).toFixed(2));
      } else if (t < s5) {
        // Das Siegel wird aufgedrueckt: von oben heran und kurz nachfedern
        const p = (t - s4) / SIEGEL;
        const e = easeIO(Math.min(1, p * 1.25));
        const gr = 1.7 - 0.7 * e;
        siegel.setAttribute('opacity', Math.min(1, p * 2.4).toFixed(2));
        siegel.setAttribute('transform',
          'translate(502,1191) scale(' + gr.toFixed(3) + ') translate(-502,-1191)');
      } else {
        endzustand();
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     6. Umschlag oeffnen
     --------------------------------------------------------- */
  function oeffnen() {
    const env = $('envelope');
    if (env.dataset.done) return;
    env.dataset.done = '1';
    if (window.HOCHZEIT_MUSIK_START) window.HOCHZEIT_MUSIK_START();
    $('env-flap').classList.add('open');
    env.classList.add('offen');
    setTimeout(() => {
      $('envelope-screen').classList.add('gone');
      fahrtStarten();
    }, reduced ? 60 : 3100);
  }

  // Hero-Beschriftungen aus der aktiven Sprache; wird beim Umschalten erneut gerufen
  function heroTexte() {
    const S = (window.HOCHZEIT_SPRACHE && window.HOCHZEIT_SPRACHE()) || C.sprachen[C.standardsprache];
    $('env-kicker').textContent = S.umschlagKicker;
    document.querySelector('.env-hint').textContent = S.umschlagHinweis;
    document.querySelector('.hc-line').textContent = S.heroZeile;
    $('hc-date').textContent = S.datumLang;
    const ek = $('ek-namen'); if (ek) ek.textContent = C.namen;
    $('skip').textContent = S.ueberspringen;
    document.querySelector('.scroll-cue span').textContent = S.weiter;
  }
  window.HOCHZEIT_HERO_TEXTE = heroTexte;
  heroTexte();

  $('envelope').addEventListener('click', oeffnen);
  $('skip').addEventListener('click', () => { abbruch = true; endzustand(); });

  document.body.classList.add('locked');

  // getBBox braucht die geladene Schrift, sonst stimmt die Groesse nicht
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(schriftSetzen);
})();
