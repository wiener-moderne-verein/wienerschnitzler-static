<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:local="http://dse-static.foo.bar"
    version="2.0" exclude-result-prefixes="local">

    <xsl:import href="shared.xsl"/>

    <!-- Load place types -->
    <xsl:variable name="place_types" select="document('../../data/indices/ortstypen.xml')"/>

    <!-- Template to inject JavaScript translations -->
    <xsl:template name="js_translations">
        <script id="translations-data" type="application/json">
            {
                "filter": {
                    "all": "<xsl:value-of select="local:translate('js.filter.all')"/>",
                    "none": "<xsl:value-of select="local:translate('js.filter.none')"/>"
                },
                "location": {
                    "all": "<xsl:value-of select="local:translate('js.location.all')"/>"
                },
                "popup": {
                    "one_day": "<xsl:value-of select="local:translate('js.popup.one_day')"/>",
                    "days": "<xsl:value-of select="local:translate('js.popup.days')"/>",
                    "no_stays": "<xsl:value-of select="local:translate('js.popup.no_stays')"/>"
                },
                "place_types": {<xsl:for-each select="$place_types//item">
                    <xsl:variable name="de_name" select="name[@xml:lang='de']"/>
                    <xsl:variable name="target_name">
                        <xsl:choose>
                            <xsl:when test="$language = 'en' and name[@xml:lang='en']">
                                <xsl:value-of select="name[@xml:lang='en']"/>
                            </xsl:when>
                            <xsl:otherwise>
                                <xsl:value-of select="$de_name"/>
                            </xsl:otherwise>
                        </xsl:choose>
                    </xsl:variable>
                    "<xsl:value-of select="replace($de_name, '&quot;', '\\&quot;')"/>": "<xsl:value-of select="replace($target_name, '&quot;', '\\&quot;')"/>"<xsl:if test="position() != last()">,</xsl:if>
                </xsl:for-each>}
            }
        </script>
    </xsl:template>

</xsl:stylesheet>
