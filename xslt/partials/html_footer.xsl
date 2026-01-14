<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:local="http://dse-static.foo.bar"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all" version="2.0">
    <xsl:import href="shared.xsl"/>

    <xsl:template name="html_footer">
        <footer class="text-center py-4 mt-5" role="contentinfo">
            <div class="container mt-5">
                <div class="row justify-content-between">
                    <p class="mt-2">
                        <xsl:attribute name="lang">
                            <xsl:value-of select="$language"/>
                        </xsl:attribute>
                        <xsl:value-of select="local:translate('footer.citation_label')"/>
                        <xsl:text> </xsl:text>
                        <xsl:value-of select="local:translate('footer.citation_text')"/>
                        <xsl:text> </xsl:text>
                        <i><xsl:value-of select="local:translate('footer.citation_date')"/></i>
                        <xsl:text>).</xsl:text>
                    </p>
                    <div class="col-md-5 text-start mb-4">
                        <img src="./images/wmv-logo-white.jpg" class="img-fluid my-2" width="150" height="auto">
                            <xsl:attribute name="alt">
                                <xsl:value-of select="local:translate('footer.wmv_alt')"/>
                            </xsl:attribute>
                        </img>
                        <p><xsl:value-of select="local:translate('footer.wmv_text')"/></p>
                    </div>
                    <div class="col-md-5 text-end mb-4">
                        <img src="./images/Stadt_Wien_Kultur_pos_rgb.jpg" class="img-fluid my-2" width="150" height="auto">
                            <xsl:attribute name="alt">
                                <xsl:value-of select="local:translate('footer.stadt_wien_alt')"/>
                            </xsl:attribute>
                        </img>
                        <p><xsl:value-of select="local:translate('footer.stadt_wien_text')"/></p>
                    </div>
                </div>
            </div>
        </footer>


        <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"/>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"/>
        <script src="https://d3js.org/d3.v6.min.js"/>
    </xsl:template>
</xsl:stylesheet>
