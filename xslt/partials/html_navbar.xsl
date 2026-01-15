<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:local="http://dse-static.foo.bar"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="#all" version="2.0">
    <xsl:import href="shared.xsl"/>

    <!-- Optional parameter to override page name detection -->
    <xsl:param name="output_filename" select="''"/>

    <!-- Helper function to generate language-aware URLs -->
    <xsl:function name="local:get-url">
        <xsl:param name="base" as="xs:string"/>
        <xsl:choose>
            <xsl:when test="$language = 'en'">
                <xsl:value-of select="concat($base, '-en.html')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="concat($base, '.html')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <xsl:template name="nav_bar">
        <a href="#main-content" class="skip-link" accesskey="1"><xsl:value-of select="local:translate('nav.skip_to_content')"/></a>
        <header role="banner">
            <div class="container">
                <nav class="navbar navbar-expand-lg navbar-light" role="navigation">
                    <xsl:attribute name="aria-label">
                        <xsl:value-of select="local:translate('aria.main_navigation')"/>
                    </xsl:attribute>
                    <!-- Roter BETA-Button -->
                            <!--<span class="navbar-text" style="position: relative;">
                                <button class="btn btn-danger disabled" type="button" style="color: white; background-color: red; font-size: 0.75rem; padding: 0.25rem 0.5rem; transform: rotate(-10deg); position: absolute; bottom: -27px; right: -155px; z-index:2000;">BETA</button>
                            </span>-->
                    <div class="container">
                        <img src="images/wienerschnitzler.jpg" class="me-2" height="30px" alt="Wiener Schnitzler Logo"/>

                        <a class="navbar-brand" href="{local:get-url('index')}">
                            <xsl:value-of select="local:translate('nav.site_title')"/>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false">
                            <xsl:attribute name="aria-label">
                                <xsl:value-of select="local:translate('nav.toggle_menu')"/>
                            </xsl:attribute>
                            <span class="navbar-toggler-icon" aria-hidden="true"></span>
                        </button>
                        
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav flex-grow-1 mb-2 mb-lg-0">
                                <!-- Projekt Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="projektDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <xsl:value-of select="local:translate('nav.project')"/>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="projektDropdown">
                                        <li><a class="dropdown-item" href="{local:get-url('projekt')}">
                                            <xsl:value-of select="local:translate('nav.project.about')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('faqs')}">
                                            <xsl:value-of select="local:translate('nav.project.faqs')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('literatur')}">
                                            <xsl:value-of select="local:translate('nav.project.bibliography')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('kontakt')}">
                                            <xsl:value-of select="local:translate('nav.project.contact')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('impressum')}">
                                            <xsl:value-of select="local:translate('nav.project.imprint')"/>
                                        </a></li>
                                    </ul>
                                </li>

                                <!-- Orte Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="OrteDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <xsl:value-of select="local:translate('nav.places')"/>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="OrteDropdown">
                                        <li><a class="dropdown-item" href="{local:get-url('gesamt')}">
                                            <xsl:value-of select="local:translate('nav.places.days')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('gesamt_typen')}">
                                            <xsl:value-of select="local:translate('nav.places.types')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('listplace')}">
                                            <xsl:value-of select="local:translate('nav.places.directory')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('listplace-missing')}">
                                            <xsl:value-of select="local:translate('nav.places.missing')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('schnitzler-und-ich')}">
                                            <xsl:value-of select="local:translate('nav.places.schnitzler_and_me')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.places.kepler'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.places.kepler')"/>
                                        </a></li>
                                    </ul>
                                </li>

                                <!-- Zeiträume Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="zeitraeumeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <xsl:value-of select="local:translate('nav.periods')"/>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="zeitraeumeDropdown">
                                        <li><a class="dropdown-item" href="{local:get-url('tag')}">
                                            <xsl:value-of select="local:translate('nav.periods.day')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('monat')}">
                                            <xsl:value-of select="local:translate('nav.periods.month')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('jahr')}">
                                            <xsl:value-of select="local:translate('nav.periods.year')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('dekade')}">
                                            <xsl:value-of select="local:translate('nav.periods.decade')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('uebersicht')}">
                                            <xsl:value-of select="local:translate('nav.periods.overview')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="{local:get-url('zeitleiste')}">
                                            <xsl:value-of select="local:translate('nav.periods.timeline')"/>
                                        </a></li>

                                    </ul>
                                </li>
                                
                                <!-- Schnitzler-Links Dropdown -->
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="schnitzlerLinksDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <xsl:value-of select="local:translate('nav.schnitzler')"/>
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="schnitzlerLinksDropdown">
                                        <li><a class="dropdown-item" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="href">
                                                <xsl:choose>
                                                    <xsl:when test="$language = 'en'">https://en.wikipedia.org/wiki/Arthur_Schnitzler</xsl:when>
                                                    <xsl:otherwise>https://de.wikipedia.org/wiki/Arthur_Schnitzler</xsl:otherwise>
                                                </xsl:choose>
                                            </xsl:attribute>
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.wikipedia'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.wikipedia')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://www.geschichtewiki.wien.gv.at/Arthur_Schnitzler" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.wien_wiki'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.wien_wiki')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.diary'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.diary')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.letters'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.letters')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://www.arthur-schnitzler.de" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.works'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.works')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-mikrofilme.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.microfilms'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.microfilms')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-zeitungen.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.newspapers'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.newspapers')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-interviews.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.interviews'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.interviews')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-kultur.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.culture'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.culture')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-bahr.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.bahr'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.bahr')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-chronik.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.chronicle'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.chronicle')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-lektueren.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.readings'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.readings')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://pollaczek.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.pollaczek'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.pollaczek')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://schnitzler-orte.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.locations'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.locations')"/>
                                        </a></li>
                                        <li><a class="dropdown-item" href="https://pmb.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer">
                                            <xsl:attribute name="aria-label">
                                                <xsl:value-of select="concat(local:translate('nav.schnitzler.pmb'), ' - ', local:translate('aria.opens_new_window'))"/>
                                            </xsl:attribute>
                                            <xsl:value-of select="local:translate('nav.schnitzler.pmb')"/>
                                        </a></li>
                                    </ul>
                                </li>

                                <!-- Language Switcher with Flags (right-aligned) -->
                                <li class="nav-item ms-auto">
                                    <xsl:choose>
                                        <xsl:when test="$language = 'de'">
                                            <!-- Show UK flag when on German page -->
                                            <a class="nav-link d-flex align-items-center" href="#" id="lang-switcher" title="English" aria-label="Switch to English">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 60 30" style="border: 1px solid #ddd;">
                                                    <rect width="60" height="30" fill="#012169"/>
                                                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                                                    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/>
                                                    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#fff" stroke-width="10"/>
                                                    <path d="M30,0 L30,30 M0,15 L60,15" stroke="#C8102E" stroke-width="6"/>
                                                </svg>
                                            </a>
                                        </xsl:when>
                                        <xsl:otherwise>
                                            <!-- Show Austrian flag when on English page -->
                                            <a class="nav-link d-flex align-items-center" href="#" id="lang-switcher" title="Deutsch" aria-label="Zu Deutsch wechseln">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 900 600" style="border: 1px solid #ddd;">
                                                    <rect width="900" height="600" fill="#ED2939"/>
                                                    <rect width="900" height="400" fill="#FFF"/>
                                                    <rect width="900" height="200" fill="#ED2939"/>
                                                </svg>
                                            </a>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </li>
                            </ul>

                        </div>
                    </div>
                </nav>
            </div>
        </header>

        <!-- Language Switcher Script -->
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                var langSwitcher = document.getElementById('lang-switcher');
                if (langSwitcher) {
                    var currentPath = window.location.pathname;
                    var currentFile = currentPath.split('/').pop() || 'index.html';
                    var targetFile;

                    // Toggle between German and English versions
                    if (currentFile.endsWith('-en.html')) {
                        // Currently on English page, switch to German
                        targetFile = currentFile.replace('-en.html', '.html');
                    } else {
                        // Currently on German page, switch to English
                        targetFile = currentFile.replace('.html', '-en.html');
                    }

                    langSwitcher.href = targetFile;
                }
            });
        </script>

        <!-- AI Translation Notice Toast (only for English) -->
        <xsl:if test="$language = 'en'">
            <div class="position-fixed top-0 end-0 p-3" style="z-index: 11; margin-top: 80px;">
                <div id="aiNoticeToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="8000">
                    <div class="toast-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="me-2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <strong class="me-auto"><xsl:value-of select="local:translate('ai.notice.title')"/></strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        <xsl:value-of select="local:translate('ai.notice.message')"/>
                    </div>
                </div>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    // Check if user hasn't seen the notice in this session
                    if (!sessionStorage.getItem('aiNoticeShown')) {
                        var toastEl = document.getElementById('aiNoticeToast');
                        if (toastEl) {
                            var toast = new bootstrap.Toast(toastEl);
                            toast.show();
                            sessionStorage.setItem('aiNoticeShown', 'true');
                        }
                    }
                });
            </script>
        </xsl:if>

    </xsl:template>
</xsl:stylesheet>