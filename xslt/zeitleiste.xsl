<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:local="http://dse-static.foo.bar" version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/shared.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:template match="/">
        <html class="h-100">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <xsl:variable name="doc_title">
                    <xsl:text>Wiener Schnitzler</xsl:text>
                </xsl:variable>
                <xsl:variable name="doc_description">
                    <xsl:text>Zeitleiste – Interaktive Visualisierung der zeitlichen Entwicklung von Arthur Schnitzlers Aufenthalten in Wien</xsl:text>
                </xsl:variable>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/zeitleiste.html')"/>
                </xsl:call-template>
                <script type="text/javascript" src="https://unpkg.com/vis-timeline@latest/standalone/umd/vis-timeline-graph2d.min.js"></script>
                <link href="https://unpkg.com/vis-timeline@latest/styles/vis-timeline-graph2d.min.css" rel="stylesheet" type="text/css" />
                
            </head>
            <body class="h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="w-100">
                    <div class="container-fluid my-4" id="main-content">
                        <h1>Zeitleiste</h1>
                        <div class="form-group">
                            <label for="yearSelect">Jahr auswählen:</label>
                            <select id="yearSelect"></select>
                            <div style="width: 20px"></div>
                            <input type="checkbox" id="toggleAdditional" />
                            <label for="toggleAdditional" class="ms-2">In der Wochen- oder Tagesansicht werden Orte innerhalb von Orten gezeigt</label>
                        </div>
                       <div class="center"> 
                           <div id="timeline" style="height: 500px;"></div>
                       </div>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script type="module" src="./js/zeitleiste.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
