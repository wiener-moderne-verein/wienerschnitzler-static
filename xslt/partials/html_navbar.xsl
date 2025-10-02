<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="#all" version="2.0">
    <xsl:template name="nav_bar">
        <a href="#main-content" class="skip-link" accesskey="1">Zum Hauptinhalt springen</a>
        <header role="banner">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light" role="navigation" aria-label="Hauptnavigation">
                    <!-- Roter BETA-Button -->
                            <!--<span class="navbar-text" style="position: relative;">
                                <button class="btn btn-danger disabled" type="button" style="color: white; background-color: red; font-size: 0.75rem; padding: 0.25rem 0.5rem; transform: rotate(-10deg); position: absolute; bottom: -27px; right: -155px; z-index:2000;">BETA</button>
                            </span>-->
                    <div class="container">
                        <img src="images/wienerschnitzler.jpg" class="me-2" height="30px" alt="Wiener Schnitzler Logo"/>

                        <a class="navbar-brand" href="index.html">Wiener Schnitzler</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Navigationsmenü öffnen">
                            <span class="navbar-toggler-icon" aria-hidden="true"></span>
                        </button>
                        
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <!-- Projekt Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="projektDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Projekt
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="projektDropdown">
                                        <li><a class="dropdown-item" href="projekt.html">Über das Projekt</a></li>
                                        <li><a class="dropdown-item" href="faqs.html">Antworten auf häufige Fragen</a></li>
                                        <li><a class="dropdown-item" href="literatur.html">Auswahlbibliografie</a></li>
                                        <li><a class="dropdown-item" href="kontakt.html">Kontakt</a></li>
                                        <li><a class="dropdown-item" href="impressum.html">Impressum</a></li>
                                    </ul>
                                </li>
                                
                                <!-- Orte Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="OrteDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Orte
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="OrteDropdown">
                                        <li><a class="dropdown-item" href="gesamt.html">Aufenthaltstage</a></li>
                                        <li><a class="dropdown-item" href="gesamt_typen.html">Typen</a></li>
                                        <li><a class="dropdown-item" href="listplace.html">Verzeichnis</a></li>
                                        <li><a class="dropdown-item" href="listplace-missing.html">Nicht identifizierte Orte</a></li>
                                        <li><a class="dropdown-item" href="schnitzler-und-ich.html">Schnitzler und ich</a></li>
                                        <li><a class="dropdown-item" href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank" rel="noopener noreferrer" aria-label="Kepler.gl - öffnet in neuem Fenster">Kepler.gl</a></li>
                                    </ul>
                                </li>
                                
                                <!-- Zeiträume Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="zeitraeumeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Zeiträume
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="zeitraeumeDropdown">
                                        <li><a class="dropdown-item" href="tag.html">Einzelner Tag</a></li>
                                        <li><a class="dropdown-item" href="monat.html">Monat</a></li>
                                        <li><a class="dropdown-item" href="jahr.html">Jahr</a></li>
                                        <li><a class="dropdown-item" href="dekade.html">Dekade</a></li>
                                        <li><a class="dropdown-item" href="uebersicht.html">Übersicht</a></li>
                                        <li><a class="dropdown-item" href="zeitleiste.html">Zeitleiste</a></li>
                                        
                                    </ul>
                                </li>
                                
                                <!-- Schnitzler-Links Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="schnitzlerLinksDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Schnitzler</a>
                                    <ul class="dropdown-menu" aria-labelledby="schnitzlerLinksDropdown">
                                        <li><a class="dropdown-item" href="https://de.wikipedia.org/wiki/Arthur_Schnitzler" target="_blank" rel="noopener noreferrer" aria-label="Wikipedia - öffnet in neuem Fenster">Wikipedia</a></li>
                                        <li><a class="dropdown-item" href="https://www.geschichtewiki.wien.gv.at/Arthur_Schnitzler" target="_blank" rel="noopener noreferrer" aria-label="Wien Geschichte Wiki - öffnet in neuem Fenster">Wien Geschichte Wiki</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Tagebuch (1879–1931) - öffnet in neuem Fenster">Tagebuch (1879–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Briefe (1888–1931) - öffnet in neuem Fenster">Briefe (1888–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://www.arthur-schnitzler.de" target="_blank" rel="noopener noreferrer" aria-label="Werke digital (1905–1931) - öffnet in neuem Fenster">Werke digital (1905–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-mikrofilme.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Mikrofilme - öffnet in neuem Fenster">Mikrofilme</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-zeitungen.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Archiv der Zeitungsausschnitte - öffnet in neuem Fenster">Archiv der Zeitungsausschnitte</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-interviews.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Interviews, Meinungen, Proteste - öffnet in neuem Fenster">Interviews, Meinungen, Proteste</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-bahr.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Korrespondenz mit Hermann Bahr - öffnet in neuem Fenster">Korrespondenz mit Hermann Bahr</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-chronik.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Chronik - öffnet in neuem Fenster">Chronik</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-lektueren.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Lektüren - öffnet in neuem Fenster">Lektüren</a></li>
                                        <li><a class="dropdown-item" href="https://pollaczek.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Pollaczek: Schnitzler und ich - öffnet in neuem Fenster">Pollaczek: Schnitzler und ich</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-orte.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="Aufenthaltsorte - öffnet in neuem Fenster">Aufenthaltsorte</a></li>
                                        <li><a class="dropdown-item" href="https://pmb.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" aria-label="PMB – Personen der Moderne - öffnet in neuem Fenster">PMB – Personen der Moderne</a></li>
                                    </ul>
                                </li>
                            </ul>
                            
                        </div>
                    </div>
                </nav>
            </div>
        </header>
        
        
        
    </xsl:template>
</xsl:stylesheet>