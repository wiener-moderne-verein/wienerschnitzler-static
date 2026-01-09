<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:mam="whatever" version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="./partials/html_footer.xsl"/>
    <xsl:import href="./partials/biblStruct-output.xsl"/>
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:value-of select="descendant::tei:titleStmt/tei:title[@level = 'a'][1]/text()"/>
        </xsl:variable>
        <xsl:variable name="doc_description">
            <xsl:choose>
                <xsl:when test="descendant::tei:body//tei:p">
                    <xsl:value-of select="substring(normalize-space((descendant::tei:body//tei:p)[1]), 1, 160)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="concat($doc_title, ' – ', $project_title)"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="filename">
            <xsl:value-of select="replace(tokenize(document-uri(/), '/')[last()], '.xml', '.html')"/>
        </xsl:variable>
        <html lang="de" class="h-100">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                    <xsl:with-param name="page_description" select="$doc_description"/>
                    <xsl:with-param name="page_url" select="concat($base_url, '/', $filename)"/>
                </xsl:call-template>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main>
                    <div class="container col-12" style="max-width:800px" id="main-content">
                        <h1>
                            <xsl:value-of select="$doc_title"/>
                        </h1>
                        <xsl:apply-templates select=".//tei:body"/>
                        <xsl:if test="descendant::tei:note">
                            <div class="footnotes" style="max-width:600px; margin-left: 50px; margin-top: 100px;">
                                <hr style="margin-bottom: 1rem;"/>
                                <small>
                                    <ol>
                                        <xsl:for-each select="descendant::tei:note">
                                            <xsl:variable name="zaehler"
                                                select="count(preceding::tei:note) + 1"/>
                                            <li id="footnote-{$zaehler}" value="{$zaehler}">
                                                <xsl:apply-templates/>
                                                <xsl:text> </xsl:text>
                                                <a href="#note-ref-{$zaehler}" aria-label="Zurück zum Text">↩</a>
                                            </li>
                                        </xsl:for-each>
                                    </ol>
                                </small>
                            </div>
                        </xsl:if>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="tei:div[@type = 'faqs']">
        <div>
            <xsl:apply-templates select="tei:div[@type = 'faq']"/>
        </div>
    </xsl:template>
    <xsl:template match="tei:listBibl">
        <ul class="mt-5">
            <xsl:for-each select="tei:biblStruct">
                <li class="mt-2">
                    <xsl:call-template name="mam:bibliografische-angabe">
                        <xsl:with-param name="biblStruct-input" select="."/>
                    </xsl:call-template>
                </li>
            </xsl:for-each>
        </ul>
    </xsl:template>
    <xsl:template match="tei:div[@type = 'faq']">
        <details>
            <summary>
                <xsl:value-of select="tei:head[1]"/>
            </summary>
            <div>
                <xsl:apply-templates select="tei:list" mode="faq"/>
            </div>
        </details>
    </xsl:template>
    <xsl:template match="tei:list[parent::tei:div/@type = 'faq']" mode="faq">
        <xsl:apply-templates select="tei:item" mode="faq"/>
    </xsl:template>
    <xsl:template match="tei:item" mode="faq">
        <details>
            <summary>
                <xsl:value-of select="tei:q"/>
            </summary>
            <div>
                <xsl:apply-templates select="tei:p"/>
            </div>
        </details>
    </xsl:template>
    <xsl:template match="tei:p">
        <p id="{generate-id()}">
            <xsl:if test="@rend = 'right'">
                <xsl:attribute name="style">
                    <xsl:text>text-align: right</xsl:text>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match="tei:div">
        <div id="{generate-id()}">
            <xsl:apply-templates/>
        </div>
    </xsl:template>
    <xsl:template match="tei:lb">
        <br/>
    </xsl:template>
    <xsl:template match="tei:unclear">
        <abbr title="unclear">
            <xsl:apply-templates/>
        </abbr>
    </xsl:template>
    <xsl:template match="tei:del">
        <del>
            <xsl:apply-templates/>
        </del>
    </xsl:template>
    <xsl:template match="tei:ref">
        <xsl:element name="a">
            <xsl:attribute name="href">
                <xsl:value-of select="@target"/>
            </xsl:attribute>
            <xsl:if test="starts-with(@target, 'http')">
                <xsl:attribute name="target">
                    <xsl:text>_blank</xsl:text>
                </xsl:attribute>
                <xsl:attribute name="rel">
                    <xsl:text>noopener noreferrer</xsl:text>
                </xsl:attribute>
                <xsl:attribute name="aria-label">
                    <xsl:value-of select="concat(., ' - öffnet in neuem Fenster')"/>
                </xsl:attribute>
            </xsl:if>
            <xsl:apply-templates/>
        </xsl:element>
    </xsl:template>
    <xsl:template match="tei:list[@type = 'kontakt']">
        <ul class="list-group list-group-flush">
            <xsl:apply-templates select="tei:item" mode="kontakt"/>
        </ul>
    </xsl:template>
    <xsl:template match="tei:list[not(@type)]">
        <ul class="list-group list-group-flush" style="margin-left: 40px;">
            <xsl:apply-templates select="tei:item"/>
        </ul>
    </xsl:template>
    <xsl:template match="tei:item">
        <li>
            <xsl:apply-templates/>
        </li>
    </xsl:template>
    <xsl:template match="tei:item" mode="kontakt">
        <li class="list-group-item">
            <a href="#" class="text-decoration-none text-primary">
                <xsl:apply-templates/>
            </a>
        </li>
    </xsl:template>
    <xsl:template match="tei:hi[@rend = 'italics']">
        <i>
            <xsl:apply-templates/>
        </i>
    </xsl:template>
    <xsl:template match="tei:note">
        <xsl:variable name="noteNumber" select="count(preceding::tei:note) + 1"/>
        <!-- Verweis im Text -->
        <sup>
            <a href="#footnote-{$noteNumber}" id="note-ref-{$noteNumber}">
                <xsl:value-of select="$noteNumber"/>
            </a>
        </sup>
    </xsl:template>
</xsl:stylesheet>
