// Globaler Variablen-Container für GeoJSON-Layer
const geoJsonLayers =[];
let lineLayer;
// Für den Linien-Layer

// Funktion zum Entfernen aller bisher hinzugefügten GeoJSON-Layer (Punkte)
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Laden der Punktdaten (bleibt wie gehabt)
function loadGeoJsonByMonth(month) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${month}.geojson`;
    
    // Entferne vorherige Punkt-Layer
    clearGeoJsonLayers();
    
    fetch(url).then(response => {
        if (! response.ok) {
            throw new Error(`GeoJSON für ${month} nicht gefunden.`);
        }
        return response.json();
    }).then(data => {
        const newLayer = L.geoJSON(data, {
            pointToLayer: createCircleMarker, // Deine Funktion für Marker
            onEachFeature: function (feature, layer) {
                bindPopupEvents(feature, layer);
            }
        }).addTo(map);
        
        geoJsonLayers.push(newLayer);
        
        if (newLayer.getLayers().length > 0) {
            map.fitBounds(newLayer.getBounds());
        } else {
            console.warn('Keine gültigen Features gefunden.');
        }
        
        // Optional: Legende etc. erstellen
        const maxImportance = Math.max(...data.features.map(feature => feature.properties.importance || 0));
        createLegend(maxImportance);
    }). catch (error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

const namedLineLayers = {};

function loadLineGeoJsonByMonth(month) {
    const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_months.geojson";
    const layerName = "lineLayer_" + month;
    
    // Entferne alle vorhandenen Linien-Layer aus namedLineLayers
    Object.keys(namedLineLayers).forEach(key => {
        map.removeLayer(namedLineLayers[key]);
        delete namedLineLayers[key];
    });
    
    // Setze den Toggle zurück
    const lineToggle = document.getElementById('lineToggle');
    lineToggle.checked = false;
    const lineToggleIcon = document.getElementById('lineToggleIcon');
    lineToggleIcon.innerHTML = '';
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Line GeoJSON für ${month} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            // Filtere Features für den gewünschten Monat
            const filteredFeatures = data.features.filter(feature =>
                feature.properties && feature.properties.month === month
            );
            
            // Erstelle den neuen Linien-Layer
            const newLineLayer = L.geoJSON(filteredFeatures, {
                style: { color: '#AAAAFA', weight: 2 },
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        layer.bindPopup(`Monat: ${feature.properties.month}`);
                    }
                }
            });
            
            newLineLayer.layerName = layerName;
            namedLineLayers[layerName] = newLineLayer;
            
            // Setze den globalen aktiven Layer auf den neuen Layer
            activeLineLayer = newLineLayer;
            
            // Falls der Toggle aktiv ist, füge den neuen Layer hinzu
            if (lineToggle.checked) {
                activeLineLayer.addTo(map);
                activeLineLayer.bringToBack();
            }
        })
        .catch(error => {
            console.error("Error loading line GeoJSON:", error);
        });
}


// Toggle‑Listener für den Linien-Layer einrichten
function setupLineToggleControl(layer) {
    const lineToggle = document.getElementById('lineToggle');
    const lineToggleIcon = document.getElementById('lineToggleIcon');

    // Um alte Listener zu entfernen, klonen wir den Button und binden den Listener neu
    const newToggle = lineToggle.cloneNode(true);
    lineToggle.parentNode.replaceChild(newToggle, lineToggle);

    // Binde den Eventlistener an den neuen Toggle
    newToggle.addEventListener('change', function () {
        if (this.checked) {
            map.addLayer(layer);
            layer.bringToBack();
            updateLineUrlParam('on');
        } else {
            map.removeLayer(layer);
            updateLineUrlParam('off');
        }
        updateIcon();
    });
}

// Funktion zur Aktualisierung des URL-Parameters "l" für den Linien-Layer
function updateLineUrlParam(state) {
    const params = new URLSearchParams(window.location.search);
    if (state === 'off') {
        params. set ('l', 'off');
    } else {
        params. delete ('l');
    }
    const newUrl = window.location.pathname + '?' + params.toString() + window.location.hash;
    window.history.replaceState({
    },
    '', newUrl);
}

// Funktionen zum Aktualisieren des URL-Fragments und zum Ändern des Monats bleiben unverändert:
function updateUrlFragment(month) {
    if (window.location.hash.substring(1) !== month) {
        window.location.hash = month;
    }
}

function getMonthFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1): null;
}

function setMonthAndLoad(month) {
    document.getElementById('date-input').value = month;
    updateUrlFragment(month);
    loadGeoJsonByMonth(month);
    loadLineGeoJsonByMonth(month);
}

function formatMonthToISO(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function changeMonthByMonths(currentMonth, months) {
    const[year, month] = currentMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + months, 1);
    return formatMonthToISO(newDate);
}

// Initialisiere die Karte
initializeMap();

// Eventlistener für das Monatseingabefeld und die Navigations-Buttons
document.getElementById('date-input').addEventListener('change', function () {
    const month = this.value;
    if (month) {
        setMonthAndLoad(month);
    }
});

document.getElementById('load-data').addEventListener('click', function () {
    const month = document.getElementById('date-input').value;
    if (month) {
        setMonthAndLoad(month);
    }
});

document.getElementById('prev-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentMonth = dateInput.value;
    const newMonth = changeMonthByMonths(currentMonth, -1);
    setMonthAndLoad(newMonth);
});

document.getElementById('next-day').addEventListener('click', function () {
    const dateInput = document.getElementById('date-input');
    const currentMonth = dateInput.value;
    const newMonth = changeMonthByMonths(currentMonth, 1);
    setMonthAndLoad(newMonth);
});

window.addEventListener('hashchange', function () {
    const month = getMonthFromUrl();
    if (month) {
        setMonthAndLoad(month);
    }
});

const initialMonth = getMonthFromUrl() || '1895-01';
setMonthAndLoad(initialMonth);

// Globale Variable für den aktuell aktiven Linien-Layer
let activeLineLayer = null;

// Einmaliger Setup des Toggle-Listeners (z. B. beim Initialisieren der Seite)
function initLineToggleControl() {
    const lineToggle = document.getElementById('lineToggle');
    const lineToggleIcon = document.getElementById('lineToggleIcon');

    // Entferne vorherige Eventlistener, falls vorhanden (optional, falls du initLineToggleControl mehrfach aufrufst)
    lineToggle.replaceWith(lineToggle.cloneNode(true));
    
    // Hole das Toggle-Element erneut, da cloneNode ein neues Element erzeugt
    const newToggle = document.getElementById('lineToggle');
    newToggle.addEventListener('change', function() {
        if (this.checked) {
            // Füge immer den aktuell aktiven Layer hinzu (falls vorhanden)
            if (activeLineLayer) {
                map.addLayer(activeLineLayer);
                activeLineLayer.bringToBack();
            }
            lineToggleIcon.innerHTML = '';
            updateLineUrlParam('on');
        } else {
            if (activeLineLayer) {
                map.removeLayer(activeLineLayer);
            }
            lineToggleIcon.innerHTML = '';
            updateLineUrlParam('off');
        }
    });
}

// Rufe initLineToggleControl einmal beim Start auf
initLineToggleControl();

