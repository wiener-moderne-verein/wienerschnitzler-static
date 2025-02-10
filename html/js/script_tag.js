function updateMapInhaltText(titles, date, name) {
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (mapInhaltTextDiv) {
        const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date); // Überprüft, ob das Datum im Format YYYY-MM-DD vorliegt
        const displayedDate = isValidDate ? date : 'unbekanntes Datum';
        const displayedName = name || displayedDate;

        const filteredTitles = titles.filter(title => title && title.trim() !== '' && title.trim() !== 'Kein Titel');
        
        const textContent = filteredTitles.length > 0 
            ? `Am <a class="schnitzler-chronik-link" href="https://schnitzler-chronik.acdh.oeaw.ac.at/${displayedDate}.html" target="_blank">${displayedName}</a> war Schnitzler an folgenden Orten: ${
                filteredTitles.length === 1
                    ? `<a href="https://de.wikipedia.org/wiki/${encodeURIComponent(filteredTitles[0])}" target="_blank">${filteredTitles[0]}</a>.`
                    : filteredTitles.slice(0, -1).map(title => `<a href="https://de.wikipedia.org/wiki/${encodeURIComponent(title)}" target="_blank">${title}</a>`).join(', ') +
                      ` und <a href="https://de.wikipedia.org/wiki/${encodeURIComponent(filteredTitles[filteredTitles.length - 1])}" target="_blank">${filteredTitles[filteredTitles.length - 1]}</a>.`
            }<br/><br/>`
            : `Am ${displayedDate} sind keine Orte bekannt.<br/><br/>`;

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
                pointToLayer: createCircleMarker, // Verwende die ausgelagerte Funktion für Marker aus mapUtils.js
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const popupContent = createPopupContent(feature); // Verwende die ausgelagerte Funktion für Popups
                        layer.bindPopup(popupContent, { maxWidth: 300 });
                        
                        // Füge den Titel zur Liste hinzu und überprüfe das Datum
                        let title = feature.properties.title 
                            ? `<a href="${feature.properties.id}.html">${feature.properties.title}</a>` 
                            : 'Kein Titel';

                        // Überprüfen, ob das Datum innerhalb des gültigen Zeitraums liegt
                        const id = feature.properties.id;
                        if (checkDateInRange(date, id)) {
                            title = `${title} <span style="color: black;">(Wohnadresse)</span>`;
                        }
                        
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

function extractLocationsFromGeoJson(data) {
    const locations = [];
    data.features.forEach(feature => {
        if (feature.properties && feature.properties.typ === 'ort') {
            locations.push({
                name: feature.properties.name || 'Unbekannter Ort',
                coordinates: feature.geometry.coordinates.reverse(), // GeoJSON hat [lon, lat], wir brauchen [lat, lon]
            });
        }
    });
    return locations;
}


function checkDateInRange(date, id) {
    // Umwandlung des übergebenen Datums in ein Date-Objekt
    const inputDate = new Date(date);
    
    // Suche nach dem entsprechenden Eintrag in der `wohnsitze`-Konstanten
    const wohnsitz = wohnsitze.find(entry => entry.target_id === id);
    
    // Falls keine Übereinstimmung gefunden wurde
    if (!wohnsitz) {
        return false;
    }
    
    // Umwandlung der Start- und Enddaten in Date-Objekte
    const startDate = new Date(wohnsitz.start_date);
    const endDate = new Date(wohnsitz.end_date);
    
    // Überprüfung, ob das Datum innerhalb des Zeitraums liegt
    return inputDate >= startDate && inputDate <= endDate;
}

const wohnsitze = [
    {
        target_label: "Sternwartestraße 71",
        target_id: "pmb168815",
        start_date: "1910-07-17",
        end_date: "1931-10-21"
    },
    {
        target_label: "Edmund-Weiß-Gasse 7",
        target_id: "pmb168940",
        start_date: "1903-09-12",
        end_date: "1910-07-16"
    },
    {
        target_label: "Frankgasse 1",
        target_id: "pmb168934",
        start_date: "1893-11-15",
        end_date: "1903-09-11"
    },
    {
        target_label: "Wohnung und Ordination Arthur Schnitzler Grillparzerstraße 7/3. Stock",
        target_id: "pmb167782",
        start_date: "1892-10-15",
        end_date: "1893-11-14"
    },
    {
        target_label: "Kärntnerring 12/Bösendorferstraße 11",
        target_id: "pmb167805",
        start_date: "1889-12-03",
        end_date: "1892-10-14"
    },
    {
        target_label: "Wohnung und Ordination Arthur Schnitzler Burgring 1",
        target_id: "pmb168768",
        start_date: "1888-10-19",
        end_date: "1889-12-02"
    },
    {
        target_label: "Wohnung und Ordination Johann Schnitzler Burgring 1",
        target_id: "pmb168765",
        start_date: "1870-05-12",
        end_date: "1888-10-18"
    },
    {
        target_label: "Kärntnerring 12/Bösendorferstraße 11",
        target_id: "pmb167805",
        start_date: "1870-01-01",
        end_date: "1871-01-01"
    },
    {
        target_label: "Schottenbastei 3",
        target_id: "pmb51969",
        start_date: "1864-01-22",
        end_date: "1870-01-01"
    },
    {
        target_label: "Praterstraße 16",
        target_id: "pmb168783",
        start_date: "1862-05-15",
        end_date: "1864-01-01"
    }
];