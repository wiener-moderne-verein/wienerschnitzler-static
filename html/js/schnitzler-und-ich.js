import { initializeMapLarge , map } from './fuer-alle-karten.js';

const geojsonUrl = "https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/geojson/wienerschnitzler_distinctPlaces.geojson";

const resultElement = document.getElementById('result');
let geojsonData = null;

// Haversine-Formel zur Berechnung der Entfernung zwischen zwei Punkten
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Erdradius in Kilometern
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findNearest(lat, lon) {
    if (!geojsonData) {
        alert("GeoJSON-Daten sind noch nicht geladen.");
        return null;
    }

    let nearest = null;
    let minDistance = Infinity;

    geojsonData.features.forEach((feature) => {
        const [featureLon, featureLat] = feature.geometry.coordinates;
        const distance = haversineDistance(lat, lon, featureLat, featureLon);

        if (distance < minDistance) {
            minDistance = distance;
            nearest = {
                id: feature.properties.id, // Hier wird die ID aus den GeoJSON-Daten übernommen
                name: feature.properties.title || "Unbekannt",
                timestamps: feature.properties.timestamp || [],
                distance,
                lat: feature.geometry.coordinates[1],
                lon: feature.geometry.coordinates[0]
            };
        }
    });

    return nearest;
}

function displayNearestLocation(lat, lon) {
    const nearest = findNearest(lat, lon);
    if (nearest) {
        const timestamps = Array.isArray(nearest.timestamps)
            ? nearest.timestamps.join(", ")
            : nearest.timestamps;

        const link = nearest.id 
            ? `<a href="${nearest.id}.html" target="_blank">${nearest.name}</a>` 
            : nearest.name;

        displayResult(link, nearest.distance, timestamps);
        plotOnMap(lat, lon, nearest);
    } else {
        resultElement.textContent = "Kein Ort gefunden.";
    }
}

function displayResult(link, distance, timestamps) {
    const resultElement = document.getElementById('result');
    
    if (distance < 0.01) {
        resultElement.innerHTML = `Genau an diesem Ort – ${link} – war Schnitzler am ${formatDate(timestamps)}.`;
    } else {
        resultElement.innerHTML = `Nächster Ort: ${link}, Entfernung: ${distance.toFixed(2)} km.<br>
        Wann hielt Schnitzler sich hier auf: ${formatDate(timestamps) || "Keine Daten vorhanden"}`;
    }

    // Blende den Abfrage-Container aus (falls noch nicht geschehen)
    const queryControls = document.getElementById('queryControls');
    if (queryControls) {
        queryControls.style.display = 'none';
    }
    
    // Mache den "Neuen Ort abfragen"-Button sichtbar
    const newQueryContainer = document.getElementById('newQueryContainer');
if (newQueryContainer) {
    newQueryContainer.classList.remove('d-none');
    console.log('newQueryContainer eingeblendet'); // Debug-Ausgabe
} else {
    console.error('Element newQueryContainer nicht gefunden');
}

    // Update des Bluesky-Links (wie gehabt)
    const shareBlueskyLink = document.getElementById('shareBluesky');
    if (shareBlueskyLink) {
        const blueskyUrl = `https://bsky.app/intent/compose?text=Arthur%20Schnitzler%20stand%20mir%20schon%20ganz%20nah%2C%20er%20war%20nur%20${distance.toFixed(2)}%20km%20entfernt.%0A%0Ahttps%3A%2F%2Fwienerschnitzler.org%2Fschnitzler-und-ich.html`;
        shareBlueskyLink.href = blueskyUrl;
    }
}

function formatDate(isoDate) {
    if (!isoDate || typeof isoDate !== "string") {
        return "Ungültiges Datum";
    }

    const dates = isoDate.split(",").map(date => date.trim());
    return dates.map(date => {
        const dateParts = date.split("-");
        if (dateParts.length !== 3) {
            return "Ungültiges Datum";
        }

        const [year, month, day] = dateParts.map(part => parseInt(part, 10));
        return `${day}.${month}.${year}`;
    }).join(", ");
}

// GeoJSON laden
fetch(geojsonUrl)
    .then(response => response.json())
    .then(data => {
        geojsonData = data;
        console.log("GeoJSON-Daten erfolgreich geladen.");
    })
    .catch(error => {
        console.error("Fehler beim Laden der GeoJSON-Daten:", error);
        alert("Die GeoJSON-Daten konnten nicht geladen werden.");
    });

// Karte initialisieren und global speichern
initializeMapLarge();

// Funktionen, die 'map' nutzen, können es jetzt verwenden
function plotOnMap(lat, lon, nearest) {
    if (!map) {
        console.error("Map ist noch nicht initialisiert.");
        return;
    }

    map.eachLayer(layer => {
        if (!layer._url) { // Tile-Layer nicht entfernen
            map.removeLayer(layer);
        }
    });

    L.circleMarker([lat, lon], {
        color: '#AAAAFA',
        radius: 10,
        fillOpacity: 0.8
    })
    .addTo(map)
    .bindPopup('Ihr Standort')
    .openPopup();

    if (nearest) {
        L.circleMarker([nearest.lat, nearest.lon], {
            color: '#FF0000',
            radius: 10,
            fillOpacity: 0.8
        })
        .addTo(map)
        .bindPopup(`Nächster Ort: ${nearest.name}`);
    }

    if (lat !== undefined && nearest) {
        L.polyline(
            [
                [lat, lon],
                [nearest.lat, nearest.lon]
            ],
            { color: 'green', weight: 2 }
        ).addTo(map);
    }

    const bounds = L.latLngBounds(
        [lat, lon],
        [nearest ? nearest.lat : lat, nearest ? nearest.lon : lat]
    );
    map.fitBounds(bounds, { padding: [50, 50] });
}

// Event-Listener wie gehabt...
document.getElementById('getLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            displayNearestLocation(latitude, longitude);
        }, (error) => {
            alert("Geolocation konnte nicht abgerufen werden: " + error.message);
        });
    } else {
        alert('Geolocation wird von Ihrem Browser nicht unterstützt.');
    }
});

document.getElementById('locationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    displayNearestLocation(latitude, longitude);
});

function showQueryControls() {
    const queryControls = document.getElementById('queryControls');
    if (queryControls) {
        queryControls.style.display = 'block';
    }
    document.getElementById('result').innerHTML = 'Bitte Standort teilen auswählen oder Koordinaten eingeben. (Nein, wir interessieren uns nicht dafür, wo Sie sich herumtreiben.)';
}

document.getElementById('newQuery').addEventListener('click', showQueryControls);