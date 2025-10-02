import {
    DataSet, Timeline
}
from "https://unpkg.com/vis-timeline/standalone/esm/vis-timeline-graph2d.js";

// Schwellenwert für den Typfilter: 10 Tage in Millisekunden
const typeThreshold = 10 * 24 * 3600 * 1000;

// Globale Variablen für das aktuell gefilterte Jahr und Items
let currentYear = 1900;
let currentYearItems =[];

// JSON-Daten laden
fetch("https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/json/wienerschnitzler_timeline.json").then(response => response.json()).then(data => {
    // Erstelle Timeline-Items und speichere auch den "type" in "eventType"
    const items = data.map(item => {
        const timeStamp = item.timestamp[0];
        let startStr, endStr;
        if (timeStamp.includes('/')) {[startStr, endStr] = timeStamp.split('/');
        } else {
            startStr = timeStamp;
        }
        const startDate = new Date(startStr);
        const endDate = endStr ? new Date(endStr): undefined;
        
        // Farbe berechnen: Zahl aus "id" extrahieren und als Hue (mod 360) nutzen
        let color = "gray"; // Fallback
        const idNumber = parseInt(item.id.replace("pmb", ""), 10);
        if (! isNaN(idNumber)) {
            const hue = idNumber % 360;
            color = `hsl(${hue}, 70%, 50%)`;
        }
        const style = `background-color: ${color}; color: white;`;
        
        return {
            content: item.title,
            start: startDate,
            end: endDate,
            style: style,
            eventType: item.type, // "p" oder "a"
            id: item.id,
            title: item.title // für Tooltip
        };
    });
    
    // Alle verfügbaren Jahre (aus Start- und Enddaten) ermitteln
    let yearSet = new Set ();
    items.forEach(item => {
        if (item.start instanceof Date && ! isNaN(item.start)) {
            yearSet.add(item.start.getFullYear());
        }
        if (item.end instanceof Date && ! isNaN(item.end)) {
            const startYear = item.start.getFullYear();
            const endYear = item.end.getFullYear();
            for (let y = startYear; y <= endYear; y++) {
                yearSet.add(y);
            }
        }
    });
    let years = Array. from (yearSet).sort((a, b) => a - b);
    
    // URL-Parameter "year" auslesen; Standardwert: 1900
    const urlParams = new URLSearchParams(window.location.search);
    currentYear = urlParams. get ('year') ? parseInt(urlParams. get ('year'), 10): 1900;
    if (! years.includes(currentYear)) {
        years.push(currentYear);
        years.sort((a, b) => a - b);
    }
    
    // Dropdown mit den verfügbaren Jahren füllen
    const yearSelect = document.getElementById('yearSelect');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    });
    
    // Container-Breite dynamisch anpassen
    const container = document.getElementById('timeline');
    container.style.width = window.innerWidth + "px";
    
    // Timeline initialisieren
    const timelineItems = new DataSet([]);
    const timelineOptions = {
    selectable: true,
    zoomable: true,
    moveable: true,
    height: '600px',  // z. B. 400px festlegen
    orientation: {
        axis: "top",
        item: "top"
    },
    tooltip: {
        followMouse: true
    },
    zoomMin: 86400000,
    timeAxis: {
        scale: 'day',  // Maßstab auf Tag festlegen
        step: 1        // Schritt: 1 Tag
    },
    locale: 'de',
    locales: {
        de: {
            current: 'Aktuell',
            time: 'Zeit',
            months: [
                'Jänner', 'Feber', 'März', 'April', 'Mai', 'Juni',
                'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
            ],
            monthsShort: [
                'Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
            ],
            days: [
                'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
                'Donnerstag', 'Freitag', 'Samstag'
            ],
            daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        }
    }
};
    const timeline = new Timeline(container, timelineItems, timelineOptions);
    
    // Funktion: Filtert Items für das ausgewählte Jahr (Zeitspannen werden berücksichtigt)
    function filterItemsByYear(year) {
        return items.filter(item => {
            const startYear = item.start.getFullYear();
            if (item.end) {
                const endYear = item.end.getFullYear();
                return (startYear <= year && endYear >= year);
            } else {
                return startYear === year;
            }
        });
    }
    
    // Aktualisiert die Timeline-Items basierend auf dem aktuellen sichtbaren Fenster:
    // Liegt das Fenster über dem Schwellenwert, werden nur "p"-Items angezeigt.
    // Bei kleineren Zeitfenstern (z.B. Woche) werden alle Items (sowohl "p" als auch "a") gezeigt.
    function updateTimelineItems() {
        const windowRange = timeline.getWindow();
        const windowDuration = windowRange.end - windowRange.start;
        
        // Bestimme newItems basierend auf dem Zoomlevel:
        let newItems;
        if (windowDuration > typeThreshold) {
            // Bei großer Ansicht: nur primary-Items
            newItems = currentYearItems.filter(item => item.eventType === "p");
        } else {
            // Bei kleiner Ansicht: alle Items
            newItems = currentYearItems.slice();
            // Kopie aller Items
        }
        
        // Falls das Auswahlfeld "Orte innerhalb von Orten" ausgeschaltet ist,
        // entferne zusätzlich alle "a"-Items.
        if (! showAdditional) {
            newItems = newItems.filter(item => item.eventType === "p");
        }
        
        timelineItems.clear();
        timelineItems.add(newItems);
    }
    
    
    // Aktualisiert die Timeline: Filtert Items für das Jahr, setzt das Zeitfenster und sperrt den Zeitraum
    function updateTimeline(year) {
        currentYearItems = filterItemsByYear(year);
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59);
        // Setze min und max, sodass immer nur das aktuelle Jahr sichtbar ist
        timeline.setOptions({
            min: startOfYear,
            max: endOfYear
        });
        timeline.setWindow(startOfYear, endOfYear);
        updateTimelineItems();
    }
    
    // Event-Listener für das Dropdown: Bei Änderung Timeline aktualisieren und URL-Parameter anpassen
    yearSelect.addEventListener('change', (event) => {
        const selectedYear = parseInt(event.target.value, 10);
        currentYear = selectedYear;
        updateTimeline(selectedYear);
        const newUrl = new URL(window.location);
        newUrl.searchParams. set ('year', selectedYear);
        window.history.pushState({
        },
        '', newUrl);
    });
    
    // Jetzt wird das Auswahlfeld "Orte innerhalb von Orten" (toggleAdditional) deklariert:
    let showAdditional = true; // Default: "a" werden angezeigt
    const toggleAdditional = document.getElementById("toggleAdditional");
    toggleAdditional.addEventListener("change", () => {
        showAdditional = toggleAdditional.checked;
        updateTimelineItems();
    });
    
    // Beim Zoomen (Range-Change) werden die Items aktualisiert
    timeline.on('rangechanged', function () {
        updateTimelineItems();
    });

    // Click-Event für Timeline-Items: Navigiere zur Ortsseite
    timeline.on('select', function (properties) {
        if (properties.items.length > 0) {
            const selectedItemId = properties.items[0];
            // Extrahiere die ID und navigiere zur entsprechenden HTML-Seite
            if (selectedItemId) {
                window.location.href = `${selectedItemId}.html`;
            }
        }
    });

    // Initiale Auswahl: Den URL-Parameter (oder Standardwert 1900) nutzen
    yearSelect.value = currentYear;
    updateTimeline(currentYear);
}). catch (error => console.error("Fehler beim Laden der JSON-Daten:", error));
