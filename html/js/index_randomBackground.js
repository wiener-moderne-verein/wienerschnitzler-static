document.addEventListener('DOMContentLoaded', () => {
    // Zufallszahl zwischen 1 und 17 generieren
    const minNumber = 1;
    const maxNumber = 17;
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    // Pfad zum zufälligen Hintergrundbild
    const backgroundPath = `./images/wienmuseum/AnsichtenVonWien${String(randomNumber).padStart(5, '0')}.jpg`;

    // Hintergrundbild-Element setzen
    const backgroundImageElement = document.getElementById('background-image');
    if (backgroundImageElement) {
        backgroundImageElement.src = backgroundPath;
        backgroundImageElement.style.width = '100%'; // Bildbreite auf 100% setzen
        backgroundImageElement.style.height = 'auto'; // Höhe proportional anpassen
    }
});
