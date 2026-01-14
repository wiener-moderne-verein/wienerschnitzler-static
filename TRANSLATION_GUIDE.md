# Translation Guide - Mehrsprachigkeit für Wiener Schnitzler

## 📋 Übersicht

Die Website verwendet ein **parametrisiertes XSLT-System** mit zentralen Übersetzungsdateien.

### Aktueller Stand
✅ **Vollständig übersetzt:**
- Navigation (html_navbar.xsl)
- Footer (html_footer.xsl)
- Index-Seite (index.xsl)

🔄 **Teilweise vorbereitet:**
- gesamt.xsl (Beispiel-Template erstellt)
- tag.xsl, listplace.xsl (Übersetzungen in translations-*.xml vorhanden)

⏳ **Noch zu tun:**
- Alle anderen XSLT-Seiten
- Meta-Seiten (Projekt, FAQs, Kontakt, etc.)
- Dynamische Inhalte aus wienerschnitzler-data

---

## 🏗️ Architektur

### 1. Translation-Dateien
```
xslt/translations-de.xml  →  Deutsche Übersetzungen
xslt/translations-en.xml  →  Englische Übersetzungen
```

**Struktur:**
```xml
<translations lang="de">
    <text key="gesamt.heading">Anzahl der Aufenthalte Schnitzlers</text>
    <text key="gesamt.legend_title">Aufenthaltstage</text>
</translations>
```

### 2. XSLT-Templates
Jedes Template nutzt die `local:translate()` Funktion:

```xsl
<h1><xsl:value-of select="local:translate('gesamt.heading')"/></h1>
```

### 3. Build-System
`build.xml` generiert beide Sprachversionen:

```xml
<!-- Deutsche Version -->
<xsl:param name="language" expression="de"/>
→ gesamt.html

<!-- Englische Version -->
<xsl:param name="language" expression="en"/>
→ gesamt-en.html
```

---

## 🔧 Eine Seite übersetzen (Schritt-für-Schritt)

### Beispiel: `gesamt.xsl`

#### **Schritt 1: Übersetzungen hinzufügen**

Füge in `translations-de.xml` und `translations-en.xml` alle Texte hinzu:

```xml
<!-- translations-de.xml -->
<text key="gesamt.heading">Anzahl der Aufenthalte Schnitzlers</text>
<text key="gesamt.legend_title">Aufenthaltstage</text>

<!-- translations-en.xml -->
<text key="gesamt.heading">Number of Schnitzler's Stays</text>
<text key="gesamt.legend_title">Days of Stay</text>
```

#### **Schritt 2: XSLT anpassen**

**Vorher:**
```xsl
<xsl:template match="/">
    <html lang="de" class="h-100">
        <head>
            <xsl:variable name="doc_title">
                <xsl:text>Karte der Aufenthaltstage | Wiener Schnitzler</xsl:text>
            </xsl:variable>
```

**Nachher:**
```xsl
<xsl:import href="./partials/shared.xsl"/>

<xsl:template match="/">
    <html class="h-100">
        <xsl:attribute name="lang">
            <xsl:value-of select="$language"/>
        </xsl:attribute>
        <head>
            <xsl:variable name="doc_title" select="local:translate('gesamt.title')"/>
```

**Alle Texte ersetzen:**
```xsl
<!-- Vorher -->
<h1>Anzahl der Aufenthalte Schnitzlers</h1>

<!-- Nachher -->
<h1><xsl:value-of select="local:translate('gesamt.heading')"/></h1>
```

#### **Schritt 3: Build-System erweitern**

In `build.xml` beide Versionen generieren:

```xml
<!-- Deutsche Version -->
<xslt in="${index}" out="${target}/gesamt.html" style="./xslt/gesamt.xsl">
    <factory name="net.sf.saxon.TransformerFactoryImpl"/>
    <classpath location="${basedir}/saxon/saxon9he.jar"/>
    <param name="language" expression="de"/>
</xslt>

<!-- Englische Version -->
<xslt in="${index}" out="${target}/gesamt-en.html" style="./xslt/gesamt.xsl">
    <factory name="net.sf.saxon.TransformerFactoryImpl"/>
    <classpath location="${basedir}/saxon/saxon9he.jar"/>
    <param name="language" expression="en"/>
</xslt>
```

#### **Schritt 4: Testen**

