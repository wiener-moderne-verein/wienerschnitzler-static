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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
}

function loadGeoJson() {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson`;

    // Entferne vorherige Layer
    clearGeoJsonLayers();

    // GeoJSON laden und anzeigen
    fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('GeoJSON konnte nicht geladen werden.');
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

// Initialisierung der Karte beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    initializeMap(); // Karte initialisieren
    loadGeoJson(); // GeoJSON laden und anzeigen
});
