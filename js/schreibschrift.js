/* Schreibschrift-Setzer
   Glyphen: Hershey 'Script 1-stroke' (A. V. Hershey, 1967, gemeinfrei),
   Datenport aus techninja/hersheytextjs.
   Bewusst diese Schnittfassung: sie zieht jeden Buchstaben in einem
   einzigen Zug. Die kalligrafischere 'Script medium' braucht fuer
   denselben Namen 49 statt 20 Zuege - die Feder muesste also 48-mal
   absetzen, und keine Hand schreibt so.
   Koordinaten: Grundlinie y=22, Versalhoehe y=1, Unterlaenge y=34. */
window.SCHREIBSCHRIFT = (() => {
  'use strict';
  const G = {
    A: [9, 'M0,22 L2,21 5,18 8,14 12,7 15,1 15,22 14,19 12,16 10,14 7,12 5,12 4,13 4,15 5,17 7,19 10,21 13,22 18,22'],
    B: [11, 'M13,3 L14,4 14,7 13,11 12,14 11,16 9,19 7,21 5,22 4,22 3,21 3,18 4,13 5,10 6,8 8,5 10,3 12,2 15,1 18,1 20,2 21,4 21,6 20,8 19,9 17,10 14,11 M13,11 L14,11 17,12 18,13 19,15 19,18 18,20 17,21 15,22 12,22 10,21 9,19'],
    C: [10, 'M12,7 L12,8 13,9 15,9 17,8 18,6 18,4 17,2 15,1 12,1 9,2 7,4 5,7 4,9 3,13 3,17 4,20 5,21 7,22 9,22 12,21 14,19 15,17'],
    D: [12, 'M13,1 L11,2 10,4 9,8 8,14 7,17 6,19 4,21 2,22 0,22 -1,21 -1,19 0,18 2,18 4,19 6,21 9,22 12,22 15,21 17,19 19,15 20,10 20,6 19,3 18,2 16,1 13,1 11,3 11,5 12,8 14,11 16,13 19,15 21,16'],
    E: [10, 'M14,5 L14,6 15,7 17,7 18,6 18,4 17,2 14,1 10,1 7,2 6,4 6,7 7,9 8,10 11,11 8,11 5,12 4,13 3,15 3,18 4,20 5,21 8,22 11,22 14,21 16,19 17,17'],
    F: [10, 'M10,7 L8,7 6,6 5,4 6,2 9,1 12,1 16,2 19,2 21,1 M16,2 L14,9 12,15 10,19 8,21 6,22 4,22 2,21 1,19 1,17 2,16 4,16 6,17 M9,11 L18,11'],
    G: [12, 'M0,22 L2,21 6,17 9,12 10,9 11,5 11,2 10,1 9,1 8,2 7,4 7,7 8,9 10,10 14,10 17,9 18,8 19,6 19,12 18,17 17,19 15,21 12,22 8,22 5,21 3,19 2,17 2,15'],
    H: [12, 'M7,8 L5,7 4,5 4,4 5,2 7,1 8,1 10,2 11,4 11,6 10,10 8,16 6,20 4,22 2,22 1,21 1,19 M7,13 L16,10 18,9 21,7 23,5 24,3 24,2 23,1 22,1 20,3 18,7 16,13 15,18 15,21 16,22 17,22 19,21 20,20 22,17'],
    I: [8, 'M14,17 L12,15 10,12 9,10 8,7 8,4 9,2 10,1 12,1 13,2 14,4 14,7 13,12 11,17 10,19 8,21 6,22 4,22 2,21 1,19 1,17 2,16 4,16 6,17'],
    J: [7, 'M10,25 L8,22 6,17 5,11 5,5 6,2 8,1 10,1 11,2 12,5 12,8 11,13 8,22 6,28 5,31 4,33 2,34 1,33 1,31 2,28 4,25 6,23 9,21 13,19'],
    K: [12, 'M7,8 L5,7 4,5 4,4 5,2 7,1 8,1 10,2 11,4 11,6 10,10 8,16 6,20 4,22 2,22 1,21 1,19 M24,4 L24,2 23,1 22,1 20,2 18,4 16,7 14,9 12,10 10,10 M12,10 L13,12 13,19 14,21 15,22 16,22 18,21 19,20 21,17'],
    L: [10, 'M4,13 L6,13 10,12 13,10 15,8 16,6 16,3 15,1 13,1 12,2 11,4 10,9 9,14 8,17 7,19 5,21 3,22 1,22 0,21 0,19 1,18 3,18 5,19 8,21 11,22 13,22 16,21 18,19'],
    M: [15, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,6 8,11 7,15 5,22 M7,15 L10,7 12,3 13,2 15,1 16,1 18,2 19,4 19,6 18,11 17,15 15,22 M17,15 L20,7 22,3 23,2 25,1 26,1 28,2 29,4 29,6 28,11 26,18 26,21 27,22 28,22 30,21 31,20 33,17'],
    N: [11, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,6 8,11 7,15 5,22 M7,15 L10,7 12,3 13,2 15,1 17,1 19,2 20,4 20,6 19,11 17,18 17,21 18,22 19,22 21,21 22,20 24,17'],
    O: [11, 'M12,1 L9,2 7,4 5,7 4,9 3,13 3,17 4,20 5,21 7,22 9,22 12,21 14,19 16,16 17,14 18,10 18,6 17,3 16,2 14,1 12,1 10,3 10,6 11,9 13,12 15,14 18,16 20,17'],
    P: [13, 'M13,3 L14,4 14,7 13,11 12,14 11,16 9,19 7,21 5,22 4,22 3,21 3,18 4,13 5,10 6,8 8,5 10,3 12,2 15,1 20,1 22,2 23,3 24,5 24,8 23,10 22,11 20,12 17,12 15,11 14,10'],
    Q: [12, 'M13,7 L12,9 11,10 9,11 7,11 6,9 6,7 7,4 9,2 12,1 15,1 17,2 18,4 18,8 17,11 15,14 11,18 8,20 6,21 3,22 1,22 0,21 0,19 1,18 3,18 5,19 8,21 11,22 14,22 17,21 19,19'],
    R: [13, 'M13,3 L14,4 14,7 13,11 12,14 11,16 9,19 7,21 5,22 4,22 3,21 3,18 4,13 5,10 6,8 8,5 10,3 12,2 15,1 19,1 21,2 22,3 23,5 23,8 22,10 21,11 19,12 16,12 13,11 14,12 15,14 15,19 16,21 18,22 20,21 21,20 23,17'],
    S: [10, 'M0,22 L2,21 4,19 7,15 9,12 11,8 12,5 12,2 11,1 10,1 9,2 8,4 8,6 9,8 11,10 14,12 16,14 17,16 17,18 16,20 15,21 12,22 8,22 5,21 3,19 2,17 2,15'],
    T: [9, 'M10,7 L8,7 6,6 5,4 6,2 9,1 12,1 16,2 19,2 21,1 M16,2 L14,9 12,15 10,19 8,21 6,22 4,22 2,21 1,19 1,17 2,16 4,16 6,17'],
    U: [11, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,6 8,10 7,13 6,17 6,19 7,21 9,22 11,22 13,21 14,20 16,16 19,8 21,1 M19,8 L18,12 17,18 17,21 18,22 19,22 21,21 22,20 24,17'],
    V: [11, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,6 8,10 7,13 6,17 6,20 7,22 9,22 11,21 14,18 16,15 18,11 19,8 20,4 20,2 19,1 18,1 17,2 16,4 16,6 17,9 19,11 21,12'],
    W: [13, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,7 8,22 M18,1 L8,22 M18,1 L16,22 M30,1 L28,2 25,5 22,9 19,15 16,22'],
    X: [12, 'M8,7 L6,7 5,6 5,4 6,2 8,1 10,1 12,2 13,4 13,7 11,16 11,19 12,21 14,22 16,22 18,21 19,19 19,17 18,16 16,16 M23,4 L23,2 22,1 20,1 18,2 16,4 14,7 10,16 8,19 6,21 4,22 2,22 1,21 1,19'],
    Y: [11, 'M5,8 L3,7 2,5 2,4 3,2 5,1 6,1 8,2 9,4 9,6 8,10 7,13 6,17 6,19 7,21 8,22 10,22 12,21 14,19 16,16 17,14 19,8 M21,1 L19,8 16,18 14,24 12,29 10,33 8,34 7,33 7,31 8,28 10,25 13,22 16,20 21,17'],
    Z: [11, 'M13,7 L12,9 11,10 9,11 7,11 6,9 6,7 7,4 9,2 12,1 15,1 17,2 18,4 18,8 17,11 15,15 12,18 8,21 6,22 3,22 2,21 2,19 3,18 6,18 8,19 9,20 10,22 10,25 9,28 8,30 6,33 4,34 3,33 3,31 4,28 6,25 9,22 12,20 18,17'],
    a: [10, 'M9,16 L8,14 6,13 4,13 2,14 1,15 0,17 0,19 1,21 3,22 5,22 7,21 8,19 10,13 9,18 9,21 10,22 11,22 13,21 14,20 16,17'],
    b: [9, 'M0,17 L2,14 5,9 6,7 7,4 7,2 6,1 4,2 3,4 2,8 1,15 1,21 2,22 3,22 5,21 7,19 8,16 8,13 9,17 10,18 12,18 14,17'],
    c: [6, 'M7,15 L7,14 6,13 4,13 2,14 1,15 0,17 0,19 1,21 3,22 6,22 9,20 11,17'],
    d: [10, 'M9,16 L8,14 6,13 4,13 2,14 1,15 0,17 0,19 1,21 3,22 5,22 7,21 8,19 14,1 M10,13 L9,18 9,21 10,22 11,22 13,21 14,20 16,17'],
    e: [6, 'M1,20 L3,19 4,18 5,16 5,14 4,13 3,13 1,14 0,16 0,19 1,21 3,22 5,22 7,21 8,20 10,17'],
    f: [5, 'M0,17 L4,12 6,9 7,7 8,4 8,2 7,1 5,2 4,4 2,12 -1,21 -4,28 -5,31 -5,33 -4,34 -2,33 -1,30 0,21 1,22 3,22 5,21 6,20 8,17'],
    g: [9, 'M9,16 L8,14 6,13 4,13 2,14 1,15 0,17 0,19 1,21 3,22 5,22 7,21 8,20 M10,13 L8,20 4,31 3,33 1,34 0,33 0,31 1,28 4,25 7,23 9,22 12,20 15,17'],
    h: [10, 'M0,17 L2,14 5,9 6,7 7,4 7,2 6,1 4,2 3,4 2,8 1,14 0,22 M0,22 L1,19 2,17 4,14 6,13 8,13 9,14 9,16 8,19 8,21 9,22 10,22 12,21 13,20 15,17'],
    i: [5, 'M3,8 L3,9 4,9 4,8 3,8 M0,17 L2,13 0,19 0,21 1,22 2,22 4,21 5,20 7,17'],
    j: [5, 'M3,8 L3,9 4,9 4,8 3,8 M0,17 L2,13 -4,31 -5,33 -7,34 -8,33 -8,31 -7,28 -4,25 -1,23 1,22 4,20 7,17'],
    k: [9, 'M0,17 L2,14 5,9 6,7 7,4 7,2 6,1 4,2 3,4 2,8 1,14 0,22 M0,22 L1,19 2,17 4,14 6,13 8,13 9,14 9,16 7,17 4,17 M4,17 L6,18 7,21 8,22 9,22 11,21 12,20 14,17'],
    l: [5, 'M0,17 L2,14 5,9 6,7 7,4 7,2 6,1 4,2 3,4 2,8 1,15 1,21 2,22 3,22 5,21 6,20 8,17'],
    m: [12, 'M0,17 L2,14 4,13 5,14 5,15 4,19 3,22 M4,19 L5,17 7,14 9,13 11,13 12,14 12,15 11,19 10,22 M11,19 L12,17 14,14 16,13 18,13 19,14 19,16 18,19 18,21 19,22 20,22 22,21 23,20 25,17'],
    n: [10, 'M0,17 L2,14 4,13 5,14 5,15 4,19 3,22 M4,19 L5,17 7,14 9,13 11,13 12,14 12,16 11,19 11,21 12,22 13,22 15,21 16,20 18,17'],
    o: [8, 'M6,13 L4,13 2,14 1,15 0,17 0,19 1,21 3,22 5,22 7,21 8,20 9,18 9,16 8,14 6,13 5,14 5,16 6,18 8,19 11,19 13,18 14,17'],
    p: [8, 'M0,17 L2,14 3,12 2,16 -4,34 M2,16 L3,14 5,13 7,13 9,14 10,16 10,18 9,20 8,21 6,22 M2,21 L4,22 7,22 10,21 12,20 15,17'],
    q: [9, 'M9,16 L8,14 6,13 4,13 2,14 1,15 0,17 0,19 1,21 3,22 5,22 7,21 M10,13 L9,16 7,21 4,28 3,31 3,33 4,34 6,33 7,30 7,23 9,22 12,20 15,17'],
    r: [8, 'M0,17 L2,14 3,12 3,14 6,14 7,15 7,17 6,20 6,21 7,22 8,22 10,21 11,20 13,17'],
    s: [7, 'M0,17 L2,14 3,12 3,14 5,17 6,19 6,21 4,22 M0,21 L2,22 6,22 8,21 9,20 11,17'],
    t: [6, 'M0,17 L2,14 4,10 M7,1 L1,19 1,21 2,22 4,22 6,21 7,20 9,17 M1,9 L8,9'],
    u: [9, 'M0,17 L2,13 0,19 0,21 1,22 3,22 5,21 7,19 9,16 M10,13 L8,19 8,21 9,22 10,22 12,21 13,20 15,17'],
    v: [9, 'M0,17 L2,13 1,18 1,21 2,22 3,22 6,21 8,19 9,16 9,13 M9,13 L10,17 11,18 13,18 15,17'],
    w: [12, 'M3,13 L1,15 0,18 0,20 1,22 3,22 5,21 7,19 M9,13 L7,19 7,21 8,22 10,22 12,21 14,19 15,16 15,13 M15,13 L16,17 17,18 19,18 21,17'],
    x: [8, 'M0,17 L2,14 4,13 6,13 7,14 7,21 8,22 11,22 14,20 16,17 M13,14 L12,13 10,13 9,14 5,21 4,22 2,22 1,21'],
    y: [9, 'M0,17 L2,13 0,19 0,21 1,22 3,22 5,21 7,19 9,16 M10,13 L4,31 3,33 1,34 0,33 0,31 1,28 4,25 7,23 9,22 12,20 15,17'],
    z: [8, 'M0,17 L2,14 4,13 6,13 8,15 8,17 7,19 5,21 2,22 4,23 5,25 5,28 4,31 3,33 1,34 0,33 0,31 1,28 4,25 7,23 11,20 14,17'],
    0: [10, 'M9,1 L6,2 4,5 3,10 3,13 4,18 6,21 9,22 11,22 14,21 16,18 17,13 17,10 16,5 14,2 11,1 9,1'],
    1: [10, 'M6,5 L8,4 11,1 11,22'],
    2: [10, 'M4,6 L4,5 5,3 6,2 8,1 12,1 14,2 15,3 16,5 16,7 15,9 13,12 3,22 17,22'],
    3: [10, 'M5,1 L16,1 10,9 13,9 15,10 16,11 17,14 17,16 16,19 14,21 11,22 8,22 5,21 4,20 3,18'],
    4: [10, 'M13,1 L3,15 18,15 M13,1 L13,22'],
    5: [10, 'M15,1 L5,1 4,10 5,9 8,8 11,8 14,9 16,11 17,14 17,16 16,19 14,21 11,22 8,22 5,21 4,20 3,18'],
    6: [10, 'M16,4 L15,2 12,1 10,1 7,2 5,5 4,10 4,15 5,19 7,21 10,22 11,22 14,21 16,19 17,16 17,15 16,12 14,10 11,9 10,9 7,10 5,12 4,15'],
    7: [10, 'M17,1 L7,22 M3,1 L17,1'],
    8: [10, 'M8,1 L5,2 4,4 4,6 5,8 7,9 11,10 14,11 16,13 17,15 17,18 16,20 15,21 12,22 8,22 5,21 4,20 3,18 3,15 4,13 6,11 9,10 13,9 15,8 16,6 16,4 15,2 12,1 8,1'],
    9: [10, 'M16,8 L15,11 13,13 10,14 9,14 6,13 4,11 3,8 3,7 4,4 6,2 9,1 10,1 13,2 15,4 16,8 16,13 15,18 13,21 10,22 8,22 5,21 4,19'],
    '&': [13, 'M23,10 L23,9 22,8 21,8 20,9 19,11 17,16 15,19 13,21 11,22 7,22 5,21 4,20 3,18 3,16 4,14 5,13 12,9 13,8 14,6 14,4 13,2 11,1 9,2 8,4 8,6 9,9 11,12 16,19 18,21 20,22 22,22 23,21 23,20'],
    '.': [4, 'M4,17 L3,18 4,19 5,18 4,17'],
    ',': [4, 'M5,18 L4,19 3,18 4,17 5,18 5,20 3,22'],
    "'": [2, 'M2,8 L2,12'],
    '-': [13, 'M4,13 L22,13'],
    '!': [5, 'M5,1 L5,15 M5,20 L4,21 5,22 6,21 5,20'],
    '?': [9, 'M3,6 L3,5 4,3 5,2 7,1 11,1 13,2 14,3 15,5 15,7 14,9 13,10 9,12 9,15 M9,20 L8,21 9,22 10,21 9,20'],
  };
  /* Sonderzeichen: Grundbuchstabe plus Beizeichen.
     Hershey kennt nur ASCII, also setzen wir Trema, Cedille und Bogen
     selbst - in denselben Einheiten (Grundlinie 22, x-Hoehe 13). */
  const BEI = {
    trema:   'M-2.6,7.4 L-2.4,9.0 M2.4,7.4 L2.6,9.0',
    punkt:   'M-0.3,7.4 L0.3,9.0',
    cedille: 'M0,22 C0.4,25.4 1.8,26.2 1.0,27.8 C0.4,29.0 -1.4,29.0 -2.4,28.2',
    bogen:   'M-3.2,6.0 C-2.6,8.9 2.6,8.9 3.2,6.0',
  };
  // Wieviel hoeher sitzt das Beizeichen ueber einem Versal?
  const VERSAL_HOCH = -11;

  const ABLEITUNG = {
    'ä':['a','trema'],   'ö':['o','trema'],   'ü':['u','trema'],
    'Ä':['A','trema'],   'Ö':['O','trema'],   'Ü':['U','trema'],
    'ç':['c','cedille'], 'Ç':['C','cedille'],
    'ş':['s','cedille'], 'Ş':['S','cedille'],
    'ğ':['g','bogen'],   'Ğ':['G','bogen'],
    'İ':['I','punkt'],
    'ı':['i',null],      // punktloses i - das Tuepfelchen faellt weg
    'é':['e','punkt'],   'â':['a','bogen'],   'î':['i',null],
  };
  const ERSATZ = { 'ß':'ss', 'æ':'ae', 'œ':'oe' };

  /* --- Pfaddaten in Punktlisten zerlegen ------------------------------ */
  function zerlegen(d) {
    const stuecke = [];
    d.split('M').forEach(s => {
      s = s.trim();
      if (!s) return;
      const zahlen = s.match(/-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g) || [];
      const p = [];
      zahlen.forEach(paar => {
        const [x, y] = paar.split(',').map(Number);
        const l = p[p.length - 1];
        if (!l || Math.abs(l[0] - x) > 1e-9 || Math.abs(l[1] - y) > 1e-9) p.push([x, y]);
      });
      if (p.length > 1) stuecke.push(p);
    });
    return stuecke;
  }

  /* --- Punktzug zu einer fliessenden Kurve glaetten -------------------
     Catmull-Rom in kubische Bezier. Ohne das sieht die Schrift aus wie
     von einem Plotter gezogen - mit Ecken an jedem Stuetzpunkt. */
  function glaetten(p, s) {
    s = s === undefined ? 0.5 : s;
    let d = 'M' + p[0][0].toFixed(2) + ',' + p[0][1].toFixed(2);
    if (p.length === 2) return d + ' L' + p[1][0].toFixed(2) + ',' + p[1][1].toFixed(2);
    const q = [p[0]].concat(p, [p[p.length - 1]]);
    for (let i = 1; i < q.length - 2; i++) {
      const p0 = q[i - 1], p1 = q[i], p2 = q[i + 1], p3 = q[i + 2];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) * s / 3).toFixed(2) + ',' + (p1[1] + (p2[1] - p0[1]) * s / 3).toFixed(2)
         + ' ' + (p2[0] - (p3[0] - p1[0]) * s / 3).toFixed(2) + ',' + (p2[1] - (p3[1] - p1[1]) * s / 3).toFixed(2)
         + ' ' + p2[0].toFixed(2) + ',' + p2[1].toFixed(2);
    }
    return d;
  }

  /* --- Die Striche in eine Schreibreihenfolge bringen ---------------
     Die Rohdaten stehen in der Reihenfolge, in der sie 1967 erfasst
     wurden - nicht in der, in der eine Hand sie zoege. Nimmt man sie so,
     springt die Feder innerhalb eines Buchstabens kreuz und quer: erst
     der Aussenbogen, dann zurueck zum Anfang, dann der Innenbogen.
     Genau daran scheitert jeder Versuch, das wie Schreiben aussehen zu
     lassen. Also: unten links ansetzen und von da immer zum naechst-
     gelegenen Ansatz weitergehen. */
  function schreibfolge(stuecke) {
    if (stuecke.length < 2) return stuecke;
    const rest = stuecke.slice(), folge = [];
    const kopf = p => p[0], fuss = p => p[p.length - 1];

    // Ansetzen, wo eine Hand ansetzt: links, und tiefer schlaegt hoeher
    let i = 0, best = Infinity;
    rest.forEach((p, k) => {
      const wert = kopf(p)[0] - kopf(p)[1] * 0.42;
      if (wert < best) { best = wert; i = k; }
    });
    let akt = rest.splice(i, 1)[0];
    folge.push(akt);

    while (rest.length) {
      const hier = fuss(akt);
      let bi = 0, bd = Infinity, umgekehrt = false;
      rest.forEach((p, k) => {
        const dv = Math.hypot(kopf(p)[0] - hier[0], kopf(p)[1] - hier[1]);
        if (dv < bd) { bd = dv; bi = k; umgekehrt = false; }
        // Rueckwaerts nur, wenn es den Weg deutlich abkuerzt - sonst
        // wuerden Abstriche von unten nach oben gezogen.
        const dr = Math.hypot(fuss(p)[0] - hier[0], fuss(p)[1] - hier[1]);
        if (dr * 2.2 < bd) { bd = dr; bi = k; umgekehrt = true; }
      });
      akt = rest.splice(bi, 1)[0];
      if (umgekehrt) akt = akt.slice().reverse();
      folge.push(akt);
    }
    return folge;
  }

  /* Das Tuepfelchen auf dem i steht in den Rohdaten vorn. Geschrieben
     wird es aber zuletzt - also wandert es ans Ende des Buchstabens. */
  function istTuepfelchen(p) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    p.forEach(pt => {
      if (pt[0] < x0) x0 = pt[0];  if (pt[0] > x1) x1 = pt[0];
      if (pt[1] < y0) y0 = pt[1];  if (pt[1] > y1) y1 = pt[1];
    });
    return y1 < 12 && (x1 - x0) < 5 && (y1 - y0) < 5;
  }

  function verschieben(d, dx, dy) {
    return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g,
      (_, a, b) => (Number(a) + dx).toFixed(2) + ',' + (Number(b) + dy).toFixed(2));
  }

  /* --- Einen Buchstaben holen ---------------------------------------- */
  function glyph(c) {
    if (G[c]) return { o: G[c][0], stuecke: zerlegen(G[c][1]), bei: null };
    const ab = ABLEITUNG[c];
    if (ab) {
      const g = G[ab[0]];
      if (!g) return null;
      let st = zerlegen(g[1]);
      if (c === 'ı' || c === 'î') st = st.filter(p => !istTuepfelchen(p));
      const versal = ab[0] === ab[0].toUpperCase() && ab[0] !== ab[0].toLowerCase();
      return {
        o: g[0],
        stuecke: st,
        bei: ab[1] ? verschieben(BEI[ab[1]],
              g[0], ab[1] === 'cedille' ? 0 : (versal ? VERSAL_HOCH : 0)) : null,
      };
    }
    return null;
  }

  /* --- Eine Zeile setzen ---------------------------------------------
     Ergebnis: die Teilstriche in genau der Reihenfolge, in der eine
     Hand sie schreiben wuerde. Genau dieser Reihenfolge folgt spaeter
     die Feder. */
  function setzen(text, opt) {
    opt = opt || {};
    const sperrung = opt.sperrung === undefined ? 0 : opt.sperrung;
    const wortluecke = opt.wortluecke === undefined ? 15 : opt.wortluecke;
    let x = 0;
    const striche = [];
    const zeichen = String(text).split('');

    for (let i = 0; i < zeichen.length; i++) {
      let c = zeichen[i];
      if (c === ' ' || c === ' ') { x += wortluecke + sperrung; continue; }
      if (ERSATZ[c]) { zeichen.splice(i, 1, ...ERSATZ[c].split('')); c = zeichen[i]; }
      const g = glyph(c);
      if (!g) continue;

      const haupt = [], nach = [];
      g.stuecke.forEach(p => (istTuepfelchen(p) ? nach : haupt).push(p));
      schreibfolge(haupt).forEach(p =>
        striche.push(glaetten(p.map(pt => [pt[0] + x, pt[1]]))));
      if (g.bei) striche.push(verschieben(g.bei, x, 0));
      nach.forEach(p => striche.push(glaetten(p.map(pt => [pt[0] + x, pt[1]]))));  // Tuepfelchen zuletzt

      x += g.o * 2 + sperrung;
    }
    return { striche: striche, d: striche.join(' '), breite: x, grundlinie: 22 };
  }

  return { setzen: setzen, grundlinie: 22, versalhoehe: 21 };
})();
