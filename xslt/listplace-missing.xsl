<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="partials/html_navbar.xsl"/>
    <xsl:import href="partials/html_head.xsl"/>
    <xsl:import href="partials/html_footer.xsl"/>
    <xsl:import href="partials/place.xsl"/>
    <xsl:param name="distinctPlaces"
        select="document('../data/editions/xml/wienerschnitzler_distinctPlaces.xml')/tei:TEI/tei:text/tei:body/tei:listPlace"
        as="node()"/>
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:text>Nicht identifizierte Aufenthaltsorte</xsl:text>
        </xsl:variable>
        <html lang="de" class="h-100">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                </xsl:call-template>
                <link
                    href="https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator_bootstrap5.min.css"
                    rel="stylesheet"/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""/>
                <link rel="stylesheet"
                    href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"/>
                <link rel="stylesheet"
                    href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"/>
                <script src="https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js"/>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="container" id="main-content">
                    <div class="col">
                        <h1>
                            <xsl:value-of select="$doc_title"/>
                        </h1>
                        <p>Die folgenden Orte konnten wir bislang nur ungenau auf der Landkarte verorten. Wir freuen 
                        uns über entsprechende Hinweise, die zur Lösung beitragen können.</p>
                        <div id="map"/>
                        <table id="placesTable"
                            style="width:100%; margin: auto;">
                            <thead>
                                <tr>
                                    <th scope="col">Ortsname</th>
                                    <th scope="col">Zugehörigkeiten</th>
                                    <th scope="col">Erwähnungen</th>
                                    <th scope="col">Typ</th>
                                    <th scope="col">Wohn- und Arbeitsort</th>
                                    <th scope="col">lat</th>
                                    <th scope="col">lng</th>
                                    <th scope="col">linkToEntity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <xsl:for-each select=".//tei:place[not(child::tei:location[@type='coords']/tei:geo)]">
                                    <xsl:variable name="id">
                                        <xsl:value-of select="data(@xml:id)"/>
                                    </xsl:variable>
                                    <tr>
                                        <td>
                                            <xsl:value-of
                                                select="descendant::tei:placeName[1]/text()"/>
                                        </td>
                                        <td>
                                            <xsl:for-each select="descendant::tei:location[@type='located_in_place']">
                                                <xsl:value-of select="tei:placeName[1]"/>
                                                <xsl:if test="not(position()=last())">
                                                    <xsl:text>, </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </td>
                                        <td><!-- Erwähnungen -->
                                            <xsl:value-of
                                                select="$distinctPlaces/tei:place[@xml:id = $id]/tei:listEvent/count(tei:event)"
                                            />
                                        </td>
                                        <td><!-- Typ -->
                                            <xsl:value-of
                                                select="normalize-space(descendant::tei:desc[@type='entity_type_literal'][1]/text())"/>
                                        </td>
                                        <td><!-- Personen -->
                                            <xsl:for-each select="descendant::tei:noteGrp/tei:note">
                                                <xsl:choose>
                                                    <xsl:when test="descendant::tei:persName/tei:surname and descendant::tei:persName/tei:forename">
                                                        <xsl:value-of select="concat( descendant::tei:persName/tei:forename, ' ', descendant::tei:persName/tei:surname)"/>
                                                    </xsl:when>
                                                    <xsl:when test="descendant::tei:persName/tei:surname">
                                                        <xsl:value-of select="descendant::tei:persName/tei:surname"/>
                                                    </xsl:when>
                                                    <xsl:when test="descendant::tei:persName/tei:forename">
                                                        <xsl:value-of select="descendant::tei:persName/tei:forename"/>
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="descendant::tei:persName"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                                <xsl:if test="not(position()=last())">
                                                    <xsl:text>, </xsl:text>
                                                </xsl:if>
                                                
                                            </xsl:for-each>
                                        </td>
                                        <td>
                                            <xsl:choose>
                                                <xsl:when test="child::tei:location/tei:geo">
                                                    <xsl:value-of
                                                        select="replace(tokenize(child::tei:location[1]/tei:geo/text(), ' ')[1], ',', '.')"
                                                    />
                                                </xsl:when>
                                            </xsl:choose>
                                        </td>
                                        <td>
                                            <xsl:choose>
                                                <xsl:when test="child::tei:location/tei:geo">
                                                    <xsl:value-of
                                                        select="replace(tokenize(child::tei:location[1]/tei:geo/text(), ' ')[last()], ',', '.')"
                                                    />
                                                </xsl:when>
                                            </xsl:choose>
                                        </td>
                                        <td>
                                            <xsl:value-of select="$id"/>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </tbody>
                        </table>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
                <script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator.min.js"/>
                <script src="js/listplace_map_table_cfg.js"/>
                <script src="js/listplace_map_and_table.js"/>
                <script>
                    build_map_and_table(map_cfg, table_cfg, wms_cfg=null, tms_cfg=null);
                </script>
            </body>
        </html>
        <xsl:for-each select=".//tei:place[@xml:id]">
            <xsl:variable name="filename" select="concat(./@xml:id, '.html')"/>
            <xsl:variable name="name"
                select="normalize-space(string-join(./tei:placeName[1]//text()))"/>
            <xsl:result-document href="{$filename}">
                <html lang="de" class="h-100 w-100">
                    <head>
                        <xsl:call-template name="html_head">
                            <xsl:with-param name="html_title" select="$name"/>
                        </xsl:call-template>
                    </head>
                    <body class="w-100 h-100">
                        <xsl:call-template name="nav_bar"/>
                        <main class="container" id="main-content">
                            <div class="col">
                                <h1>
                                    <xsl:value-of select="$name"/>
                                </h1>
                                <xsl:call-template name="place_detail"/>
                            </div>
                        </main>
                        <xsl:call-template name="html_footer"/>
                        <xsl:if test="./tei:location/tei:geo">
                            <link rel="stylesheet"
                                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                                crossorigin=""/>
                            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""/>
                            <script>
                                var lat = <xsl:value-of select="replace(tokenize(./tei:location[1]/tei:geo[1]/text(), ' ')[1], ',', '.')"/>;
                                var long = <xsl:value-of select="replace(tokenize(./tei:location[1]/tei:geo[1]/text(), ' ')[2], ',', '.')"/>;
                                $("#map_detail").css("height", "500px");
                                var map = L.map('map_detail').setView([Number(lat), Number(long)], 13);
                                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                                maxZoom: 19,
                                attribution: '&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp;copy; <a href="https://carto.com/attributions">CARTO</a>'
                                }).addTo(map);
                                var marker = L.marker([Number(lat), Number(long)]).addTo(map);
                            </script>
                            
                        </xsl:if>
                    </body>
                </html>
            </xsl:result-document>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>
