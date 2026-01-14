<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:tei="http://www.tei-c.org/ns/1.0"
   xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:local="http://dse-static.foo.bar" version="2.0"
   exclude-result-prefixes="xsl tei xs local">
   <xsl:import href="./partials/shared.xsl"/>
   <xsl:import href="./partials/html_head.xsl"/>
   <xsl:import href="./partials/html_navbar.xsl"/>
   <xsl:import href="./partials/html_footer.xsl"/>
   <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
      omit-xml-declaration="yes"/>

   <!-- Override for index page - base-uri() returns listplace.xml but we want index.html -->
   <xsl:param name="output_filename">index.html</xsl:param>

   <!-- Template for index cards -->
   <xsl:template name="index-card">
      <xsl:param name="href"/>
      <xsl:param name="aria_key"/>
      <xsl:param name="img_src"/>
      <xsl:param name="img_alt_key"/>
      <xsl:param name="text_before_key"/>
      <xsl:param name="link_text_key"/>
      <xsl:param name="text_after" select="''"/>
      <xsl:param name="external" select="false()"/>

      <div class="col-12 col-md-6 col-lg-3">
         <div class="card content-item">
            <!-- Dynamically adjust href for language -->
            <xsl:variable name="localized_href">
               <xsl:choose>
                  <xsl:when test="$external or starts-with($href, 'http')">
                     <xsl:value-of select="$href"/>
                  </xsl:when>
                  <xsl:when test="$language = 'en' and contains($href, '.html')">
                     <xsl:value-of select="replace($href, '\.html', '-en.html')"/>
                  </xsl:when>
                  <xsl:otherwise>
                     <xsl:value-of select="$href"/>
                  </xsl:otherwise>
               </xsl:choose>
            </xsl:variable>
            <a href="{$localized_href}">
               <xsl:if test="$external">
                  <xsl:attribute name="target">_blank</xsl:attribute>
                  <xsl:attribute name="rel">noopener noreferrer</xsl:attribute>
               </xsl:if>
               <xsl:attribute name="aria-label">
                  <xsl:value-of select="local:translate($aria_key)"/>
                  <xsl:if test="$external">
                     <xsl:value-of select="concat(' - ', local:translate('aria.opens_new_window'))"/>
                  </xsl:if>
               </xsl:attribute>
               <img src="{$img_src}" class="card-img-top" loading="lazy">
                  <xsl:attribute name="alt">
                     <xsl:value-of select="local:translate($img_alt_key)"/>
                  </xsl:attribute>
               </img>
            </a>
            <div class="card-body">
               <p class="card-text">
                  <xsl:value-of select="local:translate($text_before_key)"/>
                  <xsl:text> </xsl:text>
                  <a href="{$localized_href}">
                     <xsl:if test="$external">
                        <xsl:attribute name="target">_blank</xsl:attribute>
                        <xsl:attribute name="rel">noopener noreferrer</xsl:attribute>
                        <xsl:attribute name="aria-label">
                           <xsl:value-of select="concat(local:translate($link_text_key), ' - ', local:translate('aria.opens_new_window'))"/>
                        </xsl:attribute>
                     </xsl:if>
                     <xsl:value-of select="local:translate($link_text_key)"/>
                  </a>
                  <xsl:value-of select="$text_after"/>
               </p>
            </div>
         </div>
      </div>
   </xsl:template>

   <xsl:template match="/">
      <html class="h-100">
         <xsl:attribute name="lang">
            <xsl:value-of select="$language"/>
         </xsl:attribute>
         <head>
            <xsl:variable name="doc_title" select="local:translate('index.title')"/>
            <xsl:variable name="doc_description" select="local:translate('index.meta_description')"/>
            <xsl:variable name="page_filename">
               <xsl:choose>
                  <xsl:when test="$language = 'en'">index-en.html</xsl:when>
                  <xsl:otherwise>index.html</xsl:otherwise>
               </xsl:choose>
            </xsl:variable>
            <xsl:call-template name="html_head">
               <xsl:with-param name="html_title" select="$doc_title"/>
               <xsl:with-param name="page_description" select="$doc_description"/>
               <xsl:with-param name="page_url" select="concat($base_url, '/', $page_filename)"/>
            </xsl:call-template>
            <meta name="keywords">
               <xsl:attribute name="content">
                  <xsl:value-of select="local:translate('index.keywords')"/>
               </xsl:attribute>
            </meta>
         </head>
         <body>
            <!-- Navbar -->
            <xsl:call-template name="nav_bar"/>
            <main role="main">
            <div class="container mt-5" id="main-content">
               <div class="row">
                  <h1><xsl:value-of select="local:translate('index.main_title')"/></h1>
                  <h2 class="fs-4 text-center"><xsl:value-of select="local:translate('index.subtitle')"/></h2>
                  <!-- Rechte Spalte für das Bild (wird zuerst angezeigt auf kleinen Bildschirmen) -->
                  <div class="col-md-6 order-2 order-md-1">
                     <div class="image-container">
                        <img id="background-image" class="background"
                           src="./images/wienmuseum/AnsichtenVonWien00001.jpg" loading="lazy">
                           <xsl:attribute name="alt">
                              <xsl:value-of select="local:translate('index.image_alt_background')"/>
                           </xsl:attribute>
                        </img>
                        <img id="foreground-image" class="foreground"
                           src="./images/schnitzler-index2.png" loading="lazy">
                           <xsl:attribute name="alt">
                              <xsl:value-of select="local:translate('index.image_alt_foreground')"/>
                           </xsl:attribute>
                        </img>
                     </div>
                  </div>
                  <!-- Linke Spalte für den Text -->
                  <div class="col-md-6 order-1 order-md-2">
                     <p class="lead">
                        <xsl:value-of select="local:translate('index.intro_text')"/>
                        <xsl:text> </xsl:text>
                        <a href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" class="schnitzler-tagebuch-link">
                           <xsl:attribute name="aria-label">
                              <xsl:value-of select="concat(local:translate('index.intro_diary_link'), ' - ', local:translate('aria.opens_new_window'))"/>
                           </xsl:attribute>
                           <xsl:value-of select="local:translate('index.intro_diary_link')"/>
                        </a>
                        <xsl:text>, </xsl:text>
                        <xsl:if test="$language = 'de'"><xsl:text>seiner </xsl:text></xsl:if>
                        <xsl:if test="$language = 'en'"><xsl:text>his </xsl:text></xsl:if>
                        <a href="https://schnitzler-briefe.acdh.oeaw.ac.at/" target="_blank" rel="noopener noreferrer" class="schnitzler-briefe-link">
                           <xsl:attribute name="aria-label">
                              <xsl:value-of select="concat(local:translate('index.intro_letters_link'), ' - ', local:translate('aria.opens_new_window'))"/>
                           </xsl:attribute>
                           <xsl:value-of select="local:translate('index.intro_letters_link')"/>
                        </a>
                        <xsl:text> </xsl:text>
                        <xsl:value-of select="local:translate('index.intro_text_continued')"/>
                     </p>
                  </div>
               </div>
            </div>

            <section class="container my-5">
               <div class="row g-3">
                  <!-- Card: Aufenthaltstage -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">gesamt.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_days_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltstage.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_days_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_days_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_days_link</xsl:with-param>
                     <xsl:with-param name="text_after">.</xsl:with-param>
                  </xsl:call-template>

                  <!-- Card: Typen -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">gesamt_typen.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_types_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltstypen.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_types_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_types_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_types_link</xsl:with-param>
                     <xsl:with-param name="text_after">.</xsl:with-param>
                  </xsl:call-template>

                  <!-- Card: Verzeichnis -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">listplace.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_directory_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltsorte.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_directory_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_directory_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_directory_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_directory_text_after'))"/>
                  </xsl:call-template>

                  <!-- Card: Nicht identifizierte Orte -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">listplace-missing.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_missing_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/fehlend.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_missing_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_missing_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_missing_link</xsl:with-param>
                     <xsl:with-param name="text_after">.</xsl:with-param>
                  </xsl:call-template>

                  <!-- Card: Schnitzler und ich -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">schnitzler-und-ich.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_schnitzler_and_me_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/schnitzlerundich.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_schnitzler_and_me_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_schnitzler_and_me_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_schnitzler_and_me_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_schnitzler_and_me_text_after'))"/>
                  </xsl:call-template>

                  <!-- Card: Tag -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">tag.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_day_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltstag.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_day_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_day_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_day_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_day_text_after'))"/>
                  </xsl:call-template>

                  <!-- Card: Monat -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">monat.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_month_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltsmonat.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_month_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_month_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_month_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_month_text_after'))"/>
                  </xsl:call-template>

                  <!-- Card: Jahr -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">jahr.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_year_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltsjahr.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_year_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_year_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_year_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="local:translate('index.card_year_text_after')"/>
                  </xsl:call-template>

                  <!-- Card: Dekade -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">dekade.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_decade_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/aufenthaltsdekade.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_decade_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_decade_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_decade_link</xsl:with-param>
                     <xsl:with-param name="text_after">.</xsl:with-param>
                  </xsl:call-template>

                  <!-- Card: Übersicht -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">uebersicht.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_overview_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/uebersicht.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_overview_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_overview_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_overview_link</xsl:with-param>
                     <xsl:with-param name="text_after">.</xsl:with-param>
                  </xsl:call-template>

                  <!-- Card: Zeitleiste -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">zeitleiste.html</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_timeline_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/zeitleiste.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_timeline_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_timeline_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_timeline_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_timeline_text_after'))"/>
                  </xsl:call-template>

                  <!-- Card: Kepler.gl -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">https://kepler.gl/demo/map?mapUrl=https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_kepler_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/keplergl.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_kepler_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_kepler_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_kepler_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_kepler_text_after'))"/>
                     <xsl:with-param name="external" select="true()"/>
                  </xsl:call-template>

                  <!-- Card: GitHub -->
                  <xsl:call-template name="index-card">
                     <xsl:with-param name="href">https://github.com/wiener-moderne-verein/wienerschnitzler-data</xsl:with-param>
                     <xsl:with-param name="aria_key">index.card_github_aria</xsl:with-param>
                     <xsl:with-param name="img_src">images/index/github.png</xsl:with-param>
                     <xsl:with-param name="img_alt_key">index.card_github_img_alt</xsl:with-param>
                     <xsl:with-param name="text_before_key">index.card_github_text</xsl:with-param>
                     <xsl:with-param name="link_text_key">index.card_github_link</xsl:with-param>
                     <xsl:with-param name="text_after" select="concat(' ', local:translate('index.card_github_text_after'))"/>
                     <xsl:with-param name="external" select="true()"/>
                  </xsl:call-template>

               </div>
            </section>
            </main>



            <!-- Footer -->
            <xsl:call-template name="html_footer"/>
            <script src="./js/index_randomBackground.js"/>
         </body>
      </html>
   </xsl:template>
</xsl:stylesheet>
