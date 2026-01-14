import { getColorByType } from './fuer-alle-karten.js';
import { displayFilteredGeoJsonType } from './script_gesamt_typen.js';
import { t } from './translations.js';

// Globale Variable, in der alle existierenden Typen (als Strings) gespeichert werden.
let allTypes = new Set();

export function createFilterType(features) {
    const filter = document.getElementById('filter-type');
    if (!filter) {
        console.error("Fehler: Element mit ID 'filter-type' nicht gefunden!");
        return;
    }

    // Legende leeren
    filter.innerHTML = '';

    // Titel hinzufügen
    const filterTitle = document.createElement('span');
    filterTitle.innerText = '';
    filter.appendChild(filterTitle);

    // Suchfeld hinzufügen
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Typen filtern...';
    searchInput.classList.add('form-control', 'form-control-sm', 'mb-2');
    searchInput.id = 'type-search-input';
    filter.appendChild(searchInput);
    
    // Zunächst prüfen, ob in der URL ein "years"-Parameter vorhanden ist.
    // Falls ja, wird nur für Features gezählt, die einen Timestamp in den ausgewählten Jahren haben.
    const params = new URLSearchParams(window.location.search);
    let selectedYears = null; // null signalisiert: kein Year‑Filter aktiv
    if (params.has("years")) {
        const yearsParam = params.get("years");
        if (yearsParam === "0") {
            // Explizit "keine" Jahre ausgewählt → leere Menge
            selectedYears = new Set();
        } else {
            selectedYears = new Set(yearsParam.split("_"));
        }
    }
    
    // Alle einzigartigen Typen extrahieren und zählen
    const typeCountMap = {};
    features.forEach(feature => {
        const type = feature.properties && feature.properties.type;
        if (type && typeof type === 'string') {
            // Wenn kein Year-Filter aktiv ist, zähle alle Features.
            // Andernfalls: Zähle nur, wenn mind. ein Timestamp in den ausgewählten Jahren liegt.
            if (selectedYears === null) {
                typeCountMap[type] = (typeCountMap[type] || 0) + 1;
            } else {
                if (Array.isArray(feature.properties.timestamp) &&
                    feature.properties.timestamp.some(date => selectedYears.has(date.substring(0, 4)))) {
                    typeCountMap[type] = (typeCountMap[type] || 0) + 1;
                }
            }
        }
    });
    
    // Die Typen werden jetzt nicht mehr alphabetisch, sondern nach ihrer Häufigkeit (absteigend) sortiert.
    const uniqueTypes = Object.keys(typeCountMap).sort((a, b) => {
        // Zuerst nach absteigender Anzahl sortieren:
        if (typeCountMap[b] !== typeCountMap[a]) {
            return typeCountMap[b] - typeCountMap[a];
        }
        // Bei gleicher Anzahl alphabetisch:
        return a.localeCompare(b);
    });
    
    if (uniqueTypes.length === 0) {
        console.warn("Keine Typen für die Legende gefunden.");
        filter.innerHTML += '<p style="color: red;">&#160; Keine Typen vorhanden. Wähle zumindest ein Jahr aus.</p>';
        return;
    }
    
    // Alle Typen global speichern (wichtig für toggleTypeFilter und updateURLWithFilters)
    allTypes = new Set(uniqueTypes);
    
    // Vorherige Filter aus der URL laden
    let urlTypes = getSelectedTypesFromURL();
    // Falls in der URL kein Parameter "types" vorhanden ist, gehen wir davon aus, dass alle Typen aktiv sind.
    let selectedTypes = new Set(window.location.search.includes("types") ? urlTypes : uniqueTypes);
    
    // "(alle)"-Button erstellen
    const allButton = document.createElement('button');
    allButton.innerText = t('location.all');
    allButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
    allButton.style.backgroundColor = "#ddd";
    allButton.style.color = "black";
    allButton.style.borderRadius = "2px";
    
    allButton.addEventListener('click', function () {
        // Setzt den Filter so, dass alle Typen aktiv sind (d.h. URL-Parameter entfernen)
        updateURLWithFilters(new Set(uniqueTypes));
        displayFilteredGeoJsonType();
    });
    filter.appendChild(allButton);
    
    // "(keine)"-Button erstellen
    const noneButton = document.createElement('button');
    noneButton.innerText = t('filter.none');
    noneButton.classList.add('btn-filter', 'btn-filter-sm', 'm-1');
    noneButton.style.backgroundColor = "#ddd";
    noneButton.style.color = "black";
    noneButton.style.borderRadius = "2px";
    
    noneButton.addEventListener('click', function () {
        // Setzt den Filter auf keine Typen – in der URL wird "types=0" vermerkt.
        updateURLWithFilters(new Set());
        displayFilteredGeoJsonType();
    });
    filter.appendChild(noneButton);
    
    // Buttons für die einzelnen Typen erstellen
    uniqueTypes.forEach(type => {
        const count = typeCountMap[type];
        const color = getColorByType(type);

        const button = document.createElement('button');
        button.innerText = `${type} (${count})`;
        // Hier werden die btn-filter-Klassen hinzugefügt
        button.classList.add('btn-filter', 'btn-filter-sm', 'm-1', 'type-button');
        // Falls der Typ in selectedTypes enthalten ist, wird er farbig dargestellt,
        // andernfalls in Grau
        button.style.backgroundColor = selectedTypes.has(type) ? color : "#ccc";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "3px 5px";
        button.style.margin = "1px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "2px";

        button.dataset.type = type; // Typ im Button speichern

        button.addEventListener('click', function () {
            toggleTypeFilter(type);
        });

        filter.appendChild(button);
    });

    // Event Listener für das Suchfeld hinzufügen
    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const typeButtons = filter.querySelectorAll('.type-button');

        typeButtons.forEach(button => {
            const type = button.dataset.type.toLowerCase();
            if (type.includes(searchTerm)) {
                button.style.display = '';
            } else {
                button.style.display = 'none';
            }
        });
    });
}

function getSelectedTypesFromURL() {
    const params = new URLSearchParams(window.location.search);
    const types = params.get("types");
    // Wenn explizit "0" gesetzt ist, interpretieren wir das als keine Auswahl.
    if (types === "0") {
        return [];
    }
    return types ? types.split(",") : [];
}

function updateURLWithFilters(selectedTypes) {
    const params = new URLSearchParams(window.location.search);
    if (selectedTypes.size === allTypes.size) {
        // Alle Typen ausgewählt → Parameter entfernen (Standard: alle aktiv)
        params.delete("types");
    } else if (selectedTypes.size === 0) {
        // Keine Typen ausgewählt → explizit "0" in der URL setzen
        params.set("types", "0");
    } else {
        params.set("types", Array.from(selectedTypes).join(","));
    }
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

export function toggleTypeFilter(type) {
    let urlTypes = getSelectedTypesFromURL();
    // Falls in der URL ein "types"-Parameter vorhanden ist (auch wenn er leer ist),
    // verwenden wir dessen Inhalt – andernfalls defaulten wir zu allen Typen.
    let selectedTypes = window.location.search.includes("types") ? new Set(urlTypes) : new Set(allTypes);
    
    if (selectedTypes.has(type)) {
        selectedTypes.delete(type);
    } else {
        selectedTypes.add(type);
    }
    
    updateURLWithFilters(selectedTypes);
    displayFilteredGeoJsonType();
}



