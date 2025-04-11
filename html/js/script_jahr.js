// Globale Variablen und Funktionen
const geoJsonLayers = [];
let lineLayer; // Für den Linien-Layer

// --- NEU: Konstanten für den Jahresbereich ---
const startYear = 1869;
const endYear = 1931;

// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(year) {
    // Stelle sicher, dass year ein String ist für den Vergleich
    const yearStr = String(year);
    if (window.location.hash.substring(1) !== yearStr) {
        window.location.hash = yearStr;
    }
}

// Funktion, um das Jahr aus der URL zu lesen
function getYearFromUrl() {
    const hash = window.location.hash;
    // Gibt den Hash-Wert ohne # zurück, oder null
    return hash ? hash.substring(1) : null;
}

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => {
        if (map.hasLayer(layer)) {
             map.removeLayer(layer);
        }
        });
    geoJsonLayers.length = 0;
     // Optional: Auch die Legende entfernen
     const legend = document.querySelector('.legend');
     if (legend) {
         legend.remove();
     }
}

// Funktion zum Laden von GeoJSON basierend auf einem Jahr
function loadGeoJsonByYear(year) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${year}.geojson`;

    clearGeoJsonLayers(); // Vorherige Layer entfernen

    fetch(url)
        .then(response => {
            if (!response.ok) {
                 // Benutzerfreundlichere Meldung
                 console.error(`GeoJSON für ${year} nicht gefunden.`);
                 alert(`Keine Punktdaten für das Jahr ${year} gefunden.`);
                 throw new Error(`GeoJSON für ${year} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
             if (!data.features || data.features.length === 0) {
                 console.warn(`Keine gültigen Features für ${year} gefunden.`);
                 alert(`Keine Punktdaten für das Jahr ${year} vorhanden.`);
                 return; // Beenden, wenn keine Features vorhanden sind
             }

            const newLayer = L.geoJSON(data, {
                pointToLayer: (feature, latlng) => {
                     // Stelle sicher, dass createCircleMarker existiert
                     if (typeof createCircleMarker === 'function') {
                         return createCircleMarker(feature, latlng);
                     }
                     // Fallback-Marker
                     console.warn("createCircleMarker Funktion nicht definiert, verwende Standardmarker.");
                     return L.marker(latlng);
                },
                onEachFeature: function (feature, layer) {
                     // Stelle sicher, dass bindPopupEvents existiert
                    if (typeof bindPopupEvents === 'function') {
                         bindPopupEvents(feature, layer);
                    }
                }
            }).addTo(map);

            geoJsonLayers.push(newLayer);

            if (newLayer.getLayers().length > 0) {
                map.fitBounds(newLayer.getBounds());
            }

            // Maximalen Wert für die Wichtigkeit bestimmen
            const maxImportance = Math.max(
                0, // Sicherstellen, dass das Ergebnis nie negativ ist
                ...data.features.map(feature => feature.properties?.importance || 0) // Optional Chaining für Sicherheit
            );

             // Legende erstellen (sicherstellen, dass Funktion existiert)
             if (typeof createLegend === 'function') {
                createLegend(maxImportance);
             }
        })
        .catch(error => {
            // Fehler wurde meist schon vorher behandelt, dies fängt Netzwerkfehler etc. ab
            console.error('Fehler beim Laden oder Verarbeiten von GeoJSON:', error);
            clearGeoJsonLayers(); // Aufräumen
        });
}

