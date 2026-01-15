#!/usr/bin/env python3
"""
Sitemap Generator für Wiener Schnitzler Projekt
Erstellt sitemap.xml aus allen HTML-Dateien für bessere SEO mit multilingualer Unterstützung.
"""

import os
import glob
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

def get_base_filename(filename):
    """
    Extracts the base filename without language suffix.
    Examples:
        index-en.html -> index
        tag.html -> tag
        monat-en.html -> monat
    """
    # Remove .html extension
    base = filename.replace('.html', '')
    # Remove -en suffix if present
    if base.endswith('-en'):
        base = base[:-3]
    return base

def get_language_pair(filename):
    """
    Returns (de_filename, en_filename) for a given file.
    Examples:
        'index.html' -> ('index.html', 'index-en.html')
        'tag-en.html' -> ('tag.html', 'tag-en.html')
    """
    base = get_base_filename(filename)
    return (f"{base}.html", f"{base}-en.html")

def generate_sitemap():
    """Generiert sitemap.xml aus allen HTML-Dateien im html/ Verzeichnis mit hreflang-Support."""

    # Basis-URL
    base_url = "https://wienerschnitzler.org"

    # HTML-Verzeichnis
    html_dir = "./html"

    # Root-Element für Sitemap mit allen notwendigen Namespaces
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    urlset.set('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')

    # Alle HTML-Dateien finden
    html_files = glob.glob(os.path.join(html_dir, "*.html"))
    html_filenames = [os.path.basename(f) for f in html_files]

    # Prioritäten für verschiedene Seitentypen (basierend auf base filename)
    priorities = {
        'index': '1.0',
        'listplace': '0.9',
        'gesamt': '0.8',
        'gesamt_typen': '0.8',
        'uebersicht': '0.8',
        'jahr': '0.7',
        'monat': '0.7',
        'dekade': '0.7',
        'tag': '0.7',
        'zeitleiste': '0.7',
        'schnitzler-und-ich': '0.7',
        'listplace-missing': '0.6',
        'projekt': '0.6',
        'faqs': '0.5',
        'literatur': '0.5',
        'kontakt': '0.4',
        'impressum': '0.4',
        '404': '0.1'
    }

    # Änderungsfrequenzen
    change_frequencies = {
        'index': 'weekly',
        'listplace': 'monthly',
        'gesamt': 'monthly',
        'gesamt_typen': 'monthly',
        'uebersicht': 'monthly',
        'jahr': 'yearly',
        'monat': 'yearly',
        'dekade': 'yearly',
        'tag': 'yearly',
        'zeitleiste': 'monthly',
        'schnitzler-und-ich': 'monthly',
        'impressum': 'yearly',
        'kontakt': 'yearly',
        '404': 'never'
    }

    # Aktuelles Datum für lastmod
    current_date = datetime.now().strftime('%Y-%m-%d')

    # Track which files we've already processed (to avoid duplicates)
    processed_bases = set()

    # URLs hinzufügen
    for html_file in sorted(html_files):
        filename = os.path.basename(html_file)
        base = get_base_filename(filename)

        # Skip 404 page
        if base == '404':
            continue

        # Skip if we already processed this base (avoid adding both DE and EN separately)
        if base in processed_bases:
            continue
        processed_bases.add(base)

        # Get language pair
        de_file, en_file = get_language_pair(filename)

        # Check which versions exist
        de_exists = de_file in html_filenames
        en_exists = en_file in html_filenames

        # Create URL entries for existing versions
        if de_exists:
            url = SubElement(urlset, 'url')

            # Location
            loc = SubElement(url, 'loc')
            loc.text = f"{base_url}/{de_file}"

            # Last modified
            lastmod = SubElement(url, 'lastmod')
            lastmod.text = current_date

            # Change frequency
            changefreq = SubElement(url, 'changefreq')
            changefreq.text = change_frequencies.get(base, 'monthly')

            # Priority
            priority = SubElement(url, 'priority')
            priority.text = priorities.get(base, '0.6')

            # Add hreflang links if both versions exist
            if en_exists:
                # Self-reference (German)
                xhtml_link_de = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_de.set('rel', 'alternate')
                xhtml_link_de.set('hreflang', 'de')
                xhtml_link_de.set('href', f"{base_url}/{de_file}")

                # English version
                xhtml_link_en = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_en.set('rel', 'alternate')
                xhtml_link_en.set('hreflang', 'en')
                xhtml_link_en.set('href', f"{base_url}/{en_file}")

                # x-default points to German version
                xhtml_link_default = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_default.set('rel', 'alternate')
                xhtml_link_default.set('hreflang', 'x-default')
                xhtml_link_default.set('href', f"{base_url}/{de_file}")

        if en_exists:
            url = SubElement(urlset, 'url')

            # Location
            loc = SubElement(url, 'loc')
            loc.text = f"{base_url}/{en_file}"

            # Last modified
            lastmod = SubElement(url, 'lastmod')
            lastmod.text = current_date

            # Change frequency
            changefreq = SubElement(url, 'changefreq')
            changefreq.text = change_frequencies.get(base, 'monthly')

            # Priority (same as German version)
            priority = SubElement(url, 'priority')
            priority.text = priorities.get(base, '0.6')

            # Add hreflang links if both versions exist
            if de_exists:
                # German version
                xhtml_link_de = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_de.set('rel', 'alternate')
                xhtml_link_de.set('hreflang', 'de')
                xhtml_link_de.set('href', f"{base_url}/{de_file}")

                # Self-reference (English)
                xhtml_link_en = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_en.set('rel', 'alternate')
                xhtml_link_en.set('hreflang', 'en')
                xhtml_link_en.set('href', f"{base_url}/{en_file}")

                # x-default points to German version
                xhtml_link_default = SubElement(url, '{http://www.w3.org/1999/xhtml}link')
                xhtml_link_default.set('rel', 'alternate')
                xhtml_link_default.set('hreflang', 'x-default')
                xhtml_link_default.set('href', f"{base_url}/{de_file}")

    # PMB-Seiten hinzufügen (falls vorhanden) - these don't have language versions
    pmb_files = glob.glob(os.path.join(html_dir, "pmb*.html"))
    for pmb_file in sorted(pmb_files):
        filename = os.path.basename(pmb_file)

        url = SubElement(urlset, 'url')

        loc = SubElement(url, 'loc')
        loc.text = f"{base_url}/{filename}"

        lastmod = SubElement(url, 'lastmod')
        lastmod.text = current_date

        changefreq = SubElement(url, 'changefreq')
        changefreq.text = 'yearly'  # PMB-Seiten ändern sich selten

        priority = SubElement(url, 'priority')
        priority.text = '0.5'  # Mittlere Priorität für Ortsseiten

    # XML formatieren und schreiben
    rough_string = tostring(urlset, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    pretty_xml = reparsed.toprettyxml(indent="  ")

    # XML-Header korrigieren (minidom fügt unnötige Leerzeile hinzu)
    lines = pretty_xml.split('\n')
    pretty_xml = '\n'.join([lines[0]] + [line for line in lines[1:] if line.strip()])

    # Sitemap speichern
    sitemap_path = os.path.join(html_dir, 'sitemap.xml')
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)

    print(f"✅ Sitemap erstellt: {sitemap_path}")
    print(f"📊 {len(html_files)} HTML-Dateien gefunden")
    print(f"🌐 {len([f for f in html_filenames if f.endswith('-en.html')])} englische Versionen")
    print(f"🔗 Basis-URL: {base_url}")
    print(f"🌍 hreflang-Attribute für multilinguale SEO hinzugefügt")

    # robots.txt aktualisieren/erstellen
    robots_path = os.path.join(html_dir, 'robots.txt')
    robots_content = f"""User-agent: *
Allow: /

# Sitemap
Sitemap: {base_url}/sitemap.xml

# Spezielle Anweisungen
Disallow: /js/
Disallow: /css/
Allow: /css/style.css
"""

    with open(robots_path, 'w', encoding='utf-8') as f:
        f.write(robots_content)

    print(f"🤖 robots.txt aktualisiert: {robots_path}")

if __name__ == "__main__":
    generate_sitemap()
