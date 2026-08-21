/* =========================================================
   DIGITALE HOCHZEITSKARTE — INHALTE
   Pro Paar wird ausschliesslich diese Datei angefasst.
   Demo-Datensatz: Furkan & Dilara, 01.01.2027 (frei erfunden)

   Aufbau: Zuerst die sprachneutralen Angaben (Namen, Termine,
   Adresse, Bankverbindung), danach unter `sprachen` alles,
   was uebersetzt werden muss.
   ========================================================= */
window.HOCHZEIT = {

  // Wird von bin/veroeffentlichen.sh gesetzt und an alle Bilder gehaengt,
  // damit Browser nach einer Aenderung nicht die alte Fassung zeigen.
  version: '20260821104040',

  /* ---------- Sprachen ---------- */
  standardsprache: 'de',
  sprachfolge: ['de', 'tr'],

  /* ---------- Das Paar ---------- */
  braut:        'Dilara',
  braeutigam:   'Furkan',
  namen:        'Furkan & Dilara',
  datumKurz:    '01.01.2027',
  datumISO:     '2027-01-01',
  beginnISO:    '2027-01-01T14:30:00',
  endeISO:      '2027-01-02T02:00:00',

  /* ---------- Hero-Animation ---------- */
  hero: {
    schriftzug:   '',              // leer => nutzt `namen`
    ausrichtung:  'strasse',       // 'strasse' = Spur des Wagens laengs der Fahrbahn
    trenner:      'herz',          // 'herz' | 'zeichen'
    herzZeigen:   true,
    tempo:        1.0,
    ueberspringbar: true,
  },

  /* ---------- Musik ---------- */
  musik: {
    datei:  'assets/audio/musik.mp3',
    titel:  'Instrumental, eigens erzeugt',
    starten: true,                 // beginnt beim Antippen des Umschlags
    lautstaerke: 0.42,
  },

  /* ---------- Ort (sprachneutral) ---------- */
  ort: {
    strasse: 'Benrather Schloßallee 104',
    plz:     '40597',
    stadt:   'Düsseldorf',
    lat: 51.163, lon: 6.871,
  },

  /* ---------- Familien (Namen sind sprachneutral) ---------- */
  familien: [
    { schluessel: 'brautseite',      namen: ['Nilüfer und Hamdi Sarıca'] },
    { schluessel: 'braeutigamseite', namen: ['Oya und Etem Zarga'] },
    { schluessel: 'trauzeugen',      namen: ['Elif Sarıca', 'Mehmet Zarga'] },
  ],

  /* ---------- Geschenke ---------- */
  geschenk: {
    kontoinhaber: 'Dilara Sarıca',
    iban: 'DE89 3704 0044 0532 0130 00',   // Beispiel-IBAN, kein echtes Konto
  },

  /* ---------- Ablauf: Uhrzeit und Symbol, sprachneutral ----------
     Reihenfolge wie unter sprachen.*.ablauf. Symbole:
     ringe · glaeser · besteck · tanz · torte · mond            */
  zeiten:  ['14:30', '15:30', '17:00', '19:30', '20:00', '02:00'],
  symbole: ['ringe', 'glaeser', 'besteck', 'tanz', 'torte', 'mond'],

  /* ---------- Gut zu wissen ---------- */
  wissen: ['bett', 'auto', 'geschenk'],

  /* ---------- Rueckmeldung ---------- */
  rsvp: { frist_iso: '2026-11-01' },

  /* ---------- Galerie ---------- */
  galerie: [
    { datei: 'assets/img/paar1.webp', schluessel: 'g1' },
    { datei: 'assets/img/paar2.webp', schluessel: 'g2' },
    { datei: 'assets/img/paar3.webp', schluessel: 'g3' },
    { datei: 'assets/img/paar4.webp', schluessel: 'g4' },
  ],

  /* ---------- Dresscode-Farben (Namen uebersetzt) ---------- */
  farben: [
    { hex: '#6d7a63', schluessel: 'salbei' },
    { hex: '#8a6f5c', schluessel: 'nuss' },
    { hex: '#3f4a55', schluessel: 'rauchblau' },
    { hex: '#a8894e', schluessel: 'altgold' },
  ],

  /* =========================================================
     Alles Uebersetzbare
     ========================================================= */
  sprachen: {

    /* ------------------------- DEUTSCH ------------------------- */
    de: {
      name: 'Deutsch', kuerzel: 'DE', htmlLang: 'de',
      datumLang: 'Freitag, 1. Januar 2027',
      monate: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
      wochentage: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],

      umschlagKicker: 'Eine Einladung für dich',
      umschlagHinweis:'Tippe auf den Umschlag',
      heroZeile:      'wir heiraten',
      ueberspringen:  'Überspringen',
      weiter:         'Weiter',

      kopfUeberzeile: 'Die Einladung',
      merken:         'Erinnerung hinzufügen',
      kalenderApple:  'iPhone — Apple Kalender',
      kalenderGoogle: 'Android — Google Kalender',

      anredeText: 'Am ersten Tag des neuen Jahres geben wir uns das Ja-Wort. '
                + 'Wir würden uns freuen, wenn ihr dabei seid – zur Trauung, '
                + 'zum Essen und danach so lange, wie ihr mögt.',
      anredeGruss: 'Dilara und Furkan',

      zitat: 'Ein Tag. Und danach alle anderen.',
      zitatKlein: 'Wir freuen uns darauf, ihn mit euch anzufangen.',
      abschiedGross: 'Bis bald',
      abschiedText: 'Bringt gute Schuhe mit. Es wird spät.',

      countdownUeber: 'Noch',
      cdTage: 'Tage', cdStunden: 'Stunden', cdMinuten: 'Minuten', cdSekunden: 'Sekunden',
      countdownFuss: n => 'bis zum ' + n,
      countdownHeute: 'Heute ist es so weit.',

      wissenTitel: 'Gut zu wissen',
      wissen: {
        bett: { titel: 'Übernachtung',
                text: 'Im Hotel am Schlosspark ist bis zum 1. November ein Kontingent '
                    + 'auf unseren Namen reserviert. Zu Fuß sind es zehn Minuten.' },
        auto: { titel: 'Anreise und Parken',
                text: 'Am Westflügel gibt es Parkplätze, die reichen erfahrungsgemäß. '
                    + 'Der Taxistand liegt direkt am Parkeingang.' },
        geschenk: { titel: 'Geschenke',
                text: 'Ihr müsst nichts mitbringen. Wer trotzdem möchte, findet '
                    + 'weiter unten unsere Bankverbindung.' },
      },

      ablaufTitel: 'Der Tag',
      ablauf: [
        { titel: 'Freie Trauung',   ort: 'Orangerie im Schlosspark', notiz: 'Bitte seid 15 Minuten vorher da.' },
        { titel: 'Sektempfang',     ort: 'Terrasse vor der Orangerie', notiz: 'Bei Regen drinnen im Foyer.' },
        { titel: 'Abendessen',      ort: 'Festsaal' },
        { titel: 'Eröffnungstanz',  ort: 'Festsaal' },
        { titel: 'Torte und Feier', ort: 'Festsaal' },
        { titel: 'Ende',            ort: '', notiz: 'Taxistand liegt direkt am Parkeingang.' },
      ],

      ortTitel: 'Wo',
      ortName: 'Schloss Benrath, Orangerie',
      ortBildAlt: 'Blumenbogen vor der Orangerie, dahinter die Stuhlreihen für die Trauung',
      ortHinweis: 'Parkplätze gibt es am Westflügel. Vom Bahnhof Benrath sind es acht Minuten zu Fuß.',
      routeGoogle: 'Route mit Google Maps',
      routeApple:  'Apple Karten',
      kartenAlt: ort => 'Schematische Lage: ' + ort + ' im Schlosspark, Zufahrt von Norden',

      familienTitel: 'Mit uns freuen sich',
      rollen: { brautseite: 'Eltern der Braut', braeutigamseite: 'Eltern des Bräutigams', trauzeugen: 'Trauzeugen' },

      dresscodeTitel: 'Dresscode',
      dresscodeKopf: 'Festlich, gerne lang',
      dresscodeText: 'Die Trauung ist draußen in der Orangerie – flache Absätze sind auf dem Kiesweg '
                   + 'die klügere Wahl. Weiß bleibt der Braut vorbehalten.',
      farbnamen: { salbei: 'Salbei', nuss: 'Nussbraun', rauchblau: 'Rauchblau', altgold: 'Altgold' },

      galerieTitel: 'Wir zwei',
      bildtexte: {
        g1: 'Dilara und Furkan zu Hause, sie hält seine Wange',
        g2: 'Die beiden abends unter Palmen und Lichterketten',
        g3: 'Furkan und Dilara am Strand bei Sonnenuntergang',
        g4: 'Dilara lehnt an Furkans Schulter auf dem Sofa',
      },

      albumTitel: 'Euer Blick auf den Tag',
      albumText: 'Fotos, ein kurzes Video oder ein paar gesprochene Worte – '
               + 'alles, was ihr hier hochladet, landet in unserem Album.',
      albumWaehlen: 'Datei auswählen',
      albumArten: 'Bild, Video oder Sprachnotiz',
      albumEine: 'Eine Datei ausgewählt. In dieser Vorschau wird noch nichts hochgeladen – dafür fehlt die Serveranbindung.',
      albumMehrere: n => n + ' Dateien ausgewählt. In dieser Vorschau wird noch nichts hochgeladen – dafür fehlt die Serveranbindung.',

      geschenkTitel: 'Geschenke',
      geschenkText: 'Ihr müsst nichts mitbringen. Wer uns trotzdem etwas schenken möchte: '
                  + 'Wir sparen auf die Hochzeitsreise nach Kappadokien.',
      kopieren: 'Kopieren', kopiert: 'Kopiert', kopierenHand: 'Bitte von Hand kopieren',

      rsvpTitel: 'Sagt ihr uns Bescheid?',
      rsvpHinweis: frist => 'Bitte bis zum ' + frist + '. Danach steht die Bestellung beim Caterer fest.',
      fName: 'Euer Name', fNamePlatz: 'Ayşe und Deniz Yılmaz', fNameFehler: 'Bitte tragt euren Namen ein.',
      fKommt: 'Kommt ihr?', fJa: 'Wir kommen', fNein: 'Wir können leider nicht',
      fZusageFehler: 'Bitte wählt eine der beiden Antworten.',
      fAnzahl: 'Wie viele Personen',
      fGruss: 'Ein paar Worte an uns', fGrussPlatz: 'Wir freuen uns schon!',
      fOptional: 'optional',
      fEinwilligung: 'Ich bin einverstanden, dass meine Angaben zur Planung der Feier '
                   + 'gespeichert und nach der Hochzeit gelöscht werden.',
      fDsgvoFehler: 'Ohne dieses Häkchen dürfen wir die Angaben nicht speichern.',
      fSenden: 'Rückmeldung senden',
      rsvpJa: 'Die Eingaben sind vollständig. In dieser Vorschau geht noch nichts raus – '
            + 'für den Versand und die Gästeliste fehlt die Serveranbindung.',
      rsvpNein: 'Schade. Die Eingaben sind vollständig – in dieser Vorschau wird noch nichts versendet.',


      musikAn: 'Musik ausschalten', musikAus: 'Musik einschalten',

      verantwortlich: 'Verantwortlich für den Inhalt: Dilara Sarıca und Furkan Zarga · hallo@dilara-und-furkan.de',
      datenschutz: 'Diese Seite setzt keine Cookies und lädt weder Schriften noch Karten von fremden Servern. '
                 + 'Der Google-Kalender-Knopf öffnet erst nach eurem Klick eine Seite von Google.',
      demoHinweis: 'Demo-Karte von JP Webstudio, gehostet auf GitHub Pages. Paar, Termin und Bankverbindung sind erfunden.',
      seitentitel: namen => namen + ' — Wir heiraten',
    },

    /* ------------------------- TÜRKISCH ------------------------- */
    tr: {
      name: 'Türkçe', kuerzel: 'TR', htmlLang: 'tr',
      datumLang: '1 Ocak 2027 Cuma',
      monate: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
      wochentage: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],

      umschlagKicker: 'Size özel bir davetiye',
      umschlagHinweis:'Zarfa dokunun',
      heroZeile:      'evleniyoruz',
      ueberspringen:  'Geç',
      weiter:         'Aşağı kaydırınız',

      kopfUeberzeile: 'Davetiye',
      merken:         'Hatırlatıcı ekle',
      kalenderApple:  'iPhone — Apple Takvim',
      kalenderGoogle: 'Android — Google Takvim',

      anredeText: 'Yeni yılın ilk gününde hayatımızı birleştiriyoruz. '
                + 'Bu özel günümüzde sizi de aramızda görmekten mutluluk duyarız – '
                + 'nikâhta, yemekte ve sonrasında dilediğiniz kadar.',
      anredeGruss: 'Dilara ve Furkan',

      zitat: 'Bir gün. Ve ardından bütün diğerleri.',
      zitatKlein: 'Bu güne sizinle başlamak bizi mutlu edecek.',
      abschiedGross: 'Görüşmek üzere',
      abschiedText: 'Rahat ayakkabı getirin. Gece uzun sürecek.',

      countdownUeber: 'Geri sayım',
      cdTage: 'Gün', cdStunden: 'Saat', cdMinuten: 'Dakika', cdSekunden: 'Saniye',
      countdownFuss: n => n + ' tarihine',
      countdownHeute: 'Bugün o gün!',

      wissenTitel: 'Bilmekte fayda var',
      wissen: {
        bett: { titel: 'Konaklama',
                text: 'Saray parkındaki otelde 1 Kasım’a kadar adımıza oda ayrıldı. '
                    + 'Yürüyerek on dakika.' },
        auto: { titel: 'Ulaşım ve otopark',
                text: 'Batı kanadında otopark var, genelde yeterli oluyor. '
                    + 'Taksi durağı park girişinin hemen yanında.' },
        geschenk: { titel: 'Hediye',
                text: 'Bir şey getirmenize gerek yok. Yine de isteyenler için '
                    + 'banka bilgimiz aşağıda.' },
      },

      ablaufTitel: 'Günün akışı',
      ablauf: [
        { titel: 'Nikâh töreni',            ort: 'Saray parkındaki Orangerie', notiz: 'Lütfen 15 dakika önce gelin.' },
        { titel: 'Karşılama kokteyli',      ort: 'Orangerie terası', notiz: 'Yağmur durumunda fuayede.' },
        { titel: 'Akşam yemeği',            ort: 'Balo salonu' },
        { titel: 'İlk dans',                ort: 'Balo salonu' },
        { titel: 'Pasta kesimi ve eğlence', ort: 'Balo salonu' },
        { titel: 'Kapanış',                 ort: '', notiz: 'Taksi durağı park girişinin hemen yanında.' },
      ],

      ortTitel: 'Konum',
      ortName: 'Benrath Sarayı, Orangerie',
      ortBildAlt: 'Orangerie önünde çiçekli kemer, arkasında nikâh için sandalye sıraları',
      ortHinweis: 'Otopark batı kanadındadır. Benrath tren istasyonundan yürüyerek sekiz dakika.',
      routeGoogle: 'Google Haritalar ile yol tarifi',
      routeApple:  'Apple Haritalar',
      kartenAlt: ort => 'Konum şeması: saray parkındaki ' + ort + ', kuzeyden giriş',

      familienTitel: 'Sevdiklerimiz',
      rollen: { brautseite: 'Gelin tarafı', braeutigamseite: 'Damat tarafı', trauzeugen: 'Şahitlerimiz' },

      dresscodeTitel: 'Kıyafet',
      dresscodeKopf: 'Şık, tercihen uzun',
      dresscodeText: 'Nikâh Orangerie’nin bahçesinde yapılacak – çakıl yolda alçak topuk daha rahat olur. '
                   + 'Beyaz rengi geline bırakalım.',
      farbnamen: { salbei: 'Adaçayı', nuss: 'Kahve', rauchblau: 'Duman mavisi', altgold: 'Eski altın' },

      galerieTitel: 'Biz ikimiz',
      bildtexte: {
        g1: 'Dilara ve Furkan evde, Dilara elini yanağına koymuş',
        g2: 'İkisi akşam, palmiyeler ve ışıklar altında',
        g3: 'Furkan ve Dilara gün batımında sahilde',
        g4: 'Dilara başını Furkan’ın omzuna yaslamış',
      },

      albumTitel: 'Anı albümü',
      albumText: 'Fotoğraf, kısa bir video ya da birkaç kelime – '
               + 'buraya yüklediğiniz her şey albümümüze düşer.',
      albumWaehlen: 'Dosya seçin',
      albumArten: 'Fotoğraf, video veya ses kaydı',
      albumEine: 'Bir dosya seçildi. Bu önizlemede henüz yükleme yapılmıyor – sunucu bağlantısı eksik.',
      albumMehrere: n => n + ' dosya seçildi. Bu önizlemede henüz yükleme yapılmıyor – sunucu bağlantısı eksik.',

      geschenkTitel: 'Hediye',
      geschenkText: 'Varlığınız bizim için en değerli hediye. Yine de bir şey vermek isteyenler için: '
                  + 'Kapadokya’ya balayı için biriktiriyoruz.',
      kopieren: 'Kopyala', kopiert: 'Kopyalandı', kopierenHand: 'Lütfen elle kopyalayın',

      rsvpTitel: 'Katılım bildirimi',
      rsvpHinweis: frist => 'Lütfen ' + frist + ' tarihine kadar bildirin. Sonrasında ikram siparişi kesinleşiyor.',
      fName: 'Adınız soyadınız', fNamePlatz: 'Ayşe ve Deniz Yılmaz', fNameFehler: 'Lütfen adınızı yazın.',
      fKommt: 'Katılacak mısınız?', fJa: 'Katılıyoruz', fNein: 'Maalesef katılamıyoruz',
      fZusageFehler: 'Lütfen iki seçenekten birini işaretleyin.',
      fAnzahl: 'Kaç kişi',
      fGruss: 'Bize birkaç kelime', fGrussPlatz: 'Şimdiden heyecanlıyız!',
      fOptional: 'isteğe bağlı',
      fEinwilligung: 'Bilgilerimin düğün planlaması için saklanmasını ve düğünden sonra '
                   + 'silinmesini kabul ediyorum.',
      fDsgvoFehler: 'Bu onay olmadan bilgileri saklayamayız.',
      fSenden: 'Gönder',
      rsvpJa: 'Bilgiler eksiksiz. Bu önizlemede henüz gönderim yapılmıyor – '
            + 'gönderim ve konuk listesi için sunucu bağlantısı eksik.',
      rsvpNein: 'Üzüldük. Bilgiler eksiksiz – bu önizlemede henüz gönderim yapılmıyor.',


      musikAn: 'Müziği kapat', musikAus: 'Müziği aç',

      verantwortlich: 'İçerik sorumlusu: Dilara Sarıca ve Furkan Zarga · hallo@dilara-und-furkan.de',
      datenschutz: 'Bu sayfa çerez kullanmaz, yazı tiplerini ve haritaları başka sunuculardan yüklemez. '
                 + 'Google Takvim düğmesi yalnızca siz dokununca bir Google sayfası açar.',
      demoHinweis: 'JP Webstudio demo davetiyesi, GitHub Pages üzerinde. Çift, tarih ve banka bilgisi kurgudur.',
      seitentitel: namen => namen + ' — Evleniyoruz',
    },
  },
};
