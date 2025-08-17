import { createFilterTime } from './filter_jahre.js';
import { createLegend } from './filter_dauer.js';
import { displayFilteredGeoJsonType } from './script_gesamt_typen.js';


// Globale Map-Referenz
export let map;
export let lineLayer = [];
export let geoJsonLayers = [];
export let geoJsonData = null;

// ===============================
// Map Initialisierung
// ===============================
export function initializeMapLarge() {
  if (map) {
    console.warn("Map ist bereits initialisiert. Initialisierung abgebrochen.");
    return; // Map nicht doppelt initialisieren
  }

  map = L.map('map-large').setView([48.2082, 16.3738], 5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 18
  }).addTo(map);
}

// ===============================
// GeoJSON Layer entfernen
// ===============================
export function clearGeoJsonLayers() {
  if (geoJsonLayers.length > 0 && map) {
    geoJsonLayers.forEach(layer => {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    geoJsonLayers.length = 0; // Array leeren
    
    // Alle Popups schließen
    map.closePopup();
  }
}


// ===============================
// Vollständige Map-Bereinigung
// ===============================
export function clearMap() {
  if (!map) return;
  
  // Alle Popups schließen
  map.closePopup();
  
  // Alle GeoJSON Layer entfernen
  clearGeoJsonLayers();
  
  // ALLE Layer sammeln und entfernen (außer TileLayer)
  const layersToRemove = [];
  map.eachLayer(function(layer) {
    if (!(layer instanceof L.TileLayer)) {
      layersToRemove.push(layer);
    }
  });
  
  // Layer entfernen
  layersToRemove.forEach(layer => {
    map.removeLayer(layer);
  });
  
  // Zusätzlich: Alle interaktiven SVG-Pfade direkt aus dem DOM entfernen
  const mapContainer = map.getContainer();
  const interactivePaths = mapContainer.querySelectorAll('path.leaflet-interactive');
  interactivePaths.forEach(path => path.remove());
  
  // Alle SVG-Gruppen bereinigen
  const svgGroups = mapContainer.querySelectorAll('svg g');
  svgGroups.forEach(g => {
    const paths = g.querySelectorAll('path[stroke="#888"]');
    paths.forEach(path => path.remove());
  });
}

// ===============================
// Dispatcher – erkennt Ansicht
// ===============================
function isTypenView() {
  return window.location.href.includes("_typen");
}

// ===============================
// Daten anzeigen
// ===============================
function displayGeoJson(features, mode) {
  if (!features || features.length === 0 || !map) return;

  // Sicherheitshalber nochmals alle Layer bereinigen
  clearGeoJsonLayers();

  // Sortiere nach importance für bessere Darstellung
  if (mode === "importance") {
    features.sort((a, b) => (a.properties.importance || 0) - (b.properties.importance || 0));
  }

  const markerFunction = createCircleMarkerDynamic(mode);

  const newLayer = L.geoJSON(features, {
    pointToLayer: markerFunction,
    onEachFeature: (feature, layer) => bindPopupEvents(feature, layer)
  });

  // Layer zur Map hinzufügen
  newLayer.addTo(map);
  
  // Layer zur Verwaltung hinzufügen
  geoJsonLayers.push(newLayer);
  
  // Map an die neuen Bounds anpassen
  if (newLayer.getBounds().isValid()) {
    map.fitBounds(newLayer.getBounds());
  }

  if (mode === "importance") {
    const maxImp = features.reduce((max, f) => Math.max(max, f.properties.importance || 0), 0);
    createLegend(maxImp);
  }
}



// ===============================
// Filter & Ansicht
// ===============================
function getSelectedYearsFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("years")) return null;
  if (params.get("years") === "0") return new Set();
  return new Set(params.get("years").split("_"));
}

