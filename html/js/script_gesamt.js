// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers = [];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Initialisieren der Karte
function initializeMap() {
    window.map = L.map('map-large').setView([48.2082, 16.3738], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
}

function loadGeoJson() {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson`;
    
    // Entferne vorherige Layer
    clearGeoJsonLayers();
    
    // GeoJSON laden und anzeigen
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('GeoJSON konnte nicht geladen werden.');
            }
            return response.json();
        })
        .then(data => {
            window.geoJsonData = data; // Speichert das GeoJSON global für spätere Filterung
            displayFilteredGeoJson();
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers();
        });
}

// Initialisierung der Karte und Laden der GeoJSON-Daten beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();

    // GeoJSON-Daten laden und anzeigen
    fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson')
        .then(response => response.json())
        .then(data => {
            window.geoJsonData = data;
            displayFilteredGeoJson();
        })
        .catch(error => console.error('Fehler beim Laden der GeoJSON-Daten:', error));
});

function displayFilteredGeoJson() {
    if (!window.geoJsonData || !window.geoJsonData.features) {
        console.warn("GeoJSON-Daten nicht geladen.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    let filteredFeatures = window.geoJsonData.features;

    // ============================
    // Jahre-Filter
    // ============================
    let selectedYears;
    if (!params.has("years")) {
        // Kein "years"-Parameter → alle Jahre auswählen:
        selectedYears = new Set();
        window.geoJsonData.features.forEach(feature => {
            if (Array.isArray(feature.properties.timestamp)) {
                feature.properties.timestamp.forEach(date => {
                    selectedYears.add(date.substring(0, 4));
                });
            }
        });
    } else {
        const yearsParam = params.get("years");
        if (yearsParam === "0") {
            // Explizit "(keinen)" gedrückt → keine Jahre ausgewählt
            selectedYears = new Set();
        } else {
            selectedYears = new Set(yearsParam.split("_"));
        }
    }

    // Filterung nach Jahren – analog zum Typen-Filter:
    if (params.has("years")) {
        if (selectedYears.size > 0) {
            filteredFeatures = filteredFeatures.filter(feature =>
                feature.properties.timestamp.some(date => selectedYears.has(date.substring(0, 4)))
            );
        } else {
            filteredFeatures = [];
        }
    }
    
    // ============================
    // Karte aktualisieren
    // ============================
    clearGeoJsonLayers();
    createFilterTime(window.geoJsonData.features);

    if (filteredFeatures.length === 0) {
        console.warn('Keine passenden Features gefunden.');
        return;
    }

    // GeoJSON-Layer erstellen, dabei wird createCircleMarker als pointToLayer verwendet
    const newLayer = L.geoJSON(filteredFeatures, {
        pointToLayer: createCircleMarker,
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                const popupContent = createPopupContent(feature);
                layer.bindPopup(popupContent, {
                    maxWidth: 300
                });
            }
        }
    }).addTo(map);

    geoJsonLayers.push(newLayer);

    // ----------------------------
    // Dropdown mit allen Orten auffüllen
    // ----------------------------
    // Hier wird die Funktion aufgerufen – analog zur Verwendung in loadGeoJson:
    populateLocationDropdown(filteredFeatures);

    // Berechne das maximale "importance", um die Legende anzupassen
    const maxImportance = filteredFeatures.reduce((max, feature) => {
        const imp = feature.properties.importance || 0;
        return imp > max ? imp : max;
    }, 0);
    createLegend(maxImportance);

    map.fitBounds(newLayer.getBounds());
}


