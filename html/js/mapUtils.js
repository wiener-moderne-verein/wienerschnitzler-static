// Das standardisiert die Punkte und Popups auf den Leaflet-Karten

const visibilityPalette = [
    '#4682B4', // Stahlblau
    '#5F9EA0', // Cadet Blue
    '#2E8B57', // Sea Green
    '#3CB371', // Medium Sea Green
    '#9ACD32', // Gelbgrün
    '#ADFF2F', // Green Yellow
    '#FFD700', // Gold
    '#FFA500', // Orange
    '#FF4500', // Orangerot
    '#FF0000', // Rot
    '#E60000', // Dunkleres Rot
    '#CC0000', // Noch dunkleres Rot
    '#B30000', // Tieferes Rot
    '#990000', // Sehr dunkles Rot
    '#800000', // Maroon
    '#4D0000', // Fast Schwarzrot
    '#330000' // Sehr dunkles Braunrot
];

// Schwellenwerte für die Farbauswahl
const thresholds = [1, 2, 5, 10, 15, 25, 35, 50, 75, 100, 150, 250, 400, 600, 1000, 1500, 2500, 4000, 5000];

// Funktion zur Auswahl der Farbe basierend auf der Wichtigkeit (1 bis 5000)
function getColorByImportance(importance) {
    for (let i = 0; i < thresholds.length; i++) {
        if (importance <= thresholds[i]) {
            return visibilityPalette[i];
        }
    }
    // Fallback: die dunkelste Farbe für sehr hohe Werte
    return visibilityPalette[visibilityPalette.length - 1];
}

function createCircleMarker(feature, latlng) {
    const importance = feature.properties.importance || 0;
    const color = getColorByImportance(importance);
    const radius = 5 + (importance / 5000) * 10;

    return L.circleMarker(latlng, {
        radius: Math.min(13, Math.max(3, radius)), // Radius von 3 bis 13
        color: '#FF0000', // Immer ein roter Rahmen
        fillColor: color, // Füllfarbe basierend auf der Wichtigkeit
        fillOpacity: 1.0, // Immer vollflächig
        weight: 2 // Randbreite
    });
}

function createPopupContent(feature) {
    const title = feature.properties.title || 'Kein Titel';
    const id = feature.properties.id || '#';
    const titleLink = `<a href="${id}.html" target="_blank">${title}</a>`;
    const dates = feature.properties.timestamp || [];
    let links = dates.slice(0, 10).map(date =>
        `<a href="https://schnitzler-chronik.acdh.oeaw.ac.at/${date}.html" target="_blank">${date}</a>`
    ).join('<br>');

    if (dates.length > 10) {
        const remainingCount = dates.length - 10;
        links += `<p style="text-align: right">… <a href="${id}.html">${remainingCount} weitere</a></p>`;
    }

    const wikipediaLink = feature.properties.wikipedia ? `<a href="${feature.properties.wikipedia}" target="_blank">Wikipedia</a>` : '';

    // Füge das <br> nur hinzu, wenn der wikipediaLink einen Textinhalt hat
    const wikipediaContent = wikipediaLink ? `<br>${wikipediaLink}` : '';

    return `<b>${titleLink}</b><br>${links}${wikipediaContent}`;
}
