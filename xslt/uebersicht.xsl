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
        <html class="h-100">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
                <link rel="stylesheet" href="https://unpkg.com/cal-heatmap/dist/cal-heatmap.css"/>
                <xsl:variable name="doc_title">
                    <xsl:text>Wiener Schnitzler</xsl:text>
                </xsl:variable>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                </xsl:call-template>
                <style>
                    .ch-domain-text {font-size: 20px;}
                    .btn {margin: 10px;}
                </style>
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                    <main class="w-100">
                        <div class="container-fluid my-4" id="main-content">
        
                                <h1>Übersicht nach Anzahl der Aufenthaltsorte</h1>
                            <div class="card-body containingloader">
                                
                                <div class="d-flex flex-column align-items-center">
                                    <!-- Zentrierte Decade-Buttons -->
                                    <div id="decade-buttons" class="mb-3"></div>
                                    <!-- Zentrierte Heatmap ohne eigenen Rahmen -->
                                    <div id="cal-heatmap" class="border-0"></div>
                                </div>
                            </div>
                        </div>
                    </main>
                    
         
                    <script src="https://d3js.org/d3.v7.min.js"></script>
                    <script src="https://unpkg.com/@popperjs/core@2"></script>
                    <script src="https://unpkg.com/cal-heatmap/dist/plugins/Tooltip.min.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>
                    <script src="https://unpkg.com/cal-heatmap/dist/cal-heatmap.min.js"></script>
                    <script type="module" src="./js/uebersicht.js"></script>
                    
                    <xsl:call-template name="html_footer"/>
            </body>
            
        </html>
    </xsl:template>
</xsl:stylesheet>
