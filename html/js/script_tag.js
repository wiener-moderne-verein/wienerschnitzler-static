// Funktion zum Aktualisieren des Textfelds mit den Titeln
function updateMapInhaltText(titles, date, name) {
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (mapInhaltTextDiv) {
        // Filtere leere Titel und "Kein Titel" heraus
        const filteredTitles = titles.filter(title => title && title.trim() !== '' && title.trim() !== 'Kein Titel');
        
        // Erstelle den Text mit Datum und Titeln
        const textContent = filteredTitles.length > 0 
            ? `Am <a class="schnitzler-chronik-link" href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${name}</a> war Schnitzler an folgenden Orten: ${
                filteredTitles.length === 1
                    ? `<a href="https://de.wikipedia.org/wiki/${encodeURIComponent(filteredTitles[0])}" target="_blank">${filteredTitles[0]}</a>.`
                    : filteredTitles.slice(0, -1).map(title => `<a href="https://de.wikipedia.org/wiki/${encodeURIComponent(title)}" target="_blank">${title}</a>`).join(', ') +
                      ` und <a href="https://de.wikipedia.org/wiki/${encodeURIComponent(filteredTitles[filteredTitles.length - 1])}" target="_blank">${filteredTitles[filteredTitles.length - 1]}</a>.`
            }<br/><br/>`
            : `Am ${date} sind keine Orte bekannt.<br/><br/>`;

        mapInhaltTextDiv.innerHTML = textContent;
    } else {
        console.error('Element mit ID "map-inhalt-text" nicht gefunden.');
    }
}


// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers = [];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0; // Array leeren
    updateMapInhaltText([], ''); // Leere das Textfeld, wenn die Layer entfernt werden
}

// Funktion zum Laden von GeoJSON basierend auf einem Datum
function loadGeoJsonByDate(date) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data//editions/geojson/${date}.geojson`;

    // Entferne vorherige Layer
    clearGeoJsonLayers();

    // GeoJSON laden und anzeigen
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für ${date} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            const titles = [];
            const name = data.features[0].properties.name || date; // Extrahiere den Namen aus dem ersten Feature
            const newLayer = L.geoJSON(data, {
                style: function (feature) {
                    // Stil für Linien
                    return {
                        color: '#FF0000', // Linienfarbe
                        weight: 2, // Dicke der Linie
                        opacity: 1 // Deckkraft der Linie
                    };
                },
                pointToLayer: createCircleMarker, // Verwende die ausgelagerte Funktion für Marker aus mapUtils.js
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const popupContent = createPopupContent(feature); // Verwende die ausgelagerte Funktion für Popups
                        layer.bindPopup(popupContent, { maxWidth: 300 });
                        // Füge den Titel zur Liste hinzu
                        let title = feature.properties.title 
                            ? `<a href="${feature.properties.id}.html">${feature.properties.title}</a>` 
                            : 'Kein Titel';
                        titles.push(feature.properties.id 
                            ? `<a href="${feature.properties.id}" target="_blank">${title}</a>` 
                            : title);
                    }
                }
            }).addTo(map);
            
            // Hinzufügen der neuen Layer-Referenz zur Liste
            geoJsonLayers.push(newLayer);

            // Karte an die neuen Daten anpassen
            if (newLayer.getLayers().length > 0) {
                map.fitBounds(newLayer.getBounds());
            } else {
                console.warn('Keine gültigen Features gefunden.');
            }

            // Aktualisiere das Textfeld mit den gesammelten Titeln und dem Datum
            updateMapInhaltText(titles, date, name);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers(); // Entferne alte Layer auch bei Fehlern
        });
}

// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(date) {
    if (window.location.hash.substring(1) !== date) {
        window.location.hash = date;
    }
}

// Funktion, um das Datum aus der URL zu lesen
function getDateFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

// Funktion zum Ändern des Datums in der Eingabe und URL
function setDateAndLoad(date) {
    document.getElementById('date-input').value = date;
    updateUrlFragment(date);
    loadGeoJsonByDate(date);
}

// Funktion zum Formatieren von Datum in ISO-String (YYYY-MM-DD)
function formatDateToISO(date) {
    return date.toISOString().split('T')[0];
}

// Funktion, um das aktuelle Datum um eine Anzahl Tage zu ändern
function changeDateByDays(currentDate, days) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    return formatDateToISO(date);
}

// Initialisierung der Karte
const map = L.map('map').setView([48.2082, 16.3738], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map);

// Eventlistener für das Datumseingabefeld
document.getElementById('date-input').addEventListener('change', function () {
    const date = this.value;
    if (date) {
        setDateAndLoad(date);
    }
});

// Eventlistener für den "Vorheriger Tag"-Button
document.getElementById('prev-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentDate = dateInput.value;
    const newDate = changeDateByDays(currentDate, -1);
    setDateAndLoad(newDate);
});

// Eventlistener für den "Nächster Tag"-Button
document.getElementById('next-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentDate = dateInput.value;
    const newDate = changeDateByDays(currentDate, 1);
    setDateAndLoad(newDate);
});

// Überwache Änderungen am URL-Fragment
window.addEventListener('hashchange', function () {
    const date = getDateFromUrl();
    if (date) {
        setDateAndLoad(date);
    }
});

// Initialisiere die Karte mit dem Datum aus der URL oder einem Standardwert
const initialDate = getDateFromUrl() || '1895-01-23';
setDateAndLoad(initialDate);

// Funktion zum Holen des Datums aus der URL nach "#"
function getDateFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null; // Gibt das Datum zurück, oder null, wenn kein Datum vorhanden ist
}
