import { map, createCircleMarkerDynamic, bindPopupEvents, clearGeoJsonLayers, geoJsonLayers, initializeMapLarge } from './fuer-alle-karten.js';
import { setupLineToggleControl, updateLineUrlParam } from './linie-anzeigen.js';
import { createStaticLegend } from './legend_static.js';

const namedLineLayers = {}; // Behalten wir für die Verwaltung der Linienlayer bei
let activeLineLayer = null; // Globale Variable für den aktuell aktiven Linien-Layer

// Nur Map initialisieren, ohne automatische Datenladung
if (!map) {
  initializeMapLarge();
}

function loadGeoJsonByMonth(month) { // Erwartet "YYYY-MM"
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${month}.geojson`;

    // Entferne vorherige Punkt-Layer und Legende
    clearGeoJsonLayers();

    fetch(url).then(response => {
        if (!response.ok) {
            // Zeige eine Meldung an, statt nur in der Konsole
            console.error(`GeoJSON für ${month} nicht gefunden.`);
            alert(`Für ${month} wurden keine Punktdaten gefunden.`);
            throw new Error(`GeoJSON für ${month} nicht gefunden.`);
        }
        return response.json();
    }).then(data => {
        if (data.features.length === 0) {
             alert(`Für ${month} wurden keine Punktdaten gefunden.`);
             return; // Frühzeitig beenden, wenn keine Features da sind
        }

        data.features.sort((a, b) => (a.properties?.importance || 0) - (b.properties?.importance || 0));

        const newLayer = L.geoJSON(data, {
             pointToLayer: createCircleMarkerDynamic("importance"),
            onEachFeature: function (feature, layer) {
              if (typeof bindPopupEvents === 'function') {
                   bindPopupEvents(feature, layer);
                 }
              }
        }).addTo(map);

        geoJsonLayers.push(newLayer);

        if (newLayer.getLayers().length > 0) {
            map.fitBounds(newLayer.getBounds());
        }

        // Optional: Legende etc. erstellen
        const maxImportance = Math.max(0, ...data.features.map(feature => feature.properties?.importance || 0));
        // Stelle sicher, dass createStaticLegend definiert ist
        if (typeof createStaticLegend === 'function') {
            createStaticLegend(maxImportance);
        }
    }).catch (error => {
        // Fehler wurde bereits im 'response.ok'-Check behandelt oder ist ein Netzwerkfehler
        console.error('Error loading or processing GeoJSON:', error);
        // Optional: Zusätzliche Fehlermeldung für den Benutzer
        // alert(`Ein Fehler ist beim Laden der Daten für ${month} aufgetreten.`);
        clearGeoJsonLayers(); // Stelle sicher, dass alles sauber ist
    });
}


function loadLineGeoJsonByMonth(month) { // Erwartet "YYYY-MM"
    const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_months.geojson";
    const layerName = "lineLayer_" + month; // Eindeutiger Name pro Monat

    // Entferne alle vorhandenen Linien-Layer aus der Karte und dem Speicher
    Object.keys(namedLineLayers).forEach(key => {
        if (map.hasLayer(namedLineLayers[key])) {
             map.removeLayer(namedLineLayers[key]);
        }
        delete namedLineLayers[key];
    });
    activeLineLayer = null; // Setze den aktiven Layer zurück

    // Setze den Toggle zurück (Status wird später basierend auf URL/Standard gesetzt)
    const lineToggle = document.getElementById('lineToggle');
    // lineToggle.checked = false; // Initial nicht aktiv, außer URL sagt was anderes
    lineToggle.checked = false;
    lineToggle.disabled = true;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Line GeoJSON konnte nicht geladen werden.`);
            }
            return response.json();
        })
        .then(data => {
            // Filtere Features für den gewünschten Monat
            const filteredFeatures = data.features.filter(feature =>
                feature.properties && feature.properties.month === month
            );

            if (filteredFeatures.length === 0) {
                 console.log(`Keine Linien-Features für Monat ${month} gefunden.`);
                 // Stelle sicher, dass der Toggle deaktiviert ist, wenn keine Daten da sind
                 lineToggle.checked = false;
                 lineToggle.disabled = true; // Optional: Toggle deaktivieren
                 // Eventuell auch das Icon anpassen
                 const lineToggleIcon = document.getElementById('lineToggleIcon');
                 if (lineToggleIcon) lineToggleIcon.innerHTML = '';
                 return; // Beenden, wenn keine Linien für den Monat existieren
            }

             lineToggle.disabled = false; // Toggle aktivieren, falls er deaktiviert war

            // Erstelle den neuen Linien-Layer
            const newLineLayer = L.geoJSON(filteredFeatures, {
                style: { color: '#AAAAFA', weight: 2 },
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                         // Stelle sicher, dass bindPopup definiert ist
                        if (typeof layer.bindPopup === 'function') {
                            layer.bindPopup(`Monat: ${feature.properties.month}`);
                        }
                    }
                }
            });

            // Speichere den Layer und setze ihn als aktiv
            newLineLayer.layerName = layerName;
            namedLineLayers[layerName] = newLineLayer;
            activeLineLayer = newLineLayer; // Setze den globalen aktiven Layer
            const params = new URLSearchParams(window.location.search);
            const lineParam = params.get('l');
            const shouldBeVisible = (lineParam === 'on');

            setupLineToggleControl(activeLineLayer, shouldBeVisible);

             lineToggle.checked = shouldBeVisible; // Setze den Toggle-Status

            if (shouldBeVisible && activeLineLayer) {
                activeLineLayer.addTo(map);
                activeLineLayer.bringToBack();
            }
            // Aktualisiere das Icon basierend auf dem initialen Status
            updateLineToggleIcon(shouldBeVisible);

        })
        .catch(error => {
            console.error("Error loading line GeoJSON:", error);
            // Toggle deaktivieren bei Fehler
            lineToggle.checked = false;
            lineToggle.disabled = true;
             const lineToggleIcon = document.getElementById('lineToggleIcon');
             if (lineToggleIcon) lineToggleIcon.innerHTML = '';

        });
}

