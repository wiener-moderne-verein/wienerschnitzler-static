// Eigenständige JavaScript-Datei für tag.xsl ohne Abhängigkeiten zu fuer-alle-karten.js

// Globale Variablen
let map;
let geoJsonLayers = [];
let lineLayer;

const wohnsitze = [{
    target_label: "Sternwartestraße 71",
    target_id: "pmb168815",
    start_date: "1910-07-17",
    end_date: "1931-10-21"
}, {
    target_label: "Edmund-Weiß-Gasse 7",
    target_id: "pmb168940",
    start_date: "1903-09-12",
    end_date: "1910-07-16"
}, {
    target_label: "Frankgasse 1",
    target_id: "pmb168934",
    start_date: "1893-11-15",
    end_date: "1903-09-11"
}, {
    target_label: "Wohnung und Ordination Arthur Schnitzler Grillparzerstraße 7/3. Stock",
    target_id: "pmb167782",
    start_date: "1892-10-15",
    end_date: "1893-11-14"
}, {
    target_label: "Kärntnerring 12/Bösendorferstraße 11",
    target_id: "pmb167805",
    start_date: "1889-12-03",
    end_date: "1892-10-14"
}, {
    target_label: "Wohnung und Ordination Arthur Schnitzler Burgring 1",
    target_id: "pmb168768",
    start_date: "1888-10-19",
    end_date: "1889-12-02"
}, {
    target_label: "Wohnung und Ordination Johann Schnitzler Burgring 1",
    target_id: "pmb168765",
    start_date: "1870-05-12",
    end_date: "1888-10-18"
}, {
    target_label: "Kärntnerring 12/Bösendorferstraße 11",
    target_id: "pmb167805",
    start_date: "1870-01-01",
    end_date: "1871-01-01"
}, {
    target_label: "Schottenbastei 3",
    target_id: "pmb51969",
    start_date: "1864-01-22",
    end_date: "1870-01-01"
}, {
    target_label: "Praterstraße 16",
    target_id: "pmb168783",
    start_date: "1862-05-15",
    end_date: "1864-01-01"
}];

let currentlyLoadingDate = null; // Verhindert mehrfache Aufrufe
let tagebuchDates = []; // Liste der Tagebuch-Daten

// Map Initialisierung - komplett eigenständig
function initializeMapLarge() {
  if (map) {
    console.warn("Map ist bereits initialisiert.");
    return;
  }

  map = L.map('map-large').setView([48.2082, 16.3738], 5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 18
  }).addTo(map);
}

// Hilfsfunktion zur Formatierung von ISO-Datum (YYYY-MM-DD) ins deutsche Format (z.B. 3.3.1863)
function formatIsoDateToGerman(dateStr) {
  const parts = dateStr.split('-');
  return `${Number(parts[2])}.${Number(parts[1])}.${parts[0]}`;
}

// Hilfsfunktion zur Formatierung von ISO-Datum mit Wochentag (z.B. "Dienstag, dem 3.3.1863")
function formatIsoDateWithWeekday(dateStr) {
  const date = new Date(dateStr);
  const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const weekday = weekdays[date.getDay()];
  const formattedDate = formatIsoDateToGerman(dateStr);
  return `${weekday}, dem ${formattedDate}`;
}

// Funktion, die anhand des Datums den entsprechenden Wohnsitz aus dem Array sucht
function getWohnsitzForDate(date) {
  const inputDate = new Date(date);
  return wohnsitze.find(entry => {
    const startDate = new Date(entry.start_date);
    const endDate = new Date(entry.end_date);
    return inputDate >= startDate && inputDate <= endDate;
  });
}

