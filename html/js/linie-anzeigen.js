import {map, lineLayer} from './fuer-alle-karten.js';

// Hilfsfunktion zum Aktualisieren der Button-Beschriftung inklusive Info-Icon
function updateLineToggleButtonLabel(button, visible) {
  const labelText = visible ? 'Linie ausblenden' : 'Linie';
  button.innerHTML = labelText;
}

// Event-Listener werden nur eingerichtet, wenn setupLineToggleControl aufgerufen wird
// Entfernt den automatischen Event-Listener beim Modulimport

// Funktion zur Aktualisierung des URL-Parameters "l" (optional)
export function updateLineUrlParam(state) {
  const params = new URLSearchParams(window.location.search);
  if (state === 'off') {
    params.set('l', 'off');
  } else {
    params.delete('l');
  }
  const newUrl = window.location.pathname + '?' + params.toString() + window.location.hash;
  window.history.replaceState({}, '', newUrl);
}

// Funktion zum Setup des Toggle-Controls für einen Linien-Layer
export function setupLineToggleControl(layer, initialVisibility) {
  // Hole den Toggle-Button und das Icon
  let button = document.getElementById('lineToggle');
  const icon = document.getElementById('lineToggleIcon');

  // Setze initial den Zustand (Button-Beschriftung)
  updateLineToggleButtonLabel(button, initialVisibility);

  // Um alte Listener zu entfernen, ersetzen wir den Button durch eine Kopie:
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener('change', function () {
    if (this.checked) {
      map.addLayer(layer);
      layer.bringToBack();
      updateLineUrlParam('on');
    } else {
      map.removeLayer(layer);
      updateLineUrlParam('off');
    }
    updateLineToggleButtonLabel(newButton, this.checked);
  });
}