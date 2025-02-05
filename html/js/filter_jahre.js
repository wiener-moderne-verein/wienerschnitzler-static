// Funktion zum Einfärben der Jahre
function lightenColor(color, percent) {
const num = parseInt(color.slice(1), 16),
amt = Math.round(255 * percent),
R = (num >> 16) + amt,
G = ((num >> 8) & 0x00FF) + amt,
B = (num & 0x0000FF) + amt;

return `rgb(${Math.min(R, 255)}, ${Math.min(G, 255)}, ${Math.min(B, 255)})`;
}

function getSelectedYearsFromURL() {
const params = new URLSearchParams(window.location.search);
return new Set(params.get("years") ? params.get("years").split("_") : []);
}

function updateURLWithYears(selectedYears) {
    const params = new URLSearchParams(window.location.search);
    
    // Wähle ein alternatives Trennzeichen wie '_' statt ',' 
    if (selectedYears.size > 0) {
        params.set("years", Array.from(selectedYears).join("_"));
    } else {
        params.delete("years");
    }

    // URL ohne Hash und mit den neuen Parametern aktualisieren
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function toggleYearFilter(year) {
    const selectedYears = new Set(getSelectedYearsFromURL());

    if (selectedYears.has(String(year))) {
        selectedYears.delete(String(year));  // Jahr entfernen
    } else {
        selectedYears.add(String(year));  // Jahr hinzufügen
    }

    updateURLWithYears(selectedYears);  // URL mit den neuen Jahren aktualisieren
    displayFilteredGeoJson();  // GeoJSON neu anzeigen
}


function createFilterTime(features) {
    const filter = document.getElementById('filter-time');
    if (!filter) {
        console.error("Fehler: Element mit ID 'filter-time' nicht gefunden!");
        return;
    }
    filter.innerHTML = '<span style="font-weight: bold; display: block;">Zeit-Filter:</span>';

    const yearSet = new Set();
    features.forEach(feature => {
        if (Array.isArray(feature.properties.timestamp)) {
            feature.properties.timestamp.forEach(date => {
                const year = date.substring(0, 4);
                yearSet.add(Number(year));
            });
        }
    });

    const years = Array.from(yearSet).sort((a, b) => a - b);
    const selectedYears = new Set(getSelectedYearsFromURL());

    const colorPalette = [
        "#776d5a", "#987d7c", "#a09cb0", "#a3b9c9", "#abdae1", "#8DB1AB", "#587792"
    ];

    let colorIndex = 0;

    // "Alle"-Button hinzufügen
    const allButton = document.createElement('button');
    allButton.innerText = "(alle)";
    allButton.classList.add('btn', 'btn-sm', 'm-1');
    allButton.style.backgroundColor = "#ddd";
    allButton.style.color = "black";
    allButton.style.borderRadius = "5px";

    allButton.addEventListener('click', function () {
        // Entferne den "years" Filter aus der URL und aktualisiere die Ansicht
        const selectedYears = new Set();
        updateURLWithYears(selectedYears);  // URL aktualisieren ohne Jahre
        displayFilteredGeoJson();  // GeoJSON neu anzeigen ohne Filter auf Jahre
    });

    filter.appendChild(allButton);

    years.forEach(year => {
        const color = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;

        const yearButton = document.createElement('button');
        yearButton.innerText = year;
        yearButton.classList.add('btn', 'btn-sm', 'm-1');
        yearButton.style.backgroundColor = selectedYears.has(String(year)) ? lightenColor(color, 0.3) : "#ddd";
        yearButton.style.color = "black";
        yearButton.style.borderRadius = "5px";
        yearButton.dataset.year = year;

        // Klick-Event für den Jahr-Button
        yearButton.addEventListener('click', function () {
            toggleYearFilter(year);
            yearButton.style.backgroundColor = selectedYears.has(String(year)) ? lightenColor(color, 0.3) : "#ddd";
        });

        filter.appendChild(yearButton);
    });
}