// Eigenständige Tag-spezifische Bereinigung
function clearTagMap() {
  if (!map) return;

  // Alle Popups schließen
  map.closePopup();

  // Alle existierenden geoJsonLayers entfernen
  geoJsonLayers.forEach(layer => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  geoJsonLayers.length = 0;

  // LineLayer entfernen falls vorhanden
  if (lineLayer && map.hasLayer(lineLayer)) {
    map.removeLayer(lineLayer);
  }

  // ALLE Layer entfernen (außer TileLayer) - für Tag-Ansicht
  const layersToRemove = [];
  map.eachLayer(function(layer) {
    if (!(layer instanceof L.TileLayer)) {
      layersToRemove.push(layer);
    }
  });
  layersToRemove.forEach(layer => {
    map.removeLayer(layer);
  });

  // Aggressive DOM-Bereinigung für verbleibende SVG-Elemente
  function cleanupTagDOM() {
    const mapContainer = map.getContainer();

    // Alle grauen Punkte entfernen
    const greyPaths = mapContainer.querySelectorAll('path[stroke="#888"]');
    greyPaths.forEach(path => path.remove());

    const greyFillPaths = mapContainer.querySelectorAll('path[fill="#888"]');
    greyFillPaths.forEach(path => path.remove());

    // Alle interaktiven Pfade mit unbekannten Farben entfernen
    const interactivePaths = mapContainer.querySelectorAll('path.leaflet-interactive');
    interactivePaths.forEach(path => {
      const stroke = path.getAttribute('stroke');
      const fill = path.getAttribute('fill');
      // Behalte nur rote Punkte (#cc0000) und Linien (#462346)
      if (stroke !== '#cc0000' && stroke !== '#462346' && fill !== '#cc0000') {
        path.remove();
      }
    });
  }

  // Sofort ausführen
  cleanupTagDOM();

  // Mehrfache Ausführung mit Verzögerung für asynchrone Erstellung
  setTimeout(cleanupTagDOM, 10);
  setTimeout(cleanupTagDOM, 50);
  setTimeout(cleanupTagDOM, 100);
  setTimeout(cleanupTagDOM, 200);
}

// Eigenständige Circle Marker Funktion
function createCircleMarkerForDay(feature, latlng) {
  return L.circleMarker(latlng, {
    radius: 5,
    color: '#cc0000',
    fillColor: '#cc0000',
    fillOpacity: 1,
    weight: 2
  });
}

// Eigenständige Popup Funktion
function bindPopupEvents(feature, layer) {
  if (feature.properties) {
    const popupContent = createPopupContent(feature);
    layer.bindPopup(popupContent, { maxWidth: 300 });

    // Popup beim Mouseover öffnen
    layer.on('mouseover', function() {
      this.openPopup();
    });

    // Globaler Klick-Handler für Map
    if (map && !map.hasCustomPopupClickHandler) {
      map.on('click', function() {
        map.closePopup();
      });
      map.hasCustomPopupClickHandler = true;
    }
  }
}

// Eigenständige Popup Content Funktion
function createPopupContent(feature) {
  const title = feature.properties.title || 'Kein Titel';
  const id = feature.properties.id || '#';
  const titleLink = `<a href="${id}.html" target="_blank" class="text-decoration-none">${title}</a>`;

  // Tag-Seite zeigt keine Aufenthaltstage an
  const stayInfo = "";

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

// Eigenständige Linien-Toggle Funktion
function setupLineToggleControl(lineLayer, initialVisible) {
  const lineToggle = document.getElementById('lineToggle');
  if (!lineToggle) return;

  lineToggle.checked = initialVisible;

  lineToggle.addEventListener('change', function() {
    if (this.checked) {
      if (lineLayer && !map.hasLayer(lineLayer)) {
        lineLayer.addTo(map);
        lineLayer.bringToBack();
      }
      updateUrlParameter('l', 'on');
    } else {
      if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
      }
      updateUrlParameter('l', 'off');
    }
  });
}

// Hilfsfunktion zur korrekten URL-Parameter Behandlung
function updateUrlParameter(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.replaceState(null, '', url.toString());
}

// Hilfsfunktion: Link zu einem Ort erstellen
function makePlaceLink(id, name) {
  return `<a href="${encodeURIComponent(id)}.html">${name}</a>`;
}

// Hilfsfunktion: Liste von Orten mit "und" vor dem letzten verbinden
function joinPlaceLinks(places) {
  if (places.length === 0) return '';
  if (places.length === 1) return makePlaceLink(places[0].id, places[0].name);
  const allButLast = places.slice(0, -1).map(p => makePlaceLink(p.id, p.name)).join(', ');
  return `${allButLast} und ${makePlaceLink(places[places.length - 1].id, places[places.length - 1].name)}`;
}

// Baut den Hierarchietext rekursiv auf (alle Ebenen mit Unterorten)
function buildHierarchyText(hierarchy) {
  const paragraphs = [];

  function processLevel(places) {
    places.forEach(place => {
      if (place.children && place.children.length > 0) {
        const childLinks = joinPlaceLinks(place.children);
        paragraphs.push(`In ${makePlaceLink(place.id, place.name)} hielt er sich an folgenden Orten auf: ${childLinks}.`);
        processLevel(place.children);
      }
    });
  }

  processLevel(hierarchy);
  return paragraphs;
}

function updateMapInhaltText(features, date, name, hierarchy) {
  const mapInhaltTextDiv = document.getElementById('map-inhalt-text');

  if (mapInhaltTextDiv) {
    const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const displayedDate = isValidDate ? formatIsoDateToGerman(date) : 'unbekanntes Datum';
    const displayedName = name || displayedDate;
    const dateWithWeekday = isValidDate ? formatIsoDateWithWeekday(date) : displayedName;

    let textContent = '';

    if (hierarchy && hierarchy.length > 0) {
      // Erster Satz: die obersten Orte auflisten
      const topLinks = joinPlaceLinks(hierarchy);
      textContent = `<p>Am ${dateWithWeekday} war Schnitzler in ${topLinks}.</p>`;

      // Folgesätze: für jeden Ort mit Unterorten einen eigenen Absatz
      const subParagraphs = buildHierarchyText(hierarchy);
      if (subParagraphs.length > 0) {
        textContent += subParagraphs.map(p => `<p>${p}</p>`).join('');
      }
    } else {
      // Fallback: GeoJSON-Features direkt auflisten (kein Hierarchiefeld vorhanden)
      const filteredFeatures = features.filter(feature => feature && feature.properties && feature.properties.id);
      if (filteredFeatures.length > 0) {
        const createLinkText = (feature) => feature.properties.title || feature.properties.id;
        textContent = `<p>Am ${dateWithWeekday} war Schnitzler in ${
          filteredFeatures.length === 1
            ? `<a href="${encodeURIComponent(filteredFeatures[0].properties.id)}.html">${createLinkText(filteredFeatures[0])}</a>.`
            : filteredFeatures.slice(0, -1).map(f => `<a href="${encodeURIComponent(f.properties.id)}.html">${createLinkText(f)}</a>`).join(', ') +
              ` und <a href="${encodeURIComponent(filteredFeatures[filteredFeatures.length - 1].properties.id)}.html">${createLinkText(filteredFeatures[filteredFeatures.length - 1])}</a>.`
        }</p>`;
      } else {
        const wohnsitz = getWohnsitzForDate(date);
        if (wohnsitz) {
          textContent = `<p>Für den ${displayedDate} ist kein Aufenthaltsort bekannt. Schnitzler wohnte zu dieser Zeit in der ${wohnsitz.target_label}.</p>`;
        } else {
          textContent = `<p>Für den ${displayedDate} sind keine Aufenthaltsorte bekannt.</p>`;
        }
      }
    }

    // Füge die Links zu Chronik und Tagebuch hinzu
    const hasTagebuch = tagebuchDates.includes(date);
    const linksHtml = `
      <div class="mt-3 p-1 border rounded d-inline-block">
        <a class="btn schnitzler-chronik-link me-2" role="button" href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank" rel="noopener noreferrer" aria-label="Schnitzler Chronik - öffnet in neuem Fenster">Schnitzler Chronik</a>
        ${hasTagebuch ? `<a class="btn schnitzler-tagebuch-link" role="button" href="https://schnitzler-tagebuch.acdh.oeaw.ac.at/entry__${date}.html" target="_blank" rel="noopener noreferrer" aria-label="Schnitzler Tagebuch - öffnet in neuem Fenster">Schnitzler Tagebuch</a>` : ''}
      </div>
    `;

    mapInhaltTextDiv.innerHTML = textContent + linksHtml;
  } else {
    console.error('Element mit ID "map-inhalt-text" nicht gefunden.');
  }
}

function loadGeoJsonByDate(date) {
  // Verhindere mehrfache Aufrufe für dasselbe Datum
  if (currentlyLoadingDate === date) {
    console.log(`Debug: Überspringe doppelten Aufruf für ${date}`);
    return;
  }
  currentlyLoadingDate = date;

  const inputDate = new Date(date);
  const minDateObj = new Date("1862-05-15");
  const maxDateObj = new Date("1931-10-21");

  // Tag-spezifische aggressive Bereinigung
  clearTagMap();

  if (inputDate < minDateObj || inputDate > maxDateObj) {
    const formattedDate = formatIsoDateWithWeekday(date);
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (mapInhaltTextDiv) {
      mapInhaltTextDiv.innerHTML = `Am ${formattedDate} war Arthur Schnitzler nicht am Leben.`;
    }
    return;
  }

  const url = `../geojson/${date}.geojson`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`GeoJSON für ${date} nicht gefunden.`);
      }
      return response.json();
    })
    .then(data => {
      const featuresWithID = [];
      const name = data.features[0]?.properties?.name || date;
      const hierarchy = data.hierarchy || null;

      // Nur Point-Features mit timestamp, die das Datum enthalten
      const pointFeatures = data.features.filter(feature => {
        return feature.geometry.type === 'Point' &&
               feature.properties &&
               Array.isArray(feature.properties.timestamp) &&
               feature.properties.timestamp.includes(date);
      });

      console.log(`Debug: Gefundene Features für ${date}:`, pointFeatures.length);

      // LineString-Features für Linie
      const lineFeatures = data.features.filter(feature => feature.geometry.type === 'LineString');

      // Linie erstellen
      lineLayer = L.geoJSON(lineFeatures, {
        style: {
          color: '#462346',
          weight: 2
        }
      });

      // Linien-Visibility anhand Parameter und Checkbox steuern
      const params = new URLSearchParams(window.location.search);
      const lineParam = params.get('l');
      const lineVisible = (lineParam === 'on');
      document.getElementById('lineToggle').checked = lineVisible;

      if (lineVisible) {
        lineLayer.addTo(map);
        lineLayer.bringToBack();
      }

      if (lineFeatures.length > 0) {
        setupLineToggleControl(lineLayer, lineVisible);
      }

      // Punkte-Layer erzeugen und zum Map hinzufügen
      const pointsLayer = L.geoJSON(pointFeatures, {
        pointToLayer: createCircleMarkerForDay,
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.id) {
            featuresWithID.push(feature);
          }
          bindPopupEvents(feature, layer);
        }
      }).addTo(map);

      geoJsonLayers.push(pointsLayer);
      console.log(`Debug: Layer erstellt mit ${pointsLayer.getLayers().length} Punkten`);
      console.log(`Debug: Aktuell ${geoJsonLayers.length} Layer in geoJsonLayers`);

      if (pointsLayer.getLayers().length > 0) {
        map.fitBounds(pointsLayer.getBounds());
      } else if (lineVisible && lineLayer.getLayers().length > 0) {
        map.fitBounds(lineLayer.getBounds());
      }

      updateMapInhaltText(featuresWithID, date, name, hierarchy);
    })
    .catch(error => {
      console.error('Error loading GeoJSON:', error);
    })
    .finally(() => {
      // Ermögliche neue Aufrufe nach Abschluss
      currentlyLoadingDate = null;
    });
}

