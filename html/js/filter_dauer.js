import { displayFilteredGeoJsonImportance } from './script_gesamt.js';
import { visibilityPalette, thresholds, clearGeoJsonLayers, map } from './fuer-alle-karten.js';

// Funktion zum Erstellen der Legende (unabhängig vom DOM-Event, kann so bleiben)
export function createLegend(maxImportance) {
  const legend = document.getElementById('legend');
  if (!legend) return;

  legend.innerHTML = '';

  const legendTitle = document.createElement('span');
  legendTitle.innerText = '';
  legend.appendChild(legendTitle);

  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    const color = visibilityPalette[i];

    const legendItem = document.createElement('span');
    legendItem.style.display = 'inline-flex';
    legendItem.style.marginRight = '10px';

    const colorBox = document.createElement('span');
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.backgroundColor = color;
    colorBox.style.marginRight = '5px';

    const label = document.createElement('span');
    label.innerText = threshold;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(label);
    legend.appendChild(legendItem);

    if (threshold > maxImportance) break;
  }
}

// Funktion, um das Max-Eingabefeld mit dem höchsten Importance-Wert vorzubelegen (kann getrennt bleiben)
function prefillMaxImportance() {
  const maxInput = document.getElementById("max-input");
  if (window.geoJsonData && window.geoJsonData.features && maxInput && !maxInput.value) {
    const overallMaxImportance = Math.max(
      ...window.geoJsonData.features.map(f => f.properties.importance || 0)
    );
    maxInput.value = overallMaxImportance;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  prefillMaxImportance();

  const minInput = document.getElementById("min-input");
  const maxInput = document.getElementById("max-input");
  const updateButton = document.getElementById("update-filter");

  if (minInput && maxInput && updateButton) {
    // Damit maxInput.min immer >= minInput.value ist
    minInput.addEventListener("input", () => {
      const minValue = parseFloat(minInput.value);
      maxInput.min = !isNaN(minValue) ? minValue : 0;
    });

    // Automatisch URL anpassen und Karte aktualisieren bei Änderung
    [minInput, maxInput].forEach(input => {
      input.addEventListener("change", () => {
        let minValue = parseFloat(minInput.value);
        let maxValue = parseFloat(maxInput.value);

        if (isNaN(minValue)) minValue = 0;
        if (isNaN(maxValue)) maxValue = Infinity;

        if (maxValue < minValue) {
          alert("Der Max-Wert darf nicht unter dem Min-Wert liegen.");
          return;
        }

        const params = new URLSearchParams(window.location.search);
        params.set("min", minValue);
        params.set("max", maxValue);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
        clearGeoJsonLayers();
        displayFilteredGeoJsonImportance(map);
      });
    });

    // Optional: Update-Button weiterhin für manuelles Update (z.B. andere Filter)
    updateButton.addEventListener("click", () => {
      // Einfach den gleichen Effekt wie oben auslösen, z.B. so:
      minInput.dispatchEvent(new Event('change'));
      maxInput.dispatchEvent(new Event('change'));
    });

  } else {
    console.warn("Elemente für Filter (min-input, max-input, update-filter) nicht gefunden.");
  }

});
