<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="#all" version="2.0">
    <xsl:template match="/" name="nav_bar">
        
        <header>
            <div class="container-fluid">
                <nav class="navbar navbar-expand-lg navbar-light bg-light" aria-label="Primary">
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
                                        <li><a class="dropdown-item" href="about.html">Über das Projekt</a></li>
                                        <li><a class="dropdown-item" href="imprint.html">Impressum</a></li>
                                        <li><a class="dropdown-item" href="danke.html">Danksagung</a></li>
                                        <li><a class="dropdown-item" href="literatur.html">Literatur</a></li>
                                    </ul>
                                </li>
                                
                                <!-- Orte Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="OrteDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Orte
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="OrteDropdown">
                                        <li><a class="dropdown-item" href="listplace.html">Verzeichnis</a></li>
                                        <li><a class="dropdown-item" href="https://kepler.gl/demo/map?mapUrl=https://dl.dropboxusercontent.com/scl/fi/y8bpsyosh2uwvawwi2jdh/keplergl_ygz1fc.json?rlkey=rl5x7uoswnd0cttr1mw2ncw18" target="_blank">Visualisierung mit Kepler.gl</a></li>
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
                                    <a class="nav-link dropdown-toggle" href="#" id="schnitzlerLinksDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Schnitzler-Links
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="schnitzlerLinksDropdown">
                                        <li><a class="dropdown-item" href="#">Wikipedia</a></li>
                                        <li><a class="dropdown-item" href="#">Tagebuch</a></li>
                                        <li><a class="dropdown-item" href="#">Briefe</a></li>
                                        <li><a class="dropdown-item" href="#">Mikrofilme</a></li>
                                        <li><a class="dropdown-item" href="#">Zeitungsarchiv</a></li>
                                        <li><a class="dropdown-item" href="#">Chronik</a></li>
                                        <li><a class="dropdown-item" href="#">PMB</a></li>
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