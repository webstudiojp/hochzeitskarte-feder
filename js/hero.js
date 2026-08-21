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
     3. Der Schriftzug entsteht als echter Schreibpfad

     Kein Textelement, keine Umrissschrift: SCHREIBSCHRIFT liefert
     die Namen als Folge einzelner Linienzuege - in genau der
     Reihenfolge, in der eine Hand sie zoege. Aus diesen Zuegen
     wird ein einziger Pfad. Er ist zugleich
       - die Tinte (ueber stroke-dashoffset waechst sie mit),
       - die Fuehrungsschiene der Feder (getPointAtLength).
     Beides aus derselben Quelle - deshalb kann die Spitze gar
     nicht mehr neben der Schrift liegen.
     --------------------------------------------------------- */

  // Breitfeder: mehrere deckungsgleiche Lagen, entlang der Federkante
  // gegeneinander versetzt. Wo der Zug quer zur Kante laeuft, addieren
  // sich die Lagen zum breiten Abstrich; laengs dazu bleibt ein
  // Haarstrich. Alle Lagen sind gleich lang - eine Animation genuegt.
  // winkel: Lage der Federkante. Senkrecht dazu liegt die Schattenachse -
  //   bei -35 Grad laufen genau die geneigten Abstriche der Schrift breit,
  //   die Auf- und Querstriche bleiben Haarlinien. Das ist der Kontrast,
  //   von dem eine Kupferstichschrift lebt.
  const NIB = { winkel: -35, breite: 2.6, lagen: 15, strich: 0.34 };

  let schreib = null;   // { lagen, mess, laenge, grenzen, ox, oy, s }

  function zeilenAufteilen(txt) {
    // "Furkan & Dilara" wird zur klassischen Anordnung:
    //   Furkan / & / Dilara  - so steht es auf gedruckten Karten,
    // und die Feder setzt zwischen den Zeilen sichtbar neu an.
    const m = txt.split(/\s*(&|\bund\b|\bve\b)\s*/i);
    if (m.length === 3 && m[0] && m[2]) return [m[0], m[1], m[2]];
    return [txt];
  }

  function schriftSetzen() {
    const txt = (C.hero.schriftzug || C.namen || '').trim();
    const g = $('script-group');
    g.innerHTML = '';
    if (!window.SCHREIBSCHRIFT || !txt) return;

    const S = window.SCHREIBSCHRIFT;
    const zeilen = zeilenAufteilen(txt);
    const gesetzt = zeilen.map(z => S.setzen(z));

    // Die Verbindungszeile ("&") steht kleiner und eingerueckt
    const klein = gesetzt.length === 3 ? [1, 0.62, 1] : [1];
    const breiteMax = Math.max.apply(null, gesetzt.map((r, i) => r.breite * klein[i]));

    const platz = (BLATT.rechts - BLATT.links) - RAND * 2;
    // Unter dem Namen bleiben Herz und Siegel stehen - der Text darf
    // sich diesen Streifen nicht nehmen, sonst schreibt er ins Siegel.
    const FUSS = 200;
    const hochRaum = (BLATT.unten - BLATT.oben) - RAND * 2 - FUSS;
    const zeilenhoehe = 30;                       // in Schrifteinheiten
    const hochBedarf = (gesetzt.length - 1) * zeilenhoehe + 34;
    const s = Math.min(platz / breiteMax, hochRaum / hochBedarf, 4.6);

    // Alle Zeilen mittig, der Block mittig auf dem Blatt
    const mitte = (BLATT.links + BLATT.rechts) / 2;
    const blockH = ((gesetzt.length - 1) * zeilenhoehe) * s;
    const feldMitte = (BLATT.oben + RAND + BLATT.unten - RAND - FUSS) / 2;
    const oy = feldMitte - blockH / 2 - 8 * s;

    const striche = [];
    gesetzt.forEach((r, i) => {
      const f = klein[i];
      const dx = -(r.breite * f) / 2;
      const dy = i * zeilenhoehe;
      r.striche.forEach(d => striche.push(
        d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,
          (_, a, b) => (Number(a) * f + dx).toFixed(2) + ',' + (Number(b) * f + dy - 22 * f + 22).toFixed(2))
      ));
    });

    g.setAttribute('transform', 'translate(' + mitte.toFixed(1) + ',' + oy.toFixed(1) + ') scale(' + s.toFixed(4) + ')');

    // Ein Pfad je Schreibzug. Die Federlagen liegen als Unterpfade darin -
    // und weil SVG das Strichmuster bei jedem Unterpfad neu beginnt,
    // enthuellt ein einziger stroke-dashoffset alle Lagen eines Zuges
    // exakt gleich weit. Ein gemeinsamer Pfad fuer den ganzen Namen
    // scheitert genau daran: dort bekaeme jeder Buchstabe sein eigenes
    // Muster und stuende von der ersten Sekunde an komplett da.
    const a = NIB.winkel * Math.PI / 180;
    const ux = Math.cos(a), uy = Math.sin(a);
    const versetzen = (dd, dx, dy) => dd.replace(
      /(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,
      (_, q, r) => (Number(q) + dx).toFixed(2) + ',' + (Number(r) + dy).toFixed(2));
    function lagern(dd) {
      const k = [];
      for (let i = 0; i < NIB.lagen; i++) {
        const t = (i / (NIB.lagen - 1) - 0.5) * NIB.breite;
        k.push(versetzen(dd, ux * t, uy * t));
      }
      return k.join(' ');
    }

    // Jeden Zug ausmessen: eigene Laenge, Platz im Gesamtweg, und wie
    // weit die Feder danach bis zum naechsten Ansatz springen muss.
    const zuege = [], grenzen = [], spruenge = [], pausen = [];
    let summe = 0, vorEnde = null;
    const tmp = el('path', { fill: 'none' });
    g.appendChild(tmp);

    striche.forEach(st => {
      tmp.setAttribute('d', st);
      const L = tmp.getTotalLength();
      const anfang = tmp.getPointAtLength(0);
      if (vorEnde) {
        const w = Math.hypot(anfang.x - vorEnde.x, anfang.y - vorEnde.y);
        spruenge.push(w);
        // Der Weg hinunter in die naechste Zeile kostet mehr Zeit als
        // der kurze Hupfer zum Tuepfelchen auf dem i.
        pausen.push(Math.min(46, 5 + w * 0.5));
      }
      const knoten = el('path', {
        d: lagern(st), fill: 'none', stroke: '#241509',
        'stroke-width': NIB.strich, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'stroke-dasharray': L, 'stroke-dashoffset': L,
      });
      g.appendChild(knoten);
      zuege.push({ el: knoten, start: summe, laenge: L, stand: L });
      summe += L;
      grenzen.push(summe);
      vorEnde = tmp.getPointAtLength(L);
    });
    g.removeChild(tmp);

    // Unsichtbare Zwillingsbahn ueber alle Zuege: auf ihr misst die Feder
    // ihren Standort, denn hier laeuft die Laengenrechnung durchgehend.
    const bahn = el('path', { d: striche.join(' '), fill: 'none', stroke: 'none' });
    g.appendChild(bahn);
    const laenge = bahn.getTotalLength();

    let gesamt = laenge;
    pausen.forEach(x => { gesamt += x; });

    schreib = { zuege: zuege, mess: bahn, laenge: laenge, grenzen: grenzen,
                spruenge: spruenge, pausen: pausen, gesamt: gesamt,
                ox: mitte, oy: oy, s: s };

    heartEl.setAttribute('stroke-width', Math.max(3.4, s * 1.1).toFixed(2));
    if (!C.hero.herzZeigen) heartEl.style.display = 'none';

    // Herz und Siegel standen bisher auf festen Koordinaten - bei drei
    // Zeilen schrieb der Name mitten hinein. Jetzt richten sie sich an
    // der Unterkante des tatsaechlichen Schriftblocks aus.
    const bb = g.getBBox();
    const textUnten = oy + (bb.y + bb.height) * s;
    const fussRaum = (BLATT.unten - RAND) - textUnten;

    const hb = heartEl.getBBox();
    const hZiel = textUnten + Math.min(58, fussRaum * 0.26);
    const hSkala = Math.max(0.62, Math.min(1, fussRaum / 330));
    heartEl.setAttribute('transform',
      'translate(' + (mitte - (hb.x + hb.width / 2)).toFixed(1) + ',' +
      (hZiel - hb.y).toFixed(1) + ') ' +
      'translate(' + (hb.x + hb.width / 2).toFixed(1) + ',' + hb.y.toFixed(1) + ') ' +
      'scale(' + hSkala.toFixed(3) + ') ' +
      'translate(' + (-(hb.x + hb.width / 2)).toFixed(1) + ',' + (-hb.y).toFixed(1) + ')');

    // Das Siegel sitzt am Blattfuss, nie ueber der Kante
    const sg = $('siegel-gruppe');
    const sb = sg.getBBox();
    const sZiel = Math.min(BLATT.unten - RAND * 0.4 - sb.height,
                           hZiel + hb.height * hSkala + 34);
    schreib.siegelVersatz = { x: mitte - (sb.x + sb.width / 2), y: sZiel - sb.y };
    schreib.siegelMitte = { x: mitte, y: sZiel + sb.height / 2 };
    sg.setAttribute('transform',
      'translate(' + schreib.siegelVersatz.x.toFixed(1) + ',' + schreib.siegelVersatz.y.toFixed(1) + ')');
  }

  /* ---------------------------------------------------------
     4. Die Feder sitzt auf der Tintenspitze - nicht daneben

     Die Position kommt aus dem Schreibpfad selbst. Die Neigung
     folgt der Tangente nur zu einem Bruchteil: eine Hand dreht
     die Feder beim Schreiben kaum, sie haelt sie schraeg und
     bewegt den Arm. Genau das war vorher falsch.
     --------------------------------------------------------- */
  const federEl = $('feder');
  const easeIO = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const FEDER_NEIGUNG = -33;

  function amPfad(l) {
    const p = schreib.mess.getPointAtLength(Math.max(0, Math.min(schreib.laenge, l)));
    return { x: schreib.ox + p.x * schreib.s, y: schreib.oy + p.y * schreib.s };
  }

  function federAufPfad(l, hebung, weite, sichtbar) {
    const hier = amPfad(l);
    const dort = amPfad(Math.min(schreib.laenge, l + 1.6));
    const winkel = Math.atan2(dort.y - hier.y, dort.x - hier.x) * 180 / Math.PI;

    // Beim Absetzen loest sich die Spitze vom Papier: sie steigt, kippt
    // etwas auf und kommt der Kamera minimal naeher.
    const hoch = hebung * Math.min(58, 12 + weite * schreib.s * 0.5);
    const gr   = 1 + hebung * 0.05;
    // Eine Hand ist ruhig, aber nicht starr
    const zittern = Math.sin(l * 0.9) * 0.5 + Math.sin(l * 2.7) * 0.22;
    const neigung = FEDER_NEIGUNG + winkel * 0.13 + zittern - hebung * 6;

    federEl.setAttribute('transform',
      'translate(' + hier.x.toFixed(2) + ',' + (hier.y - hoch).toFixed(2) + ') ' +
      'rotate(' + neigung.toFixed(2) + ') scale(' + gr.toFixed(4) + ')');
    federEl.setAttribute('opacity', sichtbar.toFixed(2));
  }

  /* Die Tinte reicht immer exakt bis dorthin, wo die Spitze steht:
     der laufende Zug waechst mit, die davor stehen fertig da, die
     dahinter warten unsichtbar. */
  function tinteSetzen(l) {
    const z = schreib.zuege;
    for (let i = 0; i < z.length; i++) {
      const t = z[i];
      const off = l >= t.start + t.laenge ? 0
                : l <= t.start            ? t.laenge
                : t.start + t.laenge - l;
      if (t.stand !== off) { t.el.setAttribute('stroke-dashoffset', off.toFixed(2)); t.stand = off; }
    }
  }

  /* ---------------------------------------------------------
     5. Der Ablauf

     Zwischen zwei Zuegen haelt die Feder an und hebt ab - und
     zwar umso laenger, je weiter der Weg zum naechsten Ansatz
     ist. Der Sprung von "Furkan" hinunter zu "Dilara" dauert
     deshalb sichtbar laenger als der Punkt auf dem i.
     --------------------------------------------------------- */
  function schreibPunkt(p) {
    const g = schreib.grenzen, n = g.length;
    let v = p * schreib.gesamt;
    for (let i = 0; i < n - 1; i++) {
      if (v <= g[i]) return { l: v, hebung: 0, weite: 0 };
      const pause = schreib.pausen[i];
      v -= pause;
      if (v < g[i]) {
        const a = (g[i] - v) / pause;                 // 1 am Anfang, 0 am Ende
        return { l: g[i], hebung: Math.sin((1 - a) * Math.PI), weite: schreib.spruenge[i] };
      }
    }
    return { l: Math.min(v, schreib.laenge), hebung: 0, weite: 0 };
  }

  function endzustand() {
    if (schreib) {
      tinteSetzen(schreib.laenge);
    }
    federEl.setAttribute('opacity', 0);
    const tg = $('tinte-gruppe');
    if (tg) tg.setAttribute('filter', 'url(#tinte)');   // jetzt erst die Tintenstruktur
    if (C.hero.herzZeigen) heartEl.setAttribute('opacity', 1);
    const sg2 = $('siegel-gruppe');
    sg2.setAttribute('opacity', 1);
    sg2.style.transform = 'none';
    if (schreib && schreib.siegelVersatz) {
      sg2.setAttribute('transform', 'translate(' + schreib.siegelVersatz.x.toFixed(1) +
        ',' + schreib.siegelVersatz.y.toFixed(1) + ')');
    }
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
    if (!schreib) schriftSetzen();
    if (reduced || !schreib) { endzustand(); return; }
    if (C.hero.ueberspringbar) $('skip').hidden = false;

    const t0 = performance.now();
    const ANSCHWEBEN = T(1150);
    const SCHREIBEN  = T(6200);
    const ABHEBEN    = T(900);
    const HERZ       = T(700);
    const SIEGEL     = T(900);
    const s1 = ANSCHWEBEN, s2 = s1 + SCHREIBEN, s3 = s2 + ABHEBEN,
          s4 = s3 + HERZ, s5 = s4 + SIEGEL;

    const siegel = $('siegel-gruppe');
    const start = amPfad(0);
    const ende  = amPfad(schreib.laenge);

    function frame(now) {
      if (abbruch) return;
      const t = now - t0;

      if (t < s1) {
        // Die Feder kommt von rechts unten heran und senkt sich auf den
        // ersten Ansatzpunkt - genau dorthin, wo der erste Zug beginnt.
        const p = easeIO(t / s1);
        const x = start.x + 250 * (1 - p);
        const y = start.y + 300 * (1 - p);
        federEl.setAttribute('transform',
          'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ') ' +
          'rotate(' + (-38 + 14 * p).toFixed(1) + ') scale(' + (1.1 - 0.1 * p).toFixed(3) + ')');
        federEl.setAttribute('opacity', Math.min(1, p * 1.7).toFixed(2));
      } else if (t < s2) {
        const p = (t - s1) / SCHREIBEN;
        const z = schreibPunkt(p);
        tinteSetzen(z.l);
        federAufPfad(z.l, z.hebung, z.weite, 1);
      } else if (t < s3) {
        // Abheben vom letzten Buchstaben weg, nach rechts oben aus dem Bild
        const p = easeIO((t - s2) / ABHEBEN);
        tinteSetzen(schreib.laenge);
        federEl.setAttribute('transform',
          'translate(' + (ende.x + 190 * p).toFixed(1) + ',' + (ende.y - 210 * p).toFixed(1) + ') ' +
          'rotate(' + (FEDER_NEIGUNG - 18 * p).toFixed(1) + ') scale(' + (1 + 0.09 * p).toFixed(3) + ')');
        federEl.setAttribute('opacity', (1 - p).toFixed(2));
      } else if (t < s4) {
        federEl.setAttribute('opacity', 0);
        if (C.hero.herzZeigen) heartEl.setAttribute('opacity', ((t - s3) / HERZ).toFixed(2));
      } else if (t < s5) {
        const p = (t - s4) / SIEGEL;
        const e = easeIO(Math.min(1, p * 1.25));
        const gr = 1.7 - 0.7 * e;
        const m = schreib.siegelMitte, v = schreib.siegelVersatz;
        siegel.setAttribute('opacity', Math.min(1, p * 2.4).toFixed(2));
        siegel.setAttribute('transform',
          'translate(' + m.x.toFixed(1) + ',' + m.y.toFixed(1) + ') scale(' + gr.toFixed(3) + ') ' +
          'translate(' + (-m.x).toFixed(1) + ',' + (-m.y).toFixed(1) + ') ' +
          'translate(' + v.x.toFixed(1) + ',' + v.y.toFixed(1) + ')');
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
