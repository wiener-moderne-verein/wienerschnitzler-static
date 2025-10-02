import{initView, viewInitialized, clearGeoJsonLayers, createCircleMarkerDynamic, bindPopupEvents, populateLocationDropdown, geoJsonLayers, thresholds} from './fuer-alle-karten.js';
import {createFilterTime} from './filter_jahre.js';
import {createLegend} from './filter_dauer.js';

document.addEventListener('DOMContentLoaded', initView);

export function displayFilteredGeoJsonImportance(map) {
    if (!window.geoJsonData || !window.geoJsonData.features) {
        console.warn("GeoJSON-Daten nicht geladen.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    let filteredFeatures = window.geoJsonData.features;

    // ============================
    // Jahre-Filter
    // ============================
    let selectedYears = new Set();

    // Prüfe, ob ein gültiger "years"-Parameter vorhanden ist:
    if (!params.has("years") || params.get("years") === "") {
        // Kein "years"-Parameter → alle Jahre auswählen
        // (Dabei wird auch berücksichtigt, ob timestamp als Array oder String vorliegt)
        window.geoJsonData.features.forEach(feature => {
            const ts = feature.properties.timestamp;
            if (Array.isArray(ts)) {
                ts.forEach(date => {
                    // Extrahiere die ersten 4 Zeichen (das Jahr) und füge es hinzu
                    selectedYears.add(date.substring(0, 4));
                });
            } else if (typeof ts === 'string') {
                selectedYears.add(ts.substring(0, 4));
            }
        });
        // Da alle Jahre berücksichtigt werden sollen, wird hier nicht weiter gefiltert.
    } else {
        // Es liegt ein "years"-Parameter vor
        const yearsParam = params.get("years");
        if (yearsParam === "0") {
            // Falls explizit "(keinen)" gewählt wurde, also keine Jahre selektiert sind,
            // wird ein leeres Set benutzt → Ergebnis: Keine Features
            selectedYears = new Set();
        } else {
            // Aufteilen des Parameters (z. B. "2018_2019_2020") in einzelne Jahrwerte
            yearsParam.split("_").forEach(year => {
                if (year.trim() !== "") {
                    selectedYears.add(year.trim());
                }
            });
        }

        // Wende den Jahrfilter an – nur Features übernehmen, die mindestens einen
        // Timestamp mit einem Jahr aus dem ausgewählten Set haben
        if (selectedYears.size > 0) {
            filteredFeatures = filteredFeatures.filter(feature => {
                const ts = feature.properties.timestamp;
                // Falls timestamp nicht als Array vorliegt, in ein Array packen:
                let dates = Array.isArray(ts) ? ts : [ts];
                return dates.some(date => {
                    // Sicherstellen, dass date ein String ist und das Jahr ermittelt werden kann
                    return typeof date === "string" && selectedYears.has(date.substring(0, 4));
                });
            });
        } else {
            // Leeres Set → keine Features
            filteredFeatures = [];
        }
    }
    
    populateLocationDropdown(filteredFeatures);

    // ============================
    // Threshold-Filter (Legende)
    // ============================
    let selectedThresholds = null;
    if (params.has("thresholds")) {
        const thresholdsParam = params.get("thresholds");
        if (thresholdsParam === "0") {
            selectedThresholds = new Set(); // keine Schwellenwerte ausgewählt
        } else {
            selectedThresholds = new Set(thresholdsParam.split("_").map(Number));
        }
    }

    // Falls Schwellenwerte selektiert sind, filtere die Features entsprechend
    if (selectedThresholds !== null && selectedThresholds.size > 0) {
        filteredFeatures = filteredFeatures.filter(feature => {
            const imp = feature.properties.importance || 0;

            // Finde, zu welchem Schwellenwert dieser importance-Wert gehört
            let belongsToThreshold = null;
            for (let i = 0; i < thresholds.length; i++) {
                if (i === 0) {
                    // Erster Schwellenwert: alle Werte <= threshold
                    if (imp <= thresholds[i]) {
                        belongsToThreshold = thresholds[i];
                        break;
                    }
                } else if (i === thresholds.length - 1) {
                    // Letzter Schwellenwert: alle Werte > vorletzter threshold
                    if (imp > thresholds[i - 1]) {
                        belongsToThreshold = thresholds[i];
                        break;
                    }
                } else {
                    // Mittlere Schwellenwerte
                    if (imp > thresholds[i - 1] && imp <= thresholds[i]) {
                        belongsToThreshold = thresholds[i];
                        break;
                    }
                }
            }

            return belongsToThreshold !== null && selectedThresholds.has(belongsToThreshold);
        });
    } else if (selectedThresholds !== null && selectedThresholds.size === 0) {
        // Explizit keine Schwellenwerte ausgewählt → keine Features anzeigen
        filteredFeatures = [];
    }

    // ============================
    // Karte aktualisieren
    // ============================
    clearGeoJsonLayers();
    createFilterTime(window.geoJsonData.features);

    if (filteredFeatures.length === 0) {
        console.warn('Keine passenden Features gefunden.');
        return;
    }
    
    // Sortiere Features nach importance, aufsteigend – weniger wichtige zuerst
    filteredFeatures.sort((a, b) => {
        const impA = a.properties.importance || 0;
        const impB = b.properties.importance || 0;
        return impA - impB; // Kleinere importance zuerst → größere werden zuletzt gezeichnet
    });

    // GeoJSON-Layer erstellen – mit der Marker-Funktion createCircleMarker
    const newLayer = L.geoJSON(filteredFeatures, {
        pointToLayer: createCircleMarkerDynamic("importance"),
        onEachFeature: function (feature, layer) {
          bindPopupEvents(feature, layer);
        }
        
    }).addTo(map);

    geoJsonLayers.push(newLayer);
    
    // Bestimme den maximalen Importance-Wert der gefilterten Features
    const maxImportanceFeature = filteredFeatures.reduce((max, feature) => {
        const imp = feature.properties.importance || 0;
        return imp > max ? imp : max;
    }, 0);
    
    // Legende anhand des maximalen Importance-Werts erstellen
    createLegend(maxImportanceFeature);

    map.fitBounds(newLayer.getBounds());
}

