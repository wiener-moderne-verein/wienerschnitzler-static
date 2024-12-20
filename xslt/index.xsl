<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar"
    version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <!--<xsl:import href="./partials/one_time_alert.xsl"/>-->
    <xsl:template match="/">
        <html class="h-100">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <xsl:variable name="doc_title">
                    <xsl:text>Wiener Schnitzler</xsl:text>
                </xsl:variable>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                </xsl:call-template>
            </head>
            <body>
                <!-- Navbar -->
                <xsl:call-template name="nav_bar"/>
                <div class="container mt-5">
                    <div class="row">
                        <div class="col-md-6">
                            <h2>Wiener Schnitzler – Schnitzlers Wien</h2>
                            <p class="lead">Arthur Schnitzler kam 1862 in Wien auf die Welt. Hier
                                starb er 1931. In Wien sind die meisten seiner literarischen Werke
                                angesiedelt. Er verließ die Stadt nur für ausgedehnte Reisen und
                                Sommeraufenthalte. Durch sein <a
                                    href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/"
                                    target="_blank"
                                    style="color: #037A33; font-weight: bold; text-decoration: none;"
                                    >Tagebuch</a>, seine <a
                                    href="https://schnitzler-briefe.acdh.oeaw.ac.at/"
                                    target="_blank"
                                    style="color: #A63437; font-weight: bold; text-decoration: none;"
                                    >Korrespondenz</a> und andere Dokumente können wir derzeit 35.000
                                Aufenthalte an über 2.700 Orten bestimmen. Für keine Zeitgenossin,
                                für keinen Zeitgenossen dürften derzeit so viele georeferenzierte Daten frei verfügbar 
                                sein. Damit lässt sich der geographischen Raum bestimmen, in dem Schnitzler sich
                                bewegte, Häuser, Straßen, Bezirke, Städte und Länder, die er kannte, die ihm wichtig waren. Und im Gegenzug
                                auch jene Orte, die er nicht
                                besuchte. </p>
                            <p>Die Detailtiefe der derzeit erfassten Daten schwankt. Die Jahre 1890–1906 und 1929 sind besonders dicht.</p>
                        </div>
                        <div class="col-md-6">
                            <img src="./images/schnitzler-index.jpg"
                                alt="Arthur Schnitzler als digitalen Avatar"
                                class="img-fluid rounded"/>
                        </div>
                    </div>
                </div>
                <!-- Footer -->
                <xsl:call-template name="html_footer"/>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
