<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar"
    version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:import href="./partials/shared.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:import href="./partials/js_translations.xsl"/>
    <xsl:output encoding="UTF-8" media-type="text/html" method="xhtml" version="1.0" indent="yes"
        omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <html class="h-100">
            <xsl:attribute name="lang">
                <xsl:value-of select="$language"/>
            </xsl:attribute>
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <xsl:variable name="doc_title" select="local:translate('statistik.title')"/>
                <xsl:variable name="doc_description" select="local:translate('statistik.meta_description')"/>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/statistik.html')"/>
                </xsl:call-template>
                <style>
                    .stat-card {margin-bottom: 2rem;}
                    .stat-card .card-header h2 {font-size: 1.25rem; margin: 0;}
                    .chart-wrapper {position: relative; width: 100%;}
                </style>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container my-4" id="main-content">
                        <h1><xsl:value-of select="local:translate('statistik.heading')"/></h1>
                        <p class="lead"><xsl:value-of select="local:translate('statistik.intro')"/></p>

                        <div id="stats-loading" class="text-center my-5">
                            <div class="spinner-border" role="status"/>
                            <p class="mt-2"><xsl:value-of select="local:translate('statistik.loading')"/></p>
                        </div>

                        <div id="stats-content" style="display: none;">
                            <!-- Aufenthaltstage pro Jahr -->
                            <div class="card stat-card">
                                <div class="card-header">
                                    <h2><xsl:value-of select="local:translate('statistik.years.heading')"/></h2>
                                </div>
                                <div class="card-body">
                                    <p class="text-muted"><xsl:value-of select="local:translate('statistik.years.description')"/></p>
                                    <div class="chart-wrapper" style="height: 420px;">
                                        <canvas id="chart-years"/>
                                    </div>
                                </div>
                            </div>

                            <!-- Meistbesuchte Orte -->
                            <div class="card stat-card">
                                <div class="card-header">
                                    <h2><xsl:value-of select="local:translate('statistik.places.heading')"/></h2>
                                </div>
                                <div class="card-body">
                                    <p class="text-muted"><xsl:value-of select="local:translate('statistik.places.description')"/></p>
                                    <div class="btn-group mb-3" role="group">
                                        <xsl:attribute name="aria-label">
                                            <xsl:value-of select="local:translate('statistik.places.heading')"/>
                                        </xsl:attribute>
                                        <button type="button" id="places-mode-detail" class="btn btn-primary btn-sm">
                                            <xsl:value-of select="local:translate('statistik.places.mode_detail')"/>
                                        </button>
                                        <button type="button" id="places-mode-settlement" class="btn btn-outline-primary btn-sm">
                                            <xsl:value-of select="local:translate('statistik.places.mode_settlement')"/>
                                        </button>
                                    </div>
                                    <div class="chart-wrapper" style="height: 600px;">
                                        <canvas id="chart-places"/>
                                    </div>
                                </div>
                            </div>

                            <!-- Ortstypen -->
                            <div class="card stat-card">
                                <div class="card-header">
                                    <h2><xsl:value-of select="local:translate('statistik.types.heading')"/></h2>
                                </div>
                                <div class="card-body">
                                    <p class="text-muted"><xsl:value-of select="local:translate('statistik.types.description')"/></p>
                                    <div class="btn-group mb-3" role="group">
                                        <xsl:attribute name="aria-label">
                                            <xsl:value-of select="local:translate('statistik.types.heading')"/>
                                        </xsl:attribute>
                                        <button type="button" id="types-mode-days" class="btn btn-primary btn-sm">
                                            <xsl:value-of select="local:translate('statistik.types.by_days')"/>
                                        </button>
                                        <button type="button" id="types-mode-places" class="btn btn-outline-primary btn-sm">
                                            <xsl:value-of select="local:translate('statistik.types.by_places')"/>
                                        </button>
                                    </div>
                                    <div class="chart-wrapper" style="height: 450px;">
                                        <canvas id="chart-types"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
                <script type="module" src="./js/statistik.js"></script>

                <xsl:call-template name="html_footer"/>
                <xsl:call-template name="js_translations"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
