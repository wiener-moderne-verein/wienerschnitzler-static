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
            pointToLayer: function (feature, latlng) {
                // Bestimme die Farbe basierend auf der Importance mit einer Farbskala
                const importance = feature.properties.importance || 0;
                let color;
                if (importance <= 10) {
                    color = '#fef0d9'; // Helle Farben für geringe Wichtigkeit
                } else if (importance <= 100) {
                    color = '#fdcc8a';
                } else if (importance <= 500) {
                    color = '#fc8d59';
                } else if (importance <= 5000) {
                    color = '#e34a33';
                } else {
                    color = '#b30000'; // Dunkelrot für höchste Wichtigkeit
                }

                // Berechne den Radius basierend auf der Importance
                const radius = 3 + (importance / 5000) * 10;

                return L.circleMarker(latlng, {
                    radius: Math.min(13, Math.max(3, radius)), // Radius von 3 bis 13
                    color: 'red', // Immer ein roter Rahmen
                    fillColor: color, // Füllfarbe basierend auf der Wichtigkeit
                    fillOpacity: 1.0, // Immer vollflächig
                    weight: 2 // Randbreite
                });
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    const title = feature.properties.title || 'Kein Titel';
                    const id = feature.properties.id || '#';
                    const titleLink = `<a href="${id}.html" target="_blank">${title}</a>`;
                    const dates = feature.properties.timestamp || [];
                    let links = dates.slice(0, 10).map(date =>
                        `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`
                    ).join('<br>');

                    if (dates.length > 10) {
                        const remainingCount = dates.length - 10;
                        links += `<p style="text-align: right">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
                    }

                    console.log(`Popup content for ${title}:`, links); // Debugging-Ausgabe

                    const popupContent = `<b>${titleLink}</b><br>${links}`;
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



// Initialisierung der Karte beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    initializeMap(); // Karte initialisieren
    loadGeoJson(); // GeoJSON laden und anzeigen
});