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
    hsl.s = Math.min(1, hsl.s * 2.5);
    // Erhöhe die Sättigung um 50%
    return hsl.toString();
}

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

function createPopupContent(feature) {
    const title = feature.properties.title || 'Kein Titel';
    const id = feature.properties.id || '#';
    const titleLink = `<a href="${id}.html" target="_blank" class="text-dark text-decoration-none">${title} →</a>`;
    const dates = feature.properties.timestamp || [];
    
    let links = dates.slice(0, 10)
        .map(date => `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`)
        .join('<br>');
    
    if (dates.length > 10) {
        const remainingCount = dates.length - 10;
        links += `<p style="text-align: right;">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
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
    
    // Ermitteln des Wertes von "importance" und dynamisches Erzeugen des Texts
    const importance = feature.properties.importance || 0;
    const daysText = importance === 1 ? "Ein Aufenthaltstag" : `${importance} Aufenthaltstage:`;
    
    return `
    <div class="rounded" style="font-family: Arial, sans-serif;">
        <div class="p-3 mb-3">
            <h5 class="m-0"><b>${titleLink}</b></h5>
        </div>
        <p class="m-0">${daysText}<br/>${links}</p>
        ${wohnortContent}
        ${arbeitsortContent}
        <p class="m-0 mt-3 d-flex align-items-center">
            ${wikipediaLink}
            ${wiengeschichtewikiLink}
        </p>
    </div>`;
}

function populateLocationDropdown(features) {
    const locationSelect = document.getElementById('location-select');
    // Dropdown leeren
    locationSelect.innerHTML = '';

    // Füge den Auswahlpunkt "(alle)" an erster Stelle ein
    const allOption = document.createElement('option');
    allOption.value = 'europe'; // Dieser Wert wird später im Event-Listener abgefangen
    allOption.textContent = '(alle)';
    locationSelect.appendChild(allOption);

    // Optional: Füge einen Platzhalter hinzu, falls gewünscht
    // const placeholderOption = document.createElement('option');
    // placeholderOption.value = '';
    // placeholderOption.textContent = 'Wähle einen Ort';
    // placeholderOption.disabled = true;
    // placeholderOption.selected = true;
    // locationSelect.appendChild(placeholderOption);

    // Filtere und sortiere die Features alphabetisch nach Titel
    const sortedFeatures = features
        .filter(feature => feature.properties && feature.properties.title && feature.properties.abbr)
        .filter(feature => {
            const abbr = feature.properties.abbr;
            return abbr.startsWith('BSO') || abbr.startsWith('P.') || abbr.startsWith('A.');
        })
        .sort((a, b) => {
            const titleA = a.properties.title.toLowerCase();
            const titleB = b.properties.title.toLowerCase();
            return titleA.localeCompare(titleB);
        });

    // Füge die sortierten Optionen zum Dropdown hinzu
    sortedFeatures.forEach(feature => {
        const option = document.createElement('option');
        // Erzeuge eine Kopie des Koordinaten-Arrays, bevor du reverse aufrufst
        const coords = feature.geometry.coordinates.slice().reverse(); // [lon, lat] -> [lat, lon]
        option.value = coords.join(',');
        option.textContent = feature.properties.title;
        locationSelect.appendChild(option);
    });
}

document.getElementById('location-select').addEventListener('change', function () {
    // Prüfen, ob der ausgewählte Wert "europe" ist – dann die Karte auf ganz Europa zentrieren
    if (this.value === 'europe') {
        // Beispielhafte Bounds für ganz Europa – passe die Werte nach Bedarf an
        const europeBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
        map.fitBounds(europeBounds);
    } else {
        // Andernfalls den ausgewählten Ort fokussieren:
        const [lat, lon] = this.value.split(',').map(Number);
        map.setView([lat, lon], 14); // Zoom auf den ausgewählten Ort
    }
});

