// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers = [];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Laden von GeoJSON basierend auf einer Dekade
function loadGeoJsonByDecade(decade) {
    const startYear = decade;
    const endYear = parseInt(decade, 10) + 9; // 'decade' wird als Zahl behandelt
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${encodeURIComponent(startYear)}-${encodeURIComponent(endYear)}.geojson`;

    // Entferne vorherige Layer
    clearGeoJsonLayers();

    // GeoJSON laden und anzeigen
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(`GeoJSON für die Dekade ${startYear}-${endYear} nicht gefunden.`);
        }
        return response.json();
    }).then(data => {
        const newLayer = L.geoJSON(data, {
            pointToLayer: createCircleMarker, // Verwende die ausgelagerte Funktion für Marker
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    const popupContent = createPopupContent(feature); // Verwende die ausgelagerte Funktion für Popups
                    layer.bindPopup(popupContent, { maxWidth: 300 });
                }
            }
        }).addTo(map);

        geoJsonLayers.push(newLayer);

        if (newLayer.getLayers().length > 0) {
            map.fitBounds(newLayer.getBounds());
        } else {
            console.warn('Keine gültigen Features gefunden.');
        }
        // Maximalen Wert für die Wichtigkeit bestimmen
        const maxImportance = Math.max(
            ...data.features.map(feature => feature.properties.importance || 0)
        );

        // Legende erstellen
        createLegend(maxImportance);

    }).catch(error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(decade) {
    if (window.location.hash.substring(1) !== decade) {
        window.location.hash = decade;
    }
}

// Funktion, um die Dekade aus der URL zu lesen
function getDecadeFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

// Funktion zum Ändern der Dekade in der Eingabe und URL
function setDecadeAndLoad(decade) {
    document.getElementById('decade-input').value = decade; // Korrigierter ID
    updateUrlFragment(decade);
    loadGeoJsonByDecade(decade);
}

// Funktion, um die Dekade zu ändern (vorherige oder nächste Dekade)
function changeDecadeByYears(currentDecade, years) {
    const startYear = parseInt(currentDecade, 10);
    const newStartYear = startYear + (years * 10);
    return newStartYear.toString();
}

// Funktion, um das Dropdown-Menü mit Dekaden zu befüllen
function populateDecadeDropdown() {
    const selectElement = document.getElementById('decade-input'); // Korrigierter ID

    for (let year = 1861; year <= 1940; year += 10) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}-${year + 9}`;
        selectElement.appendChild(option);
    }
}

// Initialisierung der Karte
const map = L.map('map').setView([48.2082, 16.3738], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

// Eventlistener für das Dekadeneingabefeld

document.getElementById('decade-input').addEventListener('change', function () { // Korrigierter ID
    const decade = this.value;
    if (decade) {
        setDecadeAndLoad(decade);
    }
});

// Eventlistener für den "Vorherige Dekade"-Button

document.getElementById('prev-decade').addEventListener('click', function () {
    const dateInput = document.getElementById('decade-input'); // Korrigierter ID
    const currentDecade = dateInput.value;
    const newDecade = changeDecadeByYears(currentDecade, -1);
    setDecadeAndLoad(newDecade);
});

// Eventlistener für den "Nächste Dekade"-Button

document.getElementById('next-decade').addEventListener('click', function () {
    const dateInput = document.getElementById('decade-input'); // Korrigierter ID
    const currentDecade = dateInput.value;
    const newDecade = changeDecadeByYears(currentDecade, 1);
    setDecadeAndLoad(newDecade);
});

// Überwache Änderungen am URL-Fragment

window.addEventListener('hashchange', function () {
    const decade = getDecadeFromUrl();
    if (decade) {
        setDecadeAndLoad(decade);
    }
});

// Fülle das Dropdown mit Dekaden

populateDecadeDropdown();

// Initialisiere die Karte mit der Dekade aus der URL oder einem Standardwert
const initialDecade = getDecadeFromUrl() || '1891';

setDecadeAndLoad(initialDecade);