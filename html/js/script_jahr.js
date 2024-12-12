// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers =[];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
    // Array leeren
}

// Funktion zum Laden von GeoJSON basierend auf einem Jahr
function loadGeoJsonByYear(year) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${year}.geojson`;
    
    // Entferne vorherige Layer
    clearGeoJsonLayers();
    
    // GeoJSON laden und anzeigen
    fetch(url).then(response => {
        if (! response.ok) {
            throw new Error(`GeoJSON für ${year} nicht gefunden.`);
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
                    const popupContent = `<b>${title}</b><br>${links}`;
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
function updateUrlFragment(year) {
    if (window.location.hash.substring(1) !== year) {
        window.location.hash = year;
    }
}

// Funktion, um das Jahr aus der URL zu lesen
function getYearFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1): null;
}

// Funktion zum Ändern des Jahres in der Eingabe und URL
function setYearAndLoad(year) {
    document.getElementById('date-input').value = year;
    updateUrlFragment(year);
    loadGeoJsonByYear(year);
}

// Funktion, um das aktuelle Jahr zu ändern
function changeYearByYears(currentYear, years) {
    const year = parseInt(currentYear, 10);
    const newYear = year + years;
    return Math.max(1869, Math.min(1931, newYear)).toString();
}

// Initialisierung der Karte
const map = L.map('map').setView([48.2082, 16.3738], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

// Eventlistener für das Jahreseingabefeld
document.getElementById('date-input').addEventListener('change', function () {
    const year = this.value;
    if (year) {
        setYearAndLoad(year);
    }
});

// Eventlistener für den "Laden"-Button
document.getElementById('load-data').addEventListener('click', function () {
    const year = document.getElementById('date-input').value;
    if (year) {
        setYearAndLoad(year);
    }
});


// Überwache Änderungen am URL-Fragment
window.addEventListener('hashchange', function () {
    const year = getYearFromUrl();
    if (year) {
        setYearAndLoad(year);
    }
});

// Initialisiere die Karte mit dem Jahr aus der URL oder einem Standardwert
const initialYear = getYearFromUrl() || '1895';
setYearAndLoad(initialYear);