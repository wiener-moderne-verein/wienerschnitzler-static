import { DataSet, Timeline } from "https://unpkg.com/vis-timeline/standalone/esm/vis-timeline-graph2d.js";

// Schwellenwert für Zoom: 30 Tage in Millisekunden
const zoomThreshold = 30 * 24 * 3600 * 1000;

// Globale Variablen für die aktuell gefilterten Items und das ausgewählte Jahr
let currentYear = 1900;
let currentYearItems = [];

// JSON-Daten laden
fetch("https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/json/wienerschnitzler_timeline.json")
  .then(response => response.json())
  .then(data => {
    // Erstelle Timeline-Items:
    const items = data.map(item => {
      const timeStamp = item.timestamp[0];
      let startStr, endStr;
      if (timeStamp.includes('/')) {
        [startStr, endStr] = timeStamp.split('/');
      } else {
        startStr = timeStamp;
      }
      const startDate = new Date(startStr);
      const endDate = endStr ? new Date(endStr) : undefined;
      
      // Farbe berechnen: Extrahiere die Zahl aus der JSON-"id"
      // Beispiel: "pmb168783" → extrahiere 168783, berechne Hue als idNumber % 360
      let color = "gray"; // Fallback
      const idNumber = parseInt(item.id.replace("pmb", ""), 10);
      if (!isNaN(idNumber)) {
        const hue = idNumber % 360;
        color = `hsl(${hue}, 70%, 50%)`;
      }
      const style = `background-color: ${color}; color: white; padding: 2px 5px; border-radius: 3px;`;

      return {
        content: item.title,
        start: startDate,
        end: endDate,
        style: style,
        // Flag: true, wenn kein "/" im timespan vorhanden ist (also ein Tag)
        isShort: !timeStamp.includes('/')
      };
    });

    // Alle verfügbaren Jahre (aus Start- und Enddaten) ermitteln
    let yearSet = new Set();
    items.forEach(item => {
      if (item.start instanceof Date && !isNaN(item.start)) {
        yearSet.add(item.start.getFullYear());
      }
      if (item.end instanceof Date && !isNaN(item.end)) {
        const startYear = item.start.getFullYear();
        const endYear = item.end.getFullYear();
        for (let y = startYear; y <= endYear; y++) {
          yearSet.add(y);
        }
      }
    });
    let years = Array.from(yearSet).sort((a, b) => a - b);

    // URL-Parameter "year" auslesen; Standardwert: 1900
    const urlParams = new URLSearchParams(window.location.search);
    currentYear = urlParams.get('year') ? parseInt(urlParams.get('year'), 10) : 1900;
    if (!years.includes(currentYear)) {
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
      tooltip: { followMouse: true },
      zoomMin: 86400000 // mindestens 1 Tag (24h) Zoom
      // Wir setzen hier noch keine min/max-Grenzen – diese werden beim Update der Timeline gesetzt.
    };
    const timeline = new Timeline(container, timelineItems, timelineOptions);
    
    // Funktion: Filtert Items für das ausgewählte Jahr (Zeitspannen werden berücksichtigt)
    function filterItemsByYear(year) {
      return items.filter(item => {
        const startYear = item.start.getFullYear();
        if (item.end) {
          const endYear = item.end.getFullYear();
          // Überschneidung: beginnt vor Jahresende und endet nach Jahresbeginn
          return (startYear <= year && endYear >= year);
        } else {
          return startYear === year;
        }
      });
    }
    
    // Aktualisiert die Timeline-Items abhängig vom aktuellen Zoomlevel:
    // Liegt die sichtbare Zeitspanne über dem Schwellenwert, werden kurze (eintägige) Ereignisse ausgeblendet.
    function updateTimelineItems() {
      const windowRange = timeline.getWindow();
      const windowDuration = windowRange.end - windowRange.start;
      let newItems;
      if (windowDuration >= zoomThreshold) {
        newItems = currentYearItems.filter(item => !item.isShort);
      } else {
        newItems = currentYearItems;
      }
      timelineItems.clear();
      timelineItems.add(newItems);
    }
    
    // Aktualisiert die Timeline: Filtert Items für das Jahr, setzt das Zeitfenster und legt Grenzen fest.
    function updateTimeline(year) {
      currentYearItems = filterItemsByYear(year);
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);
      // Setzt das Fenster und legt zugleich die minimalen/maximalen Grenzen fest,
      // sodass immer nur das aktuelle Jahr sichtbar ist.
      timeline.setOptions({
        min: startOfYear,
        max: endOfYear
      });
      timeline.setWindow(startOfYear, endOfYear);
      updateTimelineItems();
    }
    
    // Beim Wechsel des Dropdowns: Timeline aktualisieren und URL-Parameter anpassen
    yearSelect.addEventListener('change', (event) => {
      const selectedYear = parseInt(event.target.value, 10);
      currentYear = selectedYear;
      updateTimeline(selectedYear);
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('year', selectedYear);
      window.history.pushState({}, '', newUrl);
    });
    
    // Bei Änderungen des sichtbaren Bereichs (z. B. beim Zoomen) Items aktualisieren
    timeline.on('rangechanged', function() {
      updateTimelineItems();
    });
    
    // Initiale Auswahl: Den URL-Parameter (oder 1900) nutzen
    yearSelect.value = currentYear;
    updateTimeline(currentYear);
  })
  .catch(error => console.error("Fehler beim Laden der JSON-Daten:", error));
