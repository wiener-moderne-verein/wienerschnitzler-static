<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:local="http://dse-static.foo.bar"
    version="2.0" exclude-result-prefixes="local">

    <xsl:import href="shared.xsl"/>

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
                }
            }
        </script>
    </xsl:template>

</xsl:stylesheet>
