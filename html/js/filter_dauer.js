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
  displayFilteredGeoJsonImportance(map);
}

// Funktion zum Erstellen der interaktiven Legende
export function createLegend(maxImportance) {
  const legend = document.getElementById('legend');
  if (!legend) return;

  legend.innerHTML = '';

  const legendTitle = document.createElement('span');
  legendTitle.innerText = '';
  legend.appendChild(legendTitle);

  // Hole die in der URL ausgewählten Schwellenwerte
  let selectedThresholds = getSelectedThresholdsFromURL();
  if (selectedThresholds === null) {
    // Kein Filter gesetzt → alle Schwellenwerte sind ausgewählt
    selectedThresholds = new Set(thresholds);
  }

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

    if (threshold > maxImportance) break;
  }
}