// Aktualisiert nur das Hash-Fragment (#YYYY-MM)
function updateUrlFragment(month) { // month ist "YYYY-MM"
    if (month && window.location.hash !== `#${month}`) { // Nur ändern, wenn nötig
         window.location.hash = month;
    }
}

// Liest Monat aus dem URL-Fragment
function getMonthFromUrl() {
    const hash = window.location.hash;
    // Einfache Validierung, ob es wie YYYY-MM aussieht
    if (hash && /^#\d{4}-\d{2}$/.test(hash)) {
        return hash.substring(1); // Gibt "YYYY-MM" zurück
    }
    return null; // Kein gültiger Hash gefunden
}

// Kernfunktion: Aktualisiert Dropdowns, URL und lädt Daten
function setMonthAndLoad(month) { // month MUSS "YYYY-MM" sein
     if (!month || !/^\d{4}-\d{2}$/.test(month)) {
          console.error("Ungültiges Monatsformat für setMonthAndLoad:", month);
          // Fallback auf einen Standardmonat oder Fehler anzeigen
          month = '1895-01'; // Beispiel-Fallback
          alert("Ungültiger Monat im Link oder Initialwert. Lade Januar 1895.");
     }

     const [year, monthNum] = month.split('-'); // Zerlege in Jahr und Monat

     // Referenzen zu den Dropdowns holen
     const monthSelect = document.getElementById('month-select');
     const yearSelect = document.getElementById('year-select');

     // Werte in den Dropdowns setzen
     if (yearSelect.querySelector(`option[value="${year}"]`)) {
          yearSelect.value = year;
     } else {
          console.warn(`Jahr ${year} nicht im Dropdown gefunden. Fallback.`);
          // Fallback, wenn Jahr nicht existiert (z.B. aus altem Link)
          yearSelect.value = yearSelect.options[1]?.value || startYear; // Ersten gültigen Wert oder Startjahr nehmen
          month = `${yearSelect.value}-${monthNum.padStart(2,'0')}`; // Monat neu zusammensetzen mit gültigem Jahr
          alert(`Jahr ${year} ist ungültig. Angepasst auf ${yearSelect.value}.`);
     }
     monthSelect.value = monthNum.padStart(2, '0'); // Stelle sicher, dass es "01", "02" etc. ist

    // URL-Fragment aktualisieren
    updateUrlFragment(month);

    // GeoJSON-Daten laden
    loadGeoJsonByMonth(month);
    loadLineGeoJsonByMonth(month);
}