function getDateFromUrl() {
  const hash = window.location.hash;
  return hash ? hash.substring(1) : null;
}

function setDateAndLoad(date) {
  const currentHash = window.location.hash.substring(1);
  if (currentHash !== date) {
    window.location.hash = date;
    // loadGeoJsonByDate wird durch hashchange-Event ausgelöst
  } else {
    // Bei gleichem Hash direkt laden
    loadGeoJsonByDate(date);
  }
}

// Hash-Änderungen überwachen
let lastHash = window.location.hash;

function checkHashChange() {
  const currentHash = window.location.hash;
  if (currentHash !== lastHash) {
    lastHash = currentHash;
    const date = getDateFromUrl();
    if (date) {
      clearTagMap(); // Tag-spezifische Bereinigung
      loadGeoJsonByDate(date);
      document.getElementById('date-input').value = date;
    }
  }
}

// Überprüfung alle 500ms
setInterval(checkHashChange, 500);

window.addEventListener('hashchange', function() {
  const date = getDateFromUrl();
  if (date) {
    loadGeoJsonByDate(date);
    document.getElementById('date-input').value = date;
  }
});

// Lade die Liste der Tagebuch-Daten
async function loadTagebuchDates() {
  try {
    const response = await fetch('../utils/index_days.xml');
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const dateElements = xmlDoc.getElementsByTagName('date');
    tagebuchDates = Array.from(dateElements).map(el => el.textContent);
  } catch (error) {
    console.error('Fehler beim Laden der Tagebuch-Daten:', error);
  }
}

