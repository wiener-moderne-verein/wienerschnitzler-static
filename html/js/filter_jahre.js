// Funktion zum Einfärben der Jahre (unverändert)
function lightenColor(color, percent) {
  const num = parseInt(color.slice(1), 16),
        amt = Math.round(255 * percent),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
  return `rgb(${Math.min(R, 255)}, ${Math.min(G, 255)}, ${Math.min(B, 255)})`;
}

/*
  Wir passen getSelectedYearsFromURL an:
  - Wenn überhaupt kein "years"-Parameter vorhanden ist, geben wir null zurück,
    was signalisiert, dass kein Filter explizit gesetzt wurde (also alle Jahre gelten).
  - Ist der Parameter vorhanden und exakt "0", wird eine leere Menge zurückgegeben.
*/
function getSelectedYearsFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("years")) {
    return null; // kein Filter gesetzt → alle Jahre ausgewählt
  }
  const yearsParam = params.get("years");
  if (yearsParam === "0") {
    return new Set(); // explizit keine Jahre ausgewählt
  }
  return new Set(yearsParam.split("_"));
}

// Globale Variable zum Speichern aller existierenden Jahre (als Strings)
let allYears = new Set();

/*
  updateURLWithYears:
  - Wenn alle Jahre ausgewählt sind, wird der Parameter entfernt (Standard = alle).
  - Wenn keine Jahre ausgewählt sind, setzen wir explizit "years=0".
  - Andernfalls wird die Liste der ausgewählten Jahre (mit "_" als Trenner) in die URL geschrieben.
*/
function updateURLWithYears(selectedYears) {
  const params = new URLSearchParams(window.location.search);
  
  if (selectedYears.size === allYears.size) {
    // Alle Jahre ausgewählt → Parameter entfernen
    params.delete("years");
  } else if (selectedYears.size === 0) {
    // Explizit keine Jahre ausgewählt → "years=0"
    params.set("years", "0");
  } else {
    params.set("years", Array.from(selectedYears).join("_"));
  }
  
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

// Umschalten eines einzelnen Jahres im Filter
function toggleYearFilter(year) {
  let selectedYears = getSelectedYearsFromURL();
  // Ist kein Filter gesetzt, gehen wir davon aus, dass alle Jahre ausgewählt sind.
  if (selectedYears === null) {
    selectedYears = new Set(allYears);
  }
  
  if (selectedYears.has(String(year))) {
    selectedYears.delete(String(year));  // Jahr abwählen
  } else {
    selectedYears.add(String(year));       // Jahr auswählen
  }
  
  updateURLWithYears(selectedYears);
  displayFilteredGeoJson(); // Annahme: Diese Funktion aktualisiert die Anzeige
}

// Erzeugt den Zeit-Filter (Jahr-Buttons) inklusive der Buttons "(alle)" und "(keinen)"
function createFilterTime(features) {
  const filter = document.getElementById('filter-time');
  if (!filter) {
    console.error("Fehler: Element mit ID 'filter-time' nicht gefunden!");
    return;
  }
  filter.innerHTML = '<span style="font-weight: bold; display: block;">Jahre</span>';
  
  // Alle Jahre aus den Features ermitteln
  const yearSet = new Set();
  features.forEach(feature => {
    if (Array.isArray(feature.properties.timestamp)) {
      feature.properties.timestamp.forEach(date => {
        const year = date.substring(0, 4);
        yearSet.add(Number(year));
      });
    }
  });
  
  // Sortierte Liste der Jahre (als Zahlen)
  const years = Array.from(yearSet).sort((a, b) => a - b);
  
  // Alle Jahre global als Strings speichern
  allYears = new Set(years.map(y => String(y)));
  
  // Hole die in der URL ausgewählten Jahre.
  let selectedYears = getSelectedYearsFromURL();
  if (selectedYears === null) {
    // Kein Filter gesetzt → alle Jahre sind ausgewählt
    selectedYears = new Set(allYears);
  }
  
  // Beispielhafte Farbpalette (hier wie gehabt; diese kann natürlich erweitert werden)
  const colorPalette = [
    "#462346", "#a3b9c9", "#776d5a", "#987d7c", "#82D282", "#a09cb0", "#83d0f5", "#8DB1AB", "#587792", "#FF5A64",
    "#AAAAFA"
  ];
  let colorIndex = 0;
  
  // Button "(alle)" – setzt den Filter so, dass alle Jahre ausgewählt sind (Parameter entfernen)
  const allButton = document.createElement('button');
  allButton.innerText = "(alle)";
  allButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
  allButton.style.backgroundColor = "#ddd";
  allButton.style.color = "black";
  allButton.style.borderRadius = "1px";
  
  allButton.addEventListener('click', function () {
    updateURLWithYears(new Set(allYears));
    displayFilteredGeoJson();
  });
  filter.appendChild(allButton);
  
  // Button "(keines)" – setzt den Filter so, dass keine Jahre ausgewählt sind (years=0)
  const noneButton = document.createElement('button');
  noneButton.innerText = "(keinen)";
  noneButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
  noneButton.style.backgroundColor = "#ddd";
  noneButton.style.color = "black";
  noneButton.style.borderRadius = "1px";
  
  noneButton.addEventListener('click', function () {
    updateURLWithYears(new Set());
    displayFilteredGeoJson();
  });
  filter.appendChild(noneButton);
  
  // Für jedes Jahr einen eigenen Button erstellen
  years.forEach(year => {
    const color = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
    
    const yearButton = document.createElement('button');
    yearButton.innerText = year;
    yearButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
    yearButton.style.backgroundColor = selectedYears.has(String(year))
      ? lightenColor(color, 0.3)
      : "#ddd";
    yearButton.style.color = "black";
    yearButton.style.borderRadius = "1px";
    yearButton.dataset.year = year;
    
    // Beim Klick wird das jeweilige Jahr umgeschaltet.
    yearButton.addEventListener('click', function () {
      toggleYearFilter(year);
    });
    
    filter.appendChild(yearButton);
  });
}
