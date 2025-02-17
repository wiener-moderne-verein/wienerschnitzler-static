// Hilfsfunktion zum Aktualisieren der Button-Beschriftung inklusive Info-Icon
function updateLineToggleButtonLabel(button, visible) {
  const labelText = visible ? 'Linie ausblenden' : 'Linie';
  button.innerHTML = labelText;
}


// Beispiel: Annahme, dass "lineLayer" Deinen Linien-Layer darstellt und "map" Deine Leaflet-Karte ist.
const lineToggle = document.getElementById('lineToggle');
const lineToggleIcon = document.getElementById('lineToggleIcon');

lineToggle.addEventListener('change', function() {
  if (this.checked) {
    // Wenn eingeschaltet: zeige den gefüllten Kreis
    lineToggleIcon.innerHTML = '';
    // Hier z.B. den Layer zur Karte hinzufügen:
    map.addLayer(lineLayer);
    // Stelle sicher, dass der Layer in den Hintergrund rückt, wenn nötig:
    lineLayer.bringToBack();
    updateLineUrlParam('on');
  } else {
    // Wenn ausgeschaltet: zeige ein X
    lineToggleIcon.innerHTML = '';
    // Hier z.B. den Layer von der Karte entfernen:
    map.removeLayer(lineLayer);
    updateLineUrlParam('off');
  }
});

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

// Funktion zum Setup des Toggle-Controls für einen Linien-Layer
function setupLineToggleControl(layer, initialVisibility) {
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