<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
   xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar" version="2.0"
   exclude-result-prefixes="xsl tei xs local">
   <xsl:import href="./partials/html_head.xsl"/>
   <xsl:import href="./partials/html_navbar.xsl"/>
   <xsl:import href="./partials/html_footer.xsl"/>
   <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
      omit-xml-declaration="yes"/>
   <xsl:template match="/">
      <html lang="de" class="h-100">
         <head>
            <xsl:variable name="doc_title">
               <xsl:text>Wiener Schnitzler – Schnitzlers Wien | Digitale Karte seiner Aufenthaltsorte</xsl:text>
            </xsl:variable>
            <xsl:variable name="doc_description">
               <xsl:text>Digitale Karte von Arthur Schnitzlers Aufenthalten in Wien (1862-1931). Über 47.000 georeferenzierte Aufenthalte an knapp 4950 Orten basierend auf Tagebuch und Korrespondenz. Ein Digital Humanities Projekt zur geografischen Verortung seiner Wege durch die Stadt.</xsl:text>
            </xsl:variable>
            <xsl:call-template name="html_head">
               <xsl:with-param name="html_title" select="$doc_title"/>
               <xsl:with-param name="page_description" select="$doc_description"/>
            </xsl:call-template>
            <meta name="keywords" content="Arthur Schnitzler, Wien, Karte, Digital Humanities, Geolokalisierung, Literatur, Tagebuch, Georeferenzierung, Wiener Moderne, Kartierung"/>
         </head>
         <body>
            <!-- Navbar -->
            <xsl:call-template name="nav_bar"/>
            <main role="main">
            <div class="container mt-5" id="main-content">
               <div class="row">
                  <h1>Wiener Schnitzler – Schnitzlers Wien</h1>
                  <h2 class="fs-4 text-center">Eine geografische Verortung durch Martin Anton Müller und Laura Untner</h2>
                  <!-- Rechte Spalte für das Bild (wird zuerst angezeigt auf kleinen Bildschirmen) -->
                  <div class="col-md-6 order-2 order-md-1">
                     <div class="image-container">
                        <img id="background-image" class="background"
                           src="./images/wienmuseum/AnsichtenVonWien00001.jpg" alt="Historische Schwarzweiß-Ansicht von Wien, etwa um 1900, mit Blick auf die Innenstadt und Donaukanal" loading="lazy"/>
                        <img id="foreground-image" class="foreground"
                           src="./images/schnitzler-index2.png"
                           alt="Stilisierte Silhouette von Arthur Schnitzler mit Hut und Brille vor historischer Wien-Kulisse" loading="lazy"/>
                     </div>
                  </div>
                  <!-- Linke Spalte für den Text -->
                  <div class="col-md-6 order-1 order-md-2">
                     <p class="lead">Arthur Schnitzler wurde 1862 in Wien in der Praterstraße
                        geboren und starb 1931 in der Sternwartestraße, kaum zehn Kilometer
                        entfernt. Er verfasste erfolgreiche Dramen, Romane und Erzählungen, die
                        meist in Wien angesiedelt sind. Die Stadt verließ er nur für Reisen und
                        Sommeraufenthalte. Dank seines <a
                           href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" class="schnitzler-tagebuch-link"
                           aria-label="Schnitzler Tagebuch - öffnet in neuem Fenster">Tagebuchs</a>, seiner <a
                           href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer"
                           class="schnitzler-briefe-link"
                           aria-label="Schnitzler Briefe - öffnet in neuem Fenster">Korrespondenz</a> und weiterer Dokumente verzeichnen wir derzeit über
                        47.000 Aufenthalte an knapp 4950 Orten. Gegenwärtig gibt es für keine andere
                        Person seiner Zeit so viele frei verfügbare und georeferenzierte Daten.
                        Diese zeigen, wo Schnitzler sich bewegte, welche Häuser, Straßen,
                        Stadtteile, Städte und Länder er kannte und welche ihm wichtig waren.
                      Zugleich sieht man, wo
                        er sich nie aufhielt.</p>
                  </div>
               </div>
            </div>

            <section class="container my-5">
               <div class="row g-3">
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="gesamt.html" aria-label="Zur Karte der Aufenthaltstage">
                           <img src="images/index/aufenthaltstage.png" class="card-img-top"
                              alt="Interaktive Karte mit farbigen Punkten zeigt Häufigkeit der Aufenthalte Schnitzlers an verschiedenen Orten" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">An welchen Orten hielt sich Schnitzler am häufigsten
                              auf? Eine Karte nach <a href="gesamt.html">Aufenthaltstagen</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="gesamt_typen.html" aria-label="Zu den Aufenthaltstypen">
                           <img src="images/index/aufenthaltstypen.png" class="card-img-top"
                              alt="Karte mit Filter-Optionen nach Ortstypen wie Museum, Theater, Café, Wohnung oder Park" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">In welchen Museen war Schnitzler? Eine schnelle
                              Antwort gibt es bei den <a href="gesamt_typen.html"
                                 >Aufenthaltstypen</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="listplace.html" aria-label="Zum Ortsverzeichnis">
                           <img src="images/index/aufenthaltsorte.png" class="card-img-top"
                              alt="Tabellarische Auflistung aller Orte mit Namen, Koordinaten, Aufenthaltstagen und bekannten Bewohnern" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Schlagen Sie Aufenthaltsorte und ihre Bewohner_innen im
                              <a href="listplace.html"
                                 >Verzeichnis</a> nach. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="listplace-missing.html" aria-label="Zu den nicht identifizierten Orten">
                           <img src="images/index/fehlend.png" class="card-img-top"
                              alt="Liste von Ortsnamen aus Tagebuch und Briefen, die noch keiner geografischen Position zugeordnet werden konnten" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Nicht immer wurden wir fündig. Hier sind derzeit <a
                                 href="listplace-missing.html">nicht identifizierte Orte</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="schnitzler-und-ich.html" aria-label="Zu Schnitzler und ich">
                           <img src="images/index/schnitzlerundich.png" class="card-img-top"
                              alt="Interaktive Funktion zur Berechnung, an welchem Ort Ihnen Schnitzler zeitlich am nächsten war" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wo Ihnen Schnitzler am nächsten stand, lässt sich
                              über <a href="schnitzler-und-ich.html">Schnitzler und ich</a>
                              abfragen. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="tag.html" aria-label="Zur Tagesansicht">
                           <img src="images/index/aufenthaltstag.png" class="card-img-top"
                              alt="Datumsauswahl zur Anzeige aller Aufenthaltsorte an einem bestimmten Tag" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Für jeden <a href="tag.html">einzelnen Tag</a> gibt
                              es eine eigene Karte. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="monat.html" aria-label="Zur Monatsansicht">
                           <img src="images/index/aufenthaltsmonat.png" class="card-img-top"
                              alt="Kalenderauswahl zur Visualisierung aller Orte eines bestimmten Monats über alle Jahre hinweg" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Auch <a href="monat.html">Monate</a> des Kalenders können
                              visualisiert werden. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="jahr.html" aria-label="Zur Jahresansicht">
                           <img src="images/index/aufenthaltsjahr.png" class="card-img-top"
                              alt="Jahresauswahl zwischen 1862 und 1931 zur Anzeige aller Aufenthaltsorte eines bestimmten Jahres" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wo war Schnitzler in einem bestimmten <a
                                 href="jahr.html">Jahr</a>?</p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="dekade.html" aria-label="Zur Dekadenansicht">
                           <img src="images/index/aufenthaltsdekade.png" class="card-img-top"
                              alt="Auswahl nach Jahrzehnten zur Darstellung von Schnitzlers Reiseverhalten in verschiedenen Lebensabschnitten" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Schnitzlers Verweilorte in den einzelnen <a href="dekade.html">Dekaden</a>.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="uebersicht.html" aria-label="Zur Datenübersicht">
                           <img src="images/index/uebersicht.png" class="card-img-top"
                              alt="Diagramm zeigt zeitliche Verteilung der bekannten Aufenthaltsorte und Datendichte über die Jahre" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wie viele Standorte an bestimmten Tagen kennen wir?
                              Eine <a href="uebersicht.html">Übersicht</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="zeitleiste.html" aria-label="Zur Zeitleiste">
                           <img src="images/index/zeitleiste.png" class="card-img-top"
                              alt="Chronologische Zeitleiste zeigt Aufenthaltsorte entlang einer Zeitachse von 1862 bis 1931" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Die <a href="zeitleiste.html">Zeitleiste</a> zeigt
                              die besuchten Orte chronologisch. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank" rel="noopener noreferrer" aria-label="Kepler.gl Karte - öffnet in neuem Fenster">
                           <img src="images/index/keplergl.png" class="card-img-top"
                              alt="Screenshot der Kepler.gl Web-Anwendung zur freien Datenexploration und -visualisierung" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Eigene Ansichten der Daten können schnell mit
                              <a href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank" rel="noopener noreferrer" aria-label="Kepler.gl Karte - öffnet in neuem Fenster">kepler.gl</a> erzeugt werden.</p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository - öffnet in neuem Fenster">
                           <img src="images/index/github.png" class="card-img-top"
                              alt="GitHub Logo - Link zum öffentlichen Code-Repository mit TEI-XML Daten und GeoJSON Dateien" loading="lazy"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Für Menschen mit ausgeprägtem Spielbedürfnis: Alle Quelldaten stehen auf
                               <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository - öffnet in neuem Fenster">GitHub</a> zur freien
                              Verfügung. </p>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </section>
            </main>



            <!-- Footer -->
            <xsl:call-template name="html_footer"/>
            <script src="./js/index_randomBackground.js"/>
         </body>
      </html>
   </xsl:template>
</xsl:stylesheet>
