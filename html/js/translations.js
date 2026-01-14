// translations.js - Load translations from the injected JSON script tag

let translations = {};

// Load translations on module load
try {
    const translationsScript = document.getElementById('translations-data');
    if (translationsScript) {
        translations = JSON.parse(translationsScript.textContent);
    }
} catch (error) {
    console.warn('Failed to load translations:', error);
}

/**
 * Get a translated string by key path
 * @param {string} key - Dot-separated key path (e.g., 'filter.all')
 * @returns {string} - Translated string or the key itself if not found
 */
export function t(key) {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    return value;
}

export default { t };