// Laden des Linien-Layers für das ausgewählte Jahr
function loadLineGeoJsonByYear(year) {
    const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_years.geojson";

    // Entferne vorhandenen Linien-Layer sicher
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
    }
    lineLayer = null; // Zurücksetzen

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Line GeoJSON nicht gefunden.`); // Generische Fehlermeldung
            }
            return response.json();
        })
        .then(data => {
            // Filtere Features sicher und mit String-Vergleich
            const yearStr = String(year);
            const filteredFeatures = data.features.filter(feature =>
                feature.properties && String(feature.properties.year) === yearStr
            );

            // console.log("Gefilterte Linien-Features für Jahr", year, filteredFeatures);

             if (filteredFeatures.length === 0) {
                 console.log(`Keine Linien-Features für Jahr ${year} gefunden.`);
                 // Optional: Toggle deaktivieren
                 const lineToggle = document.getElementById('lineToggle');
                 if (lineToggle) lineToggle.disabled = true;
                 return; // Beenden
             }

              // Optional: Toggle aktivieren, falls er deaktiviert war
              const lineToggle = document.getElementById('lineToggle');
              if (lineToggle) lineToggle.disabled = false;


            // Erstelle den Linien-Layer
            lineLayer = L.geoJSON(filteredFeatures, {
                style: {
                    color: '#FF5A64',
                    weight: 2
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties && typeof layer.bindPopup === 'function') {
                        const popupContent = `Jahr: ${feature.properties.year}`;
                        layer.bindPopup(popupContent);
                    }
                }
            });

            // Layer nur hinzufügen, wenn Toggle aktiv ist
            if (lineToggle && lineToggle.checked) {
                 if (lineLayer) {
                     lineLayer.addTo(map);
                     lineLayer.bringToBack();
                 }
            }

            // Stelle sicher, dass setupLineToggleControl existiert und rufe es auf
             if (typeof setupLineToggleControl === 'function') {
                 setupLineToggleControl(lineLayer); // Übergibt den *neuen* lineLayer
             }
        })
        .catch(error => {
            console.error("Error loading line GeoJSON:", error);
            if (lineLayer && map.hasLayer(lineLayer)) {
                map.removeLayer(lineLayer);
            }
             lineLayer = null;
             // Optional: Toggle deaktivieren bei Fehler
             const lineToggle = document.getElementById('lineToggle');
             if (lineToggle) lineToggle.disabled = true;
        });
}

// --- ANGEPASSTE Funktion zum Setzen des Jahres und Laden ---
function setYearAndLoad(year) {
    // Hole Referenz zum SELECT-Element
    const yearSelect = document.getElementById('date-input');
    // Konvertiere zu Nummer für Vergleiche, zu String für's Setzen
    const yearNum = parseInt(String(year), 10);
    const yearStr = String(yearNum); // Bereinigter String

    // Prüfen, ob das Jahr im gültigen Bereich ist
    if (isNaN(yearNum) || yearNum < startYear || yearNum > endYear) {
         console.warn(`Ungültiges Jahr ${year} wird ignoriert oder auf Standard gesetzt.`);
         // Fallback auf das erste Jahr oder einen Standardwert
         const fallbackYear = yearSelect.options[0]?.value || startYear;
         yearSelect.value = String(fallbackYear);
         alert(`Das angeforderte Jahr ${year} ist ungültig. Zeige ${yearSelect.value}.`);
         // Rekursiver Aufruf mit dem Fallback-Wert, um Ladevorgang zu starten
         setYearAndLoad(yearSelect.value);
         return; // Wichtig: Beende die aktuelle Ausführung
    }

    // Setze den Wert im Dropdown (als String!)
    yearSelect.value = yearStr;

    // Aktualisiere URL
    updateUrlFragment(yearStr);

    // Linien-Layer und Toggle zurücksetzen (Logik bleibt gleich)
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
        lineLayer = null;
    }
    const lineToggle = document.getElementById('lineToggle');
    if (lineToggle) {
         // Status des Toggles nicht ändern, nur den zugehörigen Layer entfernen
        // lineToggle.checked = false; // Entfernt, Status bleibt erhalten
        const lineToggleIcon = document.getElementById('lineToggleIcon');
        if (lineToggleIcon) {
            // lineToggleIcon.innerHTML = ''; // Optional: Icon-Reset
        }
    }

    // Lade die GeoJSON-Daten für Punkte und Linien neu
    loadGeoJsonByYear(yearStr);
    loadLineGeoJsonByYear(yearStr); // Wird den Layer nur hinzufügen, wenn Toggle aktiv ist

     // Optional: Buttons deaktivieren, wenn an den Grenzen
     const prevYearButton = document.getElementById('prev-year');
     const nextYearButton = document.getElementById('next-year');
     if (prevYearButton) prevYearButton.disabled = (yearNum <= startYear);
     if (nextYearButton) nextYearButton.disabled = (yearNum >= endYear);
}

// Event-Listener und Initialisierung
document.addEventListener('DOMContentLoaded', () => {

    // Referenzen zu den Steuerelementen
    const yearSelect = document.getElementById('date-input'); // Das SELECT-Element
    const prevYearButton = document.getElementById('prev-year');
    const nextYearButton = document.getElementById('next-year');

    // --- NEU: Dropdown mit Jahren befüllen ---
    yearSelect.innerHTML = ''; // Sicherstellen, dass es leer ist
    for (let y = startYear; y <= endYear; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        yearSelect.appendChild(option);
    }

    // Karte initialisieren (stelle sicher, dass die Funktion existiert)
     if (typeof initializeMap === 'function') {
        initializeMap();
     } else {
         console.error("Funktion initializeMap nicht gefunden!");
     }


    // --- ANGEPASSTE Eventlistener ---

    // Eventlistener für das Jahres-Dropdown (SELECT)
    yearSelect.addEventListener('change', function () {
        // Der Wert des Selects ist bereits der String des Jahres
        setYearAndLoad(this.value);
    });

    // Eventlistener für "vorheriges Jahr"
    prevYearButton.addEventListener('click', () => {
         // Lese Wert aus dem SELECT
        const currentYear = parseInt(yearSelect.value, 10);
        if (!isNaN(currentYear)) {
             setYearAndLoad(currentYear - 1); // setYearAndLoad prüft die Grenzen
        }
    });

    // Eventlistener für "nächstes Jahr"
    nextYearButton.addEventListener('click', () => {
         // Lese Wert aus dem SELECT
        const currentYear = parseInt(yearSelect.value, 10);
        if (!isNaN(currentYear)) {
             setYearAndLoad(currentYear + 1); // setYearAndLoad prüft die Grenzen
        }
    });

    // Überwache Änderungen am URL-Fragment
    window.addEventListener('hashchange', function () {
         const yearFromHash = getYearFromUrl();
         const currentSelectedYear = yearSelect.value;
         // Nur neu laden, wenn der Hash sich geändert hat UND vom aktuell ausgewählten abweicht
         if (yearFromHash && yearFromHash !== currentSelectedYear) {
            setYearAndLoad(yearFromHash);
         }
    });

    // --- Initialisierung ---
    // Initialisiere die Karte mit dem Jahr aus der URL oder einem Standardwert
    const initialYear = getYearFromUrl() || '1890'; // Dein Standardjahr
    setYearAndLoad(initialYear); // Setzt Dropdown-Wert, lädt Daten, prüft Grenzen

    // Initialisiere Line-Toggle-Logik (falls vorhanden und benötigt)
     if (typeof initLineToggleControl === 'function') {
         initLineToggleControl(); // Eventuell anpassen, falls es auf activeLineLayer basiert
     } else if (typeof setupLineToggleControl === 'function') {
         // Eventuell initiale Einrichtung hier, falls nicht in loadLineGeoJsonByYear
         // setupLineToggleControl(null); // Initial ohne Layer?
     }


});
