// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers = [];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Laden und Anzeigen von GeoJSON
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
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    color: '#FF0000', // Randfarbe
                    fillColor: '#e6c828', // Füllfarbe
                    fillOpacity: 1, // Füllungsdeckkraft
                    weight: 2
                });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    const title = feature.properties.title || 'Kein Titel';
                    const dates = feature.properties.timestamp || [];
                    const links = dates.map(date =>
                        `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`
                    ).join('<br>');
                    const popupContent = `<b>${title}</b><br>${links}`;
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
    }).catch(error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

// Initialisierung der Karte
const map = L.map('map-large').setView([48.2082, 16.3738], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

// Initialisierung der Karte beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    loadGeoJson(); // GeoJSON laden und anzeigen
});