window.addEventListener('load', async () => {
  await loadTagebuchDates();
  const date = getDateFromUrl() || '1895-01-23';
  document.getElementById('date-input').value = date;
  loadGeoJsonByDate(date);
});

// Zusätzliche Überprüfung bei Fokus-Ereignissen
window.addEventListener('focus', function() {
  const date = getDateFromUrl();
  const inputDate = document.getElementById('date-input').value;

  if (date && date !== inputDate) {
    loadGeoJsonByDate(date);
    document.getElementById('date-input').value = date;
  }
});

function formatDateToISO(date) {
  return date.toISOString().split('T')[0];
}

function changeDateByDays(currentDate, days) {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + days);
  return formatDateToISO(date);
}

// Event Listeners für Datumsnavigation
document.getElementById('date-input').addEventListener('change', function () {
  const date = this.value;
  if (date) {
    setDateAndLoad(date);
  }
});

document.getElementById('prev-day').addEventListener('click', function () {
  const dateInput = document.getElementById('date-input');
  const currentDate = dateInput.value;
  const newDate = changeDateByDays(currentDate, -1);
  setDateAndLoad(newDate);
});

document.getElementById('next-day').addEventListener('click', function () {
  const dateInput = document.getElementById('date-input');
  const currentDate = dateInput.value;
  const newDate = changeDateByDays(currentDate, 1);
  setDateAndLoad(newDate);
});

// Map initialisieren
initializeMapLarge();

// Initial laden
const initialDate = getDateFromUrl() || '1895-01-23';
document.getElementById('date-input').value = initialDate;
setDateAndLoad(initialDate);

function checkDateInRange(date, id) {
  const inputDate = new Date(date);
  const wohnsitz = wohnsitze.find(entry => entry.target_id === id);
  if (!wohnsitz) {
    return false;
  }
  const startDate = new Date(wohnsitz.start_date);
  const endDate = new Date(wohnsitz.end_date);
  return inputDate >= startDate && inputDate <= endDate;
}