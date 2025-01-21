<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="#all" version="2.0">
    <xsl:template match="/" name="nav_bar">
        
        <header>
            <div class="container-fluid">
                <nav class="navbar navbar-expand-lg navbar-light bg-light" aria-label="Primary">
                    <!-- Roter BETA-Button -->
                            <span class="navbar-text" style="position: relative;">
                                <button class="btn btn-danger disabled" type="button" style="color: white; background-color: red; font-size: 0.75rem; padding: 0.25rem 0.5rem; transform: rotate(-30deg); position: absolute; bottom: -10px; right: 10px;">BETA</button>
                            </span>
                    <div class="container-fluid">
                    
                        <a class="navbar-brand" href="index.html">Wiener Schnitzler</a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
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
                                        <li><a class="dropdown-item" href="listplace.html">Verzeichnis</a></li>
                                        <li><a class="dropdown-item" href="gesamt.html">Alle Orte</a></li>
                                        <li><a class="dropdown-item" href="schnitzler-und-ich.html">Schnitzler und ich</a></li>
                                        <li><a class="dropdown-item" href="https://kepler.gl/demo/map?mapUrl=https://dl.dropboxusercontent.com/scl/fi/y8bpsyosh2uwvawwi2jdh/keplergl_ygz1fc.json?rlkey=rl5x7uoswnd0cttr1mw2ncw18" target="_blank">Kepler.gl</a></li>
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
                                    </ul>
                                </li>
                                
                                <!-- Schnitzler-Links Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="schnitzlerLinksDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Schnitzler</a>
                                    <ul class="dropdown-menu" aria-labelledby="schnitzlerLinksDropdown">
                                        <li><a class="dropdown-item" href="https://de.wikipedia.org/wiki/Arthur_Schnitzler" target="_blank">Wikipedia</a></li>
                                        <li><a class="dropdown-item" href="https://www.geschichtewiki.wien.gv.at/Arthur_Schnitzler" target="_blank">Wien Geschichte Wiki</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank">Tagebuch (1879–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank">Briefe (1888–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://www.arthur-schnitzler.de" target="_blank">Digitale historisch-kritische Edition (1905–1931)</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-mikrofilme.acdh.oeaw.ac.at/" target="_blank">Mikrofilme</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-zeitungen.acdh.oeaw.ac.at/" target="_blank">Archiv der Zeitungsausschnitte</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-interviews.acdh.oeaw.ac.at/" target="_blank">Interviews, Meinungen, Proteste</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-bahr.acdh.oeaw.ac.at/" target="_blank">Korrespondenz mit Hermann Bahr</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-chronik.acdh.oeaw.ac.at/" target="_blank">Chronik</a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-lektueren.acdh.oeaw.ac.at/" target="_blank">Lektüren</a></li>
                                        <li><a class="dropdown-item" href="https://pollaczek.acdh.oeaw.ac.at/" target="_blank">Pollaczek: Schnitzler und ich</a></li>
                                        <li><a class="dropdown-item" href="https://pmb.acdh.oeaw.ac.at/" target="_blank" >PMB – Personen der Moderne</a></li>
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