// Das wohnsitze-Array sowie die Funktion checkDateInRange bleiben unverändert:
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


// Hilfsfunktion zur Formatierung von ISO-Datum (YYYY-MM-DD) ins deutsche Format (z.B. 3.3.1863)
function formatIsoDateToGerman(dateStr) {
    const parts = dateStr.split('-');
    return `${Number(parts[2])}.${Number(parts[1])}.${parts[0]}`;
}

// Funktion, die anhand des Datums den entsprechenden Wohnsitz aus dem Array sucht
function getWohnsitzForDate(date) {
    const inputDate = new Date(date);
    return wohnsitze.find(entry => {
        const startDate = new Date(entry.start_date);
        const endDate = new Date(entry.end_date);
        return inputDate >= startDate && inputDate <= endDate;
    });
}

let lineLayer; // globale Variable für den Linien-Layer

function updateMapInhaltText(features, date, name) {
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
    }
    if (mapInhaltTextDiv) {
        // Prüfe, ob ein valides ISO-Datum vorliegt und formatiere es ggf. ins deutsche Format
        const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
        const displayedDate = isValidDate ? formatIsoDateToGerman(date) : 'unbekanntes Datum';
        const displayedName = name || displayedDate;

        // Filtere Features, die ein gültiges "id"-Property besitzen
        const filteredFeatures = features.filter(feature => feature && feature.properties && feature.properties.id);
        
        let textContent = '';
        if (filteredFeatures.length > 0) {
            textContent = `Am <a class="schnitzler-chronik-link" href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${displayedName}</a> war Schnitzler an folgenden Orten: ${
                filteredFeatures.length === 1
                    ? `<a href="${encodeURIComponent(filteredFeatures[0].properties.id)}.html" target="_blank">${filteredFeatures[0].properties.title || filteredFeatures[0].properties.id}</a>.`
                    : filteredFeatures.slice(0, -1).map(feature => `<a href="${encodeURIComponent(feature.properties.id)}.html" target="_blank">${feature.properties.title || feature.properties.id}</a>`).join(', ') +
                      ` und <a href="${encodeURIComponent(filteredFeatures[filteredFeatures.length - 1].properties.id)}.html" target="_blank">${filteredFeatures[filteredFeatures.length - 1].properties.title || filteredFeatures[filteredFeatures.length - 1].properties.id}</a>.`
            }<br/><br/>`;
        } else {
            // Wenn keine Features vorhanden sind, prüfe, ob für das Datum ein Wohnsitz bekannt ist
            const wohnsitz = getWohnsitzForDate(date);
            if (wohnsitz) {
                textContent = `Für den ${displayedDate} ist kein Aufenthaltsort bekannt. Schnitzler wohnte zu dieser Zeit in der ${wohnsitz.target_label}.<br/><br/>`;
            } else {
                textContent = `Für den ${displayedDate} sind keine Aufenthaltsorte bekannt.<br/><br/>`;
            }
        }
        
        mapInhaltTextDiv.innerHTML = textContent;
    } else {
        console.error('Element mit ID "map-inhalt-text" nicht gefunden.');
    }
}

// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers = [];

// Funktion zum Entfernen aller GeoJSON-Layer; nimmt optional ein Datum entgegen,
// damit auch bei Fehlern (kein GeoJSON) der Text mit dem korrekten Datum aktualisiert wird
function clearGeoJsonLayers(date = '') {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
    updateMapInhaltText([], date);
}

// Angepasste Funktion zum Laden von GeoJSON nach Datum
function loadGeoJsonByDate(date) {
    // Konvertiere das Datum in ein Date-Objekt
    const inputDate = new Date(date);
    const minDateObj = new Date("1862-05-15");
    const maxDateObj = new Date("1931-10-21");
    
    // Falls das Datum vor 1862-05-15 oder nach 1931-10-21 liegt:
    if (inputDate < minDateObj || inputDate > maxDateObj) {
        clearGeoJsonLayers(date);
        const formattedDate = formatIsoDateToGerman(date);
        const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
        if (mapInhaltTextDiv) {
            mapInhaltTextDiv.innerHTML = `Am ${formattedDate} war Arthur Schnitzler nicht am Leben.<br/><br/>`;
        }
        return;
    }

    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data//editions/geojson/${date}.geojson`;

    // Entferne vorherige Layer und aktualisiere das Textfeld mit dem aktuellen Datum
    clearGeoJsonLayers(date);
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
            const featuresWithID = [];  // Array zum Sammeln der Features, die ein "id"-Property besitzen
            const name = data.features[0].properties.name || date;
            
            // Trenne Punkt- und Linien-Features
            const pointFeatures = data.features.filter(feature => feature.geometry.type === 'Point');
            const lineFeatures = data.features.filter(feature => feature.geometry.type === 'LineString');

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
            document.getElementById('lineToggle').checked = lineVisible;
            const lineToggleIcon = document.getElementById('lineToggleIcon');
            if (lineVisible) {
                lineToggleIcon.innerHTML = '';
                lineLayer.addTo(map);
                lineLayer.bringToBack();
            } else {
                lineToggleIcon.innerHTML = '';
                map.removeLayer(lineLayer);
            }
            if (lineFeatures.length > 0) {
                setupLineToggleControl(lineLayer, lineVisible);
            }

            // Erstelle den Punkte-Layer, sammle dabei die Features mit einem "id"-Property und binde die Popups
            const pointsLayer = L.geoJSON(pointFeatures, {
                pointToLayer: createCircleMarker,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.id) {
                        featuresWithID.push(feature);
                    }
                    bindPopupEvents(feature, layer);
                }
            }).addTo(map);
            geoJsonLayers.push(pointsLayer);

            // Passe die Karte an die vorhandenen Layer an
            if (pointsLayer.getLayers().length > 0) {
                map.fitBounds(pointsLayer.getBounds());
            } else if (lineVisible && lineLayer.getLayers().length > 0) {
                map.fitBounds(lineLayer.getBounds());
            }

            // Update den Text unterhalb der Karte mit den gesammelten Features
            updateMapInhaltText(featuresWithID, date, name);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers(date);
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
