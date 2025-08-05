<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
   xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar" version="2.0"
   exclude-result-prefixes="xsl tei xs local">
   <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
      omit-xml-declaration="yes"/>
   <xsl:import href="./partials/html_head.xsl"/>
   <xsl:import href="./partials/html_navbar.xsl"/>
   <xsl:import href="./partials/html_footer.xsl"/>
   <xsl:template match="/">
      <html class="h-100">
         <head>
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
                  <h4>Eine geografische Verortung durch Martin Anton Müller und Laura Untner</h4>
                  <!-- Rechte Spalte für das Bild (wird zuerst angezeigt auf kleinen Bildschirmen) -->
                  <div class="col-md-6 order-2 order-md-1">
                     <div class="image-container">
                        <img id="background-image" class="background"
                           src="./images/wienmuseum/AnsichtenVonWien00001.jpg" alt="Historische Ansicht von Wien aus dem Wiener Museum"/>
                        <img id="foreground-image" class="foreground"
                           src="./images/schnitzler-index2.png"
                           alt="Digitaler Avatar von Arthur Schnitzler vor Wien-Kulisse"/>
                     </div>
                  </div>
                  <!-- Linke Spalte für den Text -->
                  <div class="col-md-6 order-1 order-md-2">
                     <p class="lead">Arthur Schnitzler wurde 1862 in Wien in der Praterstraße
                        geboren und starb 1931 in der Sternwartestraße, kaum zehn Kilometer
                        entfernt. Er verfasste erfolgreiche Dramen, Romane und Erzählungen, die
                        meist in Wien angesiedelt sind. Die Stadt verließ er nur für Reisen und
                        Sommeraufenthalte. Dank seines <a
                           href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank" class="schnitzler-tagebuch-link"
                           >Tagebuchs</a>, seiner <a
                           href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank"
                           class="schnitzler-briefe-link"
                           >Korrespondenz</a> und weiterer Dokumente verzeichnen wir derzeit über
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
                        <a href="gesamt.html">
                           <img src="images/index/aufenthaltstage.png" class="card-img-top"
                              alt="Kartenansicht der Aufenthaltstage Schnitzlers"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">An welchen Orten hielt sich Schnitzler am häufigsten
                              auf? Eine Karte nach <a href="gesamt.html">Aufenthaltstagen</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="gesamt_typen.html">
                           <img src="images/index/aufenthaltstypen.png" class="card-img-top"
                              alt="Kartenansicht verschiedener Aufenthaltstypen"/>
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
                        <a href="listplace.html">
                           <img src="images/index/aufenthaltsorte.png" class="card-img-top"
                              alt="Verzeichnis aller Aufenthaltsorte mit Details"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Schlagen Sie <a href="listplace.html"
                                 >Aufenthaltsorte</a> und ihre Bewohner_innen nach. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="listplace-missing.html">
                           <img src="images/index/fehlend.png" class="card-img-top"
                              alt="Liste noch nicht identifizierter Orte"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Nicht immer wurden wir fündig. Hier sind derzeit <a
                                 href="listplace-missing.html">nicht identifizierte Orte</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="schnitzler-und-ich.html">
                           <img src="images/index/schnitzlerundich.png" class="card-img-top"
                              alt="Interaktive Karte - wo Ihnen Schnitzler am nächsten war"/>
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
                        <a href="tag.html">
                           <img src="images/index/aufenthaltstag.png" class="card-img-top"
                              alt="Kartenansicht für einzelne Tage"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Für jeden einzelnen <a href="tag.html">Tag</a> gibt
                              es eine eigene Karte. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="monat.html">
                           <img src="images/index/aufenthaltsmonat.png" class="card-img-top"
                              alt="Kartenansicht für Kalendermonate"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Auch <a href="monat.html">Kalendermonate</a> können
                              visualisiert werden. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="jahr.html">
                           <img src="images/index/aufenthaltsjahr.png" class="card-img-top"
                              alt="Kartenansicht für bestimmte Jahre"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wo war Schnitzler in einem bestimmten <a
                                 href="jahr.html">Jahr</a>?</p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="dekade.html">
                           <img src="images/index/aufenthaltsdekade.png" class="card-img-top"
                              alt="Kartenansicht für verschiedene Dekaden"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Schnitzlers Verweilorte in den einzelnen <a href="dekade.html">Dekaden</a>.
                           </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="ueberblick.html">
                           <img src="images/index/uebersicht.png" class="card-img-top"
                              alt="Übersicht über bekannte Standorte pro Tag"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wie viele Standorte an bestimmten Tagen kennen wir?
                              Eine <a href="uebersicht.html">Übersicht</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="zeitleiste.html">
                           <img src="images/index/zeitleiste.png" class="card-img-top"
                              alt="Chronologische Zeitleiste der besuchten Orte"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Die <a href="zeitleiste.html">Zeitleiste</a> zeigt
                              die besuchten Orte chronologisch. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank">
                           <img src="images/index/keplergl.png" class="card-img-top"
                              alt="Kepler.gl interaktive Datenvisualisierung"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Eigene Ansichten der Daten können schnell mit  
                              <a href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank">kepler.gl</a> erzeugt werden.</p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank">
                           <img src="images/index/github.png" class="card-img-top"
                              alt="GitHub Repository mit allen Quelldaten"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Für Menschen mit ausgeprägtem Spielbedürfnis: Alle Quelldaten stehen auf
                               <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank">GitHub</a> zur freien 
                              Verfügung. </p>
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
