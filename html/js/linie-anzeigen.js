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

// Diese Datei enthält die Definition der Funktion
function setupLineToggleControl(layer, initialVisibility) {
    let button = document.querySelector('button.linetoggle');
    if (!button) {
        console.warn('Kein Button mit Klasse "linetoggle" gefunden. Ein Button wird erstellt.');
        button = document.createElement('button');
        button.className = 'linetoggle';
        document.body.appendChild(button);
    }
    
    // Setze den Ausgangszustand
    updateLineToggleButtonLabel(button, false);

    // Klick-Handler setzen (verwende onclick, um Mehrfachevents zu vermeiden)
    button.onclick = function() {
        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            updateLineToggleButtonLabel(button, false);
            updateLineUrlParam('off');
        } else {
            map.addLayer(layer);
            layer.bringToBack();
            updateLineToggleButtonLabel(button, true);
            updateLineUrlParam('on');
        }
    };
}