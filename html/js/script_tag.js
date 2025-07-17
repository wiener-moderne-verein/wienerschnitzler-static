import { initView, map, createCircleMarkerDynamic, bindPopupEvents, clearGeoJsonLayers, geoJsonLayers, clearMap } from './fuer-alle-karten.js';
import { setupLineToggleControl } from './linie-anzeigen.js';

const wohnsitze =[ {
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


// Hilfsfunktion zur Formatierung von ISO-Datum (YYYY-MM-DD) ins deutsche Format (z.B. 3.3.1863)
function formatIsoDateToGerman(dateStr) {
  const parts = dateStr.split('-');
  return `${Number(parts[2])}.${Number(parts[1])}.${parts[0]}`;
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

let lineLayer; 
// globale Variable für den Linien-Layer

function updateMapInhaltText(features, date, name) {
  const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
  
  if (mapInhaltTextDiv) {
    const isValidDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const displayedDate = isValidDate ? formatIsoDateToGerman(date) : 'unbekanntes Datum';
    const displayedName = name || displayedDate;

    const filteredFeatures = features.filter(feature => feature && feature.properties && feature.properties.id);

    let textContent = '';
    if (filteredFeatures.length > 0) {
      const createLinkText = (feature) => {
        const title = feature.properties.title || feature.properties.id;
        return `${title}`;
      };

      textContent = `Am <a class="schnitzler-chronik-link" href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${displayedName}</a> war Schnitzler an folgenden Orten: ${
        filteredFeatures.length === 1
          ? `<a href="${encodeURIComponent(filteredFeatures[0].properties.id)}.html">${createLinkText(filteredFeatures[0])}</a>.`
          : filteredFeatures.slice(0, -1).map(feature => `<a href="${encodeURIComponent(feature.properties.id)}.html">${createLinkText(feature)}</a>`).join(', ') +
            ` und <a href="${encodeURIComponent(filteredFeatures[filteredFeatures.length - 1].properties.id)}.html">${createLinkText(filteredFeatures[filteredFeatures.length - 1])}</a>.`
      }`;
    } else {
      const wohnsitz = getWohnsitzForDate(date);
      if (wohnsitz) {
        textContent = `Für den ${displayedDate} ist kein Aufenthaltsort bekannt. Schnitzler wohnte zu dieser Zeit in der ${wohnsitz.target_label}.`;
      } else {
        textContent = `Für den ${displayedDate} sind keine Aufenthaltsorte bekannt.`;
      }
    }

    mapInhaltTextDiv.innerHTML = textContent;
  } else {
    console.error('Element mit ID "map-inhalt-text" nicht gefunden.');
  }
}

function loadGeoJsonByDate(date) {
  const inputDate = new Date(date);
  const minDateObj = new Date("1862-05-15");
  const maxDateObj = new Date("1931-10-21");

  // WICHTIG: clearMap() am Anfang aufrufen - mehrfach sicherstellen
  clearMap();
  
  // Zusätzliche Sicherheit: Alle Layer explizit entfernen
  geoJsonLayers.forEach(layer => {
    if (map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  geoJsonLayers.length = 0; // Array leeren
  
  // Auch lineLayer entfernen falls vorhanden
  if (lineLayer && map.hasLayer(lineLayer)) {
    map.removeLayer(lineLayer);
  }

  if (inputDate < minDateObj || inputDate > maxDateObj) {
    const formattedDate = formatIsoDateToGerman(date);
    const mapInhaltTextDiv = document.getElementById('map-inhalt-text');
    if (mapInhaltTextDiv) {
      mapInhaltTextDiv.innerHTML = `Am ${formattedDate} war Arthur Schnitzler nicht am Leben.`;
    }
    return;
  }

  const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data//editions/geojson/${date}.geojson`;

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

      // Nur Point-Features mit timestamp, die das Datum enthalten
      const pointFeatures = data.features.filter(feature => {
        return feature.geometry.type === 'Point' &&
               feature.properties &&
               Array.isArray(feature.properties.timestamp) &&
               feature.properties.timestamp.includes(date);
      });

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
        pointToLayer: createCircleMarkerDynamic('day'),
        onEachFeature: function (feature, layer) {
          if (feature.properties && feature.properties.id) {
            featuresWithID.push(feature);
          }
          bindPopupEvents(feature, layer);
        }
      }).addTo(map);

      geoJsonLayers.push(pointsLayer);

      if (pointsLayer.getLayers().length > 0) {
        map.fitBounds(pointsLayer.getBounds());
      } else if (lineVisible && lineLayer.getLayers().length > 0) {
        map.fitBounds(lineLayer.getBounds());
      }

      updateMapInhaltText(featuresWithID, date, name);
    })
    .catch(error => {
      console.error('Error loading GeoJSON:', error);
      // Auch bei Fehlern die Map bereinigen
      clearMap();
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
// Lösung 1: Polling-Mechanismus für Hash-Änderungen
let lastHash = window.location.hash;

function checkHashChange() {
  const currentHash = window.location.hash;
  if (currentHash !== lastHash) {
    lastHash = currentHash;
    const date = getDateFromUrl();
    if (date) {
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
    // Explizit clearMap() aufrufen vor dem Laden neuer Daten
    clearMap();
    loadGeoJsonByDate(date);
    document.getElementById('date-input').value = date;
  }
});

window.addEventListener('load', () => {
  const date = getDateFromUrl() || '1895-01-23';
  document.getElementById('date-input').value = date;
  // clearMap() wird bereits in loadGeoJsonByDate() aufgerufen
  loadGeoJsonByDate(date);
});

// Zusätzliche Überprüfung bei Fokus-Ereignissen (für manuelle URL-Änderungen)
window.addEventListener('focus', function() {
  const date = getDateFromUrl();
  const inputDate = document.getElementById('date-input').value;
  
  if (date && date !== inputDate) {
    clearMap();
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

initView();

const initialDate = getDateFromUrl() || '1895-01-23';
document.getElementById('date-input').value = initialDate;
setDateAndLoad(initialDate);

if (window.location.hash.substring(1) === initialDate) {
  loadGeoJsonByDate(initialDate);
}

function checkDateInRange(date, id) {
const inputDate = new Date(date);
const wohnsitz = wohnsitze.find(entry => entry.target_id === id);
if (! wohnsitz) {
    return false;
}
const startDate = new Date(wohnsitz.start_date);
const endDate = new Date(wohnsitz.end_date);
return inputDate >= startDate && inputDate <= endDate;
}