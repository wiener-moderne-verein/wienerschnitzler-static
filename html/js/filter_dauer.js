import { displayFilteredGeoJsonImportance } from './script_gesamt.js';
import { visibilityPalette, thresholds, clearGeoJsonLayers, map } from './fuer-alle-karten.js';

// Hilfsfunktion zum Abrufen der ausgewählten Schwellenwerte aus der URL
function getSelectedThresholdsFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("thresholds")) {
    return null; // Kein Filter gesetzt → alle Schwellenwerte ausgewählt
  }
  const thresholdsParam = params.get("thresholds");
  if (thresholdsParam === "0") {
    return new Set(); // Explizit keine Schwellenwerte ausgewählt
  }
  return new Set(thresholdsParam.split("_").map(Number));
}

// Hilfsfunktion zum Aktualisieren der URL mit ausgewählten Schwellenwerten
function updateURLWithThresholds(selectedThresholds) {
  const params = new URLSearchParams(window.location.search);

  if (selectedThresholds === null || selectedThresholds.size === thresholds.length) {
    // Alle Schwellenwerte ausgewählt → Parameter entfernen
    params.delete("thresholds");
  } else if (selectedThresholds.size === 0) {
    // Explizit keine Schwellenwerte ausgewählt → "thresholds=0"
    params.set("thresholds", "0");
  } else {
    params.set("thresholds", Array.from(selectedThresholds).join("_"));
  }

  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

// Funktion zum Umschalten eines Schwellenwerts
function toggleThreshold(threshold) {
  let selectedThresholds = getSelectedThresholdsFromURL();

  // Ist kein Filter gesetzt, gehen wir davon aus, dass alle Schwellenwerte ausgewählt sind
  if (selectedThresholds === null) {
    selectedThresholds = new Set(thresholds);
  }

  if (selectedThresholds.has(threshold)) {
    selectedThresholds.delete(threshold);  // Schwellenwert abwählen
  } else {
    selectedThresholds.add(threshold);     // Schwellenwert auswählen
  }

  updateURLWithThresholds(selectedThresholds);
  updateLegendAccordionState(selectedThresholds);
  displayFilteredGeoJsonImportance(map);
}

// Funktion zum Aktualisieren des Akkordion-Status für Legende
function updateLegendAccordionState(selectedThresholds) {
  const collapseElement = document.getElementById('collapseLegend');
  if (!collapseElement) return;

  const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });

  // Akkordion offen halten, wenn ein Filter aktiv ist (nicht alle ausgewählt)
  if (selectedThresholds.size < thresholds.length) {
    bsCollapse.show();
  }
}

// Funktion zum Erstellen der interaktiven Legende
export function createLegend(maxImportance) {
  const legend = document.getElementById('legend');
  if (!legend) return;

  legend.innerHTML = '';

  // Hole die in der URL ausgewählten Schwellenwerte
  let selectedThresholds = getSelectedThresholdsFromURL();
  if (selectedThresholds === null) {
    // Kein Filter gesetzt → alle Schwellenwerte sind ausgewählt
    selectedThresholds = new Set(thresholds);
  }

  // "Alle"-Toggle-Button
  const allButton = document.createElement('button');
  allButton.innerText = 'Alle';
  allButton.classList.add('btn', 'btn-sm', 'm-1');
  const allSelected = selectedThresholds.size === thresholds.length;
  allButton.style.backgroundColor = allSelected ? '#6F5106' : '#ddd';
  allButton.style.color = allSelected ? 'white' : 'black';
  allButton.style.border = '1px solid #ccc';
  allButton.style.borderRadius = '3px';
  allButton.style.cursor = 'pointer';
  allButton.style.transition = 'background-color 0.2s, color 0.2s';

  allButton.addEventListener('click', function(e) {
    e.stopPropagation();
    updateURLWithThresholds(new Set(thresholds));
    updateLegendAccordionState(new Set(thresholds));
    displayFilteredGeoJsonImportance(map);
  });

  legend.appendChild(allButton);

  // "Keine"-Toggle-Button
  const noneButton = document.createElement('button');
  noneButton.innerText = 'Keine';
  noneButton.classList.add('btn', 'btn-sm', 'm-1');
  const noneSelected = selectedThresholds.size === 0;
  noneButton.style.backgroundColor = noneSelected ? '#6F5106' : '#ddd';
  noneButton.style.color = noneSelected ? 'white' : 'black';
  noneButton.style.border = '1px solid #ccc';
  noneButton.style.borderRadius = '3px';
  noneButton.style.cursor = 'pointer';
  noneButton.style.transition = 'background-color 0.2s, color 0.2s';

  noneButton.addEventListener('click', function(e) {
    e.stopPropagation();
    updateURLWithThresholds(new Set());
    updateLegendAccordionState(new Set());
    displayFilteredGeoJsonImportance(map);
  });

  legend.appendChild(noneButton);

  // Akkordion-Status initial setzen
  updateLegendAccordionState(selectedThresholds);

  // Erstelle alle Schwellenwert-Items (unabhängig von maxImportance)
  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    const color = visibilityPalette[i];

    const legendItem = document.createElement('span');
    legendItem.style.display = 'inline-flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.marginRight = '10px';
    legendItem.style.marginBottom = '5px';
    legendItem.style.cursor = 'pointer';
    legendItem.style.padding = '3px';
    legendItem.style.borderRadius = '3px';
    legendItem.style.transition = 'background-color 0.2s';

    // Setze Hintergrundfarbe basierend auf Auswahlstatus
    if (!selectedThresholds.has(threshold)) {
      legendItem.style.opacity = '0.4';
      legendItem.style.backgroundColor = '#f0f0f0';
    }

    const colorBox = document.createElement('span');
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.backgroundColor = color;
    colorBox.style.marginRight = '5px';
    colorBox.style.border = '1px solid #ccc';

    const label = document.createElement('span');
    label.innerText = threshold;
    label.style.userSelect = 'none';

    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);

    // Klick-Event für Interaktivität
    legendItem.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleThreshold(threshold);
    });

    // Hover-Effekt
    legendItem.addEventListener('mouseenter', function() {
      if (selectedThresholds.has(threshold)) {
        legendItem.style.backgroundColor = '#e8e8e8';
      }
    });

    legendItem.addEventListener('mouseleave', function() {
      if (selectedThresholds.has(threshold)) {
        legendItem.style.backgroundColor = 'transparent';
      }
    });

    legend.appendChild(legendItem);
  }
}

