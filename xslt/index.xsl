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
                  <h4>Eine geografische Verortung durch Martin Anton Müller und Laura Untner</h4>
                  <!-- Rechte Spalte für das Bild (wird zuerst angezeigt auf kleinen Bildschirmen) -->
                  <div class="col-md-6 order-2 order-md-1">
                     <div class="image-container">
                        <img id="background-image" class="background"
                           src="./images/wienmuseum/AnsichtenVonWien00001.jpg" alt="Hintergrund"/>
                        <img id="foreground-image" class="foreground"
                           src="./images/schnitzler-index2.png"
                           alt="Arthur Schnitzler als digitalen Avatar"/>
                     </div>
                  </div>
                  <!-- Linke Spalte für den Text -->
                  <div class="col-md-6 order-1 order-md-2">
                     <p class="lead">Arthur Schnitzler wurde 1862 in Wien in der Praterstraße
                        geboren und starb 1931 in der Sternwartestraße, kaum zehn Kilometer
                        entfernt. Er verfasste erfolgreiche Dramen, Romane und Erzählungen, die
                        meist in Wien angesiedelt sind. Die Stadt verließ er nur für Reisen und
                        Sommeraufenthalte. Dank seines <a
                           href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank"
                           style="color: #037A33; font-weight: bold; text-decoration: none;"
                           >Tagebuchs</a>, seiner <a
                           href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank"
                           style="color: #A63437; font-weight: bold; text-decoration: none;"
                           >Korrespondenz</a> und weiterer Dokumente verzeichnen wir derzeit über
                        44.500 Aufenthalte an über 4.200 Orten. Gegenwärtig gibt es für keine andere
                        Person seiner Zeit so viele frei verfügbare und georeferenzierte Daten.
                        Diese zeigen, wo Schnitzler sich bewegte, welche Häuser, Straßen,
                        Stadtteile, Städte und Länder er kannte und welche ihm wichtig waren.
                      Zugleich sieht man, wo
                        er sich nie aufhielt.</p>
                     <p>Die Detailtiefe der derzeit erfassten Daten variiert. Die Durchsicht
                        des Tagebuchs für den Zeitraum 1919–1923 ist im Gange.</p>
                  </div>
               </div>
            </div>

            <section class="container my-5">
               <div class="row g-3">
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="gesamt.html">
                           <img src="images/index/aufenthaltstage.png" class="card-img-top"
                              alt="Aufenthaltstage"/>
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
                              alt="Aufenthaltstypen"/>
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
                              alt="Aufenthaltsorte"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Schlagen sie <a href="listplace.html"
                                 >Aufenthaltsorte</a> und ihre Bewohner_innen nach. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="listplace-missing.html">
                           <img src="images/index/fehlend.png" class="card-img-top"
                              alt="Nicht indentifizierte Orte"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Nicht immer wurden wir fündig. Hier derzeit <a
                                 href="listplace-missing.html">nicht indentifizierte Orte</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="schnitzler-und-ich.html">
                           <img src="images/index/schnitzlerundich.png" class="card-img-top"
                              alt="Schnitzler und ich"/>
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
                              alt="Aufenthaltstag"/>
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
                              alt="Aufenthaltsmonate"/>
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
                              alt="Aufenthalstjahre"/>
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
                              alt="Aufenthalsdekade"/>
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
                              alt="Übersicht"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Wie viele Standorte an bestimmten Tagen kennen wir?
                              Eine <a href="ueberblick.html">Übersicht</a>. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="zeitleiste.html">
                           <img src="images/index/zeitleiste.png" class="card-img-top"
                              alt="Übersicht"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Die <a href="zeitleiste.html">Zeitleiste</a> zeigt
                              die besuchten Orte chronologisch. </p>
                        </div>
                     </div>
                  </div>
                  <div class="col-12 col-md-6 col-lg-3">
                     <div class="card content-item">
                        <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank">
                           <img src="images/index/github.png" class="card-img-top"
                              alt="Übersicht"/>
                        </a>
                        <div class="card-body">
                           <p class="card-text">Alle Quelldaten stehen auf
                               <a href="https://github.com/wiener-moderne-verein/wienerschnitzler-data" target="_blank">gitHub</a> zur freien 
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
