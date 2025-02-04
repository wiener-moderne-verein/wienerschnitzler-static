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
        window.geoJsonData = data; // Speichert das GeoJSON global für spätere Filterung
        populateTypeDropdown(data.features);
        displayFilteredGeoJson(); // Zeige alle Punkte an
    }).catch(error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

// Initialisierung der Karte und Laden der GeoJSON-Daten beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    initializeMap(); // Karte initialisieren

    // GeoJSON-Daten laden und anzeigen
    fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson')
        .then(response => response.json())
        .then(data => {
            window.geoJsonData = data;
            populateTypeDropdown(data.features);
            displayFilteredGeoJson(); // Zeige alle Punkte an
        })
        .catch(error => console.error('Fehler beim Laden der GeoJSON-Daten:', error));
});

function populateTypeDropdown(features) {
    const typeSelect = document.getElementById('type-select');
    typeSelect.innerHTML = '<option value="" disabled selected>Wähle einen Typ</option>';

    // Extrahiere und sortiere die eindeutigen Typen
    const types = [...new Set(features.map(feature => feature.properties?.type).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b));

    // Füge die Optionen zum Dropdown hinzu
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
}

document.getElementById('type-select').addEventListener('change', function () {
    displayFilteredGeoJson();
});

function displayFilteredGeoJson() {
    if (!window.geoJsonData || !window.geoJsonData.features) {
        console.warn("GeoJSON-Daten noch nicht geladen.");
        return;
    }
    console.log("GeoJSON-Daten vorhanden:", window.geoJsonData.features.length);

    const typeSelect = document.getElementById('type-select');
    const selectedType = typeSelect.value;
    console.log('Ausgewählter Typ:', selectedType);

    // Überprüfen, ob der ausgewählte Typ gültig ist
    const filteredFeatures = (selectedType && selectedType !== "") ? 
        window.geoJsonData.features.filter(feature => feature.properties.type === selectedType) : 
        window.geoJsonData.features;

    console.log('Anzahl der gefilterten Features:', filteredFeatures.length);
    console.log('Gefilterte Features:', filteredFeatures);

    if (filteredFeatures.length === 0) {
        console.warn('Keine passenden Features gefunden.');
        return;
    }

    // Entferne vorhandene Layer
    clearGeoJsonLayers();

    const newLayer = L.geoJSON(filteredFeatures, {
        pointToLayer: createCircleMarkerType, // Verwende die angepasste Funktion für Marker
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                const popupContent = createPopupContent(feature); // Verwende die ausgelagerte Funktion für Popups
                layer.bindPopup(popupContent, { maxWidth: 300 });
            }
        }
    }).addTo(map);

    geoJsonLayers.push(newLayer);
    map.fitBounds(newLayer.getBounds());

    // Legende aktualisieren
    createLegendType(filteredFeatures);
}

