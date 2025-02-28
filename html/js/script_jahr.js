// Globale Variablen und Funktionen
const geoJsonLayers = [];
let lineLayer; // Für den Linien-Layer


// Funktion, um das Fragment in der URL zu aktualisieren
function updateUrlFragment(year) {
    if (window.location.hash.substring(1) !== year) {
        window.location.hash = year;
    }
}

// Funktion, um das Jahr aus der URL zu lesen
function getYearFromUrl() {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : null;
}

// Funktion zum Entfernen aller GeoJSON-Layer
function clearGeoJsonLayers() {
    geoJsonLayers.forEach(layer => map.removeLayer(layer));
    geoJsonLayers.length = 0;
}

// Funktion zum Laden von GeoJSON basierend auf einem Jahr
function loadGeoJsonByYear(year) {
    const url = `https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/main/data/editions/geojson/${year}.geojson`;

    clearGeoJsonLayers();

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GeoJSON für ${year} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            const newLayer = L.geoJSON(data, {
                pointToLayer: createCircleMarker, // Verwende die ausgelagerte Funktion für Marker
                 if (feature.properties) {
                      const popupContent = createPopupContent(feature); // Deine Pop-up-Funktion
                      layer.bindPopup(popupContent, { maxWidth: 300 });
                      
                      // Popup beim Mouseover öffnen
                      layer.on('mouseover', function(e) {
                        this.openPopup();
                      });
                      // Popup beim Mouseout schließen
                      layer.on('mouseout', function(e) {
                        this.closePopup();
                      });
                  }
            }).addTo(map);

            geoJsonLayers.push(newLayer);

            if (newLayer.getLayers().length > 0) {
                map.fitBounds(newLayer.getBounds());
            } else {
                console.warn('Keine gültigen Features gefunden.');
            }

            // Maximalen Wert für die Wichtigkeit bestimmen
        const maxImportance = Math.max(
            ...data.features.map(feature => feature.properties.importance || 0)
        );

        // Legende erstellen
        createLegend(maxImportance);
        })

        

        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            clearGeoJsonLayers();
        });
}

// Neue Funktion: Laden des Linien-Layers für den ausgewählten Monat
function loadLineGeoJsonByYear(year) {
    const url = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/l_years.geojson";
    
    // Entferne vorhandenen Linien-Layer
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
        lineLayer = null;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Line GeoJSON für ${year} nicht gefunden.`);
            }
            return response.json();
        })
        .then(data => {
            // Verwende einen typunabhängigen Vergleich
            const filteredFeatures = data.features.filter(feature =>
                feature.properties && String(feature.properties.year) === String(year)
            );
            console.log("Gefilterte Linien-Features für Jahr", year, filteredFeatures);
            
            // Erstelle den Linien-Layer
            lineLayer = L.geoJSON(filteredFeatures, {
                style: {
                   color: '#FF5A64',
                    weight: 2
                },
                onEachFeature: function(feature, layer) {
                    if (feature.properties) {
                        const popupContent = `Jahr: ${feature.properties.year}`;
                        layer.bindPopup(popupContent);
                    }
                }
            });
            
            const lineToggle = document.getElementById('lineToggle');
            // Wenn Du möchtest, dass die Linie standardmäßig sichtbar ist, füge sie immer hinzu:
            // lineLayer.addTo(map);
            // lineLayer.bringToBack();
            // Alternativ: Zeige den Layer nur, wenn das Kontrollkästchen aktiviert ist
            if (lineToggle && lineToggle.checked) {
                lineLayer.addTo(map);
                lineLayer.bringToBack();
            }
            
            setupLineToggleControl(lineLayer);
        })
        .catch(error => {
            console.error("Error loading line GeoJSON:", error);
            if (lineLayer && map.hasLayer(lineLayer)) {
                map.removeLayer(lineLayer);
            }
        });
}

// Funktion zum Ändern des Jahres und GeoJSON-Ladens
function setYearAndLoad(year) {
    const yearInput = document.getElementById('date-input');
    year = Math.max(1869, Math.min(1931, year)); // Begrenzung auf gültigen Bereich
    yearInput.value = year;
    updateUrlFragment(year);
    
    // Linien-Layer zurücksetzen: falls vorhanden, entfernen
    if (lineLayer && map.hasLayer(lineLayer)) {
        map.removeLayer(lineLayer);
        lineLayer = null;
    }
    
    // Toggle-Status zurücksetzen: Deaktiviere das Kontrollkästchen und aktualisiere das Icon
    const lineToggle = document.getElementById('lineToggle');
    if (lineToggle) {
        lineToggle.checked = false;
        const toggleIcon = document.getElementById('toggleIcon');
        if (toggleIcon) {
            toggleIcon.innerHTML = '<i class="bi bi-x-lg"></i>';
        }
    }
    
    // Lade die GeoJSON-Daten für Punkte und Linien neu
    loadGeoJsonByYear(year);
    loadLineGeoJsonByYear(year);
}

// Event-Listener und Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    // Karte initialisieren
    initializeMap();

    // Eventlistener für das Jahreseingabefeld
    document.getElementById('date-input').addEventListener('change', function () {
        const year = parseInt(this.value, 10);
        if (year) {
            setYearAndLoad(year);
        }
    });

    // Eventlistener für "vorheriges Jahr"
    document.getElementById('prev-year').addEventListener('click', () => {
        const currentYear = parseInt(document.getElementById('date-input').value, 10);
        setYearAndLoad(currentYear - 1);
    });

    // Eventlistener für "nächstes Jahr"
    document.getElementById('next-year').addEventListener('click', () => {
        const currentYear = parseInt(document.getElementById('date-input').value, 10);
        setYearAndLoad(currentYear + 1);
    });

   // Entferne diesen Teil
// document.getElementById('load-data').addEventListener('click', () => {
//     const year = parseInt(document.getElementById('date-input').value, 10);
//     if (year) {
//         setYearAndLoad(year);
//     }
// });


    // Überwache Änderungen am URL-Fragment
    window.addEventListener('hashchange', function () {
        const year = getYearFromUrl() || '1890'; // Standardjahr 1890
        setYearAndLoad(year);
    });

    // Initialisiere die Karte mit dem Jahr aus der URL oder einem Standardwert
    const initialYear = getYearFromUrl() || '1890'; // Standardjahr 1890
    setYearAndLoad(initialYear);
});