<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet 
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all"
    version="2.0">
    <xsl:template match="/" name="html_footer">
        <footer class="text-center py-4 mt-5">
            <div class="container mt-5">
                <div class="row justify-content-between">
                    <div class="col-md-5 text-start mb-4">
                        <img src="./images/wmv-logo-white.jpg" alt="Logo Wiener Moderne Verein" class="img-fluid my-2" width="150px"/>
                        <p>Ein Projekt von: Wiener Moderne Verein</p>
                    </div>
                    <div class="col-md-5 text-end mb-4">
                        <img src="./images/Stadt_Wien_Kultur_pos_rgb.jpg" alt="Logo Stadt Wien Kultur" class="img-fluid my-2" width="150px"/>
                        <p>Gefördert von der Stadt Wien Kultur (2024–2025)</p>
                    </div>
                <p class="mt-2"><i>Zitiervorschlag</i>: Martin Anton Müller, Laura Untner: Wiener Schnitzler – Schnitzlers Wien. Eine geografische
                     Verortung von Arthur Schnitzler. Wien, Berlin 2025, 
                     https://wienerschnitzler.org/ (Zugriff am <i>Datum</i>).</p>
                </div>
            </div>
        </footer>
        
        
        <script src="https://code.jquery.com/jquery-3.6.3.min.js" integrity="sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        <script src="https://d3js.org/d3.v6.min.js"></script>
    </xsl:template>
</xsl:stylesheet>