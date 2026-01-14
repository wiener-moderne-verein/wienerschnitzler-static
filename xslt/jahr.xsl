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
                <xsl:variable name="doc_title" select="local:translate('jahr.title')"/>
                <xsl:variable name="doc_description" select="local:translate('jahr.meta_description')"/>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/jahr.html')"/>
                </xsl:call-template>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1><xsl:value-of select="local:translate('jahr.heading')"/></h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="controls d-flex justify-content-between align-items-center mb-3">

                                    <button id="prev-year" class="btn btn-secondary btn-navigation">
                                        <xsl:attribute name="aria-label">
                                            <xsl:value-of select="local:translate('jahr.prev_year')"/>
                                        </xsl:attribute>
                                        <i class="bi bi-arrow-left-circle text-white" aria-hidden="true"></i>
                                    </button>

                                    <select id="date-input" class="form-select w-auto">
                                        <xsl:attribute name="aria-label">
                                            <xsl:value-of select="local:translate('jahr.year_select_label')"/>
                                        </xsl:attribute>
                                        <option value="">
                                            <xsl:value-of select="local:translate('jahr.loading')"/>
                                        </option>
                                    </select>

                                    <button id="next-year" class="btn btn-secondary btn-navigation">
                                        <xsl:attribute name="aria-label">
                                            <xsl:value-of select="local:translate('jahr.next_year')"/>
                                        </xsl:attribute>
                                        <i class="bi bi-arrow-right-circle text-white" aria-hidden="true"></i>
                                    </button>
                                    
                                </div>
                                <p>
                                    <b><xsl:value-of select="local:translate('jahr.legend_title')"/></b>
                                </p>
                                <div id="legend"
                                    style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                                    <span style="margin: 10px; font-weight: bold">
                                        <xsl:value-of select="local:translate('jahr.legend_days')"/>
                                    </span>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="lineToggle"/>
                                    <label class="form-check-label" for="lineToggle">
                                        <span id="lineToggleIcon" class="fs-5">
                                            <xsl:attribute name="title">
                                                <xsl:value-of select="local:translate('jahr.toggle_title')"/>
                                            </xsl:attribute>
                                        </span>
                                        <b><xsl:value-of select="local:translate('jahr.connection_line')"/></b>
                                    </label>
                                </div>
                                <p class="text-muted small mb-3" style="margin-left: 2.5rem;">
                                    <xsl:value-of select="local:translate('jahr.toggle_text_1')"/>
                                    <xsl:text> </xsl:text>
                                    <span class="fw-bold text-danger">
                                        <xsl:value-of select="local:translate('jahr.toggle_not')"/>
                                    </span>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="local:translate('jahr.toggle_text_2')"/>
                                </p>
                                <p class="text-start text-muted small mt-3">
                                    <xsl:value-of select="local:translate('jahr.page_info')"/>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="js_translations"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script type="module" src="./js/script_jahr.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