function filterByYears(features) {
  const selectedYears = getSelectedYearsFromURL();

  if (selectedYears === null) return features; // keine Filter gesetzt

  return features.filter(feature => {
    const ts = feature.properties.timestamp;
    const dates = Array.isArray(ts) ? ts : [ts];
    return dates.some(date => selectedYears.has(date.substring(0, 4)));
  });
}

function filterByImportance(features) {
  const params = new URLSearchParams(window.location.search);
  const min = params.has("min") ? Number(params.get("min")) : 0;
  const max = params.has("max") ? Number(params.get("max")) : Infinity;

  return features.filter(f => {
    const imp = f.properties.importance || 0;
    return imp >= min && imp <= max;
  });
}

// ===============================
// Öffentliche Init-Funktion
// ===============================
export let viewInitialized = false;

export function initView() {
  if (viewInitialized) {
    console.warn("initView wurde bereits aufgerufen. Bereinige Map vor Neuinitialisierung.");
    clearMap(); // Vollständige Bereinigung vor Neuinitialisierung
    viewInitialized = false; // Reset für Neuinitialisierung
  }
  
  viewInitialized = true;
  
  // Map nur initialisieren wenn noch nicht vorhanden
  if (!map) {
    initializeMapLarge();
  } else {
    // Wenn Map bereits existiert, nur bereinigen
    clearMap();
  }

  const pathname = window.location.pathname.toLowerCase();
  let viewType = "gesamt"; // Standardansicht

  if (pathname.includes("gesamt_typen")) {
    viewType = "typen";
  } else if (pathname.includes("tag")) {
    viewType = "tag";
  } else if (pathname.includes("monat")) {
    viewType = "monat";
  } else if (pathname.includes("jahr")) {
    viewType = "jahr";
  } else if (pathname.includes("dekade")) {
    viewType = "dekade";
  } else if (pathname.includes("gesamt")) {
    viewType = "gesamt";
  }

  const geoJsonUrls = {
    gesamt: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson",
    typen: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson",
    tag: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/1895-01-23.geojson",
    monat: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/1895-01.geojson",
    jahr: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/1890.geojson",
    dekade: "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/1891-1900.geojson"
  };

  const url = geoJsonUrls[viewType];

  console.log("Initialisiere Karte für Ansicht:", viewType, "→", url);

  fetch(url)
    .then(res => res.json())
    .then(data => {
      // Bereinige nochmals vor dem Hinzufügen neuer Daten
      clearMap();
      
      window.geoJsonData = data;
      const allFeatures = data.features;

      // Optional: falls Funktion undefiniert sein könnte, absichern
      if (typeof createFilterTime === "function") {
        createFilterTime(allFeatures);
      }

      if (viewType === "typen" && typeof displayFilteredGeoJsonType === "function") {
        displayFilteredGeoJsonType();
      } else if (viewType === "gesamt") {
        // Import displayFilteredGeoJsonImportance function
        import('./script_gesamt.js').then(module => {
          if (typeof module.displayFilteredGeoJsonImportance === "function") {
            module.displayFilteredGeoJsonImportance(map);
          }
        });
      } else {
        const onlyPoints = allFeatures.filter(feature => feature.geometry.type === "Point");
        displayGeoJson(onlyPoints);
      }
    })
    .catch(err => {
      console.error("Fehler beim Laden der GeoJSON-Daten:", err);
    });
}

export function addGeoJsonLayer(layer) {
  geoJsonLayers.push(layer);
}

