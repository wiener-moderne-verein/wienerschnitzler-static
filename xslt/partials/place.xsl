<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:import href="./LOD-idnos.xsl"/>
    <xsl:param name="currentDocumentIds" as="xs:string*"
        select="descendant::tei:body/tei:listPlace/tei:place/@xml:id"/>
    <xsl:param name="distinctPlaces"
        select="document('../data/editions/xml/wienerschnitzler_distinctPlaces.xml')/tei:TEI/tei:text/tei:body/tei:listPlace"
        as="node()"/>
    <xsl:param select="document('../utils/index_days.xml')" name="tb-days"/>
    <xsl:template match="tei:place" name="place_detail">
        <div style="margin-bottom:35px; margin-top:50px;">
            <!--<div class="d-flex justify-content-around">
                <!-\- Button zum Kartenbereich -\->
                <a href="#accordionMap" class="btn btn-secondary">
                    Karte
                </a>
                <!-\- Button zum Tabellenbereich -\->
                <a href="#accordionTables" class="btn btn-secondary">
                    Zugehörigkeiten
                </a>
                <!-\- Button zum Erwähnungsbereich -\->
                <a href="#accordionMentions" class="btn btn-secondary">
                    Aufenthalte
                </a>
            </div>-->
        </div>
        <xsl:variable name="placeName1" select="tei:placeName[1]" as="xs:string"/>
        <xsl:variable name="current-xml-id" select="@xml:id" as="xs:string"/>
        <xsl:choose>
            <xsl:when test="./tei:location[@type = 'coords']/tei:geo">
                <div class="accordion" id="accordionMap" style="margin-bottom:35px;">
                    <div class="accordion-item">
                        <h2 class="accordion-header bg-default" id="headingMap">
                            <button class="accordion-button" id="toggleMapButton" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseMap"
                                aria-expanded="true" aria-controls="collapseMap"> Karte </button>
                        </h2>
                        <!-- Karte im Collapse -->
                        <div id="collapseMap" class="accordion-collapse collapse show"
                            aria-labelledby="headingMap" data-bs-parent="#accordionMap">
                            <xsl:if
                                test="key('only-relevant-uris', tei:idno/@subtype, $relevant-uris)[1]">
                                <div class="container w-75 mx-auto mt-2">
                                    <p class="text-center">
                                        <xsl:variable name="idnos-of-current" as="node()">
                                            <xsl:element name="nodeset_place">
                                                <xsl:for-each select="tei:idno">
                                                  <xsl:copy-of select="."/>
                                                </xsl:for-each>
                                            </xsl:element>
                                        </xsl:variable>
                                        <xsl:call-template name="mam:idnosToLinks">
                                            <xsl:with-param name="idnos-of-current"
                                                select="$idnos-of-current"/>
                                        </xsl:call-template>
                                    </p>
                                </div>
                            </xsl:if>
                            <div class="accordion-body">
                                <div id="map_detail" style="height: 500px;"/>
                            </div>
                            <xsl:if test=".//tei:location">
                                <xsl:variable name="mlat"
                                    select="replace(tokenize(./tei:location[@type = 'coords'][1]/tei:geo[1], '\s')[1], ',', '.')"/>
                                <xsl:variable name="mlong"
                                    select="replace(tokenize(./tei:location[@type = 'coords'][1]/tei:geo[1], '\s')[2], ',', '.')"/>
                                <xsl:variable name="mappin"
                                    select="concat('mlat=',$mlat, '&amp;mlon=', $mlong)"
                                    as="xs:string"/>
                                <xsl:variable name="openstreetmapurl"
                                    select="concat('https://www.openstreetmap.org/?', $mappin, '#map=12/', $mlat, '/', $mlong)"/>
                                <a class="osm-link">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="$openstreetmapurl"/>
                                    </xsl:attribute>
                                    <xsl:attribute name="target">
                                        <xsl:text>_blank</xsl:text>
                                    </xsl:attribute>
                                    <i class="bi bi-box-arrow-up-right"/> OpenStreetMap </a>
                            </xsl:if>
                        </div>
                    </div>
                </div>
            </xsl:when>
            <xsl:otherwise>
                <p class="buttonreihe text-center">
                    <xsl:variable name="idnos-of-current" as="node()">
                        <xsl:element name="nodeset_place">
                            <xsl:for-each select="tei:idno">
                                <xsl:copy-of select="."/>
                            </xsl:for-each>
                        </xsl:element>
                    </xsl:variable>
                    <xsl:call-template name="mam:idnosToLinks">
                        <xsl:with-param name="idnos-of-current" select="$idnos-of-current"/>
                    </xsl:call-template>
                </p>
            </xsl:otherwise>
        </xsl:choose>
        <div class="accordion" id="accordionTables" style="margin-bottom:35px;">
            <!-- Toggle-Button -->
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTable1">
                    <button class="accordion-button" id="toggleTableButton" type="button"
                        data-bs-toggle="collapse" data-bs-target="#collapseTable1"
                        aria-expanded="true" aria-controls="collapseTable1"> Zugehörigkeiten
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
                                        <ul>
                                            <xsl:for-each
                                                select="distinct-values(tei:placeName[not(@type = 'legacy-name') and not(@type = 'legacy-name-merge') and not(. = $placeName1)])">
                                                <li>
                                                  <xsl:value-of select="."/>
                                                </li>
                                            </xsl:for-each>
                                        </ul>
                                    </td>
                                </tr>
                            </xsl:if>
                            <xsl:if test="./tei:location[@type = 'located_in_place']">
                                <tr>
                                    <th> Zugehörigkeit: </th>
                                    <td>
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
                            <xsl:if test="./tei:noteGrp">
                                <tr>
                                    <th> Wohnort oder Arbeitsort von: </th>
                                    <td>
                                        <ul>
                                            <xsl:for-each select="descendant::tei:noteGrp/tei:note">
                                                <xsl:element name="a">
                                                  <xsl:attribute name="target">
                                                  <xsl:text>_blank</xsl:text>
                                                  </xsl:attribute>
                                                  <xsl:attribute name="href">
                                                  <xsl:value-of
                                                  select="concat('https://pmb.acdh.oeaw.ac.at/entity/', replace(replace(descendant::tei:persName/@ref, '#', ''), '#', ''), '/')"
                                                  />
                                                  </xsl:attribute>
                                                  <xsl:choose>
                                                  <xsl:when
                                                  test="descendant::tei:persName/tei:surname and descendant::tei:persName/tei:forename">
                                                  <xsl:value-of
                                                  select="concat(descendant::tei:persName/tei:forename, ' ', descendant::tei:persName/tei:surname)"
                                                  />
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="descendant::tei:persName/tei:surname">
                                                  <xsl:value-of
                                                  select="descendant::tei:persName/tei:surname"/>
                                                  </xsl:when>
                                                  <xsl:when
                                                  test="descendant::tei:persName/tei:forename">
                                                  <xsl:value-of
                                                  select="descendant::tei:persName/tei:forename"/>
                                                  </xsl:when>
                                                  <xsl:otherwise>
                                                  <xsl:value-of select="descendant::tei:persName"/>
                                                  </xsl:otherwise>
                                                  </xsl:choose>
                                                </xsl:element>
                                                <xsl:if test="not(position() = last())">
                                                  <xsl:text>, </xsl:text>
                                                </xsl:if>
                                            </xsl:for-each>
                                        </ul>
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
                                        <xsl:value-of select="$anzahl-aufenthalte"/>
                                        <xsl:text> nachgewiesene Aufenthalte Schnitzlers</xsl:text>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </button>
                        </h2>
                        <!-- Tabelle im Collapse -->
                        <div id="mentions" class="accordion-collapse show"
                            aria-labelledby="mentions" data-bs-parent="#accordionMentions">
                            <div>
                                <!-- Balkendiagramm -->
                                <xsl:variable name="start-year" select="1869"/>
                                <xsl:variable name="end-year" select="1931"/>
                                <xsl:variable name="years" select="$start-year to $end-year"/>
                                <!-- Höchste Ereignisanzahl berechnen -->
                                <xsl:variable name="max-count" as="xs:int">
                                    <xsl:value-of select="
                                            max(for $year in $years
                                            return
                                                count($distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event[year-from-date(@when) = $year]))"
                                    />
                                </xsl:variable>
                                <xsl:if test="$max-count &gt; 0">
                                    <!-- Schrittweite für die Y-Achse berechnen -->
                                    <xsl:variable name="y-step" select="
                                            if ($max-count > 100) then
                                                25
                                            else
                                                10"/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="100%"
                                        height="300" viewBox="0 0 1000 300" role="img" aria-labelledby="svg-title svg-desc">
                                        <title id="svg-title">Zeitlinie der Aufenthalte von Arthur Schnitzler</title>
                                        <desc id="svg-desc">Ein Balkendiagramm zeigt die Häufigkeit von Schnitzlers Aufenthalten über die Jahre von 1870 bis 1930. Die Y-Achse zeigt die Anzahl der Aufenthalte, die X-Achse die Jahre.</desc>
                                        <!-- Achsen -->
                                        <line x1="50" y1="10" x2="50" y2="250" stroke="black"/>
                                        <line x1="50" y1="250" x2="950" y2="250" stroke="black"/>
                                        <!-- Dynamische Y-Achsen-Beschriftungen mit Zwischenstrichen -->
                                        <xsl:variable name="y-step" select="
                                                if ($max-count > 100) then
                                                    25
                                                else
                                                    10"/>
                                        <xsl:variable name="max-steps"
                                            select="xs:integer(floor($max-count div $y-step))"/>
                                        <!-- Haupt- und Zwischenstriche auf der Y-Achse -->
                                        <xsl:for-each select="
                                                for $i in 0 to $max-steps
                                                return
                                                    $i * $y-step">
                                            <xsl:variable name="count" select="."/>
                                            <!-- Hauptstrich -->
                                            <line x1="45" y1="{250 - $count * (240 div $max-count)}"
                                                x2="50" y2="{250 - $count * (240 div $max-count)}"
                                                stroke="black"/>
                                            <text x="40" y="{255 - $count * (240 div $max-count)}"
                                                font-size="10" text-anchor="end">
                                                <xsl:value-of select="$count"/>
                                            </text>
                                            <!-- Zwischenstriche -->
                                            <xsl:for-each select="1 to 4">
                                                <xsl:variable name="sub-step"
                                                  select="$count + (. * $y-step div 5)"/>
                                                <line x1="47"
                                                  y1="{250 - $sub-step * (240 div $max-count)}"
                                                  x2="50"
                                                  y2="{250 - $sub-step * (240 div $max-count)}"
                                                  stroke="gray"/>
                                            </xsl:for-each>
                                        </xsl:for-each>
                                        <!-- Jahrzehnte-Beschriftungen und Hauptstriche auf der X-Achse -->
                                        <xsl:for-each select="$years[position() mod 10 = 2]">
                                            <xsl:variable name="year" select="."/>
                                            <xsl:if test="$year mod 10 = 0">
                                                <!-- Hauptstrich -->
                                                <line x1="{50 + ($year - $start-year) * 10}"
                                                  y1="250" x2="{50 + ($year - $start-year) * 10}"
                                                  y2="255" stroke="black"/>
                                                <!-- Beschriftung -->
                                                <text x="{50 + ($year - $start-year) * 10}" y="270"
                                                  font-size="10" text-anchor="middle">
                                                  <xsl:value-of select="$year"/>
                                                </text>
                                            </xsl:if>
                                            <!-- Zwischenstriche -->
                                            <xsl:for-each select="1 to 9">
                                                <xsl:variable name="sub-step-x"
                                                  select="$year + . * 1"/>
                                                <line x1="{50 + ($sub-step-x - $start-year) * 10}"
                                                  y1="250"
                                                  x2="{50 + ($sub-step-x - $start-year) * 10}"
                                                  y2="253" stroke="gray"/>
                                            </xsl:for-each>
                                        </xsl:for-each>
                                        <!-- Balken -->
                                        <xsl:for-each select="$years">
                                            <xsl:variable name="year" select="."/>
                                            <xsl:variable name="count-year-events" as="xs:int">
                                                <xsl:value-of
                                                  select="count($distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event[year-from-date(@when) = $year])"
                                                />
                                            </xsl:variable>
                                            <rect x="{50 + ($year - $start-year) * 10 - 4}"
                                                y="{250 - $count-year-events * (240 div $max-count)}"
                                                width="8"
                                                height="{$count-year-events * (240 div $max-count)}"
                                                fill="#045344"/>
                                        </xsl:for-each>
                                    </svg>
                                </xsl:if>
                            </div>
                            <div class="accordion-body">
                                <xsl:choose>
                                    <xsl:when test="$anzahl-aufenthalte lt 12">
                                        <ul>
                                            <xsl:for-each
                                                select="$distinctPlaces/tei:place[@xml:id = $current-xml-id]/tei:listEvent/tei:event">
                                                <li>
                                                  <a href="{concat('tag.html#', @when)}">
                                                  <xsl:value-of select="tei:eventName"/>
                                                  </a>
                                                  <a class="btn schnitzler-chronik-link"
                                                  role="button>"
                                                  href="{concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when, '.html')}"
                                                  target="_blank">Schnitzler Chronik</a>
                                                  <xsl:variable name="when" select="@when"/>
                                                  <xsl:if
                                                  test="$tb-days/descendant::*:date[. = $when][1]">
                                                  <a class="btn schnitzler-tagebuch-link"
                                                  role="button"
                                                  href="{concat('https://schnitzler-tagebuch.acdh.oeaw.ac.at/entry__', @when, '.html')}"
                                                  target="_blank">Schnitzler Tagebuch</a>
                                                  </xsl:if>
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
                                                  <a href="{concat('tag.html#', @when)}"
                                                  >
                                                  <xsl:value-of select="tei:eventName"/>
                                                  </a>
                                                  <a class="btn schnitzler-chronik-link"
                                                  role="button>"
                                                  href="{concat('https://schnitzler-chronik.acdh.oeaw.ac.at/', @when, '.html')}"
                                                  target="_blank">Schnitzler Chronik</a>
                                                  <xsl:variable name="when" select="@when"/>
                                                  <xsl:if
                                                  test="$tb-days/descendant::*:date[. = $when][1]">
                                                  <a class="btn schnitzler-tagebuch-link"
                                                  role="button"
                                                  href="{concat('https://schnitzler-tagebuch.acdh.oeaw.ac.at/entry__', @when, '.html')}"
                                                  target="_blank">Schnitzler Tagebuch</a>
                                                  </xsl:if>
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
                toggleMapButton.textContent = "Karte";
                });
                
                const toggleTableButton = document.getElementById("toggleTableButton");
                const collapseTable1 = document.getElementById("collapseTable1");
                
                // Text ändern, wenn die Tabelle ausgeblendet wird
                collapseTable1.addEventListener("hidden.bs.collapse", () => {
                toggleTableButton.textContent = "Zugehörigkeiten anzeigen";
                });
                
                // Text ändern, wenn die Tabelle eingeblendet wird
                collapseTable1.addEventListener("shown.bs.collapse", () => {
                toggleTableButton.textContent = "Zugehörigkeiten";
                });
            </script>
    </xsl:template>
    <!-- Function to check if a value is in the list -->
    <xsl:function name="mam:is-id-in-list" as="xs:boolean">
        <xsl:param name="searchValue" as="xs:string"/>
        <xsl:sequence select="$searchValue = $currentDocumentIds"/>
    </xsl:function>
</xsl:stylesheet>
