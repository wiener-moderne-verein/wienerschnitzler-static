<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:tei="http://www.tei-c.org/ns/1.0" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    version="2.0" exclude-result-prefixes="xsl tei xs">
    <xsl:output encoding="UTF-8" media-type="text/html" method="html" version="5.0" indent="yes"
        omit-xml-declaration="yes"/>
    <xsl:import href="./partials/html_navbar.xsl"/>
    <xsl:import href="./partials/html_head.xsl"/>
    <xsl:import href="partials/html_footer.xsl"/>
    <xsl:template match="/">
        <xsl:variable name="doc_title">
            <xsl:value-of select=".//tei:title[@type = 'main'][1]/text()"/>
        </xsl:variable>
        <html class="h-100">
            <head>
                <xsl:call-template name="html_head">
                    <xsl:with-param name="html_title" select="$doc_title"/>
                </xsl:call-template>
            </head>
            <body class="d-flex flex-column h-100">
                <xsl:call-template name="nav_bar"/>
                <main class="flex-shrink-0 flex-grow-1">
                    <div class="container">
                        <h1>
                            <xsl:value-of select="$doc_title"/>
                        </h1>
                        <xsl:apply-templates select=".//tei:body"/>
                    </div>
                </main>
                <xsl:call-template name="html_footer"/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="tei:div[@type = 'faqs']">
        <div class="accordion" id="faqAccordion">
            <xsl:apply-templates select="tei:div[@type = 'faq']"/>
        </div>
    </xsl:template>
    
    <xsl:template match="tei:div[@type = 'faq']">
        <div class="accordion-item">
            <xsl:variable name="faqId" select="@xml:id"/>
            <h2 class="accordion-header" id="{concat('heading', $faqId)}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse"
                    data-bs-target="{concat('#collapseCategory', $faqId)}" aria-expanded="true"
                    aria-controls="{concat('collapseCategory', $faqId)}">
                    <xsl:value-of select="tei:head[1]"/>
                </button>
            </h2>
            <div id="{concat('collapseCategory', $faqId)}" class="accordion-collapse collapse show"
                aria-labelledby="{concat('heading', $faqId)}" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                    <div class="accordion" id="{concat('category', $faqId, 'Accordion')}">
                        <xsl:apply-templates select="tei:list" mode="faq"/>
                    </div>
                </div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="tei:list[parent::tei:div/@type='faq']" mode="faq">
        <xsl:apply-templates select="tei:item" mode="faq"/>
    </xsl:template>
    
    <xsl:template match="tei:item" mode="faq">
        <xsl:variable name="faqParentId" select="ancestor::tei:div[@type='faq']/@xml:id"/>
        <xsl:variable name="questionId" select="concat($faqParentId, '-q', position())"/>
        <div class="accordion-item">
            <h2 class="accordion-header" id="{concat('heading', $questionId)}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="{concat('#collapse', $questionId)}" aria-expanded="false"
                    aria-controls="{concat('collapse', $questionId)}">
                    <xsl:value-of select="tei:q"/>
                </button>
            </h2>
            <div id="{concat('collapse', $questionId)}" class="accordion-collapse collapse"
                aria-labelledby="{concat('heading', $questionId)}" data-bs-parent="{concat('#category', $faqParentId, 'Accordion')}">
                <div class="accordion-body">
                    <xsl:apply-templates select="tei:p"/>
                </div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p id="{generate-id()}">
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
            </xsl:if>
            <xsl:apply-templates />
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="tei:list[@type='kontakt']">
        <ul class="list-group list-group-flush">
            <xsl:apply-templates select="tei:item" mode="kontakt"/>
        </ul>
    </xsl:template>
    
    <xsl:template match="tei:item" mode="kontakt">
        <li class="list-group-item">
            <a href="#" class="text-decoration-none text-primary">
                <xsl:apply-templates/>
            </a>
        </li>
    </xsl:template>
    
</xsl:stylesheet>
