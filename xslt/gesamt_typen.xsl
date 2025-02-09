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
                        <h1>Ortstypen</h1>
                        
                        <div id="map-large"/>
                        <div id="filter-time" class="mt-5"
                            style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                            <span style="margin: 10px; font-weight: bold">Zeitraum</span>
                        </div>
                        <div id="filter-type" class="mt-5"
                            style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                            <span style="margin: 10px; font-weight: bold">Typen</span>
                        </div>
                        <div class="d-flex justify-content-center mt-5">
                            <div class="col-sm-6 mb-5">
                                <div class="text-start mx-auto">
                                    <p class="text-start">Auf dieser Seite werden die Aufenthaltsorte nach
                                    Arten von Orten visualisiert. Manche Orte lassen sich nicht ausreichend
                                    sauber voneinander unterscheiden (»Café-Restaurant«). Im Zweifel empfiehlt
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
