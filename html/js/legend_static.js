import { visibilityPalette, thresholds } from './fuer-alle-karten.js';

// Funktion zum Erstellen einer statischen (nicht-interaktiven) Legende
export function createStaticLegend(maxImportance) {
  const legend = document.getElementById('legend');
  if (!legend) return;

  legend.innerHTML = '';

  // Erstelle alle Schwellenwert-Items (ohne "Alle" und "Keine" Buttons)
  for (let i = 0; i < thresholds.length; i++) {
    const threshold = thresholds[i];
    const color = visibilityPalette[i];

    const legendItem = document.createElement('span');
    legendItem.style.display = 'inline-flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.marginRight = '10px';
    legendItem.style.marginBottom = '5px';
    legendItem.style.padding = '3px';

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

    legend.appendChild(legendItem);
  }
}
