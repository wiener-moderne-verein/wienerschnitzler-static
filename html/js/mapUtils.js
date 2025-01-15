// Das standardisiert die Punkte und Popups auf den Leaflet-Karten

function createCircleMarker(feature, latlng) {
    const importance = feature.properties.importance || 0;
    let color;
    const radius = 3 + (importance / 5000) * 10;

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
