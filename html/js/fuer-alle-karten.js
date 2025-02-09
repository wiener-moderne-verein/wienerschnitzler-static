

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
    const params = new URLSearchParams(window.location.search);
    // Lese auch hier die Filtergrenzen für importance aus der URL
    const minImp = params.has("min") ? Number(params.get("min")) : 0;
    const maxImp = params.has("max") ? Number(params.get("max")) : Infinity;

    const locationSelect = document.getElementById('location-select');
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

    // Filtere die Features anhand vorhandener Eigenschaften, passender Abkürzungen
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
        // Kopie des Koordinaten-Arrays erstellen, bevor reverse aufgerufen wird
        const coords = feature.geometry.coordinates.slice().reverse(); // [lon, lat] -> [lat, lon]
        option.value = coords.join(',');
        option.textContent = feature.properties.title;
        locationSelect.appendChild(option);
    });
}

document.getElementById('location-select').addEventListener('change', function () {
    if (this.value === 'europe') {
        // Beispielhafte Bounds für ganz Europa – passe diese Werte bei Bedarf an
        const europeBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
        map.fitBounds(europeBounds);
    } else {
        const [lat, lon] = this.value.split(',').map(Number);
        map.setView([lat, lon], 14);
    }
});