```bash
ant
ls -lh html/gesamt*.html
# Sollte zeigen:
# gesamt.html (Deutsch)
# gesamt-en.html (Englisch)
```

---

## 📊 Dynamische Inhalte aus wienerschnitzler-data

### Problem
Die XML-Dateien in `data/` enthalten **nur deutsche Texte**:

```xml
<!-- data/meta/projekt.xml -->
<TEI>
    <teiHeader>
        <titleStmt>
            <title>Über das Projekt</title>
        </titleStmt>
    </teiHeader>
    <text>
        <body>
            <p>Arthur Schnitzler wurde 1862 in Wien geboren...</p>
        </body>
    </text>
</TEI>
```

### Lösung: Mehrsprachige XML-Dateien

#### **Option 1: Separate Dateien (Empfohlen)**
```
data/meta/projekt.xml       →  Deutsch
data/meta/projekt-en.xml    →  Englisch
```

**Im XSLT:**
```xsl
<xsl:param name="content_file">
    <xsl:choose>
        <xsl:when test="$language = 'en'">
            <xsl:value-of select="'projekt-en.xml'"/>
        </xsl:when>
        <xsl:otherwise>
            <xsl:value-of select="'projekt.xml'"/>
        </xsl:otherwise>
    </xsl:choose>
</xsl:param>
<xsl:variable name="content" select="document(concat('../data/meta/', $content_file))"/>
```

#### **Option 2: xml:lang Attribut**
```xml
<TEI>
    <text xml:lang="de">
        <body><p>Deutscher Text...</p></body>
    </text>
    <text xml:lang="en">
        <body><p>English text...</p></body>
    </text>
</TEI>
```

**Im XSLT:**
```xsl
<xsl:apply-templates select="//tei:text[@xml:lang=$language]/tei:body"/>
```

#### **Option 3: Übersetzungsdatenbank**
Für sehr große Inhalte (FAQs, Projekt-Beschreibungen):

```xml
<!-- translations-content-de.xml -->
<content>
    <page id="projekt">
        <title>Über das Projekt</title>
        <intro>Arthur Schnitzler wurde 1862...</intro>
        <section id="ziele">
            <heading>Projektziele</heading>
            <text>Das Projekt visualisiert...</text>
        </section>
    </page>
</content>
```

---

## 🎯 Empfohlene Reihenfolge

### Phase 1: UI-Elemente ✅
- [x] Navigation
- [x] Footer
- [x] Index

### Phase 2: Karten-Seiten
1. **gesamt.xsl** (Beispiel vorhanden: `gesamt-translated.xsl`)
2. **gesamt_typen.xsl**
3. **tag.xsl** (Übersetzungen vorhanden)
4. **monat.xsl**
5. **jahr.xsl**
6. **dekade.xsl**
7. **uebersicht.xsl**

### Phase 3: Verzeichnisse
8. **listplace.xsl** (Übersetzungen vorhanden)
9. **listplace-missing.xsl**

### Phase 4: Meta-Seiten (aufwändiger!)
10. **meta.xsl** → benötigt mehrsprachige XML-Dateien in `data/meta/`
11. **Projekt, FAQs, Kontakt, Impressum, Literatur**

---

## 🗂️ Dateistruktur für wienerschnitzler-data

### Aktuell
```
wienerschnitzler-data/
├── data/
│   ├── meta/
│   │   ├── projekt.xml      (nur Deutsch)
│   │   ├── faqs.xml          (nur Deutsch)
│   │   └── ...
│   └── indices/
│       └── ortstypen.xml     (nur Deutsch)
```

### Empfohlen
```
wienerschnitzler-data/
├── data/
│   ├── meta/
│   │   ├── projekt.xml       (Deutsch)
│   │   ├── projekt-en.xml    (Englisch)
│   │   ├── faqs.xml          (Deutsch)
│   │   ├── faqs-en.xml       (Englisch)
│   │   └── ...
│   └── indices/
│       ├── ortstypen.xml      (Deutsch)
│       └── ortstypen-en.xml   (Englisch)
```

**Alternative mit xml:lang:**
```xml
<!-- projekt.xml -->
<TEI>
    <text xml:lang="de">...</text>
    <text xml:lang="en">...</text>
</TEI>
```

---

## 🚀 Quick Start: Nächste Seite übersetzen

