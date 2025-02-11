// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers =[];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
    // Array leeren
}

// Funktion zum Laden von GeoJSON basierend auf einem Monat
function loadGeoJsonByMonth(month) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${month}.geojson`;
    
    // Entferne vorherige Layer
    clearGeoJsonLayers();
    
    // GeoJSON laden und anzeigen
    fetch(url).then(response => {
        if (! response.ok) {
            throw new Error(`GeoJSON für ${month} nicht gefunden.`);
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
        
    }). catch (error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(month) {
    if (window.location.hash.substring(1) !== month) {
        window.location.hash = month;
    }
}

// Funktion, um das Datum aus der URL zu lesen
function getMonthFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1): null;
}

// Funktion zum Ändern des Monats in der Eingabe und URL
function setMonthAndLoad(month) {
    document.getElementById('date-input').value = month;
    updateUrlFragment(month);
    loadGeoJsonByMonth(month);
}

// Funktion zum Formatieren des Monats als `YYYY-MM`
function formatMonthToISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Funktion, um den aktuellen Monat um eine Anzahl Monate zu ändern
function changeMonthByMonths(currentMonth, months) {
    const[year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + months, 1);
    return formatMonthToISO(newDate);
}

// Initialisierung der Karte
initializeMap();

// Eventlistener für das Monatseingabefeld
document.getElementById('date-input').addEventListener('change', function () {
    const month = this.value;
    if (month) {
        setMonthAndLoad(month);
    }
});

// Eventlistener für den "Laden"-Button
document.getElementById('load-data').addEventListener('click', function () {
    const month = document.getElementById('date-input').value;
    if (month) {
        setMonthAndLoad(month);
    }
});

// Eventlistener für den "Vorheriger Monat"-Button
document.getElementById('prev-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentMonth = dateInput.value;
    const newMonth = changeMonthByMonths(currentMonth, -1);
    setMonthAndLoad(newMonth);
});

// Eventlistener für den "Nächster Monat"-Button
document.getElementById('next-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentMonth = dateInput.value;
    const newMonth = changeMonthByMonths(currentMonth, 1);
    setMonthAndLoad(newMonth);
});

// Überwache Änderungen am URL-Fragment
window.addEventListener('hashchange', function () {
    const month = getMonthFromUrl();
    if (month) {
        setMonthAndLoad(month);
    }
});

// Initialisiere die Karte mit dem Monat aus der URL oder einem Standardwert
const initialMonth = getMonthFromUrl() || '1895-01';
setMonthAndLoad(initialMonth);