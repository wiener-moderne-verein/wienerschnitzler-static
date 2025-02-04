// Farbpalette für die Sichtbarkeit
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
    for (let i = 0; i < thresholds.length; i++) {
        if (importance <= thresholds[i]) {
            return visibilityPalette[i];
        }
    }
    // Fallback: die dunkelste Farbe für sehr hohe Werte
    return visibilityPalette[visibilityPalette.length - 1];
}

// Funktion zum Erhöhen der Sättigung einer Farbe
function intensifyColor(color) {
    const hsl = d3.hsl(color);
    hsl.s = Math.min(1, hsl.s * 2.5); // Erhöhe die Sättigung um 50%
    return hsl.toString();
}

function createCircleMarker(feature, latlng) {
    const importance = feature.properties.importance || 0;
    const color = getColorByImportance(importance);
    const intensifiedColor = intensifyColor(color);
    const radius = 5 + (importance / 5000) * 10;

    return L.circleMarker(latlng, {
        radius: Math.min(13, Math.max(3, radius)), // Radius von 3 bis 13
        color: intensifiedColor, // Intensivere Randfarbe
        fillColor: color, // Füllfarbe basierend auf der Wichtigkeit
        fillOpacity: 1, // Füllungsdeckkraft
        weight: 2
    });
}

// Funktion zum Erstellen der Legende
function createLegend(maxImportance) {
    const legend = document.getElementById('legend');
    if (!legend) return;

    // Leeren der Legende, bevor neue Elemente hinzugefügt werden
    legend.innerHTML = '';

    // Text "Aufenthaltstage:" hinzufügen
    const legendTitle = document.createElement('span');
    legendTitle.style.marginRight = '10px';
    legendTitle.style.fontWeight = 'bold';
    legendTitle.innerText = 'Aufenthaltstage:';
    legend.appendChild(legendTitle);

    // Erstellen der Legende basierend auf den Thresholds, die unter dem größten Wert von importance liegen
    for (let i = 0; i < thresholds.length; i++) {
        if (thresholds[i] > maxImportance) break;

        const color = visibilityPalette[i];
        const threshold = thresholds[i];
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.marginRight = '10px';

        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = color;
        colorBox.style.marginRight = '5px';

        const label = document.createElement('span');
        label.innerText = threshold;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    }
}

// Funktion zum Erstellen der Typen-Legende
function createLegendType(features) {
    const legend = document.getElementById('legend-type');
    if (!legend) {
        console.error("Fehler: Element mit ID 'legend-type' nicht gefunden!");
        return;
    }

    console.log("Features für Legende:", features); // Debugging

    // Leeren der Legende
    legend.innerHTML = '';

    // Titel hinzufügen
    const legendTitle = document.createElement('span');
    legendTitle.style.fontWeight = 'bold';
    legendTitle.innerText = 'Typen:';
    legend.appendChild(legendTitle);

    // Alle einzigartigen Typen extrahieren und Farben zuweisen
    const types = features
        .map(feature => feature.properties?.type)
        .filter(type => type && typeof type === 'string');

    console.log("Gefundene Typen:", types); // Debugging

    if (types.length === 0) {
        console.warn("Keine Typen für die Legende gefunden.");
        legend.innerHTML += '<p style="color: red;">Keine Typen vorhanden!</p>';
        return;
    }

    const uniqueTypes = [...new Set(types)].sort((a, b) => a.localeCompare(b));

    uniqueTypes.forEach(type => {
        const color = getColorByType(type);
        console.log(`Typ: ${type}, Farbe: ${color}`); // Debugging

        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.marginTop = '5px';

        const spacer = document.createElement('div');
        spacer.style.width = '10px'; // Abstand vor der Farbe

        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = color;
        colorBox.style.marginRight = '5px';

        const label = document.createElement('span');
        label.innerText = type;

        legendItem.appendChild(spacer);
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
}


// Farbpalette für verschiedene Typen
const typeColorMap = {};
const typePalette = [
    '#FFA500', '#FF7F50', '#ff5a64', '#FF4500', '#FF0000', '#FF1493',
    '#FF69B4', '#FF00FF', '#aaaafa', '#8A2BE2', '#9400D3', '#49274b',
    '#8B008B', '#800080', '#4B0082', '#73cee5', '#0000FF', '#0000CD',
    '#00008B', '#000080', '#191970', '#82d282', '#228B22', '#2E8B57',
    '#006400', '#556B2F'
];

function getColorByType(type) {
    if (!typeColorMap[type]) {
        typeColorMap[type] = typePalette[Object.keys(typeColorMap).length % typePalette.length];
    }
    return typeColorMap[type];
}

function createCircleMarkerType(feature, latlng) {
    const type = feature.properties.type || 'default';
    const color = getColorByType(type);
    return L.circleMarker(latlng, {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2
    });
}


function createPopupContent(feature) {
    const title = feature.properties.title || 'Kein Titel';
    const id = feature.properties.id || '#';
    const titleLink = `<a href="${id}.html" target="_blank" class="text-dark text-decoration-none">${title} →</a>`;
    const dates = feature.properties.timestamp || [];

    let links = dates.slice(0, 10).map(date =>
        `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`
    ).join('<br>');

    if (dates.length > 10) {
        const remainingCount = dates.length - 10;
        links += `<p style="text-align: right;">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
    }

    const wikipediaLink = feature.properties.wikipedia ? 
        `<a href="${feature.properties.wikipedia}" target="_blank" class="text-dark me-2" title="Wikipedia">
            <i class="bi bi-wikipedia"></i>
        </a>` : '';

    const wiengeschichtewikiLink = feature.properties.wiengeschichtewiki ? 
        `<a href="${feature.properties.wiengeschichtewiki}" target="_blank" class="me-2" title="Wien Geschichte Wiki">
            <img src="../images/Wien_Geschichte_Wiki_Logo.png" alt="Wien Geschichte Wiki" style="height: 20px; width: auto;">
        </a>` : '';

    let wohnortContent = '';
   if (feature.properties.wohnort && Array.isArray(feature.properties.wohnort)) {
    const wohnortListItems = feature.properties.wohnort.map(person => 
        `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`
    ).join('');
    wohnortContent = `<p class="m-0 mt-3">Wohnort von:<br/><ul style="padding-left: 20px;">${wohnortListItems}</ul></p>`;
}

let arbeitsortContent = '';
if (feature.properties.arbeitsort && Array.isArray(feature.properties.arbeitsort)) {
    const arbeitsortListItems = feature.properties.arbeitsort.map(person => 
        `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`
    ).join('');
    arbeitsortContent = `<p class="m-0 mt-3">Arbeitsort von:<br/><ul style="padding-left: 20px;">${arbeitsortListItems}</ul></p>`;
}

    return `
    <div class="rounded" style="font-family: Arial, sans-serif;">
        <div class="p-3 mb-3">
            <h5 class="m-0"><b>${titleLink}</b> </h5>
        </div>
        <p class="m-0">Aufenthaltstage:<br/>${links}</p>
        ${wohnortContent}
        ${arbeitsortContent}
        <p class="m-0 mt-3 d-flex align-items-center">
            ${wikipediaLink}
            ${wiengeschichtewikiLink}
        </p>
    </div>`;
}






