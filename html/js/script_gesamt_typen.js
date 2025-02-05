// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers =[];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Initialisieren der Karte
function initializeMap() {
    window.map = L.map('map-large').setView([48.2082, 16.3738], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
}

function loadGeoJson() {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson`;
    
    // Entferne vorherige Layer
    clearGeoJsonLayers();
    
    // GeoJSON laden und anzeigen
    fetch(url).then(response => {
        if (! response.ok) {
            throw new Error('GeoJSON konnte nicht geladen werden.');
        }
        return response.json();
    }).then(data => {
        window.geoJsonData = data; // Speichert das GeoJSON global für spätere Filterung
        displayFilteredGeoJson();
        // Zeige alle Punkte an
    }). catch (error => {
        console.error('Error loading GeoJSON:', error);
        clearGeoJsonLayers();
    });
}

// Initialisierung der Karte und Laden der GeoJSON-Daten beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    // Karte initialisieren
    
    // GeoJSON-Daten laden und anzeigen
    fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson').then(response => response.json()).then(data => {
        window.geoJsonData = data;
        displayFilteredGeoJson();
        // Zeige alle Punkte an
    }). catch (error => console.error('Fehler beim Laden der GeoJSON-Daten:', error));
});

function createLegendType(features) {
    const legend = document.getElementById('legend-type');
    if (!legend) {
        console.error("Fehler: Element mit ID 'legend-type' nicht gefunden!");
        return;
    }
    
    // Leeren der Legende
    legend.innerHTML = '';
    
    // Titel hinzufügen
    const legendTitle = document.createElement('span');
    legendTitle.style.fontWeight = 'bold';
    legendTitle.innerText = 'Filter:';
    legend.appendChild(legendTitle);
    
    // Alle einzigartigen Typen extrahieren und Zählen
    const typeCountMap = {};
    features.forEach(feature => {
        const type = feature.properties && feature.properties.type;
        if (type && typeof type === 'string') {
            typeCountMap[type] = (typeCountMap[type] || 0) + 1;
        }
    });
    
    const uniqueTypes = Object.keys(typeCountMap).sort((a, b) => a.localeCompare(b));
    
    if (uniqueTypes.length === 0) {
        console.warn("Keine Typen für die Legende gefunden.");
        legend.innerHTML += '<p style="color: red;">Keine Typen vorhanden!</p>';
        return;
    }
    
    // Vorherige Filter aus URL laden
    const selectedTypes = new Set(getSelectedTypesFromURL());

    // "Alle"-Button hinzufügen
    const allButton = document.createElement('button');
    allButton.innerText = "(alle)";
    allButton.classList.add('btn', 'btn-sm', 'm-1');
    allButton.style.backgroundColor = "#ddd";
    allButton.style.color = "black";
    allButton.style.borderRadius = "5px";

    allButton.addEventListener('click', function () {
        // Entferne den "types" Filter aus der URL und aktualisiere die Ansicht
        const selectedTypes = new Set();
        updateURLWithFilters(selectedTypes);  // URL ohne Typen aktualisieren
        displayFilteredGeoJson();  // GeoJSON neu anzeigen ohne Filter auf Typen
    });

    legend.appendChild(allButton);

    // Erstelle die Buttons für die Typen
    uniqueTypes.forEach(type => {
        const count = typeCountMap[type];
        const color = getColorByType(type);

        const button = document.createElement('button');
        button.innerText = `${type} (${count})`;
        button.style.backgroundColor = selectedTypes.has(type) ? color : "#ccc";
        button.style.color = "white";
        button.style.border = "none";
        button.style.padding = "5px 10px";
        button.style.margin = "3px";
        button.style.cursor = "pointer";
        button.style.borderRadius = "5px";
        
        button.dataset.type = type; // Speichert den Typ im Button
        
        button.addEventListener('click', function () {
            toggleTypeFilter(type);
        });
        
        legend.appendChild(button);
    });
}


function getSelectedTypesFromURL() {
    const params = new URLSearchParams(window.location.search);
    const types = params. get ("types");
    return types ? types.split(","):[];
}

function updateURLWithFilters(selectedTypes) {
    const params = new URLSearchParams(window.location.search);
    if (selectedTypes.size > 0) {
        params. set ("types", Array. from (selectedTypes).join(","));
    } else {
        params. delete ("types");
    }
    window.history.replaceState({
    },
    "", `${window.location.pathname}?${params.toString()}`);
}

function toggleTypeFilter(type) {
    const selectedTypes = new Set (getSelectedTypesFromURL());
    
    if (selectedTypes.has(type)) {
        selectedTypes. delete (type);
    } else {
        selectedTypes.add(type);
    }
    
    updateURLWithFilters(selectedTypes);
    displayFilteredGeoJson();
}

// Farbpalette für verschiedene Typen
const typeColorMap = {
};
const typePalette =[
'#FFA500', '#FF7F50', '#ff5a64', '#FF4500', '#FF0000', '#FF1493',
'#FF69B4', '#FF00FF', '#aaaafa', '#8A2BE2', '#9400D3', '#49274b',
'#8B008B', '#800080', '#4B0082', '#73cee5', '#0000FF', '#0000CD',
'#00008B', '#000080', '#191970', '#82d282', '#228B22', '#2E8B57',
'#006400', '#556B2F'];

function getColorByType(type) {
    if (! typeColorMap[type]) {
        typeColorMap[type] = typePalette[Object.keys(typeColorMap).length % typePalette.length];
    }
    return typeColorMap[type];
}

function createCircleMarkerType(feature, latlng) {
    const type = feature.properties.type || 'default';
    const color = getColorByType(type);
    return L.circleMarker(latlng, {
        radius: 6,
        color: color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2
    });
}



function displayFilteredGeoJson() {
  if (!window.geoJsonData || !window.geoJsonData.features) {
    console.warn("GeoJSON-Daten nicht geladen.");
    return;
  }

  // Zuerst den Filter für die Typen ermitteln (unverändert)
  const selectedTypes = new Set(getSelectedTypesFromURL());

  // Filter für die Jahre: Hier wird direkt die URL ausgewertet.
  const params = new URLSearchParams(window.location.search);
  let selectedYears;
  if (!params.has("years")) {
    // Kein "years"-Parameter in der URL → alle Jahre ausgewählt.
    // Ermittele dazu alle in den Daten vorkommenden Jahre:
    selectedYears = new Set();
    window.geoJsonData.features.forEach(feature => {
      if (Array.isArray(feature.properties.timestamp)) {
        feature.properties.timestamp.forEach(date => {
          selectedYears.add(date.substring(0, 4));
        });
      }
    });
  } else {
    const yearsParam = params.get("years");
    if (yearsParam === "0") {
      // Explizit "keinen" ausgewählt → leeres Set
      selectedYears = new Set();
    } else {
      // Andernfalls: Die Jahre werden durch "_" getrennt übergeben.
      selectedYears = new Set(yearsParam.split("_"));
    }
  }

  let filteredFeatures = window.geoJsonData.features;

  // Filterung nach Typen (falls gesetzt)
  if (selectedTypes.size > 0) {
    filteredFeatures = filteredFeatures.filter(feature =>
      selectedTypes.has(feature.properties.type)
    );
  }

  // Filterung nach Jahren:
  if (selectedYears.size > 0) {
    filteredFeatures = filteredFeatures.filter(feature =>
      feature.properties.timestamp.some(date => selectedYears.has(date.substring(0, 4)))
    );
  } else {
    // Wenn explizit keine Jahre ausgewählt sind, dann:
    filteredFeatures = [];
  }

  // Bestehende GeoJSON-Layer löschen, Legenden und Filter neu erstellen
  clearGeoJsonLayers();
  createLegendType(window.geoJsonData.features);
  createFilterTime(window.geoJsonData.features);

  if (filteredFeatures.length === 0) {
    console.warn('Keine passenden Features gefunden.');
    return;
  }

  // Anzeige der gefilterten Features auf der Karte (z.B. mit Leaflet)
  const newLayer = L.geoJSON(filteredFeatures, {
    pointToLayer: createCircleMarkerType,
    onEachFeature: function (feature, layer) {
      if (feature.properties) {
        const popupContent = createPopupContent(feature);
        layer.bindPopup(popupContent, {
          maxWidth: 300
        });
      }
    }
  }).addTo(map);

  geoJsonLayers.push(newLayer);
  map.fitBounds(newLayer.getBounds());
}













