<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="#all" version="2.0">
    <xsl:include href="./params.xsl"/>
    <xsl:template name="html_head">
        <xsl:param name="html_title" select="$project_short_title"/>
        <xsl:param name="page_description" select="$project_title"/>
        <xsl:param name="page_url"/>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
        <link rel="icon" href="{$project_logo}" sizes="any"/>
        <title>
            <xsl:value-of select="$html_title"/>
        </title>
        <xsl:if test="$page_url">
            <link rel="canonical" href="{$page_url}"/>
        </xsl:if>
        <meta name="description" content="{$page_description}"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="{$html_title}"/>
        <meta property="og:description" content="{$page_description}"/>
        <xsl:if test="$page_url">
            <meta property="og:url" content="{$page_url}"/>
        </xsl:if>
        <meta property="og:site_name" content="{$project_short_title}"/>
        <meta property="og:image" content="{$og_image}"/>
        <meta property="og:image:alt"
            content="Wiener Schnitzler – Digitale Karte von Arthur Schnitzlers Aufenthalten in Wien"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>
        <meta property="og:locale" content="de_AT"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="{$html_title}"/>
        <meta name="twitter:description" content="{$page_description}"/>
        <meta name="twitter:image" content="{$og_image}"/>
        <meta name="twitter:image:alt"
            content="Wiener Schnitzler – Digitale Karte von Arthur Schnitzlers Aufenthalten in Wien"/>
        <!-- Preload kritischer Ressourcen für bessere Performance -->
        <link rel="preload" href="css/style.css" as="style"/>
        <link rel="preload" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro"
            as="style"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"/>
        <link rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>
        <link rel="stylesheet" href="css/style.css" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet"
            type="text/css"/>
        <!-- Favicon -->
        <link rel="apple-touch-icon" sizes="57x57" href="images/apple-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="images/apple-icon-60x60.png"/>
        <link rel="apple-touch-icon" sizes="72x72" href="images/apple-icon-72x72.png"/>
        <link rel="apple-touch-icon" sizes="76x76" href="images/apple-icon-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="images/apple-icon-114x114.png"/>
        <link rel="apple-touch-icon" sizes="120x120" href="images/apple-icon-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="images/apple-icon-144x144.png"/>
        <link rel="apple-touch-icon" sizes="152x152" href="images/apple-icon-152x152.png"/>
        <link rel="apple-touch-icon" sizes="180x180" href="images/apple-icon-180x180.png"/>
        <link rel="icon" type="image/png" sizes="192x192" href="images/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="96x96" href="images/favicon-96x96.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png"/>
        <link rel="manifest" href="images//manifest.json"/>
        <meta name="msapplication-TileColor" content="#ffffff"/>
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
        <meta name="theme-color" content="#ffffff"/>
        <!-- JSON-LD Structured Data -->
        <script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Wiener Schnitzler – Schnitzlers Wien",
    "alternateName": "Wiener Schnitzler",
    "description": "Digitale Karte von Arthur Schnitzlers Aufenthalten in Wien (1862-1931). Geografische Verortung seiner Wege durch die Stadt basierend auf Tagebuch und Korrespondenz.",
    "inLanguage": "de-AT",
    "about": {
        "@type": "Person",
        "@id": "https://d-nb.info/gnd/118609807",
        "name": "Arthur Schnitzler",
        "birthDate": "1862-05-15",
        "deathDate": "1931-10-21",
        "birthPlace": {
            "@type": "Place",
            "name": "Wien, Praterstraße",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.2082,
                "longitude": 16.3738
            }
        },
        "deathPlace": {
            "@type": "Place",
            "name": "Wien, Sternwartestraße",
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 48.2082,
                "longitude": 16.3738
            }
        },
        "sameAs": [
            "https://de.wikipedia.org/wiki/Arthur_Schnitzler",
            "https://d-nb.info/gnd/118609807",
            "https://www.wikidata.org/wiki/Q44331"
        ]
    },
    "creator": {
        "@type": "Organization",
        "name": "Wiener Moderne Verein",
        "url": "https://wiener-moderne-verein.github.io/"
    },
    "isBasedOn": [
        {
            "@type": "Dataset",
            "name": "Schnitzler Tagebuch",
            "url": "https://schnitzler-tagebuch.acdh.oeaw.ac.at/"
        },
        {
            "@type": "Dataset",
            "name": "Schnitzler Briefe",
            "url": "https://schnitzler-briefe.acdh.oeaw.ac.at/"
        }
    ],
    "license": "https://creativecommons.org/licenses/by/4.0/"
}</script>
    </xsl:template>
</xsl:stylesheet>
