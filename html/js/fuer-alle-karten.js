function createCircleMarker(feature, latlng) {
    const importance = feature.properties.importance || 0;
    const color = getColorByImportance(importance);
    const intensifiedColor = intensifyColor(color);
    const radius = 5 + (importance / 5000) * 10;
    
    return L.circleMarker(latlng, {
        radius: Math.min(13, Math.max(3, radius)), // Radius zwischen 3 und 13
        color: intensifiedColor, // Intensivere Randfarbe
        fillColor: color,      // Füllfarbe basierend auf der Wichtigkeit
        fillOpacity: 1,        // Füllungsdeckkraft
        weight: 2
    });
}

// Funktion zum Initialisieren der Karte (für das große Karten-Element)
function initializeMapLarge() {
    window.map = L.map('map-large').setView([48.2082, 16.3738], 5);
    
    // Carto Positron Tile-Layer hinzufügen
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map);
}
  
// Funktion zum Initialisieren der Karte (für das normale Karten-Element)
function initializeMap() {
    window.map = L.map('map').setView([48.2082, 16.3738], 5);
    
    // Carto Positron Tile-Layer hinzufügen
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map);
}
  
function createPopupContent(feature) {
    const title = feature.properties.title || 'Kein Titel';
    const id = feature.properties.id || '#';
    const titleLink = `<a href="${id}.html" target="_blank" class="text-dark text-decoration-none">${title} →</a>`;

    // Hole die rohen Timestamps (können als Array oder als String vorliegen)
    const datesRaw = feature.properties.timestamp || [];
    let allDates = [];
    if (Array.isArray(datesRaw)) {
        allDates = datesRaw;
    } else if (typeof datesRaw === 'string') {
        allDates = [datesRaw];
    }

    // Lese den URL-Parameter "years" aus
    const params = new URLSearchParams(window.location.search);
    let yearFilterPresent = false;
    let selectedYears = [];
    let filteredDates = allDates; // Standard: alle Tage werden genutzt
    if (params.has("years") && params.get("years") !== "") {
        yearFilterPresent = true;
        const yearsParam = params.get("years");
        if (yearsParam === "0") {
            // "0" signalisiert, dass keine Jahre ausgewählt wurden
            selectedYears = [];
        } else {
            // Erwartet wird z. B. "2018_2019_2020"
            selectedYears = yearsParam.split("_").map(s => s.trim()).filter(s => s !== "");
        }
        // Filtere die Tage, sodass nur jene übrigbleiben, deren Jahr im Set der ausgewählten Jahre enthalten ist.
        filteredDates = allDates.filter(date => selectedYears.includes(date.substring(0, 4)));
    }

    // Anzahl der relevanten Aufenthaltstage (je nach Filter)
    const count = filteredDates.length;

    // Erstelle Links für die ersten 10 relevanten Tage
    let links = "";
    if (filteredDates.length > 0) {
        links = filteredDates.slice(0, 10)
            .map(date => `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`)
            .join('<br>');
    }
    if (filteredDates.length > 10) {
        const remainingCount = filteredDates.length - 10;
        links += `<p style="text-align: right;">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
    }

    // Erstelle den anzuzeigenden Text (stayInfo)
    let stayInfo = "";
    if (yearFilterPresent) {
        if (selectedYears.length === 0) {
            // Es wurde ein Jahresfilter gesetzt, aber keine Jahre ausgewählt
            stayInfo = "Keine Aufenthalte ausgewählt.";
        } else if (selectedYears.length === 1) {
            // Ein Jahr ausgewählt: "Ein Aufenthaltstag im Jahr 2019" oder "5 Aufenthaltstage im Jahr 2019"
            stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) +
                       " im Jahr " + selectedYears[0] +":";
        } else {
            // Mehrere Jahre ausgewählt: "Ein Aufenthaltstag in den Jahren 2018, 2019" oder "5 Aufenthaltstage in den Jahren 2018, 2019"
            stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) +
                       " in den Jahren " + selectedYears.join(", ") +":";
        }
        // Anschließend die (gefilterten) Tages-Links anhängen, sofern vorhanden:
        if (links) {
            stayInfo += "<br/>" + links;
        }
    } else {
        // Kein Jahresfilter → alle Tage berücksichtigen, wie bisher
        stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) + ":<br/>" + links;
    }

    const wikipediaLink = feature.properties.wikipedia
        ? `<a href="${feature.properties.wikipedia}" target="_blank" class="text-dark me-2" title="Wikipedia"><i class="bi bi-wikipedia"></i></a>`
        : '';

    const wiengeschichtewikiLink = feature.properties.wiengeschichtewiki
        ? `<a href="${feature.properties.wiengeschichtewiki}" target="_blank" class="me-2" title="Wien Geschichte Wiki"><img src="../images/Wien_Geschichte_Wiki_Logo.png" alt="Wien Geschichte Wiki" style="height: 20px; width: auto;"></a>`
        : '';

    let wohnortContent = '';
    if (feature.properties.wohnort && Array.isArray(feature.properties.wohnort)) {
        const wohnortListItems = feature.properties.wohnort
            .map(person => `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`)
            .join('');
        wohnortContent = `<p class="m-0 mt-3">Wohnort von:<br/><ul style="padding-left: 20px;">${wohnortListItems}</ul></p>`;
    }

    let arbeitsortContent = '';
    if (feature.properties.arbeitsort && Array.isArray(feature.properties.arbeitsort)) {
        const arbeitsortListItems = feature.properties.arbeitsort
            .map(person => `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`)
            .join('');
        arbeitsortContent = `<p class="m-0 mt-3">Arbeitsort von:<br/><ul style="padding-left: 20px;">${arbeitsortListItems}</ul></p>`;
    }

    return `
    <div class="rounded" style="font-family: Arial, sans-serif;">
        <div class="p-3 mb-3">
            <h5 class="m-0"><b>${titleLink}</b></h5>
        </div>
        <p class="m-0">${stayInfo}</p>
        ${wohnortContent}
        ${arbeitsortContent}
        <p class="m-0 mt-3 d-flex align-items-center">
            ${wikipediaLink}
            ${wiengeschichtewikiLink}
        </p>
    </div>`;
}

function populateLocationDropdown(features) {
    const params = new URLSearchParams(window.location.search);
    // Lese auch hier die Filtergrenzen für importance aus der URL
    const minImp = params.has("min") ? Number(params.get("min")) : 0;
    const maxImp = params.has("max") ? Number(params.get("max")) : Infinity;

    const locationSelect = document.getElementById('location-select');
    if (!locationSelect) {
        console.warn("Kein Element mit der ID 'location-select' vorhanden. Überspringe Dropdown-Befüllung.");
        return;
    }
    // Dropdown leeren
    locationSelect.innerHTML = '';

    // Füge den Auswahlpunkt "(alle)" an erster Stelle ein
    const allOption = document.createElement('option');
    allOption.value = 'europe'; // Dieser Wert wird später im Event-Listener abgefangen
    allOption.textContent = '(alle)';
    locationSelect.appendChild(allOption);

    // Definiere die gewünschte Reihenfolge für bestimmte Bezirke (Beispiele: Wien, I., II. usw.)
    const forcedOrder = {
        "wien": 0,
        "i., innere stadt": 1,
        "ii., leopoldstadt": 2,
        "iii., landstraße": 3,
        "iv., wieden": 4,
        "v., margareten": 5,
        "vi., mariahilf": 6,
        "vii., neubau": 7,
        "viii., josefstadt": 8,
        "ix., alsergrund": 9,
        "x., favoriten": 10,
        "xi., simmering": 11,
        "xii., meidling": 12,
        "xiii., hietzing": 13,
        "xiv., penzing": 14,
        "xv., rudolfsheim-fünfhaus": 15,
        "xvi., ottakring": 16,
        "xvii., hernals": 17,
        "xviii., währing": 18,
        "xix., döbling": 19,
        "xx., brigittenau": 20,
        "xxi., floridsdorf": 21,
        "xxii., donaustadt": 22,
        "xxiii., liesing": 23
    };

    // Filtere und sortiere die Features anhand vorhandener Eigenschaften, passender Abkürzungen
    // und des importance-Werts (nur Features im gewünschten Bereich werden übernommen)
    const sortedFeatures = features
        .filter(feature => {
            return feature.properties &&
                   feature.properties.title &&
                   feature.properties.abbr &&
                   (feature.properties.abbr.startsWith('BSO') ||
                    feature.properties.abbr.startsWith('P.') ||
                    feature.properties.abbr.startsWith('A.')) &&
                   ((feature.properties.importance || 0) >= minImp && (feature.properties.importance || 0) <= maxImp);
        })
        .sort((a, b) => {
            const titleA = a.properties.title.toLowerCase();
            const titleB = b.properties.title.toLowerCase();

            const orderA = forcedOrder.hasOwnProperty(titleA) ? forcedOrder[titleA] : 100;
            const orderB = forcedOrder.hasOwnProperty(titleB) ? forcedOrder[titleB] : 100;

            if (orderA !== orderB) {
                return orderA - orderB;
            } else {
                return titleA.localeCompare(titleB);
            }
        });

    // Füge die sortierten Optionen zum Dropdown hinzu
    sortedFeatures.forEach(feature => {
        const option = document.createElement('option');
        // Kopie des Koordinaten-Arrays erstellen, bevor reverse aufgerufen wird ([lon, lat] -> [lat, lon])
        const coords = feature.geometry.coordinates.slice().reverse();
        option.value = coords.join(',');
        option.textContent = feature.properties.title;
        locationSelect.appendChild(option);
    });
}

// Falls ein Dropdown-Element mit der ID "location-select" existiert,
// füge den Event-Listener für die Änderung des Dropdowns hinzu.
document.addEventListener('DOMContentLoaded', function () {
    const locationSelect = document.getElementById('location-select');
    if (!locationSelect) {
        console.warn("Kein Element mit der ID 'location-select' vorhanden. Kein Event-Listener für das Dropdown wird hinzugefügt.");
        return;
    }

    locationSelect.addEventListener('change', function () {
        // Prüfen, ob überhaupt ein Wert vorhanden ist
        if (!this.value) {
            // Keine Angabe vorhanden – Standardverhalten: Karte auf einen Standardbereich zentrieren
            const defaultBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
            map.fitBounds(defaultBounds);
            return;
        }

        if (this.value === 'europe') {
            // Beispielhafte Bounds für ganz Europa – passe diese Werte bei Bedarf an
            const europeBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
            map.fitBounds(europeBounds);
        } else {
            // Erwartet wird ein Wert im Format "lat,lon"
            const [lat, lon] = this.value.split(',').map(Number);
            map.setView([lat, lon], 14);
        }
    });
});

// Farbpalette und Hilfsfunktionen zur Farbauswahl
const visibilityPalette = [
    '#FFA500', // Orange
    '#FF7F50', // Coral
    '#ff5a64', // Morgenrot
    '#FF4500', // Orangerot
    '#FF0000', // Rot
    '#FF1493', // Deep Pink
    '#FF69B4', // Hot Pink
    '#FF00FF', // Magenta
    '#aaaafa', // Medium Orchid
    '#8A2BE2', // Blue Violet
    '#9400D3', // Dark Violet
    '#49274b', // Dark Orchid
    '#8B008B', // Dark Magenta
    '#800080', // Purple
    '#4B0082', // Indigo
    '#73cee5', // Dark Slate Blue
    '#0000FF', // Blau
    '#0000CD', // Medium Blue
    '#00008B', // Dark Blue
    '#000080', // Navy
    '#191970', // Midnight Blue
    '#82d282', // Dark Green
    '#228B22', // Forest Green
    '#2E8B57', // Sea Green
    '#006400', // Dark Green
    '#556B2F'  // Dark Olive Green
];

// Schwellenwerte für die Farbauswahl
const thresholds = [1, 2, 3, 4, 5, 10, 15, 25, 35, 50, 75, 100, 150, 250, 400, 600, 1000, 1500, 2500, 4000, 5000, 6000];

// Funktion zur Auswahl der Farbe basierend auf der Wichtigkeit (1 bis 5000)
function getColorByImportance(importance) {
    if (importance === undefined) {
        return '#FF0000';
    }
    for (let i = 0; i < thresholds.length; i++) {
        if (importance <= thresholds[i]) {
            return visibilityPalette[i];
        }
    }
    return visibilityPalette[visibilityPalette.length - 1];
}

// Funktion zum Erhöhen der Sättigung einer Farbe (bzw. zur Erzeugung einer intensiveren Variante)
function intensifyColor(color) {
    const hsl = d3.hsl(color);
    hsl.h = (hsl.h + 10) % 360;
    return hsl.toString();
}



