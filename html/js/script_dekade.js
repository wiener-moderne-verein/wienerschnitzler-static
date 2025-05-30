import { initView, map, createCircleMarkerDynamic, bindPopupEvents, clearGeoJsonLayers, geoJsonLayers } from './fuer-alle-karten.js';
import { setupLineToggleControl } from './linie-anzeigen.js';
import { createLegend } from './filter_dauer.js';

// Array zur Verwaltung der Punkt-Layer
let lineLayer; 

// Funktion zum Laden der Punktdaten basierend auf einer Dekade
function loadGeoJsonByDecade(decade) {
    const startYear = decade;
    const endYear = parseInt(decade, 10) + 9;
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${encodeURIComponent(startYear)}-${encodeURIComponent(endYear)}.geojson`;

    clearGeoJsonLayers();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für die Dekade ${startYear}-${endYear} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            // 🔁 Features nach importance aufsteigend sortieren (weniger wichtig zuerst)
            data.features.sort((a, b) => {
                const impA = a.properties?.importance ?? 0;
                const impB = b.properties?.importance ?? 0;
                return impA - impB;
            });

            const newLayer = L.geoJSON(data, {
                pointToLayer: createCircleMarkerDynamic("importance"),
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

            // Maximalwert der Wichtigkeit ermitteln
            const maxImportance = Math.max(
                0,
                ...data.features.map(feature => feature.properties.importance || 0)
            );
            createLegend(maxImportance);
        })
        .catch(error => {
            console.error('Fehler beim Laden des GeoJSON:', error);
            clearGeoJsonLayers();
        });
}


// Neue Funktion: Laden des Linien-Layers für die Dekade
function loadLineGeoJsonByDecade(decade) {
  // Entferne eventuell vorhandenen Linien-Layer
  if (lineLayer && map.hasLayer(lineLayer)) {
    map.removeLayer(lineLayer);
    lineLayer = null;
  }
  
  const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_decades.geojson";
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Fehler beim Laden der Dekaden-Linien GeoJSON");
      }
      return response.json();
    })
    .then(data => {
      // Filtere Features, deren Property "decade" mit dem gewünschten Wert beginnt
      const filteredFeatures = data.features.filter(feature =>
        feature.properties &&
        feature.properties.decade &&
        feature.properties.decade.startsWith(decade)
      );
      
      // Erstelle den neuen Linien-Layer
      lineLayer = L.geoJSON(filteredFeatures, {
        style: {
          color: '#82D282',
          weight: 2
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            const popupContent = `Dekade: ${feature.properties.decade}`;
            layer.bindPopup(popupContent);
          }
        }
      });
      
      // Prüfe den Toggle-Zustand und füge ggf. den Layer der Karte hinzu
      const lineToggle = document.getElementById('lineToggle');
      if (lineToggle.checked) {
        lineLayer.addTo(map);
        lineLayer.bringToBack();
      }
      
      // Richte den Toggle-Listener ein (dabei wird der Button zuvor "bereinigt")
      setupLineToggleControl(lineLayer, lineToggle.checked);
    })
    .catch(error => {
      console.error("Fehler beim Laden der Dekaden-Linien:", error);
      if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
      }
    });
}

// Hilfsfunktion zum Aktualisieren der Button-Beschriftung inklusive Info-Icon
function updateLineToggleButtonLabel(button, visible) {
    const labelText = visible ? 'Linie ausblenden' : 'Linie';
    button.innerHTML = labelText;
}

// Funktion zur Aktualisierung des URL-Parameters "l" (optional)
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

// --- Funktionen zum Aktualisieren des URL-Fragments, Lesen und Ändern der Dekade ---

function updateUrlFragment(decade) {
    if (window.location.hash.substring(1) !== decade) {
        window.location.hash = decade;
    }
}

function getDecadeFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

// Diese Funktion setzt den Dropdown-Wert, aktualisiert das URL-Fragment,
// entfernt den vorhandenen Linien-Layer und setzt den Switch (lineToggle) auf "aus",
// bevor die neuen GeoJSON-Daten geladen werden.
function setDecadeAndLoad(decade) {
    const decadeNum = parseInt(decade, 10);
    if (isNaN(decadeNum) || decadeNum < 1861 || decadeNum > 1921) {
        console.warn(`Ungültige Dekade: ${decade}`);
        return;
    }

    document.getElementById('decade-input').value = decade;
    updateUrlFragment(decade);

    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
        lineLayer = null;
    }

    const lineToggle = document.getElementById('lineToggle');
    lineToggle.checked = false;
    updateLineToggleButtonLabel(lineToggle, false);

    loadGeoJsonByDecade(decade);
    loadLineGeoJsonByDecade(decade);
}

function changeDecadeByYears(currentDecade, years) {
    const startYear = parseInt(currentDecade, 10);
    const newStartYear = startYear + (years * 10);

    // Nur Dekaden zwischen 1861 und 1921 erlauben
    if (newStartYear < 1861 || newStartYear > 1921) {
        return currentDecade; // Keine Änderung
    }

    return newStartYear.toString();
}

// Fülle das Dropdown-Menü mit Dekaden
function populateDecadeDropdown() {
    const selectElement = document.getElementById('decade-input'); // ID muss stimmen
    // Beispiel: Von 1861 bis 1930 in 10-Jahres-Schritten
    for (let year = 1861; year <= 1930; year += 10) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}-${year + 9}`;
        selectElement.appendChild(option);
    }
}

initView();

// Eventlistener für das Dekadeneingabefeld (Dropdown)
document.getElementById('decade-input').addEventListener('change', function () {
    const decade = this.value;
    if (decade) {
        setDecadeAndLoad(decade);
    }
});

// Eventlistener für "Vorherige Dekade"-Button
document.getElementById('prev-decade').addEventListener('click', function () {
    const selectEl = document.getElementById('decade-input');
    const currentDecade = selectEl.value;
    const newDecade = changeDecadeByYears(currentDecade, -1);
    setDecadeAndLoad(newDecade);
});

// Eventlistener für "Nächste Dekade"-Button
document.getElementById('next-decade').addEventListener('click', function () {
    const selectEl = document.getElementById('decade-input');
    const currentDecade = selectEl.value;
    const newDecade = changeDecadeByYears(currentDecade, 1);
    setDecadeAndLoad(newDecade);
});

// Überwache Änderungen am URL-Fragment
window.addEventListener('hashchange', function () {
    const decade = getDecadeFromUrl();
    if (decade) {
        setDecadeAndLoad(decade);
    }
});

// Fülle das Dropdown mit Dekaden
populateDecadeDropdown();

// Initialisiere mit der Dekade aus der URL oder einem Standardwert (z. B. "1891")
const initialDecade = getDecadeFromUrl() || '1891';
setDecadeAndLoad(initialDecade);
