<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:param name="currentDocumentIds" as="xs:string*"
        select="descendant::tei:body/tei:listPlace/tei:place/@xml:id"/>
    <xsl:param name="distinctPlaces"
        select="document('../data/editions/xml/wienerschnitzler_distinctPlaces.xml')/tei:TEI/tei:text/tei:body/tei:listPlace"
        as="node()"/>
    <xsl:template match="tei:place" name="place_detail">
        <div class="container" style="margin-bottom:35px; margin-top:50px;">
            <div class="d-flex justify-content-around">
                <!-- Button zum Kartenbereich -->
                <a href="#accordionMap" class="btn btn-secondary">
                    Karte
                </a>
                <!-- Button zum Tabellenbereich -->
                <a href="#accordionTables" class="btn btn-secondary">
                    Informationen
                </a>
                <!-- Button zum Erwähnungsbereich -->
                <a href="#accordionMentions" class="btn btn-secondary">
                    Aufenthalte
                </a>
            </div>
        </div>
        
        <xsl:variable name="placeName1" select="tei:placeName[1]" as="xs:string"/>
        <xsl:variable name="current-xml-id" select="@xml:id" as="xs:string"/>
        <xsl:if test="./tei:location/tei:geo">
            <div class="accordion" id="accordionMap" style="margin-bottom:35px;">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingMap">
                        <button class="accordion-button" id="toggleMapButton" type="button" data-bs-toggle="collapse"
                            data-bs-target="#collapseMap" aria-expanded="true" aria-controls="collapseMap">
                            Karte schließen
                        </button>
                    </h2>
                    <!-- Karte im Collapse -->
                    <div id="collapseMap" class="accordion-collapse collapse show"
                        aria-labelledby="headingMap" data-bs-parent="#accordionMap">
                        <div class="accordion-body">
                            <div id="map_detail" style="height: 500px;"/>
                        </div>
                    </div>
                </div>
            </div>
        </xsl:if>
        <div class="accordion" id="accordionTables" style="margin-bottom:35px;">
            <!-- Toggle-Button -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTable1">
                    <button class="accordion-button" id="toggleTableButton" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTable1" aria-expanded="true" aria-controls="collapseTable1">
                        Informationen ausblenden
                    </button>
                </h2>
                <!-- Tabelle im Collapse -->
                <div id="collapseTable1" class="accordion-collapse show"
                    aria-labelledby="headingTable1" data-bs-parent="#accordionTables">
                    <div class="accordion-body">
                        <table class="table entity-table">
                            <xsl:if
                                test="count(distinct-values(tei:placeName[not(@type = 'legacy-name') and not(@type = 'legacy-name-merge')])) gt 1">
                                <tr>
                                    <th> Namensvarianten: </th>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when
                                                test="count(distinct-values(tei:placeName[not(@type = 'legacy-name') and not(@type = 'legacy-name-merge')])) = 2">
                                                <xsl:value-of
                                                  select="tei:placeName[not(@type = 'legacy-name') and not(@type = 'legacy-name-merge') and not(. = $placeName1)]"
                                                />
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <ul>
                                                  <xsl:for-each
                                                  select="distinct-values(tei:placeName[not(@type = 'legacy-name') and not(@type = 'legacy-name-merge') and not(. = $placeName1)])">
                                                  <li>
                                                  <xsl:value-of select="."/>
                                                  </li>
                                                  </xsl:for-each>
                                                </ul>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test="./tei:location[@type = 'located_in_place']">
                                <tr>
                                    <th> Zugehörigkeit: </th>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when
                                                test="not(tei:location[@type = 'located_in_place'][2])">
                                                <xsl:choose>
                                                  <xsl:when
                                                  test="mam:is-id-in-list(tei:location[@type = 'located_in_place']/tei:placeName/@key)">
                                                  <a
                                                  href="{tei:location[@type = 'located_in_place']/tei:placeName/@key}.html">
                                                  <xsl:value-of
                                                  select="tei:location[@type = 'located_in_place']/tei:placeName[1]"
                                                  />
                                                  </a>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of
                                                  select="tei:location[@type = 'located_in_place']/tei:placeName"
                                                  />
                                                  </xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <ul>
                                                  <xsl:for-each
                                                  select="tei:location[@type = 'located_in_place']">
                                                  <li>
                                                  <xsl:choose>
                                                  <xsl:when
                                                  test="mam:is-id-in-list(tei:placeName/@key)">
                                                  <a href="{./tei:placeName/@key}.html">
                                                  <xsl:value-of select="./tei:placeName"/>
                                                  </a>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="./tei:placeName"/>
                                                  </xsl:otherwise>
                                                  </xsl:choose>
                                                  </li>
                                                  </xsl:for-each>
                                                </ul>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if
                                test="ancestor::tei:listPlace/tei:place[tei:location[@type = 'located_in_place']/tei:placeName/@key = $current-xml-id][1]">
                                <tr>
                                    <th> Enthält: </th>
                                    <td>
                                        <ul>
                                            <xsl:for-each
                                                select="ancestor::tei:listPlace/tei:place[tei:location[@type = 'located_in_place']/tei:placeName/@key = $current-xml-id]">
                                                <xsl:variable name="placeName"
                                                  select="tei:placeName[1]" as="xs:string"/>
                                                <li>
                                                  <xsl:element name="a">
                                                  <xsl:attribute name="href">
                                                  <xsl:value-of select="concat(@xml:id, '.html')"/>
                                                  </xsl:attribute>
                                                  <xsl:value-of select="$placeName"/>
                                                  </xsl:element>
                                                </li>
                                            </xsl:for-each>
                                        </ul>
                                    </td>
                                </tr>
                            </xsl:if>
                            <tr>
                                <th> PMB ID: </th>
                                <td>
                                    <xsl:variable name="current-xml-id"
                                        select="replace(replace(@xml:id, '#', ''), 'pmb', '')"/>
                                    <xsl:variable name="pmb-url"
                                        select="concat('https://pmb.acdh.oeaw.ac.at/entity/', $current-xml-id, '/')"/>
                                    <a href="{$pmb-url}" target="_blank">
                                        <xsl:value-of select="$current-xml-id"/>
                                    </a>
                                </td>
                            </tr>
                            <xsl:if test="./tei:idno[@subtype = 'wiengeschichtewiki'][1]">
                                <tr>
                                    <th> Wien Geschichte Wiki: </th>
                                    <td>
                                        <a href="{./tei:idno[@subtype='wiengeschichtewiki'][1]}"
                                            target="_blank">
                                            <xsl:value-of
                                                select="tei:idno[@subtype = 'wiengeschichtewiki'][1]"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test="./tei:idno[@subtype = 'geonames'][1]">
                                <tr>
                                    <th> Geonames ID: </th>
                                    <td>
                                        <a href="{./tei:idno[@subtype='geonames'][1]}"
                                            target="_blank">
                                            <xsl:value-of
                                                select="tokenize(./tei:idno[@subtype = 'geonames'][1], '/')[4]"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test="./tei:idno[@subtype = 'wikidata'][1]">
                                <tr>
                                    <th> Wikidata ID </th>
                                    <td>
                                        <a href="{./tei:idno[@subtype='wikidata']}" target="_blank">
                                            <xsl:value-of
                                                select="tokenize(./tei:idno[@subtype = 'wikidata'][1], '/')[last()]"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test="./tei:idno[@subtype = 'gnd']">
                                <tr>
                                    <th> GND ID </th>
                                    <td>
                                        <a href="{./tei:idno[@subtype='gnd'][1]}" target="_blank">
                                            <xsl:value-of
                                                select="tokenize(./tei:idno[@subtype = 'gnd'][1], '/')[last()]"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test=".//tei:location">
                                <tr>
                                    <th> Längen- und Breitengrad: </th>
                                    <td>
                                        <xsl:variable name="mlat"
                                            select="replace(tokenize(./tei:location[1]/tei:geo[1], '\s')[1], ',', '.')"/>
                                        <xsl:variable name="mlong"
                                            select="replace(tokenize(./tei:location[1]/tei:geo[1], '\s')[2], ',', '.')"/>
                                        <xsl:variable name="mappin"
                                            select="concat('mlat=',$mlat, '&amp;mlon=', $mlong)"
                                            as="xs:string"/>
                                        <xsl:variable name="openstreetmapurl"
                                            select="concat('https://www.openstreetmap.org/?', $mappin, '#map=12/', $mlat, '/', $mlong)"/>
                                        <a>
                                            <xsl:attribute name="href">
                                                <xsl:value-of select="$openstreetmapurl"/>
                                            </xsl:attribute>
                                            <xsl:attribute name="target">
                                                <xsl:text>_blank</xsl:text>
                                            </xsl:attribute>
                                            <xsl:value-of select="concat($mlat, '/', $mlong)"/>
                                        </a>
                                    </td>
                                </tr>
                            </xsl:if>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <xsl:if
                test="$distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event[1]">
                <xsl:variable name="anzahl-aufenthalte" as="xs:int">
                    <xsl:value-of
                        select="count($distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event)"
                    />
                </xsl:variable>
                <div class="accordion" id="accordionMentions" style="margin-bottom:35px;">
                    <!-- Toggle-Button -->
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="mentions1">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                data-bs-target="#mentions" aria-expanded="true"
                                aria-controls="mentions">
                                <xsl:choose>
                                    <xsl:when test="$anzahl-aufenthalte = 1">
                                        <xsl:text>Ein nachgewiesener Aufenthalt Schnitzlers</xsl:text>
                                    </xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="$anzahl-aufenthalte"/> <xsl:text> nachgewiesene Aufenthalte Schnitzlers</xsl:text>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </button>
                        </h2>
                        <!-- Tabelle im Collapse -->
                        <div id="mentions" class="accordion-collapse show"
                            aria-labelledby="mentions" data-bs-parent="#accordionMentions">
                            <div class="accordion-body">
                                <xsl:choose>
                                    <xsl:when test="$anzahl-aufenthalte lt 12">
                                        <ul>
                                        <xsl:for-each
                                            select="$distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event"
                                            >
                                            <li>
                                                <a
                                                    href="{concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when, '.html')}"
                                                    target="_blank">
                                                    <xsl:value-of select="tei:eventName"/>
                                                </a>
                                            </li>
                                        </xsl:for-each>
                                        </ul>
                                    </xsl:when>
                                    <xsl:otherwise>
                                <ul>
                                    <xsl:for-each-group
                                        select="$distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event"
                                        group-by="substring(@when, 1, 4)">
                                        <div class="accordion" id="accordionExample">
                                            <!-- Jahr-Gruppe -->
                                            <div class="accordion-item">
                                                <h2 class="accordion-header"
                                                  id="heading-{current-grouping-key()}">
                                                  <button class="accordion-button collapsed"
                                                  type="button" data-bs-toggle="collapse"
                                                  data-bs-target="#collapse-{current-grouping-key()}"
                                                  aria-expanded="false"
                                                  aria-controls="collapse-{current-grouping-key()}">
                                                  <!-- Jahr und Anzahl -->
                                                  <xsl:value-of
                                                  select="concat(current-grouping-key(), ' (', count(current-group()), ')')"
                                                  />
                                                  </button>
                                                </h2>
                                                <div id="collapse-{current-grouping-key()}"
                                                  class="accordion-collapse collapse"
                                                  aria-labelledby="heading-{current-grouping-key()}"
                                                  data-bs-parent="#accordionExample">
                                                  <div class="accordion-body">
                                                  <ul>
                                                  <!-- Ereignisse innerhalb des Jahres -->
                                                  <xsl:for-each select="current-group()">
                                                  <li>
                                                  <a
                                                  href="{concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when, '.html')}"
                                                  target="_blank">
                                                  <xsl:value-of select="tei:eventName"/>
                                                  </a>
                                                  </li>
                                                  </xsl:for-each>
                                                  </ul>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                    </xsl:for-each-group>
                                </ul>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </div>
                        </div>
                    </div>
                </div>
            </xsl:if>
        </div>
        <xsl:if test="./tei:location/tei:geo">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""/>
            <script>
                
                const toggleMapButton = document.getElementById("toggleMapButton");
                const collapseMap = document.getElementById("collapseMap");
                
                collapseMap.addEventListener("hidden.bs.collapse", () => {
                toggleMapButton.textContent = "Karte anzeigen";
                });
                
                collapseMap.addEventListener("shown.bs.collapse", () => {
                toggleMapButton.textContent = "Karte schließen";
                });
                
                const toggleTableButton = document.getElementById("toggleTableButton");
                const collapseTable1 = document.getElementById("collapseTable1");
                
                // Text ändern, wenn die Tabelle ausgeblendet wird
                collapseTable1.addEventListener("hidden.bs.collapse", () => {
                toggleTableButton.textContent = "Informationen anzeigen";
                });
                
                // Text ändern, wenn die Tabelle eingeblendet wird
                collapseTable1.addEventListener("shown.bs.collapse", () => {
                toggleTableButton.textContent = "Informationen ausblenden";
                });
            </script>
        </xsl:if>
    </xsl:template>
    <!-- Function to check if a value is in the list -->
    <xsl:function name="mam:is-id-in-list" as="xs:boolean">
        <xsl:param name="searchValue" as="xs:string"/>
        <xsl:sequence select="$searchValue = $currentDocumentIds"/>
    </xsl:function>
</xsl:stylesheet>
