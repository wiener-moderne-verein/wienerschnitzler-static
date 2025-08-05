<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:local="http://dse-static.foo.bar" version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:include href="./partials/shared.xsl"/>
    <xsl:include href="./partials/html_navbar.xsl"/>
    <xsl:include href="./partials/html_head.xsl"/>
    <xsl:include href="./partials/html_footer.xsl"/>
    <xsl:template match="/">
        <html lang="de" class="h-100">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                <xsl:variable name="doc_title">
                    <xsl:text>Wiener Schnitzler</xsl:text>
                </xsl:variable>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                </xsl:call-template>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4">
                        <h1>Anzahl der Aufenthalte Schnitzlers</h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="accordion" id="filterAccordion">
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingLegend">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseLegend"
                                                aria-expanded="false" aria-controls="collapseLegend"
                                                > Legende </button>
                                        </h2>
                                        <div id="collapseLegend" class="accordion-collapse collapse"
                                            aria-labelledby="headingLegend"
                                            data-bs-parent="#filterAccordion">
                                            <div class="accordion-body">
                                                <div id="legend-content-placeholder">
                                                  <div id="legend"/>
                                                  <div class="info-text small">
                                                  <p>Die Farbe des Punkts zeigt die Zahl der
                                                  insgesamt nachgewiesenen Aufenthaltstage an diesem
                                                  Ort.</p>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingStayDuration">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseStayDuration"
                                                aria-expanded="false"
                                                aria-controls="collapseStayDuration">
                                                Aufenthaltsdauer </button>
                                        </h2>
                                        <div id="collapseStayDuration"
                                            class="accordion-collapse collapse"
                                            aria-labelledby="headingStayDuration"
                                            data-bs-parent="#filterAccordion">
                                            <div class="accordion-body">
                                                <div class="mb-2">
                                                  <label for="min-input" class="form-label"
                                                  >Mindestaufenthalt (in Tagen):</label>
                                                  <input type="number"
                                                  class="form-control form-control-sm"
                                                  id="min-input" placeholder="min."/>
                                                </div>
                                                <div class="mb-2">
                                                  <label for="max-input" class="form-label"
                                                  >Höchstaufenthalt (in Tagen):</label>
                                                  <input type="number"
                                                  class="form-control form-control-sm"
                                                  id="max-input" placeholder="max."/>
                                                </div>
                                                <button id="update-filter"
                                                  class="btn btn-primary btn-sm mt-2"
                                                  >Anwenden</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingTimeFilter">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTimeFilter"
                                                aria-expanded="false"
                                                aria-controls="collapseTimeFilter"> Zeitraum (Jahre)
                                            </button>
                                        </h2>
                                        <div id="collapseTimeFilter"
                                            class="accordion-collapse collapse"
                                            aria-labelledby="headingTimeFilter"
                                            data-bs-parent="#filterAccordion">
                                            <div class="accordion-body">
                                                <div id="filter-time-content-placeholder">
                                                  <div id="filter-time"> </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id="headingLocationInfo">
                                                <button class="accordion-button collapsed"
                                                  type="button" data-bs-toggle="collapse"
                                                  data-bs-target="#collapseLocationInfo"
                                                  aria-expanded="false"
                                                  aria-controls="collapseLocationInfo"> Ortsauswahl
                                                </button>
                                            </h2>
                                            <div id="collapseLocationInfo"
                                                class="accordion-collapse collapse"
                                                aria-labelledby="headingLocationInfo"
                                                data-bs-parent="#filterAccordion">
                                                <div class="accordion-body">
                                                  <div class="mb-3">
                                                  <label for="location-select" class="form-label"
                                                  >Ort auswählen:</label>
                                                  <select id="location-select"
                                                  class="form-select form-select-sm">
                                                  <option value="" disabled="true">Wähle einen
                                                  Ort</option>
                                                  </select>
                                                  <div class="info-text small">
                                                  <p>Das Auswahlfeld mit den Ortsnamen löst
                                                  Verschiebungen des Mittelpunkts und
                                                  Auswahlbereichs der Karte aus.</p>
                                                  </div>
                                                  </div>
                                                </div>
                                            </div>
                                            <div class="info-text small mt-3">
                                                <p>Auf dieser Seite werden alle Tage visualisiert,
                                                  an denen sich Schnitzler an einem bestimmten Ort
                                                  aufhielt. Durch die Auswahl eines Punktes werden
                                                  genauere Informationen und Links angezeigt.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script type="module" src="./js/script_gesamt.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
