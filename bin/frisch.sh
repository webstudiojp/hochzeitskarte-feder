#!/usr/bin/env bash
# Setzt nur die Versionsnummer neu, ohne zu veroeffentlichen.
# Fuer das Testen waehrend der Arbeit: sonst haelt der Browser das
# alte Stylesheet fest, weil sich die Adresse nicht geaendert hat.
set -euo pipefail
cd "$(dirname "$0")/.."
V="$(date +%Y%m%d%H%M%S)"
perl -0777 -i -pe "s|(href=\"css/[a-z-]+\\.css)(\\?v=\\d+)?\"|\$1?v=$V\"|g" index.html
perl -0777 -i -pe "s|(src=\"js/[a-z-]+\\.js)(\\?v=\\d+)?\"|\$1?v=$V\"|g" index.html
perl -0777 -i -pe "s|((?:src\|href)=\"assets/img/[a-z0-9-]+\\.webp)(\\?v=\\d+)?\"|\$1?v=$V\"|g" index.html
perl -0777 -i -pe "s|(^  version:\\s*')[^']*(')|\${1}$V\${2}|m" js/config.js
echo "Version $V"
