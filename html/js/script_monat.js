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
            style: function (feature) {
                return {
                    color: '#FF0000', // Linienfarbe
                    weight: 2, // Dicke der Linie
                    opacity: 1 // Deckkraft der Linie
                };
            },
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
                    const dates = feature.properties.timestamp ||[];
                    const links = dates.map(date =>
                    `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/entry__${date}.html" target="_blank">${date}</a>`).join('<br>');
                    const popupContent = ` < b > $ {
                        title
                    } < / b > < br >
                    $ {
                        links
                    }
                    `;
                    layer.bindPopup(popupContent, {
                        maxWidth: 300
                    });
                }
            }
        }).addTo(map);
        
        geoJsonLayers.push(newLayer);
        
        if (newLayer.getLayers().length > 0) {
            map.fitBounds(newLayer.getBounds());
        } else {
            console.warn('Keine gültigen Features gefunden.');
        }
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
const map = L.map('map').setView([48.2082, 16.3738], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

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