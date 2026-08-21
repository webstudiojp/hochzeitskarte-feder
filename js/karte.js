(() => {
  'use strict';
  const C = window.HOCHZEIT;
  const $ = id => document.getElementById(id);
  const SVGNS = 'http://www.w3.org/2000/svg';

  /* =========================================================
     1. Sprache bestimmen
     Reihenfolge: ausdrueckliche Wahl > Adresszeile > Browser > Standard
     ========================================================= */
  const VERFUEGBAR = C.sprachfolge;
  function spracheErmitteln() {
    const ausUrl = new URLSearchParams(location.search).get('lang');
    if (VERFUEGBAR.includes(ausUrl)) return ausUrl;
    try {
      const gemerkt = localStorage.getItem('sprache');
      if (VERFUEGBAR.includes(gemerkt)) return gemerkt;
    } catch { /* privater Modus */ }
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    if (VERFUEGBAR.includes(browser)) return browser;
    return C.standardsprache;
  }
  let sprache = spracheErmitteln();
  let S = C.sprachen[sprache];
  window.HOCHZEIT_SPRACHE = () => C.sprachen[sprache];

  const mitVersion = pfad => pfad + (C.version && C.version !== '0' ? '?v=' + C.version : '');
  const setzen = (id, wert) => { const n = $(id); if (n) n.textContent = wert; };
  // Symbole als schlanke Linienzeichnung - eine Strichstaerke, ein Duktus.
  // Als Pfade im Skript statt als Bilddateien: null Ladezeit, immer scharf.
  const SYMBOLE = {
    ringe:   'M9.2 13.6a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Z M15.4 16.2a4.4 4.4 0 1 0 0-8.8 4.4 4.4 0 0 0 0 8.8Z',
    glaeser: 'M4.4 3.6h5.4l-1.1 5a1.6 1.6 0 0 1-3.2 0ZM7.1 13.6v5.2M5 18.8h4.2 M14.2 3.6h5.4l-1.1 5a1.6 1.6 0 0 1-3.2 0ZM16.9 13.6v5.2M14.8 18.8H19',
    besteck: 'M6 3.4v6.2a1.8 1.8 0 0 0 3.6 0V3.4M7.8 9.6v11 M16.6 3.4c-1.5 0-2.4 1.6-2.4 4s.9 3.6 2.4 3.6V20.6',
    tanz:    'M9.4 18.4a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM11.6 16.2V4.6l7-1.4v9.6M18.6 15a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z',
    torte:   'M4.2 20.4h15.6v-6a2 2 0 0 0-2-2H6.2a2 2 0 0 0-2 2ZM6.6 12.4V9.6a1.8 1.8 0 0 1 1.8-1.8h7.2a1.8 1.8 0 0 1 1.8 1.8v2.8M12 7.8V4.6M12 3.2v.6',
    mond:    'M19.2 14.4A7.6 7.6 0 0 1 9.2 4.6a7.8 7.8 0 1 0 10 9.8Z',
    bett:    'M3.4 18.6v-9M3.4 14.4h17.2v4.2M20.6 14.4v-3a2 2 0 0 0-2-2h-7.2v4.4M7 12.2a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z',
    auto:    'M4.4 16.4v2.2h2.8v-2.2M16.8 16.4v2.2h2.8v-2.2M3.6 16.4h16.8v-4l-1.8-4.4a1.6 1.6 0 0 0-1.5-1H6.9a1.6 1.6 0 0 0-1.5 1L3.6 12.4ZM3.6 12.4h16.8M6.8 14.4h.6M16.6 14.4h.6',
    geschenk:'M3.8 11.2h16.4v9.4H3.8ZM3 7.6h18v3.6H3ZM12 7.6v13M12 7.6S9.6 7.6 8.4 6.6a2 2 0 0 1 2.6-3c1 .8 1 4 1 4ZM12 7.6s2.4 0 3.6-1a2 2 0 0 0-2.6-3c-1 .8-1 4-1 4Z',
  };
  function symbol(name, klasse) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'sym' + (klasse ? ' ' + klasse : ''));
    svg.setAttribute('aria-hidden', 'true');
    const pfad = document.createElementNS(SVGNS, 'path');
    pfad.setAttribute('d', SYMBOLE[name] || SYMBOLE.ringe);
    svg.appendChild(pfad);
    return svg;
  }

  const el = (tag, klasse, text) => {
    const n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (text != null) n.textContent = text;
    return n;
  };

  /* =========================================================
     2. Vögel am Himmel über der Einladung
     Im Vorbild sind es winzige Silhouetten weit hinten. Genau deshalb
     wirken sie natürlich: man sieht keine Details, nur Bewegung.
     ========================================================= */
  (function voegel() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const feld = $('tauben');
    if (!feld) return;
    // breite: Groesse am Himmel, schlag: Dauer eines halben Fluegelschlags.
    // Kleinere Voegel stehen weiter hinten, schlagen scheinbar schneller
    // und sind blasser - so entsteht Tiefe ohne jede Perspektivrechnung.
    const schwarm = [
      { bahn: 'z1', breite: 54, oben: '11%', verzug: -6,  deckung: .95, schlag: .44 },
      { bahn: 'z1', breite: 40, oben: '17%', verzug: -3,  deckung: .82, schlag: .39 },
      { bahn: 'z2', breite: 31, oben: '21%', verzug: -1,  deckung: .66, schlag: .35 },
      { bahn: 'z3', breite: 44, oben: '8%',  verzug: -24, deckung: .88, schlag: .41 },
      { bahn: 'z4', breite: 25, oben: '26%', verzug: -38, deckung: .54, schlag: .32 },
      { bahn: 'z2', breite: 60, oben: '5%',  verzug: -51, deckung: .97, schlag: .47 },
    ];
    schwarm.forEach(v => {
      const halter = document.createElement('span');
      halter.className = 'vogel ' + v.bahn;
      halter.setAttribute('aria-hidden', 'true');
      halter.style.cssText = 'width:' + v.breite + 'px;top:' + v.oben + ';left:0;'
        + 'opacity:' + v.deckung + ';animation-delay:' + v.verzug + 's;';
      const bild = document.createElement('i');
      bild.className = 'vogel-bild';
      bild.style.setProperty('--schlag', v.schlag + 's');
      // Versetzter Start, sonst schlaegt der ganze Schwarm im Gleichtakt
      bild.style.animationDelay = (v.verzug * 0.37) + 's, '
        + (v.verzug * 0.37) + 's, ' + (v.verzug * 0.37) + 's';
      halter.appendChild(bild);
      feld.appendChild(halter);
    });
  })();

  /* =========================================================
     3. Zierwerk — was durch die Abschnitte treibt

     Ein Bauplan, viele Besetzungen. Jeder Abschnitt bekommt sein
     eigenes Kleinteil, eigene Bahnen, eigenes Tempo — damit die Seite
     nicht acht Mal denselben Effekt zeigt. Erzeugt wird erst beim
     Herankommen, angehalten beim Verlassen: sonst laufen auf einem
     Telefon zweihundert Animationen, die niemand ansieht.
     ========================================================= */
  const zierRnd = (() => {
    let z = 90210;
    return () => (z = (z * 1103515245 + 12345) % 2147483648) / 2147483648;
  })();

  const ZIERWERK = {
    // Blütenblätter: fallen, taumeln, drehen sich weg
    bluete(r, o) {
      const gr = (o.klein || 9) + r() * ((o.gross || 20) - (o.klein || 9));
      const e = document.createElement('span');
      e.className = 'z-bluete';
      e.style.cssText =
        'left:' + (r() * 100).toFixed(1) + '%;top:0;' +
        'width:' + gr.toFixed(1) + 'px;height:' + (gr * 0.74).toFixed(1) + 'px;' +
        'background:' + o.toene[(r() * o.toene.length) | 0] + ';' +
        'opacity:' + (0.26 + r() * 0.34).toFixed(2) + ';' +
        '--drift:' + ((r() * 2 - 1) * 90).toFixed(0) + 'px;' +
        '--dreh:' + (160 + r() * 420).toFixed(0) + 'deg;' +
        'animation-duration:' + (o.dauer[0] + r() * (o.dauer[1] - o.dauer[0])).toFixed(1) + 's;' +
        'animation-delay:-' + (r() * 26).toFixed(1) + 's;';
      return e;
    },
    // Konfetti: Papierschnipsel, die sich beim Fallen um sich selbst kippen
    konfetti(r, o) {
      const b = 5 + r() * 6;
      const e = document.createElement('span');
      e.className = 'z-konfetti';
      e.style.cssText =
        'left:' + (r() * 100).toFixed(1) + '%;top:0;' +
        'width:' + b.toFixed(1) + 'px;height:' + (b * (1.4 + r())).toFixed(1) + 'px;' +
        'background:' + o.toene[(r() * o.toene.length) | 0] + ';' +
        'opacity:' + (0.5 + r() * 0.4).toFixed(2) + ';' +
        (r() < 0.4 ? 'border-radius:2px;' : '') +
        '--drift:' + ((r() * 2 - 1) * 120).toFixed(0) + 'px;' +
        '--dreh:' + (200 + r() * 500).toFixed(0) + 'deg;' +
        '--kipp:' + (0.5 + r() * 1.1).toFixed(2) + 's;' +
        'animation-duration:' + (o.dauer[0] + r() * (o.dauer[1] - o.dauer[0])).toFixed(1) + 's,' +
          (0.5 + r() * 1.1).toFixed(2) + 's;' +
        'animation-delay:-' + (r() * 20).toFixed(1) + 's,-' + (r() * 3).toFixed(1) + 's;';
      return e;
    },
    // Federn: sinken langsam und pendeln dabei seitlich aus
    feder(r, o) {
      const gr = 22 + r() * 30;
      const e = document.createElement('span');
      e.className = 'z-feder';
      e.style.cssText =
        'left:' + (6 + r() * 88).toFixed(1) + '%;top:0;' +
        'width:' + gr.toFixed(0) + 'px;height:' + (gr * 1.9).toFixed(0) + 'px;' +
        'background-image:url("assets/img/feder.webp");' +
        '--deck:' + (0.18 + r() * 0.24).toFixed(2) + ';' +
        '--dauer:' + (17 + r() * 15).toFixed(1) + 's;' +
        '--pendel:' + (3.4 + r() * 2.6).toFixed(1) + 's;' +
        'animation-delay:-' + (r() * 26).toFixed(1) + 's,-' + (r() * 5).toFixed(1) + 's;';
      return e;
    },
    // Funken: Lichtpunkte, die aufglimmen und wieder vergehen
    funke(r, o) {
      const gr = 2 + r() * 4;
      const e = document.createElement('span');
      e.className = 'z-funke';
      e.style.cssText =
        'left:' + (r() * 100).toFixed(1) + '%;top:' + (r() * 100).toFixed(1) + '%;' +
        'width:' + gr.toFixed(1) + 'px;height:' + gr.toFixed(1) + 'px;' +
        'background:' + o.toene[(r() * o.toene.length) | 0] + ';' +
        'box-shadow:0 0 ' + (gr * 3).toFixed(0) + 'px ' + o.toene[0] + ';' +
        '--deck:' + (0.5 + r() * 0.45).toFixed(2) + ';' +
        '--dauer:' + (2.6 + r() * 4).toFixed(1) + 's;' +
        'animation-delay:-' + (r() * 8).toFixed(1) + 's;';
      return e;
    },
    // Ballons: steigen auf, wiegen sich, ziehen ein Band hinter sich
    ballon(r, o) {
      const gr = 16 + r() * 26;
      const ton = o.toene[(r() * o.toene.length) | 0];
      const e = document.createElement('span');
      e.className = 'z-ballon';
      e.style.cssText =
        'left:' + (4 + r() * 92).toFixed(1) + '%;top:0;' +
        'width:' + gr.toFixed(0) + 'px;height:' + (gr * 1.18).toFixed(0) + 'px;' +
        'background-color:' + ton + ';color:' + ton + ';' +
        'opacity:' + (0.42 + r() * 0.34).toFixed(2) + ';' +
        '--drift:' + ((r() * 2 - 1) * 70).toFixed(0) + 'px;' +
        '--dauer:' + (18 + r() * 16).toFixed(1) + 's;' +
        '--wiegen:' + (4 + r() * 3).toFixed(1) + 's;' +
        'animation-delay:-' + (r() * 30).toFixed(1) + 's,-' + (r() * 6).toFixed(1) + 's;';
      return e;
    },
  };

  function zierSetzen(sektion, art, anzahl, opt) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!sektion || !ZIERWERK[art]) return;
    sektion.classList.add('hat-zier');
    const feld = document.createElement('div');
    feld.className = 'zierfeld ruht';
    feld.setAttribute('aria-hidden', 'true');
    const o = Object.assign({ toene: ['#e7d9c4'], dauer: [16, 30] }, opt || {});
    // Auf schmalen Geraeten weniger Teilchen - dort zaehlt jedes Bild
    const n = innerWidth < 700 ? Math.max(4, Math.round(anzahl * 0.6)) : anzahl;
    for (let i = 0; i < n; i++) feld.appendChild(ZIERWERK[art](zierRnd, o));
    sektion.insertBefore(feld, sektion.firstChild);

    // Die Bahnlaenge ist die Hoehe des Abschnitts. In Prozent ginge es
    // nicht: transform:translateY(%) misst an der eigenen Groesse.
    const bahnSetzen = () =>
      feld.style.setProperty('--weg', (sektion.offsetHeight + 110) + 'px');
    bahnSetzen();
    addEventListener('resize', bahnSetzen, { passive: true });
    addEventListener('load', bahnSetzen);

    // Nur laufen lassen, solange der Abschnitt in Sicht ist
    new IntersectionObserver(eintraege => {
      eintraege.forEach(e => feld.classList.toggle('ruht', !e.isIntersecting));
    }, { rootMargin: '120px' }).observe(sektion);
  }

  /* =========================================================
     4. Stilisierte Lageskizze
     Selbst gezeichnet: kein Kartendienst heisst keine Einwilligung
     und keine Lizenzfrage an fremdem Kartenmaterial.
     ========================================================= */
  function kartenbild() {
    const halter = $('kartenbild');
    halter.innerHTML = '';
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', '0 0 320 200');
    s.setAttribute('role', 'img');
    s.setAttribute('aria-label', S.kartenAlt(S.ortName));
    s.innerHTML =
      '<defs>'
      + '<linearGradient id="k-park" x1="0" y1="0" x2="0" y2="1">'
      +   '<stop offset="0%" stop-color="#e0e2c8"/><stop offset="100%" stop-color="#cfd6b6"/>'
      + '</linearGradient>'
      + '<linearGradient id="k-wasser" x1="0" y1="0" x2="1" y2="0">'
      +   '<stop offset="0%" stop-color="#c6d2d4"/><stop offset="100%" stop-color="#aebfc0"/>'
      + '</linearGradient>'
      + '</defs>'
      + '<rect width="320" height="200" fill="#f4ecdc"/>'
      + '<path d="M0 104 C54 92 92 122 148 118 C210 113 248 142 320 132 L320 200 L0 200 Z" fill="url(#k-park)"/>'
      + '<path d="M0 118 C52 108 96 134 150 130 C214 126 252 152 320 144" fill="none" stroke="#c0c8a4" stroke-width="1.2"/>'
      + '<g fill="#bdc8a0" opacity=".75">'
      +   '<circle cx="42" cy="150" r="9"/><circle cx="56" cy="158" r="7"/><circle cx="30" cy="162" r="6.5"/>'
      +   '<circle cx="268" cy="160" r="8.5"/><circle cx="283" cy="168" r="6.5"/><circle cx="118" cy="170" r="7"/>'
      + '</g>'
      + '<path d="M234 0 C246 44 226 78 238 118 C248 152 234 178 246 200" fill="none" stroke="url(#k-wasser)" stroke-width="10" stroke-linecap="round"/>'
      + '<path d="M0 58 L320 42" stroke="#e8d9c0" stroke-width="8" fill="none" stroke-linecap="round"/>'
      + '<path d="M0 58 L320 42" stroke="#d8c4a4" stroke-width="1" fill="none" stroke-dasharray="7 7"/>'
      + '<path class="k-weg" d="M72 200 L96 104 L188 88" stroke="#e8d9c0" stroke-width="5.5" fill="none" stroke-linecap="round"/>'
      + '<path class="k-weg" d="M96 104 L58 50" stroke="#eee2cd" stroke-width="3" fill="none" stroke-linecap="round"/>'
      + '<g>'
      +   '<rect x="150" y="72" width="48" height="30" rx="1.5" fill="#e3d1b2" stroke="#cdb48d" stroke-width="1"/>'
      +   '<rect x="164" y="63" width="20" height="10" rx="1.5" fill="#e3d1b2" stroke="#cdb48d" stroke-width="1"/>'
      +   '<path d="M150 82 h48" stroke="#cdb48d" stroke-width=".8"/>'
      + '</g>'
      + '<g class="k-nadel">'
      +   '<ellipse class="k-schatten" cx="174" cy="63" rx="7" ry="2.4" fill="#8a7550" opacity=".3"/>'
      +   '<path d="M174 40 a12 12 0 1 1 .01 0 M174 40 L174 62" fill="none" stroke="#b5623c" stroke-width="2.4" stroke-linecap="round"/>'
      +   '<circle cx="174" cy="28" r="4.6" fill="#b5623c"/>'
      + '</g>';
    halter.appendChild(s);

    // Die Wege zeichnen sich, sobald die Skizze ins Bild kommt, und
    // erst danach faellt die Nadel auf den Ort. Ohne diese Reihenfolge
    // steht die Karte einfach da.
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const wege = [...s.querySelectorAll('.k-weg')];
      wege.forEach(w => {
        const L = w.getTotalLength();
        w.style.strokeDasharray = L;
        w.style.strokeDashoffset = L;
      });
      halter.classList.remove('gezeichnet');
      new IntersectionObserver((eintraege, beob) => {
        eintraege.forEach(e => {
          if (!e.isIntersecting) return;
          halter.classList.add('gezeichnet');
          wege.forEach((w, i) => {
            w.style.transitionDelay = (0.15 + i * 0.45) + 's';
            w.style.strokeDashoffset = '0';
          });
          beob.disconnect();
        });
      }, { threshold: 0.35 }).observe(halter);
    }
  }

  /* =========================================================
     4. Alle Texte und Listen in der aktiven Sprache aufbauen
     ========================================================= */
  let ersterAufbau = true;
  function aufbauen() {
    S = C.sprachen[sprache];
    const sichtbar = ersterAufbau ? '' : ' da';
    const d = new Date(C.datumISO + 'T12:00:00');
    const frist = new Date(C.rsvp.frist_iso + 'T12:00:00');
    const fristText = frist.getDate() + '. ' + S.monate[frist.getMonth()] + ' ' + frist.getFullYear();

    document.documentElement.lang = S.htmlLang;
    document.title = S.seitentitel(C.namen);

    // Kopf
    const mono = $('monogramm');
    if (mono) mono.textContent = C.braeutigam.charAt(0) + ' · ' + C.braut.charAt(0);
    setzen('k-namen', C.namen);
    setzen('k-zeile', S.heroZeile);
    setzen('kopf-ueber', S.kopfUeberzeile);
    setzen('d-monat', S.monate[d.getMonth()]);
    setzen('d-tag', d.getDate());
    setzen('d-jahr', d.getFullYear());
    setzen('d-wochentag', S.wochentage[d.getDay()]);
    setzen('merken-text', S.merken);
    setzen('btn-kalender-text', S.kalenderKnopf);

    // Anrede
    setzen('a-text', S.anredeText);
    setzen('a-gruss', S.anredeGruss);
    const briefEl = $('brief');
    if (briefEl) briefEl.dataset.monogramm = C.braut.charAt(0);

    // Bildmomente
    setzen('zitat-gross', S.zitat);
    setzen('zitat-klein', S.zitatKlein);
    setzen('abschied-gross', S.abschiedGross);
    setzen('abschied-text', S.abschiedText);

    // Countdown
    setzen('cd-ueber', S.countdownUeber);
    setzen('cd-l-tage', S.cdTage); setzen('cd-l-stunden', S.cdStunden);
    setzen('cd-l-minuten', S.cdMinuten); setzen('cd-l-sekunden', S.cdSekunden);
    setzen('cd-fuss', S.countdownFuss(S.datumLang.replace(/^\w+,\s*/, '')));

    // Ablauf
    setzen('ablauf-titel', S.ablaufTitel);
    const zl = $('zeitleiste');
    zl.innerHTML = '';
    S.ablauf.forEach((p, i) => {
      const li = el('li', 'zl-punkt rv' + sichtbar);
      li.dataset.rv = String(i + 1);
      const kopf = el('div', 'zl-kopf');
      kopf.appendChild(symbol(C.symbole[i], 'zl-sym'));
      li.appendChild(kopf);
      li.appendChild(el('span', 'zl-zeit', C.zeiten[i]));
      li.appendChild(el('h3', 'zl-titel', p.titel));
      if (p.ort)   li.appendChild(el('p', 'zl-ort', p.ort));
      if (p.notiz) li.appendChild(el('p', 'zl-notiz', p.notiz));
      zl.appendChild(li);
    });

    // Gut zu wissen
    setzen('wissen-titel', S.wissenTitel);
    const wl = $('wissen-liste');
    if (wl) {
      wl.innerHTML = '';
      C.wissen.forEach((k, i) => {
        const t = S.wissen[k];
        if (!t) return;
        const d = el('div', 'wi-punkt rv' + sichtbar);
        d.dataset.rv = String(i + 1);
        d.appendChild(symbol(k, 'wi-sym'));
        d.appendChild(el('h3', 'wi-titel', t.titel));
        d.appendChild(el('p', 'wi-text', t.text));
        wl.appendChild(d);
      });
    }

    // Ort
    setzen('ort-titel', S.ortTitel);
    setzen('o-name', S.ortName);
    setzen('o-hinweis', S.ortHinweis);
    setzen('btn-google-text', S.routeGoogle);
    setzen('btn-apple-text', S.routeApple);
    const adr = $('o-adresse');
    adr.innerHTML = '';
    [C.ort.strasse, C.ort.plz + ' ' + C.ort.stadt].forEach((z, i) => {
      if (i) adr.appendChild(document.createElement('br'));
      adr.appendChild(document.createTextNode(z));
    });
    const of = $('ort-foto'); if (of) of.alt = S.ortBildAlt;
    kartenbild();

    // Familien
    setzen('familien-titel', S.familienTitel);
    const fam = $('fam-liste');
    fam.innerHTML = '';
    C.familien.forEach((gruppe, i) => {
      const div = el('div', 'fam-zeile rv' + sichtbar);
      div.dataset.rv = String(i + 1);
      div.appendChild(el('p', 'fam-rolle', S.rollen[gruppe.schluessel]));
      div.appendChild(el('p', 'fam-namen', gruppe.namen.join(' · ')));
      fam.appendChild(div);
    });

    // Dresscode
    setzen('dresscode-titel', S.dresscodeTitel);
    setzen('dc-titel', S.dresscodeKopf);
    setzen('dc-text', S.dresscodeText);
    const dcf = $('dc-farben');
    dcf.innerHTML = '';
    C.farben.forEach(f => {
      const li = el('li', 'dc-farbe');
      const feld = el('span', 'dc-feld');
      feld.style.background = f.hex;
      li.appendChild(feld);
      li.appendChild(el('span', 'dc-name', S.farbnamen[f.schluessel]));
      dcf.appendChild(li);
    });

    // Galerie
    setzen('galerie-titel', S.galerieTitel);
    const gal = $('gal-band');
    gal.innerHTML = '';
    C.galerie.slice(0, 4).forEach((b, i) => {
      const fig = el('figure', 'gal-bild rv' + sichtbar);
      fig.dataset.rv = String(i + 1);
      const img = document.createElement('img');
      img.src = mitVersion(b.datei);
      img.alt = S.bildtexte[b.schluessel] || '';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.dataset.px = '6';
      fig.appendChild(img);
      gal.appendChild(fig);
    });

    // Album
    setzen('album-titel', S.albumTitel);
    setzen('album-text', S.albumText);
    setzen('upload-text', S.albumWaehlen);
    setzen('upload-klein', S.albumArten);

    // Geschenk
    setzen('geschenk-titel', S.geschenkTitel);
    setzen('g-text', S.geschenkText);
    setzen('g-inhaber', C.geschenk.kontoinhaber);
    setzen('g-iban', C.geschenk.iban);
    setzen('btn-iban', S.kopieren);
    setzen('gabe-tipp', S.gabeOeffnen);

    // Rueckmeldung
    setzen('rsvp-titel', S.rsvpTitel);
    setzen('r-hinweis', S.rsvpHinweis(fristText));
    setzen('l-name', S.fName);
    $('f-name').placeholder = S.fNamePlatz;
    setzen('e-name', S.fNameFehler);
    setzen('l-kommt', S.fKommt);
    setzen('l-ja', S.fJa);
    setzen('l-nein', S.fNein);
    setzen('e-zusage', S.fZusageFehler);
    setzen('l-anzahl', S.fAnzahl);
    setzen('l-gruss', S.fGruss);
    $('f-gruss').placeholder = S.fGrussPlatz;
    document.querySelectorAll('.feld-optional').forEach(n => { n.textContent = S.fOptional; });
    setzen('l-einwilligung', S.fEinwilligung);
    setzen('e-dsgvo', S.fDsgvoFehler);
    setzen('btn-senden', S.fSenden);

    // Fuss
    setzen('f-namen', C.namen);
    setzen('f-datum', C.datumKurz);
    setzen('f-recht', S.verantwortlich);
    setzen('f-hoster', S.datenschutz);
    setzen('f-demo', S.demoHinweis);

    // Links
    const adresse = S.ortName + ', ' + C.ort.strasse + ', ' + C.ort.plz + ' ' + C.ort.stadt;
    const ziel = encodeURIComponent(adresse);
    $('btn-google').href = 'https://www.google.com/maps/dir/?api=1&destination=' + ziel;
    $('btn-apple').href  = 'https://maps.apple.com/?daddr=' + ziel + '&dirflg=d';

    // Sprachumschalter: aktive Flagge farbig, die andere zurueckgenommen
    document.querySelectorAll('.flagge').forEach(f => {
      const ist = f.dataset.lang === sprache;
      f.classList.toggle('aktiv', ist);
      f.title = C.sprachen[f.dataset.lang].name;
    });

    // Musikknopf
    musikKnopfBeschriften();

    if (ersterAufbau) ersterAufbau = false;
    else if (typeof reveals === 'function') reveals();
  }

  /* =========================================================
     5. Countdown
     ========================================================= */
  const ziel = new Date(C.beginnISO).getTime();
  const zwei = n => String(n).padStart(2, '0');
  // Rollt nur, wenn sich der Wert geaendert hat - sonst zappelt die
  // Sekundenanzeige und alles andere ruckelt sinnlos mit.
  function ziffer(id, wert, rollen) {
    const n = $(id);
    if (!n || n.textContent === String(wert)) return;
    n.textContent = wert;
    if (rollen === false) return;
    n.classList.remove('rollt');
    void n.offsetWidth;
    n.classList.add('rollt');
  }
  function countdown() {
    const rest = ziel - Date.now();
    if (rest <= 0) {
      $('cd-reihe').hidden = true;
      setzen('cd-fuss', S.countdownHeute);
      return false;
    }
    const s = Math.floor(rest / 1000);
    ziffer('cd-t', Math.floor(s / 86400));
    ziffer('cd-s', zwei(Math.floor(s / 3600) % 24));
    ziffer('cd-m', zwei(Math.floor(s / 60) % 60));
    ziffer('cd-k', zwei(s % 60), false);   // Sekunden ruhig lassen
    return true;
  }

  /* =========================================================
     6. Kalenderdatei - ein Knopf fuer alle Geraete

     Die .ics-Datei ist das einzige Kalenderformat, das iPhone,
     Android und Rechner gleichermassen verstehen. Sie entsteht hier
     im Browser; nichts wird an einen Dienst geschickt.

     Nur der Weg zur Datei unterscheidet sich: Safari auf dem iPhone
     verschluckt Downloads mit download-Attribut und legt sie
     bestenfalls in "Dateien" ab. Ohne das Attribut oeffnet dieselbe
     Datei direkt den Kalender. Auf allen anderen Geraeten ist es
     umgekehrt - dort braucht es den Download.
     ========================================================= */
  /* In UTC schreiben (Z am Ende). Damit steht der Termin fuer jeden Gast
     zur richtigen Ortszeit im Kalender, egal wo er sich befindet. */
  const icsZeit = iso => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');

  function kalenderDatei() {
    const adresse = S.ortName + ', ' + C.ort.strasse + ', ' + C.ort.plz + ' ' + C.ort.stadt;
    const falte = z => String(z).replace(/([,;\\])/g, '\\$1');
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//JP Webstudio//Hochzeitskarte//DE',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:' + C.datumISO + '-' + C.braut.toLowerCase() + '-' + C.braeutigam.toLowerCase() + '@einladung',
      'DTSTAMP:' + icsZeit(new Date().toISOString()),
      'DTSTART:' + icsZeit(C.beginnISO),
      'DTEND:'   + icsZeit(C.endeISO),
      'SUMMARY:' + falte(C.namen + ' \u00b7 ' + S.heroZeile),
      'LOCATION:' + falte(adresse),
      'DESCRIPTION:' + falte(S.kalenderNotiz(location.href.split('#')[0])),
      'URL:' + location.href.split('#')[0],
      // Eine Erinnerung am Vortag - sonst steht der Termin nur da
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY',
      'DESCRIPTION:' + falte(C.namen), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
  }

  $('btn-kalender').addEventListener('click', () => {
    const blob = new Blob([kalenderDatei()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const a = document.createElement('a');
    a.href = url;
    if (!apple) a.download = C.braeutigam + '-' + C.braut + '.ics';
    else a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    const t = $('btn-kalender-text');
    const vorher = t.textContent;
    t.textContent = S.kalenderFertig;
    setTimeout(() => { t.textContent = vorher; }, 2600);
  });

  /* =========================================================
     7. Die Geschenkschachtel und die Bankverbindung darin
     ========================================================= */
  (function geschenkschachtel() {
    const knopf = $('btn-gabe');
    const fach  = $('gabe-fach');
    if (!knopf || !fach) return;
    const huelle = knopf.closest('.gabe');
    knopf.addEventListener('click', () => {
      const auf = huelle.classList.toggle('auf');
      knopf.setAttribute('aria-expanded', auf ? 'true' : 'false');
      if (auf) {
        // Erst wenn der Deckel abgehoben hat, kommt die Karte zum Vorschein
        setTimeout(() => { fach.hidden = false; }, 340);
      } else {
        fach.hidden = true;
      }
    });
  })();

  /* IBAN kopieren */
  const btnIban = $('btn-iban');
  btnIban.addEventListener('click', async () => {
    const rein = C.geschenk.iban.replace(/\s+/g, '');
    try {
      await navigator.clipboard.writeText(rein);
      btnIban.textContent = S.kopiert;
    } catch {
      const t = document.createElement('textarea');
      t.value = rein; document.body.appendChild(t); t.select();
      btnIban.textContent = document.execCommand('copy') ? S.kopiert : S.kopierenHand;
      t.remove();
    }
    setTimeout(() => { btnIban.textContent = S.kopieren; }, 2400);
  });

  /* =========================================================
     8. Album — Auswahl funktioniert, Ablage braucht den Server
     ========================================================= */
  const eingabe = $('upload-input'), liste = $('upload-liste'), uHinweis = $('upload-hinweis');
  const groesse = b => b < 1048576 ? Math.round(b / 1024) + ' KB'
                                   : (b / 1048576).toFixed(1).replace('.', ',') + ' MB';
  eingabe.addEventListener('change', () => {
    const dateien = [...eingabe.files];
    liste.innerHTML = '';
    liste.hidden = dateien.length === 0;
    dateien.forEach(d => {
      const li = document.createElement('li');
      li.appendChild(el('span', null, d.name));
      li.appendChild(el('span', 'upload-groesse', groesse(d.size)));
      liste.appendChild(li);
    });
    if (dateien.length) {
      uHinweis.hidden = false;
      uHinweis.textContent = dateien.length === 1 ? S.albumEine : S.albumMehrere(dateien.length);
    }
  });

  /* =========================================================
     9. Rueckmeldung — Prüfung läuft, Versand braucht den Server
     ========================================================= */
  const form = $('rsvp-form'), rHinweis = $('rsvp-hinweis');
  // Zwei Knoepfe statt Auswahlfeldern: eindeutiger und einfacher zu treffen.
  // Der Wert landet in einem verborgenen Feld, damit das Formular
  // unveraendert funktioniert.
  [$('btn-ja'), $('btn-nein')].forEach(k => {
    k.addEventListener('click', () => {
      const wert = k.dataset.wert;
      $('f-zusage').value = wert;
      [$('btn-ja'), $('btn-nein')].forEach(x => {
        const an = x === k;
        x.classList.toggle('gewaehlt', an);
        x.setAttribute('aria-checked', an ? 'true' : 'false');
      });
      $('feld-anzahl').style.display = wert === 'ja' ? '' : 'none';
      $('e-zusage').hidden = true;
    });
  });
  const fehler = (id, feld, an) => {
    $(id).hidden = !an;
    if (feld) feld.setAttribute('aria-invalid', an ? 'true' : 'false');
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('f-name');
    const zusage = $('f-zusage').value ? { value: $('f-zusage').value } : null;
    const dsgvo = $('f-dsgvo');
    const fehltName = name.value.trim().length < 2;
    fehler('e-name', name, fehltName);
    fehler('e-zusage', null, !zusage);
    fehler('e-dsgvo', null, !dsgvo.checked);
    const erstes = fehltName ? name : (!zusage ? $('btn-ja')
                                               : (!dsgvo.checked ? dsgvo : null));
    if (erstes) { erstes.focus(); return; }
    rHinweis.hidden = false;
    rHinweis.textContent = zusage.value === 'ja' ? S.rsvpJa : S.rsvpNein;
    rHinweis.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (zusage.value === 'ja') bluetenregen();
  });

  /* =========================================================
     10. Musik
     Autoplay mit Ton ist überall gesperrt. Der Umschlag ist der
     erste Fingertipp des Gastes — und damit die einzige Stelle,
     an der Musik überhaupt starten darf.
     ========================================================= */
  const klang = $('musik');
  const musikKnopf = $('btn-musik');
  let musikAn = false;

  function musikKnopfBeschriften() {
    if (!musikKnopf) return;
    musikKnopf.setAttribute('aria-label', musikAn ? S.musikAn : S.musikAus);
    musikKnopf.classList.toggle('laeuft', musikAn);
  }
  // Quelle aus der Konfiguration. Fehlt die Datei, schlaegt play() fehl und
  // der Knopf bleibt verborgen - niemand sieht einen toten Schalter.
  if (klang && C.musik && C.musik.datei) klang.src = mitVersion(C.musik.datei);
  function musikVorhanden() { return klang && klang.getAttribute('src'); }
  window.HOCHZEIT_MUSIK_START = () => {
    if (!musikVorhanden() || !C.musik.starten) return;
    try { if (localStorage.getItem('musik') === 'aus') return; } catch { /* egal */ }
    klang.volume = 0;
    klang.play().then(() => {
      musikAn = true;
      musikKnopf.hidden = false;
      musikKnopfBeschriften();
      // sanft einblenden statt hereinplatzen
      const ziel = C.musik.lautstaerke, schritt = ziel / 40;
      const auf = setInterval(() => {
        klang.volume = Math.min(ziel, klang.volume + schritt);
        if (klang.volume >= ziel - 0.001) clearInterval(auf);
      }, 50);
    }).catch(() => { /* Browser hat abgelehnt - kein Drama */ });
  };
  if (musikKnopf) {
    musikKnopf.addEventListener('click', () => {
      if (!musikVorhanden()) return;
      if (musikAn) { klang.pause(); musikAn = false; }
      else { klang.volume = C.musik.lautstaerke; klang.play().catch(() => {}); musikAn = true; }
      try { localStorage.setItem('musik', musikAn ? 'an' : 'aus'); } catch { /* egal */ }
      musikKnopfBeschriften();
    });
  }

  /* =========================================================
     11. Sprache umschalten
     ========================================================= */
  $('sprachwahl').addEventListener('click', () => {
    sprache = VERFUEGBAR.find(x => x !== sprache) || C.standardsprache;
    try { localStorage.setItem('sprache', sprache); } catch { /* egal */ }
    aufbauen();
    if (window.HOCHZEIT_HERO_TEXTE) window.HOCHZEIT_HERO_TEXTE();
  });

  /* =========================================================
     12. Choreografie: Eintritt in Leserichtung, gestaffelt
     ========================================================= */
  function reveals() {
    const leise = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offen = [...document.querySelectorAll('.rv:not(.da)')];
    if (leise) { offen.forEach(n => n.classList.add('da')); return; }
    const beobachter = new IntersectionObserver((eintraege, o) => {
      eintraege.forEach(e => {
        if (!e.isIntersecting) return;
        const stufe = parseInt(e.target.dataset.rv || '1', 10);
        e.target.style.transitionDelay = Math.min(stufe * 62 + (stufe % 2) * 26, 460) + 'ms';
        e.target.classList.add('da');
        o.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    offen.forEach(n => beobachter.observe(n));
  }

  // Die Knoepfe stehen fest oben. Ueber der dunklen Allee hell, auf der
  // hellen Karte dunkel - sonst verschwinden sie im Untergrund.
  (function knopffarbe() {
    const hero = $('hero');
    if (!hero || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => {
      document.body.classList.toggle('hell-oben', !e.isIntersecting);
    }, { threshold: 0, rootMargin: '-56px 0px 0px 0px' }).observe(hero);
  })();

  // Kleine Belohnung fuer die Zusage - nur dann, eine Absage mit
  // Konfetti zu feiern waere taktlos.
  function bluetenregen() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const feld = document.createElement('div');
    feld.className = 'regen';
    feld.setAttribute('aria-hidden', 'true');
    const toene = ['#f3ddd0', '#e7ecdc', '#f6e7cf', '#dde7ee', '#f0d9cd'];
    let z = 4711;
    const rnd = () => (z = (z * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 34; i++) {
      const b = document.createElement('span');
      const gr = 8 + rnd() * 12;
      b.style.cssText =
        'left:' + (rnd() * 100).toFixed(1) + '%;' +
        'width:' + gr.toFixed(1) + 'px;height:' + (gr * 0.7).toFixed(1) + 'px;' +
        'background:' + toene[i % toene.length] + ';' +
        'animation-duration:' + (2.6 + rnd() * 2.4).toFixed(1) + 's;' +
        'animation-delay:' + (rnd() * 0.9).toFixed(2) + 's;' +
        '--drift:' + (rnd() * 120 - 60).toFixed(0) + 'px;' +
        '--dreh:' + (rnd() * 540 - 270).toFixed(0) + 'deg;';
      feld.appendChild(b);
    }
    document.body.appendChild(feld);
    setTimeout(() => feld.remove(), 6000);
  }

  /* =========================================================
     Bewegung, die an den Bildlauf gekoppelt ist
     Alles laeuft in einem einzigen rAF-Takt: zwei getrennte
     Scroll-Listener sind auf dem Handy sofort spuerbar.
     ========================================================= */
  /* =========================================================
     Galerie in gross, mit Wischen
     ========================================================= */
  (function lupe() {
    const kasten = $('lupe'), bild = $('lupe-bild'), text = $('lupe-text');
    if (!kasten) return;
    let stelle = 0;
    const LEER = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

    function zeige(i) {
      const bilder = C.galerie.slice(0, 4);
      stelle = (i + bilder.length) % bilder.length;
      const b = bilder[stelle];
      bild.src = mitVersion(b.datei);
      bild.alt = S.bildtexte[b.schluessel] || '';
      text.textContent = bild.alt;
    }
    function auf(i) {
      zeige(i);
      kasten.classList.add('auf');
      requestAnimationFrame(() => kasten.classList.add('sichtbar'));
      document.body.style.overflow = 'hidden';
      $('lupe-zu').focus();
    }
    function zu() {
      kasten.classList.remove('sichtbar');
      setTimeout(() => { kasten.classList.remove('auf'); bild.src = LEER; }, 320);
      document.body.style.overflow = '';
    }
    document.addEventListener('click', e => {
      const fig = e.target.closest('.gal-bild');
      if (!fig) return;
      auf([...document.querySelectorAll('.gal-bild')].indexOf(fig));
    });
    $('lupe-zu').addEventListener('click', zu);
    $('lupe-vor').addEventListener('click', () => zeige(stelle + 1));
    $('lupe-zurueck').addEventListener('click', () => zeige(stelle - 1));
    kasten.addEventListener('click', e => { if (e.target === kasten) zu(); });
    addEventListener('keydown', e => {
      if (!kasten.classList.contains('auf')) return;
      if (e.key === 'Escape') zu();
      if (e.key === 'ArrowRight') zeige(stelle + 1);
      if (e.key === 'ArrowLeft') zeige(stelle - 1);
    });
    // Wischen
    let startX = 0, startY = 0;
    kasten.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    kasten.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) zeige(stelle + (dx < 0 ? 1 : -1));
      else if (dy > 90) zu();
    }, { passive: true });
  })();

  /* ---------- Start ---------- */
  aufbauen();

  // hero.js laeuft vorher und kannte die Sprachwahl noch nicht
  if (window.HOCHZEIT_HERO_TEXTE) window.HOCHZEIT_HERO_TEXTE();
  if (countdown()) setInterval(countdown, 1000);
  reveals();

  (function scrollEffekte() {
    const leise = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leiste = $('zeitleiste');
    // Die Leiste wird bei jedem Sprachwechsel neu aufgebaut, die alten
    // Verweise zeigen dann ins Leere. Deshalb bei Bedarf nachfassen.
    let stationen = [];
    const stationenHolen = () => {
      if (!leiste) return stationen;
      if (!stationen.length || !stationen[0].isConnected) {
        stationen = [...leiste.querySelectorAll('.zl-punkt')];
      }
      return stationen;
    };

    /* ---- Parallaxe ----
       Jedes Bild traegt data-px mit seiner Staerke in Prozent. Genau um
       diesen Wert ist es oben und unten groesser als sein Rahmen, also
       kann selbst am Anschlag kein Rand auftauchen. Gerechnet wird in
       Pixeln, weil translateY in Prozent sich auf die Bildhoehe bezoege
       und nicht auf den Rahmen. */
    // Auf schmalen Schirmen kuerzere Wege: die Bilder sind dort knapper
    // aufgeloest, und jeder Prozentpunkt Ueberstand kostet Schaerfe.
    const faktor = () => (innerWidth < 700 ? 0.62 : 1);

    const bilder = leise ? [] : [...document.querySelectorAll('[data-px]')].map(el => ({
      el,
      rahmen: el.parentElement,
      roh: parseFloat(el.dataset.px) || 6,
      staerke: 0,
      letzter: null,
    }));

    // Ueberstand und Weg aus derselben Zahl - sonst faehrt das Bild weiter
    // als seine Reserve reicht und am Rand klafft eine Luecke.
    function masseSetzen() {
      const f = faktor();
      bilder.forEach(b => {
        b.staerke = b.roh * f;
        b.el.style.setProperty('--px-weg', b.staerke.toFixed(2) + '%');
        b.letzter = null;
      });
    }
    masseSetzen();

    let offen = false;
    function takt() {
      offen = false;
      const H = innerHeight;

      bilder.forEach(b => {
        const r = b.rahmen.getBoundingClientRect();
        if (r.height < 1 || r.bottom < -140 || r.top > H + 140) return;
        // 0 = Rahmen betritt das Fenster von unten, 1 = verlaesst es oben
        const lauf = Math.max(0, Math.min(1, (H - r.top) / (H + r.height)));
        const weg = r.height * b.staerke / 100;      // Reserve in Pixeln
        const y = (lauf - 0.5) * 2 * weg;
        const gerundet = Math.round(y * 100) / 100;
        if (gerundet === b.letzter) return;          // nichts Neues, nichts setzen
        b.letzter = gerundet;
        b.el.style.transform = 'translate3d(0,' + gerundet + 'px,0)';
      });

      // Die Linie der Zeitleiste waechst mit dem Lesen - und jede
      // Station geht an, sobald die Linie sie erreicht hat.
      if (leiste) {
        const r = leiste.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (H * 0.72 - r.top) / Math.max(1, r.height)));
        leiste.style.setProperty('--zl-fortschritt', p.toFixed(3));
        const spitze = r.top + r.height * p;
        const st = stationenHolen();
        for (let i = 0; i < st.length; i++) {
          const k = st[i].getBoundingClientRect();
          st[i].classList.toggle('erreicht', spitze >= k.top + k.height * 0.34);
        }
      }
    }

    addEventListener('scroll', () => {
      if (offen) return;
      offen = true;
      requestAnimationFrame(takt);
    }, { passive: true });
    addEventListener('resize', () => { masseSetzen(); takt(); }, { passive: true });
    takt();
    // Nach dem Laden der Bilder noch einmal, dann stimmen die Hoehen
    addEventListener('load', takt);
  })();

  /* =========================================================
     11. Die Besetzung: jeder Abschnitt bekommt sein eigenes Kleinteil

     Nichts davon ist beliebig gestreut. Der Brief bekommt Federn, weil
     er geschrieben wurde. Der Dresscode bekommt Konfetti in genau den
     Farben, um die er bittet. Die Zusage bekommt Ballons. So traegt
     jeder Abschnitt sein eigenes Motiv, statt acht Mal dasselbe.
     ========================================================= */
  (function besetzung() {
    const S = id => document.getElementById(id);
    // Auf dem hellen Leinengrund verschwindet zartes Pastell. Die Toene
    // sind deshalb deutlich gesetzt und die Deckkraft regelt die Ruhe.
    const G = { salbei:'#a7bd9b', salbeiTief:'#7e9673', rose:'#e5b49c', roseTief:'#c98a6c',
                sand:'#d9bd8a', gold:'#a85a34', creme:'#ecd9b8', himmel:'#9dbdd0',
                weiss:'#ffffff' };

    // Der Brief: hier hat jemand mit der Feder geschrieben
    zierSetzen(S('sek-anrede'), 'feder', 5);

    // Der Tagesablauf liegt im Gruenen
    zierSetzen(S('sek-ablauf'), 'bluete', 16,
      { toene:[G.salbei, G.salbeiTief, G.creme], dauer:[22, 40], klein:8, gross:17 });

    // Vor der Trauung: Blueten, die vom Bogen herunterwehen
    zierSetzen(S('sek-ort'), 'bluete', 12,
      { toene:[G.weiss, G.creme, G.rose], dauer:[26, 46], klein:7, gross:15 });

    // Der Dresscode wirft genau die Farben, um die er bittet - nicht
    // irgendein Pastell, sondern die Hexwerte aus der Konfiguration.
    zierSetzen(S('sek-dresscode'), 'konfetti', 26,
      { toene: (C.farben || []).map(f => f.hex), dauer:[13, 24] });

    // Die Familien stehen im warmen Licht
    zierSetzen(S('sek-familien'), 'bluete', 14,
      { toene:[G.rose, G.roseTief, G.creme], dauer:[24, 42], klein:8, gross:16 });

    // Kerzen ueber der Tafel
    zierSetzen(S('sek-wissen'), 'funke', 22, { toene:[G.gold, G.sand] });
    zierSetzen(S('sek-galerie'), 'funke', 26, { toene:[G.gold, G.creme] });

    // Das Album sammelt Augenblicke ein
    zierSetzen(S('sek-erinnerung'), 'funke', 18, { toene:[G.himmel, G.weiss] });

    // Der Umschlag liegt in goldenem Schnipselregen
    zierSetzen(S('sek-geschenk'), 'konfetti', 20,
      { toene:[G.gold, G.sand, G.creme], dauer:[17, 30] });

    // Und wer zusagt, steht schon mitten in der Feier
    zierSetzen(S('sek-rsvp'), 'ballon', 9,
      { toene:[G.rose, G.sand, G.salbei, G.himmel] });
  })();

})();
