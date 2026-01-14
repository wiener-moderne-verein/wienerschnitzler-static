<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    <xsl:param name="directory_name">wienerschnitzler-static</xsl:param>
    <xsl:param name="project_title">Wiener Schnitzler – Schnitzlers Wien</xsl:param>
    <xsl:param name="redmine_id">18716</xsl:param>
    <xsl:param name="project_short_title">wienerschnitzler</xsl:param>
    <xsl:param name="github_url">https://github.com/wiener-moderne-verein/wienerschnitzler-static</xsl:param>
    <xsl:param name="html_title">wienerschnitzler</xsl:param>
    <xsl:param name="project_logo">images/logo.png</xsl:param>
    <xsl:param name="og_image">images/og-image.jpg</xsl:param>
    <xsl:param name="base_url">https://wienerschnitzler.org</xsl:param>
    <xsl:param name="data_repo">https://github.com/wiener-moderne-verein/wienerschnitzler-data</xsl:param>

    <!-- Language parameter: 'de' or 'en' -->
    <xsl:param name="language">de</xsl:param>

    <!-- Load translation file based on language parameter -->
    <xsl:variable name="translations" select="document(concat('../translations-', $language, '.xml'))/translations"/>
</xsl:stylesheet>