// Global variable to store all available years (als Strings)
let allYears = new Set();

// Funktion zum Einfärben der Jahre (unverändert)
function lightenColor(color, percent) {
  const num = parseInt(color.slice(1), 16),
        amt = Math.round(255 * percent),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

  return `rgb(${Math.min(R, 255)}, ${Math.min(G, 255)}, ${Math.min(B, 255)})`;
}

// Liest den "years"-Parameter aus der URL aus
function getSelectedYearsFromURL() {
  const params = new URLSearchParams(window.location.search);
  return new Set(params.get("years") ? params.get("years").split("_") : []);
}

// Aktualisiert die URL mit den ausgewählten Jahren
function updateURLWithYears(selectedYears) {
  const params = new URLSearchParams(window.location.search);
  
  // Falls ausgewählte Jahre vorhanden sind, setze den Parameter
  if (selectedYears.size > 0) {
    params.set("years", Array.from(selectedYears).join("_"));
  } else {
    // Falls nicht: Parameter entfernen
    params.delete("years");
  }
  
  // URL ohne Hash und mit den neuen Parametern aktualisieren
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

// Umschalten eines Jahres im Filter
function toggleYearFilter(year) {
  // Hole die in der URL gesetzten Jahre…
  let selectedYears = new Set(getSelectedYearsFromURL());

  // …und wenn noch nichts in der URL steht, gehen wir davon aus, dass alle Jahre
  // ausgewählt sind (mittels der globalen allYears)
  if (selectedYears.size === 0) {
    selectedYears = new Set(Array.from(allYears));
  }

  // Jetzt wird das angeklickte Jahr umgeschaltet
  if (selectedYears.has(String(year))) {
    selectedYears.delete(String(year));  // Jahr entfernen
  } else {
    selectedYears.add(String(year));       // Jahr hinzufügen
  }

  updateURLWithYears(selectedYears);  // URL aktualisieren
  displayFilteredGeoJson();           // GeoJSON neu anzeigen (sollte z. B. createFilterTime() aufrufen)
}

// Erzeugt den Zeit-Filter (Jahr-Buttons) aus den Features
function createFilterTime(features) {
  const filter = document.getElementById('filter-time');
  if (!filter) {
    console.error("Fehler: Element mit ID 'filter-time' nicht gefunden!");
    return;
  }
  filter.innerHTML = '<span style="font-weight: bold; display: block;">Zeit-Filter:</span>';

  // Ermitteln aller Jahre aus den Features
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

  // Speichere alle Jahre als Strings global (wichtig für toggleYearFilter)
  allYears = new Set(years.map(y => String(y)));

  // Hole die in der URL ausgewählten Jahre
  let selectedYears = new Set(getSelectedYearsFromURL());
  // Wenn kein "years"-Parameter in der URL steht, sollen alle Jahre als ausgewählt gelten:
  if (selectedYears.size === 0) {
    selectedYears = new Set(allYears);
  }

  const colorPalette = [
    "#776d5a", "#987d7c", "#a09cb0", "#a3b9c9", "#abdae1", "#8DB1AB", "#587792"
  ];
  let colorIndex = 0;

  // "Alle"-Button hinzufügen – dieser entfernt den "years"-Parameter aus der URL
  // (und in createFilterTime wird dann automatisch angenommen, dass alle Jahre ausgewählt sind)
  const allButton = document.createElement('button');
  allButton.innerText = "(alle)";
  allButton.classList.add('btn', 'btn-sm', 'm-1');
  allButton.style.backgroundColor = "#ddd";
  allButton.style.color = "black";
  allButton.style.borderRadius = "5px";

  allButton.addEventListener('click', function () {
    // Entferne den "years"-Filter aus der URL – das führt dazu, dass in createFilterTime
    // alle Jahre ausgewählt werden
    updateURLWithYears(new Set());
    displayFilteredGeoJson();
  });

  filter.appendChild(allButton);

  // Erzeuge für jedes Jahr einen Button
  years.forEach(year => {
    const color = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;

    const yearButton = document.createElement('button');
    yearButton.innerText = year;
    yearButton.classList.add('btn', 'btn-sm', 'm-1');
    // Wenn das Jahr in der ausgewählten Menge ist, wird die Schaltfläche farblich hervorgehoben
    yearButton.style.backgroundColor = selectedYears.has(String(year))
      ? lightenColor(color, 0.3)
      : "#ddd";
    yearButton.style.color = "black";
    yearButton.style.borderRadius = "5px";
    yearButton.dataset.year = year;

    // Klick-Event: Schalte das jeweilige Jahr um
    yearButton.addEventListener('click', function () {
      toggleYearFilter(year);
      // Nach dem Umschalten wird displayFilteredGeoJson() aufgerufen,
      // das vermutlich createFilterTime() neu rendert und so auch den Button-Style aktualisiert.
    });

    filter.appendChild(yearButton);
  });
}
