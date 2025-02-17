let lineLayer; // globale Variable für den Linien-Layer

function updateMapInhaltText(titles, date, name) {
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (lineLayer && map.hasLayer(lineLayer)) {
    map.removeLayer(lineLayer);
}
    if (mapInhaltTextDiv) {
        const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
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
    geoJsonLayers.length = 0;
    updateMapInhaltText([], ''); // Textfeld leeren
}

// Angepasste Funktion zum Laden von GeoJSON nach Datum
function loadGeoJsonByDate(date) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data//editions/geojson/${date}.geojson`;

    // Entferne vorherige Layer
    clearGeoJsonLayers();
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für ${date} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            const titles = [];
            const name = data.features[0].properties.name || date;
            
            // Trenne Punkt- und Linien-Features
            const pointFeatures = data.features.filter(feature => feature.geometry.type === 'Point');
            const lineFeatures = data.features.filter(feature => feature.geometry.type === 'LineString');

            // Erstelle zuerst den Linien-Layer
           // Erstelle den Linien-Layer
lineLayer = L.geoJSON(lineFeatures, {
    style: {
        color: '#462346',
        weight: 2
    }
});

// Prüfe den URL-Parameter l: Wenn l=off, dann Linie ausblenden; Standard ist sichtbar.
const params = new URLSearchParams(window.location.search);
const lineParam = params.get('l');
const lineVisible = (lineParam === 'on');
// Setze den Zustand der Checkbox
document.getElementById('lineToggle').checked = lineVisible;

// Setze das Icon abhängig vom Zustand
const lineToggleIcon = document.getElementById('lineToggleIcon');
if (lineVisible) {
    lineToggleIcon.innerHTML = '';
    lineLayer.addTo(map);
    lineLayer.bringToBack();
} else {
    lineToggleIcon.innerHTML = '';
    map.removeLayer(lineLayer);
}

// Falls Linien vorhanden sind, richte das Toggle-Control ein (der Button wird per HTML bereitgestellt)
if (lineFeatures.length > 0) {
    setupLineToggleControl(lineLayer, lineVisible);
}

            // Erstelle anschließend den Punkte-Layer und füge ihn der Karte hinzu (sodass die Punkte darüber liegen)
            const pointsLayer = L.geoJSON(pointFeatures, {
                pointToLayer: createCircleMarker, // Verwendet Deine Funktion
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const popupContent = createPopupContent(feature);
                        layer.bindPopup(popupContent, { maxWidth: 300 });
                        
                        let title = feature.properties.title 
                            ? `<a href="${feature.properties.id}.html">${feature.properties.title}</a>` 
                            : 'Kein Titel';

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
            geoJsonLayers.push(pointsLayer);

            // Passe die Karte an die vorhandenen Layer an
            if (pointsLayer.getLayers().length > 0) {
                map.fitBounds(pointsLayer.getBounds());
            } else if (lineVisible && lineLayer.getLayers().length > 0) {
                map.fitBounds(lineLayer.getBounds());
            }

            updateMapInhaltText(titles, date, name);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers();
        });
}



// Restlicher Code (Datumsauswahl, Eventlistener etc.) bleibt unverändert:

function getDateFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

function setDateAndLoad(date) {
    document.getElementById('date-input').value = date;
    updateUrlFragment(date);
    loadGeoJsonByDate(date);
}

function updateUrlFragment(date) {
    if (window.location.hash.substring(1) !== date) {
        window.location.hash = date;
    }
}

function formatDateToISO(date) {
    return date.toISOString().split('T')[0];
}

function changeDateByDays(currentDate, days) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    return formatDateToISO(date);
}

initializeMap();

document.getElementById('date-input').addEventListener('change', function () {
    const date = this.value;
    if (date) {
        setDateAndLoad(date);
    }
});

document.getElementById('prev-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentDate = dateInput.value;
    const newDate = changeDateByDays(currentDate, -1);
    setDateAndLoad(newDate);
});

document.getElementById('next-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentDate = dateInput.value;
    const newDate = changeDateByDays(currentDate, 1);
    setDateAndLoad(newDate);
});

window.addEventListener('hashchange', function () {
    const date = getDateFromUrl();
    if (date) {
        setDateAndLoad(date);
    }
});

const initialDate = getDateFromUrl() || '1895-01-23';
setDateAndLoad(initialDate);

// Funktion checkDateInRange und das wohnsitze-Array bleiben unverändert:
function checkDateInRange(date, id) {
    const inputDate = new Date(date);
    const wohnsitz = wohnsitze.find(entry => entry.target_id === id);
    if (!wohnsitz) {
        return false;
    }
    const startDate = new Date(wohnsitz.start_date);
    const endDate = new Date(wohnsitz.end_date);
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