1. **Texte extrahieren:**
   ```bash
   grep -o '<[^>]*>[^<]*</[^>]*>' xslt/gesamt.xsl | grep -E '(h1|h2|h3|p|label|option|title)'
   ```

2. **Zu translations-*.xml hinzufügen:**
   ```xml
   <text key="gesamt.heading">...</text>
   ```

3. **XSLT anpassen:**
   - `<xsl:import href="./partials/shared.xsl"/>` hinzufügen
   - `lang` Attribut dynamisch: `<xsl:attribute name="lang"><xsl:value-of select="$language"/></xsl:attribute>`
   - Texte ersetzen: `<xsl:value-of select="local:translate('key')"/>`

4. **Build erweitern:**
   ```xml
   <!-- DE-Version -->
   <param name="language" expression="de"/>
   <!-- EN-Version -->
   <param name="language" expression="en"/>
   ```

5. **Testen:**
   ```bash
   ant
   open html/page.html
   open html/page-en.html
   ```

---

## ✨ Nützliche Befehle

```bash
# Build durchführen
ant

# Nur Index neu bauen (schneller zum Testen)
ant -f build.xml | grep -A 5 "index.html"

# Alle übersetzten Seiten finden
ls html/*-en.html

# Fehlende Übersetzungsschlüssel finden
grep -r '\[.*\]' html/

# Translation-Dateien validieren
xmllint --noout xslt/translations-de.xml
xmllint --noout xslt/translations-en.xml
```

---

## 📝 Naming Conventions

### Übersetzungsschlüssel
```
[seite].[bereich].[element]

Beispiele:
- index.main_title
- gesamt.heading
- nav.project.about
- footer.citation_label
```

### Dateien
```
[page].html         →  Deutsche Version
[page]-en.html      →  Englische Version

Beispiele:
- index.html / index-en.html
- gesamt.html / gesamt-en.html
```

---

## 🆘 Troubleshooting

### "Translation not found: [key]"
→ Schlüssel zu translations-*.xml hinzufügen

### "Document not available: translations-de.xml"
→ Datei muss in `xslt/` Verzeichnis liegen

### "Stylesheet module imported more than once"
→ Warnung kann ignoriert werden

### Build-Fehler bei XSLT
→ `<xsl:import href="./partials/shared.xsl"/>` am Anfang prüfen

---

## 📚 Beispiel-Dateien

### Vollständig übersetzt
- ✅ `xslt/index.xsl`
- ✅ `xslt/partials/html_navbar.xsl`
- ✅ `xslt/partials/html_footer.xsl`

### Template zum Kopieren
- 📄 `xslt/gesamt-translated.xsl` (Beispiel-Implementation)

---

## 🔧 JavaScript Übersetzungen

### System

JavaScript-Dateien verwenden ein JSON-basiertes Übersetzungssystem:

1. **XSLT injiziert Übersetzungen** (`xslt/partials/js_translations.xsl`):
   ```xml
   <xsl:call-template name="js_translations"/>
   ```
   Generiert ein `<script id="translations-data">` Tag mit JSON.

2. **Translations-Modul** (`html/js/translations.js`):
   ```javascript
   import { t } from './translations.js';
   const text = t('filter.all'); // "Alle" oder "All"
   ```

3. **Übersetzungsschlüssel** in `translations-*.xml`:
   ```xml
   <text key="js.filter.all">Alle</text>
   <text key="js.filter.none">Keine</text>
   <text key="js.location.all">(alle)</text>
   ```

### Aktualisierte Dateien

- ✅ `html/js/translations.js` - Übersetzungsmodul
- ✅ `html/js/filter_dauer.js` - "Alle"/"Keine" Buttons
- ✅ `html/js/filter_jahre.js` - "Alle"/"Keine" Buttons
- ✅ `html/js/filter_typ.js` - "(alle)"/"(keine)" Buttons
- ✅ `html/js/fuer-alle-karten.js` - "(alle)" in Dropdown

### Neue Übersetzungen hinzufügen

1. Schlüssel zu `translations-de.xml` und `translations-en.xml` hinzufügen
2. In `js_translations.xsl` die JSON-Struktur erweitern
3. In JS-Dateien `t('key.path')` verwenden

---

**Viel Erfolg! 🎉**

Bei Fragen: Dieses Dokument zeigt das Grundkonzept. Für spezifische Seiten siehe die bereits übersetzten Beispiele.
