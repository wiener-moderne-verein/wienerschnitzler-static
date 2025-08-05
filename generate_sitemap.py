#!/usr/bin/env python3
"""
Sitemap Generator für Wiener Schnitzler Projekt
Erstellt sitemap.xml aus allen HTML-Dateien für bessere SEO.
"""

import os
import glob
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

def generate_sitemap():
    """Generiert sitemap.xml aus allen HTML-Dateien im html/ Verzeichnis."""
    
    # Basis-URL aus params.xsl (korrigiert den Typo)
    base_url = "https://wienerschnitzler.org"
    
    # HTML-Verzeichnis
    html_dir = "./html"
    
    # Root-Element für Sitemap
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Alle HTML-Dateien finden
    html_files = glob.glob(os.path.join(html_dir, "*.html"))
    
    # Prioritäten für verschiedene Seitentypen
    priorities = {
        'index.html': '1.0',
        'listplace.html': '0.9',
        'gesamt.html': '0.8',
        'uebersicht.html': '0.8',
        'jahr.html': '0.7',
        'monat.html': '0.7',
        'dekade.html': '0.7',
        '404.html': '0.1'  # Niedrigste Priorität für 404-Seite
    }
    
    # Änderungsfrequenzen
    change_frequencies = {
        'index.html': 'weekly',
        'listplace.html': 'monthly', 
        'gesamt.html': 'monthly',
        'uebersicht.html': 'monthly',
        'jahr.html': 'yearly',
        'monat.html': 'yearly',
        'dekade.html': 'yearly',
        'impressum.html': 'yearly',
        'kontakt.html': 'yearly',
        '404.html': 'never'
    }
    
    # Aktuelles Datum für lastmod
    current_date = datetime.now().strftime('%Y-%m-%d')
    
    # URLs hinzufügen
    for html_file in sorted(html_files):
        filename = os.path.basename(html_file)
        
        # 404-Seite nicht in Sitemap aufnehmen
        if filename == '404.html':
            continue
            
        # URL-Element erstellen
        url = SubElement(urlset, 'url')
        
        # Vollständige URL
        loc = SubElement(url, 'loc')
        loc.text = f"{base_url}/{filename}"
        
        # Letzte Änderung
        lastmod = SubElement(url, 'lastmod')
        lastmod.text = current_date
        
        # Änderungsfrequenz
        changefreq = SubElement(url, 'changefreq')
        changefreq.text = change_frequencies.get(filename, 'monthly')
        
        # Priorität
        priority = SubElement(url, 'priority')
        priority.text = priorities.get(filename, '0.6')
    
    # PMB-Seiten hinzufügen (falls vorhanden)
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
    print(f"📊 {len(html_files)} HTML-Dateien verarbeitet")
    print(f"🔗 Basis-URL: {base_url}")
    
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