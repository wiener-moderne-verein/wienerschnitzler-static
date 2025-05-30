import{initView, clearGeoJsonLayers, createCircleMarkerDynamic, bindPopupEvents, addGeoJsonLayer, map, populateLocationDropdown} from './fuer-alle-karten.js';
import { createFilterTime } from './filter_jahre.js';
import { createFilterType } from './filter_typ.js';

document.addEventListener('DOMContentLoaded', initView);

export function displayFilteredGeoJsonType() {
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
  
  populateLocationDropdown(filteredFeatures);


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
    pointToLayer: createCircleMarkerDynamic("type"),
    onEachFeature: function (feature, layer) {
          bindPopupEvents(feature, layer);
        }   
  }).addTo(map);

  addGeoJsonLayer(newLayer);
  map.fitBounds(newLayer.getBounds());
}

