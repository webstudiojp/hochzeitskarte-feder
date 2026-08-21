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

    schreib = { zuege: zuege, mess: bahn, laenge: laenge, grenzen: grenzen,
                spruenge: spruenge, pausen: pausen,
                ox: mitte, oy: oy, s: s };
    profilBauen();

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

  // Die Neigung wird nachgefuehrt, nicht gesetzt: eine Hand dreht die
  // Feder traege mit. Ohne diese Traegheit ruckt sie in jeder Schleife.
  let neigungIst = FEDER_NEIGUNG;

  function federAufPfad(z, sichtbar, dt) {
    // Die Position kommt aus dem Profil - auch zwischen zwei Zuegen, wo
    // die Feder ueber das Papier gleitet statt auf der Stelle zu warten.
    const x = schreib.ox + z.x * schreib.s;
    const y = schreib.oy + z.y * schreib.s;
    const dort = amPfad(Math.min(schreib.laenge, z.l + 2.2));
    const roh = Math.atan2(dort.y - (schreib.oy + z.y * schreib.s),
                           dort.x - (schreib.ox + z.x * schreib.s)) * 180 / Math.PI;

    // Beim echten Absetzen loest sich die Spitze; beim Weitergleiten
    // innerhalb eines Buchstabens bleibt sie praktisch auf dem Papier.
    const hoch = z.hebung * Math.min(30, 6 + z.weite * schreib.s * 0.16);
    const gr   = 1 + z.hebung * 0.022;

    // Das Wiegen der Hand laeuft in der Zeit, nicht im Weg - am Weg
    // gekoppelt flatterte es mit dem Schreibtempo mit.
    const jetzt = performance.now();
    const wiegen = Math.sin(jetzt / 1100) * 0.42 + Math.sin(jetzt / 1730) * 0.26;

    let ziel = FEDER_NEIGUNG + roh * 0.07 + wiegen - z.hebung * 3;
    // Kuerzesten Weg nehmen: atan2 springt bei plus/minus 180 Grad um
    // volle 360 - ungebremst reisst das die Feder jedes Mal herum.
    let ab = ziel - neigungIst;
    while (ab >  180) ab -= 360;
    while (ab < -180) ab += 360;
    const traegheit = 1 - Math.pow(0.004, Math.min(0.05, (dt || 16) / 1000));
    neigungIst += ab * traegheit;

    federEl.setAttribute('transform',
      'translate(' + x.toFixed(2) + ',' + (y - hoch).toFixed(2) + ') ' +
      'rotate(' + neigungIst.toFixed(2) + ') scale(' + gr.toFixed(4) + ')');
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
     Wie schnell die Hand an welcher Stelle ist

     Eine Hand schreibt nicht mit gleichbleibendem Tempo. Sie wird in
     engen Bogen langsamer und zieht auf geraden Strecken an - in der
     Bewegungsforschung heisst das Zwei-Drittel-Potenzgesetz: die
     Geschwindigkeit waechst mit der dritten Wurzel des Kurvenradius.
     Genau das fehlte bisher. Mit festem Tempo entlang der Linie zuckt
     die Feder durch jede Schleife, und das sieht hektisch aus.

     Hier wird der Weg einmal abgetastet, an jeder Stelle die Kruemmung
     bestimmt und daraus eine Tabelle Zeit -> Weg gebaut. Danach kostet
     die Abfrage im Bild nur noch eine Suche.
     --------------------------------------------------------- */
  const ABTASTUNG = 1.1;          // Schrittweite in Pfadeinheiten

  function profilBauen() {
    const L = schreib.laenge, g = schreib.grenzen;
    const zeit = [], wegs = [], px = [], py = [], hub = [], weit = [];
    const punkt = l => schreib.mess.getPointAtLength(Math.max(0, Math.min(L, l)));

    let t = 0, zug = 0;
    for (let l = 0; l <= L; l += ABTASTUNG) {
      const a = punkt(l - ABTASTUNG), b = punkt(l), c = punkt(l + ABTASTUNG);
      let dw = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(b.y - a.y, b.x - a.x);
      while (dw >  Math.PI) dw -= 2 * Math.PI;
      while (dw < -Math.PI) dw += 2 * Math.PI;
      const kruemmung = Math.abs(dw) / ABTASTUNG;
      const v = Math.pow(1 / (1 + kruemmung * 34), 1 / 3);

      zeit.push(t); wegs.push(l); px.push(b.x); py.push(b.y); hub.push(0); weit.push(0);
      t += ABTASTUNG / Math.max(0.22, v);

      /* Der Uebergang zum naechsten Zug.

         Die Schrift besteht aus 49 Einzelzuegen, aber eine Hand hebt
         nicht 48-mal ab. Zwischen zwei Boegen desselben Buchstabens
         gleitet sie einfach weiter - flach, schnell, ohne die Spitze
         wirklich zu loesen. Nur der Weg zum i-Punkt oder hinunter in
         die naechste Zeile ist ein echtes Absetzen.

         Entscheidend ist ausserdem, dass die Feder waehrend dieser Zeit
         WANDERT. Vorher stand sie am Zugende und wippte auf der Stelle,
         bevor sie weitersprang - genau das sah nicht nach Schreiben aus. */
      while (zug < g.length - 1 && l >= g[zug]) {
        const von = punkt(g[zug] - 0.02);          // Ende dieses Zuges
        const bis = punkt(g[zug] + 0.02);          // Ansatz des naechsten
        const w = Math.hypot(bis.x - von.x, bis.y - von.y);
        const echt = w > 13;                        // echtes Absetzen?
        const dauer = echt ? 8 + w * 0.34 : 1.1 + w * 0.28;
        const stufen = echt ? 6 : 3;

        for (let k = 1; k <= stufen; k++) {
          const f = k / stufen;
          // Weicher Ein- und Auslauf, damit der Uebergang nicht ruckt
          const e = f * f * (3 - 2 * f);
          const bogen = Math.sin(f * Math.PI);
          zeit.push(t + dauer * f);
          wegs.push(g[zug]);
          px.push(von.x + (bis.x - von.x) * e);
          py.push(von.y + (bis.y - von.y) * e - (echt ? bogen * w * 0.16 : 0));
          hub.push(echt ? bogen : 0);
          weit.push(echt ? w : 0);
        }
        t += dauer;
        zug++;
      }
    }
    const letzt = punkt(L);
    zeit.push(t); wegs.push(L); px.push(letzt.x); py.push(letzt.y); hub.push(0); weit.push(0);

    schreib.profil = { zeit, weg: wegs, px, py, hub, weit, dauer: t, zeiger: 0 };
  }

  /* ---------------------------------------------------------
     5. Der Ablauf

     Zwischen zwei Zuegen haelt die Feder an und hebt ab - und
     zwar umso laenger, je weiter der Weg zum naechsten Ansatz
     ist. Der Sprung von "Furkan" hinunter zu "Dilara" dauert
     deshalb sichtbar laenger als der Punkt auf dem i.
     --------------------------------------------------------- */
  function schreibPunkt(p) {
    const pr = schreib.profil;
    const t = p * pr.dauer;
    // Die Zeit laeuft vorwaerts, also weiter suchen statt von vorn
    let i = pr.zeiger;
    if (pr.zeit[i] > t) i = 0;
    while (i < pr.zeit.length - 1 && pr.zeit[i + 1] <= t) i++;
    pr.zeiger = i;

    const t0 = pr.zeit[i], t1 = pr.zeit[i + 1];
    const f = t1 > t0 ? (t - t0) / (t1 - t0) : 0;
    const misch = (a, b) => a + (b - a) * f;
    return {
      l:      misch(pr.weg[i], pr.weg[i + 1]),
      x:      misch(pr.px[i],  pr.px[i + 1]),
      y:      misch(pr.py[i],  pr.py[i + 1]),
      hebung: misch(pr.hub[i], pr.hub[i + 1]),
      weite:  pr.weit[i],
    };
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
    const SCHREIBEN  = T(7600);
    const ABHEBEN    = T(900);
    const HERZ       = T(700);
    const SIEGEL     = T(900);
    const s1 = ANSCHWEBEN, s2 = s1 + SCHREIBEN, s3 = s2 + ABHEBEN,
          s4 = s3 + HERZ, s5 = s4 + SIEGEL;

    const siegel = $('siegel-gruppe');
    const start = amPfad(0);
    const ende  = amPfad(schreib.laenge);

    let zuletzt = t0;
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
        neigungIst = -38 + 14 * p;
      } else if (t < s2) {
        const p = (t - s1) / SCHREIBEN;
        const z = schreibPunkt(p);
        tinteSetzen(z.l);
        federAufPfad(z, 1, now - zuletzt);
      } else if (t < s3) {
        // Abheben vom letzten Buchstaben weg, nach rechts oben aus dem Bild
        const p = easeIO((t - s2) / ABHEBEN);
        tinteSetzen(schreib.laenge);
        federEl.setAttribute('transform',
          'translate(' + (ende.x + 190 * p).toFixed(1) + ',' + (ende.y - 210 * p).toFixed(1) + ') ' +
          // Von der zuletzt geschriebenen Neigung ausgehen, sonst ruckt
          // die Feder im Moment des Abhebens noch einmal.
          'rotate(' + (neigungIst - 18 * p).toFixed(1) + ') scale(' + (1 + 0.09 * p).toFixed(3) + ')');
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
      zuletzt = now;
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
