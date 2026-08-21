# Digitale Hochzeitskarte — Arbeitskopie

> Kopie der fertigen Demo vom 20.08.2026, angelegt zum Weiterarbeiten.
> Das Original liegt unter `~/Digitale Hochzeitskarten`, ist dort mit dem
> Tag `demo-v1` gesichert und laeuft unveraendert auf
> https://webstudiojp.github.io/hochzeitskarte-demo/
>
> Diese Kopie hat ein **eigenes Repository** und laeuft unter
> https://webstudiojp.github.io/hochzeitskarte/ — getrennt vom Original,
> das unveraendert unter .../hochzeitskarte-demo/ bleibt.
> Der lokale Server laeuft hier auf Port **4323**, das Original auf 4321 —
> beide koennen also gleichzeitig offen sein.

Vorlage für eine digitale Hochzeitseinladung, die per QR-Code geöffnet wird.
Statische Seite, kein Build-Schritt, kein Framework.

**Demo-Datensatz Furkan & Dilara ist frei erfunden** — Paar, Termin,
Location und Bankverbindung existieren nicht.

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/config.js` | Alle Inhalte. Pro Paar wird nur diese Datei angefasst. |
| `js/hero.js` | Die Fahrt: Wagen, Perlenspur, Schriftzug auf der Fahrbahn. |
| `js/karte.js` | Countdown, Kalenderdatei, Route, Formular, Galerie. |
| `assets/img/` | Kulisse, Wagen, Rahmen und Fotos (WebP). |
| `assets/fonts/` | Schriften lokal, keine Anfragen an Google. |

## Aufbau der Seite

Reihenfolge nach dem Gestaltungsentwurf: Umschlag und Fahrt, dann ein
Bildmoment, Countdown, danach paarweise Blöcke — Anschreiben neben Ablauf,
Ort neben Dresscode — anschließend Gut zu wissen, Familien, Galerie,
Gästealbum, Geschenke, Rückmeldung, Abschied.

Die Paare stehen erst ab 900px nebeneinander. Darunter würden zwei Spalten
zu schmalen Textkolonnen zerfallen.

Der Ablauf ist eine Reihe mit Symbolen: zwei Spalten auf dem Handy, drei
innerhalb einer Doppelspalte, sechs in einer Reihe wenn er allein steht.
Die Symbole sind Pfade in `js/karte.js` — keine Bilddateien, keine Ladezeit,
eine Strichstärke für alle.

## Sprachen

Alles Übersetzbare steht in `js/config.js` unter `sprachen`. Angaben, die in
jeder Sprache gleich sind — Namen, Termine, Uhrzeiten, Adresse, Bankverbindung —
stehen darüber und werden nur einmal gepflegt. Eine dritte Sprache ergänzt man,
indem man einen Block kopiert und den Schlüssel in `sprachfolge` einträgt.

Die Sprache richtet sich nach der Wahl des Gastes, sonst nach `?lang=tr` in der
Adresse, sonst nach der Browsersprache, sonst nach `standardsprache`.

## Musik

Eingebunden ist ein Ney-Solo (türkische Rohrflöte) unter **CC0 1.0** —
kommerziell nutzbar, ohne Namensnennung, ohne Share-Alike.
Quelle und Bearbeitung stehen in `assets/audio/HIER-MUSIK-ABLEGEN.txt`.

Sie startet, wenn der Gast den Umschlag antippt — vorher lässt kein Browser
Ton zu — blendet sanft ein und lässt sich über den Notenknopf abschalten.
Diese Entscheidung wird gemerkt. Zum Tauschen einfach `assets/audio/musik.mp3`
ersetzen; ohne Datei bleibt der Knopf verborgen.

## Vorschau beim Teilen

Die Open-Graph-Angaben stehen im Kopf der `index.html`, das Bild ist
`assets/img/vorschau.jpg` (1200×630). **Bei jedem neuen Projekt müssen dort die
eigene Adresse und das eigene Vorschaubild eingetragen werden** — Messenger
ignorieren relative Pfade.

## Zum Ausprobieren

- `?namen=Lea+%26+Tom` — setzt das Paar ohne Datei-Änderung
- `?lang=tr` / `?lang=de` — Sprache erzwingen
- `?schrift=strasse` / `?schrift=quer` — andere Ausrichtung des Schriftzugs

## Parallaxe

Jedes Bild mit Tiefenwirkung trägt `data-px="<stärke in prozent>"`. Das Skript
setzt daraus `--px-weg`, und das CSS macht das Bild oben und unten um genau
diesen Wert größer als seinen Rahmen. Weg und Überstand kommen damit zwingend
aus derselben Zahl — sonst fährt das Bild weiter, als seine Reserve reicht,
und am Rand klafft eine Lücke.

Auf Schirmen unter 700px werden die Wege auf 62 % gekürzt: Dort sind die
Bilder knapper aufgelöst, und jeder Prozentpunkt Überstand kostet Schärfe.

Gerechnet wird in einem gemeinsamen rAF-Takt, nur für Bilder im Fenster, und
nur wenn sich der Wert tatsächlich geändert hat.

## Bildschirmgrößen

Geprüft auf 360×640, 375×812, 430×932, 768×1024, 1024×768, 1440×900 und
1920×1080 — jeweils auf seitlichen Überlauf, Hero-Höhe, Lücken zwischen
Abschnitten und Zeilenlänge.

Die Hero-Szene ist hochformatig (1000:1800). Auf Schirmen, die breiter als
hoch sind, würde sie so stark beschnitten, dass vom Wagen nichts übrig bliebe.
Dort steht sie deshalb als Bühne in voller Höhe mittig, daneben dieselbe Allee
unscharf und abgedunkelt.

## Veröffentlichen

    ./bin/veroeffentlichen.sh "Was geändert wurde"

Setzt eine frische Versionsnummer an alle eigenen Dateien und stellt live.
Ohne das liefern Browser tagelang die alte Fassung aus dem Zwischenspeicher.

Beim Arbeiten am lokalen Server reicht `./bin/frisch.sh` — das setzt nur die
Versionsnummer neu, damit der Browser nicht das alte Stylesheet festhält.

## Bildmaterial

`paar1`–`paar4` sind die echten Fotos des Paares und stehen in der Galerie.
Die generierten Motive tragen die großen Flächen: `g4-tafel` den Zitat-Moment,
`g5-lichter` den Countdown, `g3-bogen` liegt zurückgenommen hinter dem Ort,
`g1-strauss` unter dem Abschied. `g2-ringe` ist frei als Ersatz.

## Noch nicht angebunden

Rückmeldung und Gästealbum sind vollständige Oberflächen ohne Server:
Eingaben werden geprüft, aber nicht versendet oder gespeichert.
