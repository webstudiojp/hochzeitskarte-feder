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
  const pearlG  = $('pearls');
  const unschaerfe = $('tempo-blur');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = k => k * (C.hero.tempo || 1);

  /* ---------------------------------------------------------
     1. Geometrie der Fahrbahn im Hintergrundfoto
        Werte am Bild abgemessen (assets/img/allee.webp, 1000x1800).
     --------------------------------------------------------- */
  let seed = 20270101;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

  const el = (tag, attrs) => {
    const n = document.createElementNS(SVG, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  // Fahrbahnkante bei gegebener Hoehe - die Strasse laeuft leicht schraeg
  const roadEdge = (y, side) => {
    const t = Math.max(0, Math.min(1, y / 1800));
    return side === 'l' ? 345 - 165 * t : 660 + 80 * t;
  };
  // Die Strassenmitte wandert nach unten leicht nach links
  const mitteX = y => (roadEdge(y, 'l') + roadEdge(y, 'r')) / 2;

  /* ---------------------------------------------------------
     2. Schriftzug setzen — Groesse passt sich der Laenge an
     --------------------------------------------------------- */
  // Zum Vergleichen: ?schrift=quer bzw. ?schrift=strasse haengt die Konfiguration ab
  const params = new URLSearchParams(location.search);
  // Zum Vorfuehren: ?namen=Lea+%26+Tom setzt das Paar ohne Datei-Aenderung.
  // Wird ausschliesslich per textContent gesetzt, nie als HTML.
  const urlNamen = (params.get('namen') || '').slice(0, 60).trim();
  if (urlNamen) { C.namen = urlNamen; C.hero.schriftzug = urlNamen; }
  const urlAus = params.get('schrift');
  const AUS = urlAus || C.hero.ausrichtung || 'strasse';
  const QUER = AUS === 'quer';

  const SCHRIFT_VON = 400,  SCHRIFT_BIS = 1230;   // laengs der Fahrbahn
  const QUER_Y = 1060, QUER_BREITE = 530;         // waagerecht, einzeilig
  const STAPEL_VON = 520, STAPEL_BIS = 1235;      // gestapelt, perspektivisch
  const MITTE_Y = (SCHRIFT_VON + SCHRIFT_BIS) / 2;

  // "Furkan & Dilara" -> ["Furkan", "&", "Dilara"]
  function zeilenTeilen(txt) {
    const m = txt.split(/\s+(&|und|\+)\s+/i);
    return m.length === 3 ? [m[0], m[1], m[2]] : [txt];
  }
  const istTrenner = z => /^(&|und|\+)$/i.test(z);
  const HERZ_D = 'M0 -26 c-24 -36 -76 -27 -76 13 c0 36 48 60 76 88 c28 -28 76 -52 76 -88 c0 -40 -52 -49 -76 -13 z';
  const HERZ_B = 152;   // Breite der Herzform in Pfadeinheiten
  const trennerAlsHerz = (C.hero.trenner || 'herz') === 'herz';

  // Verfuegbare Textbreite auf der Fahrbahn in dieser Hoehe
  const bahnBreite = y => (roadEdge(y, 'r') - roadEdge(y, 'l')) * 0.73;

  function schriftSetzen() {
    const txt = (C.hero.schriftzug || C.namen || '').trim();
    const g = $('script-group');
    g.innerHTML = '';
    g.removeAttribute('transform');

    const PROBE = 200;
    const neueZeile = inhalt => {
      const t = el('text', {
        'text-anchor': 'middle', x: 0, y: 0, fill: 'none', stroke: '#fff6e8',
        'stroke-linecap': 'round', 'font-family': "'Great Vibes', cursive",
        'font-size': PROBE,
      });
      t.textContent = inhalt;
      g.appendChild(t);
      return t;
    };
    const perlen = (n, size) => {
      const sw = Math.max(3.2, size * 0.033);
      n.setAttribute('stroke-width', sw.toFixed(2));
      n.setAttribute('stroke-dasharray', '0.5 ' + (sw * 1.45).toFixed(2));
      return sw;
    };

    /* ---- gestapelt: jede Zeile waagerecht, perspektivisch gestaffelt ---- */
    if (AUS === 'gestapelt') {
      const zeilen = zeilenTeilen(txt);
      const n = zeilen.length;
      // Zeilen nach unten hin weiter auseinander - das erzeugt die Tiefe
      const ys = zeilen.map((_, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1);
        return STAPEL_VON + (STAPEL_BIS - STAPEL_VON) * Math.pow(t, 1.28);
      });

      // Erst die Namenszeilen messen, damit der Trenner sich daran orientiert
      const knoten = zeilen.map(z => neueZeile(z));
      const groessen = knoten.map((t, i) => {
        const bb = t.getBBox();
        return PROBE * (bahnBreite(ys[i]) / bb.width);
      });
      const namensGroessen = groessen.filter((_, i) => !istTrenner(zeilen[i]));
      const mittel = namensGroessen.reduce((a, b) => a + b, 0) / (namensGroessen.length || 1);

      let maxSw = 3.2;
      knoten.forEach((t, i) => {
        const trenner = istTrenner(zeilen[i]);

        if (trenner && trennerAlsHerz) {
          // Statt "&" ein kleines Perlenherz - spart Platz und ersetzt das Herz am Ende
          const zielB = bahnBreite(ys[i]) * 0.19;
          const h = el('path', {
            d: HERZ_D, fill: 'none', stroke: '#fff6e8', 'stroke-linecap': 'round',
            transform: 'translate(' + mitteX(ys[i]).toFixed(1) + ',' + ys[i].toFixed(1) + ') scale(' + (zielB / HERZ_B).toFixed(3) + ')',
          });
          const sw = Math.max(3.2, (mittel * 0.42) * 0.033) / (zielB / HERZ_B);
          h.setAttribute('stroke-width', sw.toFixed(2));
          h.setAttribute('stroke-dasharray', '0.5 ' + (sw * 1.45).toFixed(2));
          g.replaceChild(h, t);
          return;
        }

        const size = trenner ? mittel * 0.42 : Math.min(groessen[i], 230);
        t.setAttribute('font-size', size);
        const bb = t.getBBox();
        maxSw = Math.max(maxSw, perlen(t, size));
        t.setAttribute('transform',
          'translate(' + mitteX(ys[i]).toFixed(1) + ',' + ys[i].toFixed(1) + ') '
          + 'translate(0,' + (-(bb.y + bb.height / 2)).toFixed(1) + ')');
      });

      if (trennerAlsHerz && zeilen.length === 3) {
        heartEl.style.display = 'none';          // Herz sitzt jetzt in der Mitte
      } else {
        heartEl.setAttribute('transform', 'translate(0,64)');
        perlen(heartEl, maxSw / 0.033);
      }
    }

    /* ---- strasse / quer: eine Zeile ---- */
    else {
      const t = neueZeile(txt);
      const bb = t.getBBox();
      const ziel = QUER ? QUER_BREITE : (SCHRIFT_BIS - SCHRIFT_VON);
      const size = Math.min(PROBE * (ziel / bb.width), QUER ? 170 : 250);
      t.setAttribute('font-size', size);
      const sw = perlen(t, size);
      perlen(heartEl, size);
      const bb2 = t.getBBox();
      const dy = -(bb2.y + bb2.height / 2);
      g.setAttribute('transform', QUER
        ? 'translate(' + mitteX(QUER_Y).toFixed(1) + ',' + QUER_Y + ') translate(0,' + dy.toFixed(1) + ')'
        : 'translate(' + mitteX(MITTE_Y).toFixed(1) + ',' + MITTE_Y + ') rotate(-90) translate(0,' + dy.toFixed(1) + ')');
      heartEl.setAttribute('transform', QUER ? 'translate(0,20)'
        : 'translate(' + (mitteX(1330) - 500).toFixed(1) + ',0)');
    }

    if (!C.hero.herzZeigen) heartEl.style.display = 'none';
  }

  /* ---------------------------------------------------------
     3. Die Fahrt
     --------------------------------------------------------- */
  const START_Y = 1900, END_Y = 40;    // faehrt bis aus dem Bild, sonst bleibt
                                      // der letzte Buchstabe unenthuellt
  const WAGEN_B = 300;        // Breite des Wagenbildes bei scale 1
  const easeIO  = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Ein anfahrender Wagen beschleunigt. Erst zaeh, dann zuegig, am Ende
  // leicht auslaufend - nicht die alte Kurve, die sofort losschoss.
  const fahrKurve = t => {
    if (t < 0.34) return 1.55 * t * t;                 // anfahren
    return 0.179 + (t - 0.34) * 1.244;                 // dann gleichmaessig weiter
  };

  // Der Wagen fuellt immer denselben Anteil der Fahrbahn - das ist die
  // Perspektive, die vorher per Handwert geschaetzt war.
  const wagenScale = y => (roadEdge(y, 'r') - roadEdge(y, 'l')) * 0.46 / WAGEN_B;

  let carY = START_Y, letzteY = START_Y, letzteZeit = 0;

  function wagenSetzen(p, now) {              // p: 0..1
    const e = fahrKurve(Math.max(0, Math.min(1, p)));
    const y = START_Y + (END_Y - START_Y) * e;
    const s = wagenScale(y);

    // Fahrbahn ist nicht spiegelglatt: winziges Zittern, mit dem Tempo staerker
    const v = (letzteZeit && now) ? Math.abs(y - letzteY) / Math.max(1, now - letzteZeit) : 0;
    const zitter = Math.sin(p * 61) * 1.1 * s + Math.sin(p * 37) * 0.7 * s;

    const x = mitteX(y) + Math.sin(p * Math.PI * 1.7) * 14 * (1 - p) + zitter;
    const kipp = Math.sin(p * 23) * 0.22;     // minimales Wanken um die Hochachse

    car.setAttribute('transform',
      'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') '
      + 'rotate(' + kipp.toFixed(2) + ') scale(' + s.toFixed(3) + ')');
    car.setAttribute('opacity', Math.min(1, p * 7).toFixed(2));

    // Bewegungsunschaerfe laengs der Fahrtrichtung, an das Tempo gekoppelt
    if (unschaerfe) unschaerfe.setAttribute('stdDeviation', '0 ' + Math.min(0.9, v * 3).toFixed(2));

    letzteY = y; letzteZeit = now || letzteZeit;
    return { x, y, s };
  }

  const BLUETEN_TON = ['#fffaf0', '#fdf3e4', '#f7e6da', '#efe3d0', '#fff7ea'];

  // Bluetenblatt statt runder Perle: gedrehtes Oval, das kurz nachtrudelt
  function blueteStreuen(x, y, s, wucht) {
    const gr = (3.4 + rnd() * 3.6) * s * (wucht || 1);
    const bx = x + (rnd() - 0.5) * 120 * s * (wucht || 1);
    const by = y + 300 * s + (rnd() - 0.5) * 40 * s;
    const p = el('ellipse', {
      cx: bx.toFixed(1), cy: by.toFixed(1),
      rx: gr.toFixed(2), ry: (gr * 0.66).toFixed(2),
      fill: BLUETEN_TON[Math.floor(rnd() * BLUETEN_TON.length)],
      transform: 'rotate(' + (rnd() * 360).toFixed(0) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')',
    });
    p.style.opacity = (0.85 + rnd() * 0.15).toFixed(2);
    p.style.transition = 'opacity 1.8s ease';
    pearlG.appendChild(p);
    requestAnimationFrame(() => { p.style.opacity = '0'; });
    setTimeout(() => p.remove(), 2000);
  }

  // p = 0 nichts sichtbar, 1 alles. Laengs waechst die Spur von unten herauf.
  function maskeSetzen(p) {
    if (QUER) { maskR.setAttribute('width', (p * 1000).toFixed(1)); maskR.setAttribute('height', 1800); return; }
    if (AUS === 'strasse') {
      const oben = 1800 - p * 1800;
      maskR.setAttribute('y', oben.toFixed(1));
      maskR.setAttribute('height', (1800 - oben).toFixed(1));
    } else {
      maskR.setAttribute('height', (p * 1800).toFixed(1));
    }
  }

  // Zum Schluss treibt der Fahrtwind den ganzen Weg voller Blueten
  function bluetensturm(fertig) {
    if (reduced) { fertig(); return; }
    const t0 = performance.now(), DAUER = T(1500);
    let letzte = 0;
    (function welle(now) {
      const t = now - t0;
      if (now - letzte > 16) {
        letzte = now;
        const dichte = t < DAUER * 0.45 ? 6 : 3;
        for (let i = 0; i < dichte; i++) {
          const x = rnd() * 1000;
          const y = 200 + rnd() * 1500;
          blueteStreuen(x, y - 300 * 1.1, 1.1 + rnd() * 0.9, 1.6);
        }
      }
      if (t < DAUER) requestAnimationFrame(welle);
      else fertig();
    })(performance.now());
  }

  function endzustand() {
    maskeSetzen(1);
    maskR.setAttribute('y', 0);
    maskR.setAttribute('height', 1800);
    if (C.hero.herzZeigen) heartEl.setAttribute('opacity', 1);
    wagenSetzen(1, 0);
    car.setAttribute('opacity', 0);
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
      if (Math.abs(window.scrollY - startY) > 40) return;   // er scrollt schon selbst
      const ziel = $('sek-kopf');
      if (ziel) ziel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, T(1400));
  }

  if (QUER) maskR.setAttribute('width', 0);

  let laeuft = false, abbruch = false, sturmLaeuft = false;

  function fahrtStarten() {
    if (laeuft) return;
    laeuft = true;
    if (reduced) { endzustand(); return; }

    if (C.hero.ueberspringbar) $('skip').hidden = false;

    const t0 = performance.now();
    const FAHRT_START = T(260),  FAHRT_DAUER  = T(6600);
    const PERL_START  = T(560),  PERL_ENDE    = T(6000);
    const REVEAL_START= T(950),  REVEAL_DAUER = T(5600);
    const ENDE        = T(7200);
    let letztePerle = 0;

    function frame(now) {
      if (abbruch) return;
      const t = now - t0;

      const pf = Math.min(1, Math.max(0, (t - FAHRT_START) / FAHRT_DAUER));
      const pos = wagenSetzen(pf, now);
      if (pf >= 1) car.setAttribute('opacity', Math.max(0, 1 - (t - FAHRT_START - FAHRT_DAUER) / T(500)).toFixed(2));

      if (t > PERL_START && t < PERL_ENDE && now - letztePerle > 34) {
        letztePerle = now;
        blueteStreuen(pos.x, pos.y, pos.s);
      }

      // Die Schrift ist die Spur des Wagens: sie reicht exakt bis an sein Heck.
      const heck = pos.y + 300 * pos.s;
      maskeSetzen(Math.max(0, Math.min(1, (1800 - heck) / 1800)));
      if (C.hero.herzZeigen) heartEl.setAttribute('opacity',
        Math.min(1, Math.max(0, (1408 - heck) / 130)).toFixed(2));

      if (t < ENDE) requestAnimationFrame(frame);
      else if (!sturmLaeuft) { sturmLaeuft = true; bluetensturm(endzustand); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     4. Umschlag oeffnen
     --------------------------------------------------------- */
  function oeffnen() {
    const env = $('envelope');
    if (env.dataset.done) return;
    env.dataset.done = '1';
    if (window.HOCHZEIT_MUSIK_START) window.HOCHZEIT_MUSIK_START();
    $('env-flap').classList.add('open');
    env.classList.add('offen');
    // Die Karte braucht ihren Auftritt, bevor die Allee uebernimmt
    setTimeout(() => {
      $('envelope-screen').classList.add('gone');
      fahrtStarten();
    }, reduced ? 60 : 3100);   // Karte steht, dann erst die Allee
  }

  /* ---------------------------------------------------------
     5. Texte aus der Konfiguration + Start
     --------------------------------------------------------- */
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
