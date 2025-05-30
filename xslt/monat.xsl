<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:local="http://dse-static.foo.bar" version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/shared.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
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
                        <h1>Monate</h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="controls mb-3">
                                    <div
                                        class="d-flex justify-content-between align-items-center mb-3">
                                        <button id="prev-day"
                                            class="btn btn-secondary btn-navigation">
                                            <i class="bi bi-arrow-left-circle"/>
                                        </button>
                                        <button id="next-day"
                                            class="btn btn-secondary btn-navigation">
                                            <i class="bi bi-arrow-right-circle"/>
                                        </button>
                                    </div>
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2">
                                        <select id="month-select" class="form-select w-auto"
                                            aria-label="Monat auswählen">
                                            <option value="01">Jänner</option>
                                            <option value="02">Feber</option>
                                            <option value="03">März</option>
                                            <option value="04">April</option>
                                            <option value="05">Mai</option>
                                            <option value="06">Juni</option>
                                            <option value="07">Juli</option>
                                            <option value="08">August</option>
                                            <option value="09">September</option>
                                            <option value="10">Oktober</option>
                                            <option value="11">November</option>
                                            <option value="12">Dezember</option>
                                        </select>
                                        <select id="year-select" class="form-select w-auto"
                                            aria-label="Jahr auswählen">
                                            <option value="" selected="true" disabled="false"
                                                >Jahr...</option>
                                        </select>
                                    </div>
                                    
                                </div>
                                <p>
                                    <b>Zahl der Aufenthaltstage (Legende):</b>
                                </p>
                                <div id="legend" 
                                    style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                                    <span style="margin: 10px; font-weight: bold"
                                        >Aufenthaltstage:</span>
                                </div>
                                <p
                                    >
                                    <!-- In Deinem HTML -->
                                    <div class="form-check form-switch">
                                        <!-- Ohne checked-Attribut ist der Schalter standardmäßig ausgeschaltet -->
                                        <input class="form-check-input" type="checkbox"
                                            id="lineToggle"/>
                                        <label class="form-check-label" for="lineToggle">
                                            <span id="lineToggleIcon" class="fs-5"
                                                title="Schaltet die Linie ein oder aus"/>
                                            <!-- Standard: Linie ausgeschaltet, also X anzeigen -->
                                            <b>Verbindungslinie</b> ein-/ausschalten. Sie folgt den
                                            einzelnen Tagen, ist aber innerhalb eines Tages <span
                                                class="fw-bold text-danger">nicht</span>
                                            chronologisch geordnet. </label>
                                    </div>
                                </p>
                                <p class="text-start text-muted small">Auf dieser Seite werden
                                    einzelne Monate in Schnitzlers Leben visualisiert. Durch die
                                    Auswahl eines Punktes werden die jeweiligen Aufenthaltstage
                                    innerhalb des Monats angezeigt.</p>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script type="module" src="./js/script_monat.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