export function createCircleMarkerDynamic(attributeName) {
  return function (feature, latlng) {
    const value = feature.properties?.[attributeName];

    let color = '#888';
    let radius = 3;

    if (attributeName === 'day') {
      // Sonderfall: "day" → immer roter Marker
      color = '#cc0000';
      radius = 5;

    } else if (attributeName === 'type') {
      const type = value || 'default';
      color = getColorByType(type);
      radius = 6;

    } else if (attributeName === 'importance') {
      const importance = typeof value === 'number' ? value : 0;
      color = getColorByImportance(importance);
      radius = 5 + (importance / 20000) * 10; // Radius zwischen 5 und ca. 15

    } else if (attributeName === 'month') {
      // Monatschattierungen in Blau
      const month = parseInt(value, 10);
      const hue = 200; // Blau-Ton
      const lightness = 30 + (month / 12) * 40; // Von 30% bis 70%
      color = `hsl(${hue}, 80%, ${lightness}%)`;
      radius = 5;

    } else if (attributeName === 'year') {
      // Jahr als Grauverlauf (z. B. 1869–1931)
      const year = parseInt(value, 10);
      const minYear = 1869;
      const maxYear = 1931;
      const percent = (year - minYear) / (maxYear - minYear);
      const gray = Math.round(100 * percent);
      color = `hsl(0, 0%, ${gray}%)`; // Grau-Verlauf von hell zu dunkel
      radius = 5;

    } else if (attributeName === 'decade') {
      // Jahrzehnt: verschiedene feste Farben (mapping)
      const decadeColors = {
        '1870': '#8dd3c7',
        '1880': '#ffffb3',
        '1890': '#bebada',
        '1900': '#fb8072',
        '1910': '#80b1d3',
        '1920': '#fdb462',
        '1930': '#b3de69'
      };
      const decadeKey = String(value);
      color = decadeColors[decadeKey] || '#cccccc';
      radius = 5;
    }

    return L.circleMarker(latlng, {
      radius: radius,
      color: color,
      fillColor: color,
      fillOpacity: 1,
      weight: 2
    });
  };
}



export function bindPopupEvents(feature, layer) {
  if (feature.properties) {
    const popupContent = createPopupContent(feature);
    layer.bindPopup(popupContent, { maxWidth: 300 });
    
    // Popup beim Mouseover öffnen
    layer.on('mouseover', function() {
      this.openPopup();
    });
    
    // Es wird bewusst kein mouseout-Handler gesetzt, damit das Popup offen bleibt.
    
    // Falls noch nicht geschehen, einen globalen Klick-Handler an die Karte anhängen,
    // der alle offenen Popups schließt, wenn auf einen leeren Bereich geklickt wird.
    if (map && !map.hasCustomPopupClickHandler) {
      map.on('click', function() {
        map.closePopup();
      });
      // Flag setzen, damit der Handler nur einmal registriert wird
      map.hasCustomPopupClickHandler = true;
    }
  }
}

