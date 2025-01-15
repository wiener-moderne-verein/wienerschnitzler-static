// Globale Variablen und Funktionen
let map;
const geoJsonLayers = [];

// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(year) {
    if (window.location.hash.substring(1) !== year) {
        window.location.hash = year;
    }
}

// Funktion, um das Jahr aus der URL zu lesen
function getYearFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Laden von GeoJSON basierend auf einem Jahr
function loadGeoJsonByYear(year) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${year}.geojson`;

    clearGeoJsonLayers();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für ${year} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
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
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers();
        });
}

// Funktion zum Ändern des Jahres und GeoJSON-Ladens
function setYearAndLoad(year) {
    const yearInput = document.getElementById('date-input');
    year = Math.max(1869, Math.min(1931, year)); // Begrenzung auf gültigen Bereich
    yearInput.value = year;
    updateUrlFragment(year);
    loadGeoJsonByYear(year);
}

// Initialisierung der Karte
function initializeMap() {
    map = L.map('map').setView([48.2082, 16.3738], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);
}

// Event-Listener und Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Karte initialisieren
    initializeMap();

    // Eventlistener für das Jahreseingabefeld
    document.getElementById('date-input').addEventListener('change', function () {
        const year = parseInt(this.value, 10);
        if (year) {
            setYearAndLoad(year);
        }
    });

    // Eventlistener für "vorheriges Jahr"
    document.getElementById('prev-year').addEventListener('click', () => {
        const currentYear = parseInt(document.getElementById('date-input').value, 10);
        setYearAndLoad(currentYear - 1);
    });

    // Eventlistener für "nächstes Jahr"
    document.getElementById('next-year').addEventListener('click', () => {
        const currentYear = parseInt(document.getElementById('date-input').value, 10);
        setYearAndLoad(currentYear + 1);
    });

   // Entferne diesen Teil
// document.getElementById('load-data').addEventListener('click', () => {
//     const year = parseInt(document.getElementById('date-input').value, 10);
//     if (year) {
//         setYearAndLoad(year);
//     }
// });


    // Überwache Änderungen am URL-Fragment
    window.addEventListener('hashchange', function () {
        const year = getYearFromUrl() || '1890'; // Standardjahr 1890
        setYearAndLoad(year);
    });

    // Initialisiere die Karte mit dem Jahr aus der URL oder einem Standardwert
    const initialYear = getYearFromUrl() || '1890'; // Standardjahr 1890
    setYearAndLoad(initialYear);
});
