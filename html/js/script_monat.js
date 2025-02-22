// Globaler Variablen-Container für GeoJSON-Layer
const geoJsonLayers = [];
let lineLayer; // Für den Linien-Layer

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
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für ${month} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            const newLayer = L.geoJSON(data, {
                pointToLayer: createCircleMarker, // Deine Funktion für Marker
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        const popupContent = createPopupContent(feature); // Deine Funktion für Popups
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
            
            // Optional: Legende etc. erstellen
            const maxImportance = Math.max(
                ...data.features.map(feature => feature.properties.importance || 0)
            );
            createLegend(maxImportance);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers();
        });
}

// Neue Funktion: Laden des Linien-Layers für den ausgewählten Monat
function loadLineGeoJsonByMonth(month) {
    const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_months.geojson";
    
    // Falls bereits ein Linien-Layer vorhanden ist, entferne ihn
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
        lineLayer = null; // Optional: Setze die Variable zurück
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Line GeoJSON für ${month} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            // Filtere die Features nach dem Property "month"
            const filteredFeatures = data.features.filter(feature =>
                feature.properties && feature.properties.month === month
            );
            
            // Erstelle den Linien-Layer (mit einfachem Stil)
            lineLayer = L.geoJSON(filteredFeatures, {
                style: {
                   color: '#AAAAFA',
                    weight: 1
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        const popupContent = `Monat: ${feature.properties.month}`;
                        layer.bindPopup(popupContent);
                    }
                }
            });
            
            // Prüfe den aktuellen Zustand des Toggle‑Controls
            const lineToggle = document.getElementById('lineToggle');
            // Falls das Kontrollkästchen angehakt ist, soll die Linie sichtbar sein
            if (lineToggle.checked) {
                lineLayer.addTo(map);
                lineLayer.bringToBack();
            }
            
            // Richte den Toggle-Listener ein (falls noch nicht geschehen)
            setupLineToggleControl(lineLayer);
        })
        .catch(error => {
            console.error("Error loading line GeoJSON:", error);
            if (lineLayer && map.hasLayer(lineLayer)) {
                map.removeLayer(lineLayer);
            }
        });
}

// Funktion zum Einrichten des Toggle-Controls für den Linien-Layer
function setupLineToggleControl(layer) {
    const lineToggle = document.getElementById('lineToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    
    // Aktualisiere das Icon basierend auf dem aktuellen Zustand
    function updateIcon() {
        if (lineToggle.checked) {
            toggleIcon.innerHTML = '<i class="bi bi-circle-fill"></i>';
        } else {
            toggleIcon.innerHTML = '<i class="bi bi-x-lg"></i>';
        }
    }
    
    // Setze initial das Icon
    updateIcon();
    
    // Eventlistener für den Toggle-Schalter
    lineToggle.addEventListener('change', function() {
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
        params.set('l', 'off');
    } else {
        params.delete('l');
    }
    const newUrl = window.location.pathname + '?' + params.toString() + window.location.hash;
    window.history.replaceState({}, '', newUrl);
}

// Funktionen zum Aktualisieren des URL-Fragments und zum Ändern des Monats bleiben unverändert:
function updateUrlFragment(month) {
    if (window.location.hash.substring(1) !== month) {
        window.location.hash = month;
    }
}

function getMonthFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
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
    const [year, month] = currentMonth.split('-').map(Number);
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
