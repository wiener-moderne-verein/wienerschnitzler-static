#!/bin/bash
# Lokale Accessibility-Tests für Wiener Schnitzler Projekt

echo "🎯 Wiener Schnitzler - Accessibility Tests"
echo "=========================================="

# Prüfen ob axe-core installiert ist
if ! command -v axe &> /dev/null; then
    echo "📦 Installiere axe-core..."
    npm install -g @axe-core/cli
fi

# Build prüfen
if [ ! -f "html/index.html" ]; then
    echo "❌ HTML-Dateien nicht gefunden. Bitte zuerst 'ant' ausführen."
    exit 1
fi

echo ""
echo "🔍 Teste wichtigste Seiten auf WCAG 2.1 AA Konformität..."
echo ""

# Test-Array mit wichtigsten Seiten
pages=(
    "html/index.html"
    "html/listplace.html" 
    "html/gesamt.html"
    "html/impressum.html"
    "html/kontakt.html"
)

total_issues=0
passed_pages=0

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "📄 Teste: $page"
        
        # axe-core Test
        result=$(axe --tags wcag2a,wcag2aa,wcag21aa "$page" 2>&1)
        
        if [[ $result == *"0 violations found"* ]]; then
            echo "   ✅ Keine Accessibility-Probleme gefunden"
            ((passed_pages++))
        else
            echo "   ⚠️  Accessibility-Probleme gefunden:"
            echo "$result" | grep -A 2 "violations found" || echo "   Details siehe axe-core Output"
            ((total_issues++))
        fi
        echo ""
    else
        echo "❌ Datei nicht gefunden: $page"
    fi
done

echo "=========================================="
echo "📊 Zusammenfassung:"
echo "   ✅ Seiten bestanden: $passed_pages/${#pages[@]}"
echo "   ⚠️  Seiten mit Problemen: $total_issues"

if [ $total_issues -eq 0 ]; then
    echo ""
    echo "🎉 Alle Tests bestanden! Die Website erfüllt WCAG 2.1 AA Standards."
    exit 0
else
    echo ""
    echo "⚠️  Einige Accessibility-Probleme gefunden. Bitte überprüfen."
    exit 1
fi