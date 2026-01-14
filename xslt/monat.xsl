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
                <xsl:variable name="doc_title" select="local:translate('monat.title')"/>
                <xsl:variable name="doc_description" select="local:translate('monat.meta_description')"/>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/monat.html')"/>
                </xsl:call-template>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1><xsl:value-of select="local:translate('monat.heading')"/></h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div class="controls mb-3">
                                    <div
                                        class="d-flex justify-content-between align-items-center mb-3">
                                        <button id="prev-day"
                                            class="btn btn-secondary btn-navigation">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('monat.prev_month')"/>
                                            </xsl:attribute>
                                            <i class="bi bi-arrow-left-circle text-white" aria-hidden="true"/>
                                        </button>
                                        <button id="next-day"
                                            class="btn btn-secondary btn-navigation">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('monat.next_month')"/>
                                            </xsl:attribute>
                                            <i class="bi bi-arrow-right-circle text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                    <div
                                        class="d-flex align-items-center justify-content-center gap-2">
                                        <select id="month-select" class="form-select w-auto">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('monat.month_select_label')"/>
                                            </xsl:attribute>
                                            <option value="01"><xsl:value-of select="local:translate('monat.month_janner')"/></option>
                                            <option value="02"><xsl:value-of select="local:translate('monat.month_feber')"/></option>
                                            <option value="03"><xsl:value-of select="local:translate('monat.month_maerz')"/></option>
                                            <option value="04"><xsl:value-of select="local:translate('monat.month_april')"/></option>
                                            <option value="05"><xsl:value-of select="local:translate('monat.month_mai')"/></option>
                                            <option value="06"><xsl:value-of select="local:translate('monat.month_juni')"/></option>
                                            <option value="07"><xsl:value-of select="local:translate('monat.month_juli')"/></option>
                                            <option value="08"><xsl:value-of select="local:translate('monat.month_august')"/></option>
                                            <option value="09"><xsl:value-of select="local:translate('monat.month_september')"/></option>
                                            <option value="10"><xsl:value-of select="local:translate('monat.month_oktober')"/></option>
                                            <option value="11"><xsl:value-of select="local:translate('monat.month_november')"/></option>
                                            <option value="12"><xsl:value-of select="local:translate('monat.month_dezember')"/></option>
                                        </select>
                                        <select id="year-select" class="form-select w-auto">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('monat.year_select_label')"/>
                                            </xsl:attribute>
                                            <option value="" selected="true" disabled="false">
                                                <xsl:value-of select="local:translate('monat.year_placeholder')"/>
                                            </option>
                                        </select>
                                    </div>
                                    
                                </div>
                                <p>
                                    <b><xsl:value-of select="local:translate('monat.legend_title')"/></b>
                                </p>
                                <div id="legend"
                                    style="display: flex; flex-wrap: wrap; max-width: 90%;  margin-left: auto;  margin-right: auto; ">
                                    <span style="margin: 10px; font-weight: bold">
                                        <xsl:value-of select="local:translate('monat.legend_days')"/>
                                    </span>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox"
                                        id="lineToggle"/>
                                    <label class="form-check-label" for="lineToggle">
                                        <span id="lineToggleIcon" class="fs-5">
                                            <xsl:attribute name="title">
                                                <xsl:value-of select="local:translate('monat.toggle_title')"/>
                                            </xsl:attribute>
                                        </span>
                                        <b><xsl:value-of select="local:translate('monat.connection_line')"/></b>
                                    </label>
                                </div>
                                <p class="text-muted small mb-3" style="margin-left: 2.5rem;">
                                    <xsl:value-of select="local:translate('monat.toggle_text_1')"/>
                                    <xsl:text> </xsl:text>
                                    <span class="fw-bold text-danger">
                                        <xsl:value-of select="local:translate('monat.toggle_not')"/>
                                    </span>
                                    <xsl:text> </xsl:text>
                                    <xsl:value-of select="local:translate('monat.toggle_text_2')"/>
                                </p>
                                <p class="text-start text-muted small mt-3">
                                    <xsl:value-of select="local:translate('monat.page_info')"/>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="js_translations"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script type="module" src="./js/script_monat.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
