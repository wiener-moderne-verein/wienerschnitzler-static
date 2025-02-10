

// Funktion zum Erstellen der Legende
function createLegend(maxImportance) {
    const legend = document.getElementById('legend');
    if (!legend) return;
    
    // Leeren der Legende, bevor neue Elemente hinzugefügt werden
    legend.innerHTML = '';
    
    // Text "Aufenthaltstage:" hinzufügen
    const legendTitle = document.createElement('span');
    legendTitle.style.marginRight = '10px';
    legendTitle.style.fontWeight = 'bold';
    legendTitle.innerText = 'Aufenthaltstage:';
    legend.appendChild(legendTitle);
    
    // Erstellen der Legende basierend auf den Thresholds, die unter dem größten Wert von importance liegen
    for (let i = 0; i < thresholds.length; i++) {
        if (thresholds[i] > maxImportance) break;
        
        const color = visibilityPalette[i];
        const threshold = thresholds[i];
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.marginRight = '10px';
        
        const colorBox = document.createElement('div');
        colorBox.style.width = '20px';
        colorBox.style.height = '20px';
        colorBox.style.backgroundColor = color;
        colorBox.style.marginRight = '5px';
        
        const label = document.createElement('span');
        label.innerText = threshold;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    }
}


// Funktion, um das Max-Eingabefeld mit dem höchsten Importance-Wert aus den GeoJSON-Daten vorzubelegen
function prefillMaxImportance() {
  const maxInput = document.getElementById("max-input");
  // Nur vorbelegen, wenn das Feld noch leer ist und Daten vorhanden sind
  if (window.geoJsonData && window.geoJsonData.features && !maxInput.value) {
    const overallMaxImportance = Math.max(
      ...window.geoJsonData.features.map(f => f.properties.importance || 0)
    );
    maxInput.value = overallMaxImportance;
  }
}

// Rufe prefillMaxImportance auf, sobald die Seite geladen wurde (oder wenn die Daten verfügbar sind)
window.addEventListener('load', prefillMaxImportance);

// Falls sich der Min-Wert ändert, wird das "min"-Attribut für das Max-Eingabefeld aktualisiert,
// sodass der Benutzer keinen Wert unterhalb des aktuellen Min-Werts wählen kann.
document.getElementById("min-input").addEventListener("input", function() {
  const minValue = parseFloat(this.value);
  const maxInput = document.getElementById("max-input");
  if (!isNaN(minValue)) {
    maxInput.min = minValue;
  } else {
    maxInput.min = 0;
  }
});

// Event-Listener für den Button zum Aktualisieren des Filters
document.getElementById("update-filter").addEventListener("click", function() {
  let minValue = parseFloat(document.getElementById("min-input").value);
  let maxValue = parseFloat(document.getElementById("max-input").value);
  
  // Setze Standardwerte, falls keine Eingabe erfolgt ist
  if (isNaN(minValue)) {
    minValue = 0;
    document.getElementById("min-input").value = 0;
  }
  if (isNaN(maxValue)) {
    // Falls keine Eingabe erfolgt ist, benutze den höchsten Importance-Wert aus den Daten
    if (window.geoJsonData && window.geoJsonData.features) {
      maxValue = Math.max(
        ...window.geoJsonData.features.map(f => f.properties.importance || 0)
      );
      document.getElementById("max-input").value = maxValue;
    } else {
      maxValue = Infinity;
    }
  }
  
  // Sicherstellen, dass der Max-Wert nicht unter dem Min-Wert liegt
  if (maxValue < minValue) {
    alert("Der Max-Wert darf nicht unter dem Min-Wert liegen.");
    return;
  }
  
  // Aktualisiere die URL-Parameter "min" und "max"
  const params = new URLSearchParams(window.location.search);
  params.set("min", minValue);
  params.set("max", maxValue);
  
  // Aktualisiere die URL, ohne die Seite neu zu laden
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  
  // Aktualisiere die Karte (und ggf. das Dropdown) anhand der neuen Filterwerte
  displayFilteredGeoJson();
});
