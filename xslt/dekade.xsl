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
                        <h1>Dekade</h1>
                        <div
                            class="controls d-flex justify-content-between align-items-center mb-3 gap-3">
                            <div class="d-flex justify-content-start">
                                <button id="prev-decade" class="btn btn-secondary  btn-navigation">
                                    <i class="bi bi-arrow-left-circle"/>
                                </button>
                            </div>
                            <div class="d-flex center-content-start">
                                <select id="decade-input"> </select>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button id="next-decade" class="btn btn-secondary  btn-navigation">
                                    <i class="bi bi-arrow-right-circle"/>
                                </button>
                            </div>
                        </div>
                        <div id="map"/>
                        <div id="legend" class="mt-5"
                            style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                            <span style="margin: 10px; font-weight: bold">Aufenthaltstage:</span>
                        </div>
                        <div class="d-flex justify-content-center mt-5">
                            <div class="col-sm-6 mb-5">
                                <div class="text-start mx-auto">
                                    <p class="text-start">Auf dieser Seite werden Dekaden in
                                        Schnitzlers Leben visualisiert. Durch die Auswahl eines
                                        Punktes werden die jeweiligen Aufenthaltstage innerhalb
                                        desselben angezeigt.</p>
                                </div>
                                <p>
                                    <!-- In Deinem HTML -->
                                    <div class="form-check form-switch">
                                        <!-- Ohne checked-Attribut ist der Schalter standardmäßig ausgeschaltet -->
                                        <input class="form-check-input" type="checkbox"
                                            id="lineToggle"/>
                                        <label class="form-check-label" form="lineToggle">
                                            <span id="lineToggleIcon" class="fs-5"
                                                title="Schaltet die Linie ein oder aus"/>
                                            <!-- Standard: Linie ausgeschaltet, also X anzeigen -->
                                            <b>Verbindungslinie</b> ein-/ausschalten. Sie folgt den einzelnen Tagen, ist aber innerhalb eines
                                            Tages <span class="fw-bold text-danger"
                                                >nicht</span> chronologisch geordnet. </label>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script src="./js/fuer-alle-karten.js"/>
                <script src="./js/linie-anzeigen.js"/>
                <script src="./js/filter_dauer.js"/>
                <script src="./js/script_dekade.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