export function createPopupContent(feature) {
    const title = feature.properties.title || 'Kein Titel';
    const id = feature.properties.id || '#';
    const titleLink = `<a href="${id}.html" target="_blank" class="text-decoration-none">${title}</a>`;

    // Hole die rohen Timestamps (können als Array oder als String vorliegen)
    const datesRaw = feature.properties.timestamp || [];
    let allDates = [];
    if (Array.isArray(datesRaw)) {
        allDates = datesRaw;
    } else if (typeof datesRaw === 'string') {
        allDates = [datesRaw];
    }

    // Lese den URL-Parameter "years" aus
    const params = new URLSearchParams(window.location.search);
    let yearFilterPresent = false;
    let selectedYears = [];
    let filteredDates = allDates; // Standard: alle Tage werden genutzt
    if (params.has("years") && params.get("years") !== "") {
        yearFilterPresent = true;
        const yearsParam = params.get("years");
        if (yearsParam === "0") {
            // "0" signalisiert, dass keine Jahre ausgewählt wurden
            selectedYears = [];
        } else {
            // Erwartet wird z. B. "2018_2019_2020"
            selectedYears = yearsParam.split("_").map(s => s.trim()).filter(s => s !== "");
        }
        // Filtere die Tage, sodass nur jene übrigbleiben, deren Jahr im Set der ausgewählten Jahre enthalten ist.
        filteredDates = allDates.filter(date => selectedYears.includes(date.substring(0, 4)));
    }

    // Anzahl der relevanten Aufenthaltstage (je nach Filter)
    const count = filteredDates.length;

    // Erstelle Links für die ersten 10 relevanten Tage
    let links = "";
    if (filteredDates.length > 0) {
        links = filteredDates.slice(0, 10)
            .map(date => `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`)
            .join('<br>');
    }
    if (filteredDates.length > 10) {
        const remainingCount = filteredDates.length - 10;
        links += `<p style="text-align: right;">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
    }

    // Prüfe, ob "tag.html" in der URL enthalten ist
    const isTagPage = window.location.href.indexOf("tag.html") > -1;

    // Erstelle den anzuzeigenden Text (stayInfo)
    let stayInfo = "";
    if (isTagPage) {
        // Wenn "tag.html" in der URL steht, soll weder "Aufenthaltstag" noch Datum angezeigt werden.
        stayInfo = "";
    } else {
        if (yearFilterPresent) {
            if (selectedYears.length === 0) {
                // Es wurde ein Jahresfilter gesetzt, aber keine Jahre ausgewählt
                stayInfo = "Keine Aufenthalte ausgewählt.";
            } else if (selectedYears.length === 1) {
                // Ein Jahr ausgewählt: "Ein Aufenthaltstag im Jahr 2019" oder "5 Aufenthaltstage im Jahr 2019"
                stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) +
                           " im Jahr " + selectedYears[0] +":";
            } else {
                // Mehrere Jahre ausgewählt: "Ein Aufenthaltstag in den Jahren 2018, 2019" oder "5 Aufenthaltstage in den Jahren 2018, 2019"
                stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) +
                           " in den Jahren " + selectedYears.join(", ") +":";
            }
            // Anschließend die (gefilterten) Tages-Links anhängen, sofern vorhanden:
            if (links) {
                stayInfo += "<br/>" + links;
            }
        } else {
            // Kein Jahresfilter → alle Tage berücksichtigen, wie bisher
            stayInfo = (count === 1 ? "Ein Aufenthaltstag" : `${count} Aufenthaltstage`) + ":<br/>" + links;
        }
    }

    const wikipediaLink = feature.properties.wikipedia
        ? `<a href="${feature.properties.wikipedia}" target="_blank" class="text-dark me-2" title="Wikipedia"><i class="bi bi-wikipedia"></i></a>`
        : '';

    const wiengeschichtewikiLink = feature.properties.wiengeschichtewiki
        ? `<a href="${feature.properties.wiengeschichtewiki}" target="_blank" class="me-2" title="Wien Geschichte Wiki"><img src="../images/Wien_Geschichte_Wiki_Logo.png" alt="Wien Geschichte Wiki" style="height: 20px; width: auto;"></a>`
        : '';

    let wohnortContent = '';
    if (feature.properties.wohnort && Array.isArray(feature.properties.wohnort)) {
        const wohnortListItems = feature.properties.wohnort
            .map(person => `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`)
            .join('');
        wohnortContent = `<p class="m-0 mt-3">Wohnort von:<br/><ul style="padding-left: 20px;">${wohnortListItems}</ul></p>`;
    }

    let arbeitsortContent = '';
    if (feature.properties.arbeitsort && Array.isArray(feature.properties.arbeitsort)) {
        const arbeitsortListItems = feature.properties.arbeitsort
            .map(person => `<li><a href="https://pmb.acdh.oeaw.ac.at/entity/${person.p_id.replace(/^#/, '')}/" target="_blank">${person.p_name}</a></li>`)
            .join('');
        arbeitsortContent = `<p class="m-0 mt-3">Arbeitsort von:<br/><ul style="padding-left: 20px;">${arbeitsortListItems}</ul></p>`;
    }

    return `
    <div class="rounded" style="font-family: Arial, sans-serif;">
    <h5 class="m-0 mb-2">${titleLink}</h5>
    <p class="m-0">${stayInfo}</p>
    ${wohnortContent}
    ${arbeitsortContent}
    <p class="m-0 mt-3 d-flex align-items-center">
        ${wikipediaLink}
        ${wiengeschichtewikiLink}
    </p>
</div>`;
}

export function populateLocationDropdown(features) {
    const params = new URLSearchParams(window.location.search);
    // Lese auch hier die Filtergrenzen für importance aus der URL
    const minImp = params.has("min") ? Number(params.get("min")) : 0;
    const maxImp = params.has("max") ? Number(params.get("max")) : Infinity;

    const locationSelect = document.getElementById('location-select');
    if (!locationSelect) {
        console.warn("Kein Element mit der ID 'location-select' vorhanden. Überspringe Dropdown-Befüllung.");
        return;
    }
    // Dropdown leeren
    locationSelect.innerHTML = '';

    // Füge den Auswahlpunkt "(alle)" an erster Stelle ein
    const allOption = document.createElement('option');
    allOption.value = 'europe'; // Dieser Wert wird später im Event-Listener abgefangen
    allOption.textContent = '(alle)';
    locationSelect.appendChild(allOption);

    // Definiere die gewünschte Reihenfolge für bestimmte Bezirke (Beispiele: Wien, I., II. usw.)
    const forcedOrder = {
        "wien": 0,
        "i., innere stadt": 1,
        "ii., leopoldstadt": 2,
        "iii., landstraße": 3,
        "iv., wieden": 4,
        "v., margareten": 5,
        "vi., mariahilf": 6,
        "vii., neubau": 7,
        "viii., josefstadt": 8,
        "ix., alsergrund": 9,
        "x., favoriten": 10,
        "xi., simmering": 11,
        "xii., meidling": 12,
        "xiii., hietzing": 13,
        "xiv., penzing": 14,
        "xv., rudolfsheim-fünfhaus": 15,
        "xvi., ottakring": 16,
        "xvii., hernals": 17,
        "xviii., währing": 18,
        "xix., döbling": 19,
        "xx., brigittenau": 20,
        "xxi., floridsdorf": 21,
        "xxii., donaustadt": 22,
        "xxiii., liesing": 23
    };

    // Filtere und sortiere die Features anhand vorhandener Eigenschaften, passender Abkürzungen
    // und des importance-Werts (nur Features im gewünschten Bereich werden übernommen)
    const sortedFeatures = features
        .filter(feature => {
            return feature.properties &&
                   feature.properties.title &&
                   feature.properties.abbr &&
                   (feature.properties.abbr.startsWith('BSO') ||
                    feature.properties.abbr.startsWith('P.') ||
                    feature.properties.abbr.startsWith('A.')) &&
                   ((feature.properties.importance || 0) >= minImp && (feature.properties.importance || 0) <= maxImp);
        })
        .sort((a, b) => {
            const titleA = a.properties.title.toLowerCase();
            const titleB = b.properties.title.toLowerCase();

            const orderA = forcedOrder.hasOwnProperty(titleA) ? forcedOrder[titleA] : 100;
            const orderB = forcedOrder.hasOwnProperty(titleB) ? forcedOrder[titleB] : 100;

            if (orderA !== orderB) {
                return orderA - orderB;
            } else {
                return titleA.localeCompare(titleB);
            }
        });

    // Füge die sortierten Optionen zum Dropdown hinzu
    sortedFeatures.forEach(feature => {
        const option = document.createElement('option');
        // Kopie des Koordinaten-Arrays erstellen, bevor reverse aufgerufen wird ([lon, lat] -> [lat, lon])
        const coords = feature.geometry.coordinates.slice().reverse();
        option.value = coords.join(',');
        option.textContent = feature.properties.title;
        locationSelect.appendChild(option);
    });
}

// Falls ein Dropdown-Element mit der ID "location-select" existiert,
// füge den Event-Listener für die Änderung des Dropdowns hinzu.
document.addEventListener('DOMContentLoaded', function () {
    const locationSelect = document.getElementById('location-select');
    if (!locationSelect) {
        console.warn("Kein Element mit der ID 'location-select' vorhanden. Kein Event-Listener für das Dropdown wird hinzugefügt.");
        return;
    }

    locationSelect.addEventListener('change', function () {
        // Prüfen, ob überhaupt ein Wert vorhanden ist
        if (!this.value) {
            // Keine Angabe vorhanden – Standardverhalten: Karte auf einen Standardbereich zentrieren
            const defaultBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
            map.fitBounds(defaultBounds);
            return;
        }

        if (this.value === 'europe') {
            // Beispielhafte Bounds für ganz Europa – passe diese Werte bei Bedarf an
            const europeBounds = L.latLngBounds([34.5, -25.0], [71.0, 40.0]);
            map.fitBounds(europeBounds);
        } else {
            // Erwartet wird ein Wert im Format "lat,lon"
            const [lat, lon] = this.value.split(',').map(Number);
            map.setView([lat, lon], 14);
        }
    });
});

// Farbpalette und Hilfsfunktionen zur Farbauswahl
export const visibilityPalette = [
    '#FFA500', // Orange
    '#FF7F50', // Coral
    '#ff5a64', // Morgenrot
    '#FF4500', // Orangerot
    '#FF0000', // Rot
    '#FF1493', // Deep Pink
    '#FF69B4', // Hot Pink
    '#FF00FF', // Magenta
    '#aaaafa', // Medium Orchid
    '#8A2BE2', // Blue Violet
    '#9400D3', // Dark Violet
    '#49274b', // Dark Orchid
    '#8B008B', // Dark Magenta
    '#800080', // Purple
    '#4B0082', // Indigo
    '#73cee5', // Dark Slate Blue
    '#0000FF', // Blau
    '#0000CD', // Medium Blue
    '#00008B', // Dark Blue
    '#000080', // Navy
    '#191970', // Midnight Blue
    '#82d282', // Dark Green
    '#228B22', // Forest Green
    '#2E8B57', // Sea Green
    '#006400', // Dark Green
    '#556B2F'  // Dark Olive Green
];

// Schwellenwerte für die Farbauswahl
export const thresholds = [1, 2, 3, 4, 5, 10, 15, 25, 35, 50, 75, 100, 150, 250, 400, 600, 1000, 1500, 2500, 4000, 5000, 6000, 10000, 15000, 20000, 30000, 50000];

// Funktion zur Auswahl der Farbe basierend auf der Wichtigkeit (1 bis 5000)
export function getColorByImportance(importance) {
    if (importance === undefined) {
        return '#FF0000';
    }
    for (let i = 0; i < thresholds.length; i++) {
        if (importance <= thresholds[i]) {
            return visibilityPalette[i];
        }
    }
    return visibilityPalette[visibilityPalette.length - 1];
}

// Farbpalette für verschiedene Typen
const typeColorMap = {};
const typePalette = [
    '#FFA500', '#FF7F50', '#ff5a64', '#FF4500', '#FF0000', '#FF1493',
    '#FF69B4', '#FF00FF', '#aaaafa', '#8A2BE2', '#9400D3', '#49274b',
    '#8B008B', '#800080', '#4B0082', '#73cee5', '#0000FF', '#0000CD',
    '#00008B', '#000080', '#191970', '#82d282', '#228B22', '#2E8B57',
    '#006400', '#556B2F'
];

export function getColorByType(type) {
    if (!typeColorMap[type]) {
        typeColorMap[type] = typePalette[Object.keys(typeColorMap).length % typePalette.length];
    }
    return typeColorMap[type];
}

// ===============================
// Hilfsfunktion für Seiten-Navigation
// ===============================
export function resetMapForNewPage() {
  if (map) {
    clearMap();
    viewInitialized = false;
  }
}

