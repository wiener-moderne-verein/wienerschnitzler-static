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
                        <h1>Tag für Tag</h1>
                        <div
                            class="controls d-flex justify-content-between align-items-center mb-3 gap-3">
                            <div class="d-flex justify-content-start">
                                <button id="prev-day" class="btn btn-secondary  btn-navigation">
                                    <i class="bi bi-arrow-left-circle"/>
                                </button>
                            </div>
                            <div class="d-flex center-content-start">
                                <input type="date" id="date-input" class="form-control w-auto"/>
                            </div>
                            
                            <div class="d-flex justify-content-end">
                                <button id="next-day" class="btn btn-secondary  btn-navigation">
                                    <i class="bi bi-arrow-right-circle"/>
                                </button>
                            </div>
                        </div>
                        <!-- Map -->
                        <div id="map"/>
                        <div class="d-flex justify-content-center mt-5">
                            <div class="col-sm-6 mb-5">
                                <div class="text-start mx-auto">
                                    <div id="map-inhalt-text"/>
                                </div>
                                <div class="text-start mx-auto">
                                    <!-- Oberer Text -->
                                    <p class="text-start text-muted small"> Auf dieser Seite werden
                                        die einzelnen Tage in Schnitzlers Leben visualisiert. <span
                                            class="fw-bold text-danger">Achtung</span>: Die
                                        Verbindungslinie zwischen den Orten macht den geografischen
                                        Raum besser sichtbar. Sie stellt nicht die Reihenfolge dar,
                                        in der die Orte aufgesucht wurden. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script src="./js/mapUtils.js"/>
                <script src="./js/script_tag.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
