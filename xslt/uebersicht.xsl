<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="xhtml" version="1.0" indent="yes"
        omit-xml-declaration="yes"/>


    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:text>wienerschnitzler</xsl:text>
        </xsl:variable>
        <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
        <html lang="de">
            <xsl:call-template name="html_head">
                <xsl:with-param name="html_title" select="$doc_title"/>
            </xsl:call-template>
            <link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css"/>
            <body class="page">
                
                
                
                <div class="hfeed site" id="page">
                    <xsl:call-template name="nav_bar"/>

                    <div class="container-fluid">
                        <div class="card border-0">
                            <div class="card-header text-center">
                                <h1 class="d-inline-block mb-0 pe-2">Übersicht</h1>
                            </div>
                            <div class="card-body containingloader">
                                <div class="d-flex flex-column align-items-center">
                                    <!-- Zentrierte Decade-Buttons -->
                                    <div id="decade-buttons" class="mb-3"></div>
                                    <!-- Zentrierte Heatmap ohne eigenen Rahmen -->
                                    <div id="cal-heatmap" class="border-0"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <script src="https://d3js.org/d3.v7.min.js"></script>
                    <script src="https://unpkg.com/@popperjs/core@2"></script>
                    <script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
                    <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
                    <script type="module" src="./js/uebersicht.js"></script>
                    
                    <xsl:call-template name="html_footer"/>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
