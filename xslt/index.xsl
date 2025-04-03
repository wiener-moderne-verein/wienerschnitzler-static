<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
   xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar"
   version="2.0" exclude-result-prefixes="xsl tei xs local">
   <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
      omit-xml-declaration="yes"/>
   <xsl:import href="./partials/html_head.xsl"/>
   <xsl:import href="./partials/html_navbar.xsl"/>
   <xsl:import href="./partials/html_footer.xsl"/>
   <xsl:template match="/">
      <html class="h-100">
         <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <xsl:variable name="doc_title">
               <xsl:text>Wiener Schnitzler</xsl:text>
            </xsl:variable>
            <xsl:call-template name="html_head">
               <xsl:with-param name="html_title" select="$doc_title"/>
            </xsl:call-template>
         </head>
         <body>
            <!-- Navbar -->
            <xsl:call-template name="nav_bar"/>
            <div class="container mt-5">
               <div class="row">
                  <h1>Wiener Schnitzler – Schnitzlers Wien</h1>
                  <h4>Eine geografische Verortung durch Martin Anton
                     Müller und Laura Untner</h4>
                  <!-- Rechte Spalte für das Bild (wird zuerst angezeigt auf kleinen Bildschirmen) -->
                  <div class="col-md-6 order-2 order-md-1">
                     <div class="image-container">
                        <img id="background-image" class="background"
                           src="./images/wienmuseum/AnsichtenVonWien00001.jpg"
                           alt="Hintergrund"/>
                        <img id="foreground-image" class="foreground"
                           src="./images/schnitzler-index2.png"
                           alt="Arthur Schnitzler als digitalen Avatar"/>
                     </div>
                  </div>
                  <!-- Linke Spalte für den Text -->
                  <div class="col-md-6 order-1 order-md-2">
                     <p class="lead">Arthur Schnitzler wurde 1862 in Wien in der Praterstraße
                        geboren und starb 1931 in der Sternwartestraße, kaum zehn Kilometer
                        entfernt. Er verfasste erfolgreiche Dramen, Romane und Erzählungen,
                        die meist in Wien angesiedelt sind. Die Stadt verließ er nur für
                        Reisen und Sommeraufenthalte. Dank seines <a
                           href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/"
                           target="_blank"
                           style="color: #037A33; font-weight: bold; text-decoration: none;"
                           >Tagebuchs</a>, seiner <a
                              href="https://schnitzler-briefe.acdh.oeaw.ac.at/"
                              target="_blank"
                              style="color: #A63437; font-weight: bold; text-decoration: none;"
                              >Korrespondenz</a> und weiterer Dokumente verzeichnen wir
                        derzeit über 44.000 Aufenthalte an über 4.200 Orten. Gegenwärtig
                        gibt es für keine andere Person seiner Zeit so viele frei verfügbare
                        und georeferenzierte Daten. Diese zeigen, wo Schnitzler sich
                        bewegte, welche Häuser, Straßen, Stadtteile, Städte und Länder er
                        kannte und welche ihm wichtig waren. Zugleich wird auch sichtbar, wo
                        er sich nie aufhielt.</p>
                     <p>Die Detailtiefe der derzeit erfassten Daten variiert. Die Durchsicht
                        des Tagebuchs für den Zeitraum 1918–1923 ist im Gange.</p>
                  </div>
               </div>
            </div>
            
            <section class="container my-5">
               <div class="row g-3">
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltstage.png" class="card-img-top" alt="Aufenthaltstage"/><div class="card-body">
                              <p class="card-text">Die Anzahl der Tage, die Arthur Schnitzler an einem
                                 bestimmten Ort verbrachte, findet sich <a href="gesamt.html">hier</a>.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltsarten.png" class="card-img-top" alt="Aufenthaltsarten"/><div class="card-body">
                              <p class="card-text">In welchen Museen war Schnitzler? Eine schnelle Antwort steht <a href="gesamt_typen.html">hier</a>.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltsorte.png" class="card-img-top" alt="Aufenthaltsorte"/><div class="card-body">
                              <p class="card-text">Bestimmte Orte und ihre Bewohner lassen sich <a href="listplace.html">hier</a> nachschlagen.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/fehlend.png" class="card-img-top" alt="Nicht indentifizierte Orte"/><div class="card-body">
                              <p class="card-text">Nicht immer wurden wir fündig. Die nicht exakt nachgewiesenen Orte sind <a href="listplace-missing.html">hier</a> ausgewiesen.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/schnitzlerundich.png" class="card-img-top" alt="Schnitzler und ich"/><div class="card-body">
                              <p class="card-text">Wo Ihnen Schnitzler am nächsten stand, lässt sich <a href="schnitzler-und-ich.html">hier</a> abfragen.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltstag.png" class="card-img-top" alt="Aufenthaltstag"/><div class="card-body">
                              <p class="card-text">Einzelne Tage sind  <a href="tag.html">hier</a> vermerkt.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltsmonat.png" class="card-img-top" alt="Aufenthaltsmonate"/><div class="card-body">
                              <p class="card-text">Kalendermonate können  <a href="monat.html">hier</a> visualisiert werden.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltsjahr.png" class="card-img-top" alt="Aufenthalstjahre"/><div class="card-body">
                              <p class="card-text">Wo war Schnitzler in einem bestimmten Jahr? Die Antwort steht <a href="jahr.html">hier</a>.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/aufenthaltsdekade.png" class="card-img-top" alt="Aufenthalsdekade"/><div class="card-body">
                              <p class="card-text">1901 bis 1910 und weitere Dekaden sind <a href="dekade.html">hier</a> einsehbar.</p>
                     </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item"><img src="images/index/uebersicht.png" class="card-img-top" alt="Übersicht"/><div class="card-body">
                              <p class="card-text">Wie viele Standorte an bestimmten Tagen kennen wir? Ein Überblick steht  <a href="ueberblick.html">hier</a>.</p>
                     </div>
                     </div>
                  </div>
               </div>
            </section>
            
            
            <!-- Footer -->
            <xsl:call-template name="html_footer"/>
            <script src="./js/index_randomBackground.js"/>
         </body>
      </html>
   </xsl:template>
</xsl:stylesheet>