<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:local="http://dse-static.foo.bar"
    version="2.0" exclude-result-prefixes="xsl tei xs local">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes" omit-xml-declaration="yes"/>

    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:import href="./partials/one_time_alert.xsl"/>

    <xsl:template match="/">
        <html class="h-100">
            <head>
                <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <title>Arthur Schnitzler</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"/>
            </head>
            <body>
                <!-- Navbar -->
                <div id="navbar"></div>
                
                <main class="container py-5">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h1>Wiener Schnitzler – Schnitzlers Wien</h1>
                            <p class="lead">Arthur Schnitzler kam 1862 in Wien auf die Welt und er starb 1931 in der selben Stadt,
                                in der die meisten seiner literarischen Werke angesiedelt sind. Wien
                                verließ er nur für Reisen und Sommeraufenthalte. Ein einziges Mal blieb er länger als zwei Monate fort.
                                Durch sein <a href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank">Tagebuch</a>,
                                seine <a href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank">Korrespondenz</a> und andere Dokumente können wir über 
                                35.000 Aufenthalte an über 2.500 Orten bestimmen. So wird an ihm beispielhaft erfassbar, was
                                derzeit für keine Zeitgenossin und keinen Zeitgenossen vorliegt: Der geographische Raum, 
                                in dem er sich bewegte, Orte, die er kannte, die ihm wichtig waren. Und im Gegenzug auch jene 
                                Häuser, Straßen, 
                                Bezirke, Städte und Länder, die er nicht besuchte.
                            </p>
                        </div>
                        <div class="col-md-6">
                            <img src="./images/schnitzler-index.jpg" alt="Arthur Schnitzler als digitalen Avatar" class="img-fluid rounded"/>
                        </div>
                    </div>
                </main>
                
                <!-- Footer -->
                <div id="footer"></div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>