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
                    <xsl:with-param name="html_title" select="'Arthur Schnitzler und ich'"/>
                    <xsl:with-param name="page_description" select="'Wo stand Ihnen Schnitzler am nächsten? – Finden Sie heraus, welche Orte in Wien Arthur Schnitzler in Ihrer Nähe besucht hat'"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/schnitzler-und-ich.html')"/>
                </xsl:call-template>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1>Wo stand Ihnen Schnitzler am nächsten?</h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column" >
                                <div id="queryControls">
                                        <button id="getLocation" class="btn btn-primary w-100"
                                            >Meinen Standort verwenden</button>
                                    
                                        <p>Oder Koordinaten eingeben:</p>
                                        <form id="locationForm">
                                            <div class="mb-3">
                                                <label for="latitude" class="form-label"
                                                  >Breitengrad:</label>
                                                <input type="number" id="latitude"
                                                  class="form-control" step="0.000001"
                                                  required="required"/>
                                            </div>
                                            <div class="mb-3">
                                                <label for="longitude" class="form-label"
                                                  >Längengrad:</label>
                                                <input type="number" id="longitude"
                                                  class="form-control" step="0.000001"
                                                  required="required"/>
                                            </div>
                                            <button type="submit" class="btn btn-secondary w-100"
                                                >Nächsten Ort finden</button>
                                        </form>
                                </div>
                                <div class="container mt-4">
                                    <h2>Ergebnis:</h2>
                                    <p id="result">Bitte Standort teilen auswählen oder Koordinaten
                                        eingeben. (Nein, wir interessieren uns nicht dafür, wo Sie sich
                                        herumtreiben.)</p>
                                    <p class="mb-2 d-none" id="newQueryContainer">
                                        <button id="newQuery" class="btn btn-secondary">Neuen Ort
                                            abfragen</button>
                                    </p>
                                    <p>
                                        <a id="shareBluesky" target="_blank" title="Share on Bluesky"
                                            href="https://bsky.app/intent/compose?text=https://wienerschnitzler.org/schnitzler-und-ich.html"
                                            rel="noopener noreferrer"
                                            aria-label="Auf Bluesky teilen - öffnet in neuem Fenster">
                                            <span class="share-bluesky">
                                                <svg width="1em" height="1em" fill="#fff"
                                                    viewBox="0 0 600 530"
                                                    xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bluesky Logo">
                                                    <path
                                                        d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
                                                    />
                                                </svg> Bluesky</span>
                                        </a>
                                    </p>
                                </div>
                                </div>
                            
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
            <script type="module" src="js/schnitzler-und-ich.js"/>
        </html>
    </xsl:template>
</xsl:stylesheet>
