<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="partials/html_footer.xsl"/>
    <xsl:template match="/">
        <html class="h-100">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="'Ortung'"/>
                </xsl:call-template>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main>
                    <div class="container col-12" style="max-width:800px">
                        <div id="map"/>
                        <h1>Wann war Ihnen Schnitzler am nächsten?</h1>
                        <div class="container mt-4">
                            <div class="container mt-4">
                                <div class="row align-items-start">
                                    <!-- Linke Spalte: Button für Standort -->
                                    <div class="col-md-6 mb-3 d-flex flex-column justify-content-between">
                                        <button id="getLocation" class="btn btn-primary w-100">Meinen Standort verwenden</button>
                                    </div>
                                    
                                    <!-- Rechte Spalte: Formular für Koordinaten -->
                                    <div class="col-md-6 d-flex flex-column justify-content-between">
                                        <p>Oder Koordinaten eingeben:</p>
                                        <form id="locationForm">
                                            <div class="mb-3">
                                                <label for="latitude" class="form-label">Breitengrad:</label>
                                                <input type="number" id="latitude" class="form-control" step="0.000001" required="required" />
                                            </div>
                                            <div class="mb-3">
                                                <label for="longitude" class="form-label">Längengrad:</label>
                                                <input type="number" id="longitude" class="form-control" step="0.000001" required="required" />
                                            </div>
                                            <button type="submit" class="btn btn-secondary w-100">Nächsten Ort finden</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="col-md-6">
                        <h2>Ergebnis:</h2>
                        <p id="result">Bitte Standort teilen auswählen oder Koordinaten eingeben. (Nein, wir interessieren uns nicht für Ihre Daten.)</p>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
            <script type="text/javascript" src="js/ortung.js"/>
        </html>
    </xsl:template>
</xsl:stylesheet>
