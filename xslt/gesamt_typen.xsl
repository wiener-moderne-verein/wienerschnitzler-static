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
        <html class="h-100">
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
                        <h1>Aufenthalte Schnitzlers nach Arten von Orten</h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="accordion" id="filterAccordion">
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
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingTypeFilter">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTypeFilter"
                                                aria-expanded="false"
                                                aria-controls="collapseTypeFilter"> Typen </button>
                                        </h2>
                                        <div id="collapseTypeFilter"
                                            class="accordion-collapse collapse"
                                            aria-labelledby="headingTypeFilter"
                                            data-bs-parent="#filterAccordion">
                                            <div class="accordion-body">
                                                <div id="filter-type-content-placeholder">
                                                  <div id="filter-type"> </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="accordion-item">
                                        <h2 class="accordion-header" id="headingLocationInfo">
                                            <button class="accordion-button collapsed" type="button"
                                                data-bs-toggle="collapse"
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
                                    </div>
                                </div>
                                <div class="info-text small mt-3">
                                    <p class="text-start">Auf dieser Seite werden die
                                        Aufenthaltsorte nach Arten von Orten visualisiert. Manche
                                        Orte lassen sich nicht ausreichend sauber voneinander
                                        unterscheiden (»Café-Restaurant«). Im Zweifel empfiehlt
                                        sich, besser großzügig ähnliche Typen auszuwählen.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script src="./js/fuer-alle-karten.js"/>
                <script src="./js/filter_jahre.js"/>
                <script src="./js/filter_typ.js"/>
                <script src="./js/script_gesamt_typen.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
