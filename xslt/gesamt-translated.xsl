<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:local="http://dse-static.foo.bar" version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:import href="./partials/shared.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:import href="./partials/js_translations.xsl"/>
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <html class="h-100">
            <xsl:attribute name="lang">
                <xsl:value-of select="$language"/>
            </xsl:attribute>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                <xsl:variable name="doc_title" select="local:translate('gesamt.title')"/>
                <xsl:variable name="doc_description" select="local:translate('gesamt.meta_description')"/>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/gesamt.html')"/>
                </xsl:call-template>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1><xsl:value-of select="local:translate('gesamt.heading')"/></h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="mb-4">
                                    <h3 class="h5 mb-2"><xsl:value-of select="local:translate('gesamt.legend_title')"/></h3>
                                    <div id="legend"/>
                                    <div class="info-text small mt-2">
                                        <p><xsl:value-of select="local:translate('gesamt.legend_info')"/></p>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <h3 class="h5 mb-2"><xsl:value-of select="local:translate('gesamt.filter_time')"/></h3>
                                    <div id="filter-time"> </div>
                                </div>
                                <div class="mb-4">
                                    <h3 class="h5 mb-2"><xsl:value-of select="local:translate('gesamt.location_select_title')"/></h3>
                                    <div class="mb-3">
                                        <label for="location-select" class="form-label">
                                            <xsl:value-of select="local:translate('gesamt.location_select_label')"/>
                                        </label>
                                        <select id="location-select" class="form-select form-select-sm">
                                            <option value="" disabled="true">
                                                <xsl:value-of select="local:translate('gesamt.location_select_placeholder')"/>
                                            </option>
                                        </select>
                                        <div class="info-text small">
                                            <p><xsl:value-of select="local:translate('gesamt.location_select_info')"/></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="info-text small mt-3">
                                    <p><xsl:value-of select="local:translate('gesamt.page_info')"/></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="js_translations"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script type="module" src="./js/script_gesamt.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
