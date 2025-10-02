import { displayFilteredGeoJsonImportance } from './script_gesamt.js';
import { displayFilteredGeoJsonType } from './script_gesamt_typen.js';
import { map } from './fuer-alle-karten.js';

const PROJEKTFARBE = '#6F5106';
const INACTIVE_COLOR = '#ddd';

function isTypenView() {
  return window.location.href.includes("_typen");
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

  // Akkordion-Status aktualisieren
  updateAccordionState(selectedYears);

  isTypenView() ? displayFilteredGeoJsonType() : displayFilteredGeoJsonImportance(map);
}

// Funktion zum Aktualisieren des Akkordion-Status
function updateAccordionState(selectedYears) {
  const collapseElement = document.getElementById('collapseTimeFilter');
  if (!collapseElement) return;

  const bsCollapse = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });

  // Akkordion offen halten, wenn zumindest ein Jahr ausgewählt ist (aber nicht alle)
  if (selectedYears.size > 0 && selectedYears.size < allYears.size) {
    bsCollapse.show();
  } else {
    bsCollapse.hide();
  }
}

// Erzeugt den Zeit-Filter (Jahr-Buttons) inklusive der Buttons "(alle)" und "(keinen)"
export function createFilterTime(features) {
  const filter = document.getElementById('filter-time');
  if (!filter) {
    console.error("Fehler: Element mit ID 'filter-time' nicht gefunden!");
    return;
  }
  filter.innerHTML = '';
  
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

  // Akkordion-Status initial setzen
  updateAccordionState(selectedYears);

  // "Alle"-Toggle-Button
  const allButton = document.createElement('button');
  allButton.innerText = 'Alle';
  allButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
  const allSelected = selectedYears.size === allYears.size;
  allButton.style.backgroundColor = allSelected ? PROJEKTFARBE : INACTIVE_COLOR;
  allButton.style.color = allSelected ? "white" : "black";
  allButton.style.borderRadius = "1px";
  allButton.style.transition = "background-color 0.2s, color 0.2s";

  allButton.addEventListener('click', function () {
    if (selectedYears.size === allYears.size) {
      // Alle deaktivieren
      updateURLWithYears(new Set());
      updateAccordionState(new Set());
    } else {
      // Alle aktivieren
      updateURLWithYears(new Set(allYears));
      updateAccordionState(new Set(allYears));
    }
    isTypenView() ? displayFilteredGeoJsonType() : displayFilteredGeoJsonImportance(map);
  });

  filter.appendChild(allButton);

  // Für jedes Jahr einen eigenen Toggle-Button erstellen
  years.forEach(year => {
    const yearButton = document.createElement('button');
    yearButton.innerText = year;
    yearButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
    const isSelected = selectedYears.has(String(year));
    yearButton.style.backgroundColor = isSelected ? PROJEKTFARBE : INACTIVE_COLOR;
    yearButton.style.color = isSelected ? "white" : "black";
    yearButton.style.borderRadius = "1px";
    yearButton.style.transition = "background-color 0.2s, color 0.2s";
    yearButton.dataset.year = year;

    // Beim Klick wird das jeweilige Jahr umgeschaltet.
    yearButton.addEventListener('click', function () {
      toggleYearFilter(year);
    });

    filter.appendChild(yearButton);
  });
}
