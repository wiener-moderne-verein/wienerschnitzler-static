// Array zur Verwaltung der GeoJSON-Layer
const geoJsonLayers =[];

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
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
    initializeMapLarge();
    // Karte initialisieren
    
    // GeoJSON-Daten laden und anzeigen
    fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson').then(response => response.json()).then(data => {
        window.geoJsonData = data;
        displayFilteredGeoJson();
        // Zeige alle Punkte an
    }). catch (error => console.error('Fehler beim Laden der GeoJSON-Daten:', error));
});


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

  const params = new URLSearchParams(window.location.search);
  let filteredFeatures = window.geoJsonData.features;

  // ============================
  // Typen-Filter
  // ============================
  let selectedTypes;
  if (!params.has("types")) {
    // Kein "types"-Parameter → alle Typen auswählen:
    selectedTypes = new Set();
    window.geoJsonData.features.forEach(feature => {
      if (feature.properties && feature.properties.type) {
        selectedTypes.add(feature.properties.type);
      }
    });
  } else {
    const typesParam = params.get("types");
    if (typesParam === "0") {
      // Explizit "(keine)" gedrückt → keine Typen ausgewählt
      selectedTypes = new Set();
    } else {
      selectedTypes = new Set(typesParam.split(","));
    }
  }

  // Filterung nach Typen, aber nur wenn der Parameter in der URL gesetzt wurde.
  // Ist er gesetzt und das Set ist leer, sollen keine Features angezeigt werden.
  if (params.has("types")) {
    if (selectedTypes.size > 0) {
      filteredFeatures = filteredFeatures.filter(feature =>
        selectedTypes.has(feature.properties.type)
      );
    } else {
      filteredFeatures = [];
    }
  }
  
  // ============================
  // Jahre-Filter
  // ============================
  let selectedYears;
  if (!params.has("years")) {
    // Kein "years"-Parameter → alle Jahre auswählen:
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
      // Explizit "(keinen)" gedrückt → keine Jahre ausgewählt
      selectedYears = new Set();
    } else {
      selectedYears = new Set(yearsParam.split("_"));
    }
  }

  // Filterung nach Jahren – analog zum Typen-Filter:
  if (params.has("years")) {
    if (selectedYears.size > 0) {
      filteredFeatures = filteredFeatures.filter(feature =>
        feature.properties.timestamp.some(date => selectedYears.has(date.substring(0, 4)))
      );
    } else {
      filteredFeatures = [];
    }
  }

  // ============================
  // Karte aktualisieren
  // ============================
  clearGeoJsonLayers();
  createFilterType(window.geoJsonData.features);
  createFilterTime(window.geoJsonData.features);

  if (filteredFeatures.length === 0) {
    console.warn('Keine passenden Features gefunden.');
    return;
  }

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









