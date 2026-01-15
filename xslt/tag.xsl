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
                <xsl:variable name="doc_title" select="local:translate('tag.title')"/>
                <xsl:variable name="doc_description" select="local:translate('tag.meta_description')"/>
                <xsl:variable name="page_filename">
                    <xsl:choose>
                        <xsl:when test="$language = 'en'">tag-en.html</xsl:when>
                        <xsl:otherwise>tag.html</xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/', $page_filename)"/>
                </xsl:call-template>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1><xsl:value-of select="local:translate('tag.heading')"/></h1>
                        <div class="map-container-wrapper">
                            <div id="map-large"> </div>
                            <div class="filter-column">
                                <div
                                    class="controls d-flex justify-content-between align-items-center mb-3 gap-3">
                                    <div class="d-flex justify-content-start">
                                        <button id="prev-day"
                                            class="btn btn-secondary  btn-navigation">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('tag.prev_day')"/>
                                            </xsl:attribute>
                                            <i class="bi bi-arrow-left-circle text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                    <div class="d-flex center-content-start">
                                        <input type="date" id="date-input"
                                            class="form-control w-auto"/>
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button id="next-day"
                                            class="btn btn-secondary  btn-navigation">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="local:translate('tag.next_day')"/>
                                            </xsl:attribute>
                                            <i class="bi bi-arrow-right-circle text-white" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                                <div id="map-inhalt-text" class="mb-5"/>
                                <div class="text-start mx-auto">
                                    <p>
                                        <!-- In Deinem HTML -->
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox"
                                                id="lineToggle"/>
                                            <label class="form-check-label" for="lineToggle">
                                                <span id="lineToggleIcon" class="fs-5">
                                                    <xsl:attribute name="title">
                                                        <xsl:value-of select="local:translate('tag.toggle_title')"/>
                                                    </xsl:attribute>
                                                </span>
                                                <b><xsl:value-of select="local:translate('tag.connection_line')"/></b>
                                                <xsl:text> </xsl:text>
                                                <xsl:value-of select="local:translate('tag.toggle_text_1')"/>
                                                <xsl:text> </xsl:text>
                                                <span class="fw-bold text-danger">
                                                    <xsl:value-of select="local:translate('tag.toggle_not')"/>
                                                </span>
                                                <xsl:text> </xsl:text>
                                                <xsl:value-of select="local:translate('tag.toggle_text_2')"/>
                                            </label>
                                        </div>
                                    </p>
                                    <p class="text-start text-muted small">
                                        <xsl:value-of select="local:translate('tag.page_info')"/>
                                    </p>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="js_translations"/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"/>
                <script src="./js/script_tag_standalone.js"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