// Berechnet den neuen Monat basierend auf dem Offset
function changeMonthByMonths(currentMonth, months) { // currentMonth ist "YYYY-MM"
     if (!currentMonth) return null; // Absicherung
    const [year, month] = currentMonth.split('-').map(Number);
    // Vorsicht: Monate sind 0-basiert in Date(), daher month - 1
    const currentDate = new Date(year, month - 1, 1);
    currentDate.setMonth(currentDate.getMonth() + months);

     // Zurück ins "YYYY-MM" Format
    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${newYear}-${newMonth}`;
}

// --- Initialisierung und Event Listener ---

document.addEventListener('DOMContentLoaded', function() {

    // Referenzen zu den Elementen holen
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    // const loadButton = document.getElementById('load-data'); // Nicht mehr benötigt
    const prevButton = document.getElementById('prev-day');
    const nextButton = document.getElementById('next-day');

    // Jahre-Dropdown befüllen (Code unverändert)
    const startYear = 1862;
    const endYear = 1931;
    yearSelect.innerHTML = ''; // Vorherige Optionen leeren
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Jahr...";
    placeholderOption.disabled = true;
    placeholderOption.selected = true; // Platzhalter standardmäßig auswählen
    yearSelect.appendChild(placeholderOption);

    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    function triggerLoadFromDropdowns() {
        const selectedMonth = monthSelect.value; // Ist "01", "02", ...
        const selectedYear = yearSelect.value;   // Ist "YYYY" oder ""

        // Nur fortfahren, wenn ein gültiger Monat UND ein gültiges Jahr (nicht der Platzhalter) ausgewählt sind
        if (selectedMonth && selectedYear) {
            const monthString = `${selectedYear}-${selectedMonth}`;
            // Hole den aktuellen Hash, um unnötiges Neuladen zu vermeiden, falls
            // der Hash bereits dem entspricht, was ausgewählt wurde (kann bei Initialisierung passieren)
            const currentHashMonth = window.location.hash.substring(1);
            if (monthString !== currentHashMonth) {
                 setMonthAndLoad(monthString);
            }
        }
    }

    monthSelect.addEventListener('change', triggerLoadFromDropdowns);
    yearSelect.addEventListener('change', triggerLoadFromDropdowns);


    prevButton.addEventListener('click', function() {
        const currentYear = yearSelect.value;
        const currentMonth = monthSelect.value;
        if (currentYear && currentMonth) {
            const currentMonthString = `${currentYear}-${currentMonth}`;
            const newMonth = changeMonthByMonths(currentMonthString, -1);
             const [newYearNum] = newMonth.split('-').map(Number);
             if (newYearNum >= startYear) {
                 setMonthAndLoad(newMonth);
             } else {
                 console.log("Minimum erreicht");
             }
        }
    });

    nextButton.addEventListener('click', function() {
        const currentYear = yearSelect.value;
        const currentMonth = monthSelect.value;
        if (currentYear && currentMonth) {
            const currentMonthString = `${currentYear}-${currentMonth}`;
            const newMonth = changeMonthByMonths(currentMonthString, 1);
             const [newYearNum] = newMonth.split('-').map(Number);
             if (newYearNum <= endYear) {
                setMonthAndLoad(newMonth);
             } else {
                 console.log("Maximum erreicht");
             }
        }
    });

    // Event Listener für Änderungen im URL-Hash (unverändert)
    window.addEventListener('hashchange', function() {
        const monthFromHash = getMonthFromUrl();
        // Hole den aktuell in den Dropdowns ausgewählten Monat/Jahr
        const currentSelected = (yearSelect.value && monthSelect.value) ? `${yearSelect.value}-${monthSelect.value}` : null;

        // Nur laden, wenn sich der Hash von der aktuellen Auswahl unterscheidet
        // und der Hash gültig ist
        if (monthFromHash && monthFromHash !== currentSelected) {
            setMonthAndLoad(monthFromHash);
        }
    });

    // Initialen Monat festlegen und laden (unverändert)
    const initialMonth = getMonthFromUrl() || '1895-01';
    // Stelle sicher, dass der Platzhalter nicht ausgewählt ist, bevor initial geladen wird
    if (yearSelect.value === "") {
         const [initialY, initialM] = initialMonth.split('-');
         if (yearSelect.querySelector(`option[value="${initialY}"]`)) {
              yearSelect.value = initialY;
              monthSelect.value = initialM.padStart(2, '0');
         } else {
              // Fallback, wenn initiales Jahr ungültig
              yearSelect.value = startYear; // oder endYear
              monthSelect.value = '01'; // oder entsprechender Monat
              alert(`Initiales Jahr ${initialY} ungültig. Lade ${yearSelect.value}-${monthSelect.value}.`);
              setMonthAndLoad(`${yearSelect.value}-${monthSelect.value}`); // Lade Fallback explizit
              return; // Beende Initialisierung hier
         }

    }
     setMonthAndLoad(initialMonth); // Lädt, wenn Jahr NICHT der Platzhalter war

  if (activeLineLayer) {
  const params = new URLSearchParams(window.location.search);
  const isVisible = params.get('l') === 'on';
  setupLineToggleControl(activeLineLayer, isVisible);
}

}); 

// Hilfsfunktion zum Aktualisieren des Icons basierend auf dem checked-Status
function updateLineToggleIcon(isChecked) {
     const lineToggleIcon = document.getElementById('lineToggleIcon');
     if (lineToggleIcon) {
          // Hier kannst du deine Icon-Logik einfügen, falls gewünscht
          // z.B.: lineToggleIcon.innerHTML = isChecked ? '<i class="bi bi-check"></i>' : '';
          lineToggleIcon.innerHTML = ''; // Beispiel: Icon immer leer
     }
}


