import { DATA_BASE_URL } from './config.js';

const lang = document.documentElement.lang || 'de';

const LABELS = {
  de: {
    daysVienna: 'Tage mit Aufenthalt in Wien',
    daysElsewhere: 'Tage ohne Wien-Aufenthalt',
    days: 'Aufenthaltstage',
    places: 'Orte',
    other: 'Sonstige',
    daysSuffix: ' Aufenthaltstage',
    placesSuffix: ' Orte',
  },
  en: {
    daysVienna: 'Days with a stay in Vienna',
    daysElsewhere: 'Days without a stay in Vienna',
    days: 'Documented days',
    places: 'Places',
    other: 'Other',
    daysSuffix: ' documented days',
    placesSuffix: ' places',
  },
}[lang] || {};

// Ortstypen-Übersetzungen aus dem von js_translations.xsl eingebetteten JSON
let typeTranslations = {};
const translationsEl = document.getElementById('translations-data');
if (translationsEl) {
  try {
    typeTranslations = JSON.parse(translationsEl.textContent).place_types || {};
  } catch (e) {
    typeTranslations = {};
  }
}
const translateType = name => (lang === 'en' && typeTranslations[name]) || name;

// Wien (grob als Bounding-Box der heutigen Stadtgrenzen)
const VIENNA = { latMin: 48.10, latMax: 48.34, lonMin: 16.17, lonMax: 16.59 };
const inVienna = f => {
  const [lon, lat] = f.geometry?.coordinates || [];
  return lat >= VIENNA.latMin && lat <= VIENNA.latMax && lon >= VIENNA.lonMin && lon <= VIENNA.lonMax;
};

// GeoNames-Featureklasse aus dem abbr-Feld, z. B. "Wohngebäude (K.WHS)" -> "K", "P.PPL" -> "P"
const featureClass = f => {
  const abbr = f.properties?.abbr || '';
  const m = abbr.match(/(?:^|[ (])([A-Z])\.[A-Z0-9]+/);
  return m ? m[1] : '';
};
// P = besiedelte Orte, A = Verwaltungsgebiete, T/H/N/L = Naturräume
const SETTLEMENT_CLASSES = ['P', 'A'];
const NATURE_CLASSES = ['T', 'H', 'N', 'L'];

const PALETTE = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b',
  '#e377c2', '#7f7f7f', '#bcbd22', '#17becf', '#aec7e8', '#ffbb78',
  '#98df8a',
];

let features = [];
let placesChart = null;
let typesChart = null;

fetch(`${DATA_BASE_URL}/geojson/wienerschnitzler_distinctPlaces.geojson`)
  .then(res => res.json())
  .then(data => {
    features = data.features || [];
    document.getElementById('stats-loading').style.display = 'none';
    document.getElementById('stats-content').style.display = '';
    drawYearsChart();
    drawPlacesChart('detail');
    drawTypesChart('days');
    setupToggle('places-mode-detail', 'places-mode-settlement', mode => drawPlacesChart(mode), ['detail', 'settlement']);
    setupToggle('types-mode-days', 'types-mode-places', mode => drawTypesChart(mode), ['days', 'places']);
  })
  .catch(err => {
    console.error('Statistik-Daten konnten nicht geladen werden:', err);
    document.getElementById('stats-loading').innerHTML =
      lang === 'en' ? 'Data could not be loaded.' : 'Die Daten konnten nicht geladen werden.';
  });

function setupToggle(idA, idB, callback, modes) {
  const btnA = document.getElementById(idA);
  const btnB = document.getElementById(idB);
  const activate = (active, inactive, mode) => {
    active.classList.replace('btn-outline-primary', 'btn-primary');
    inactive.classList.replace('btn-primary', 'btn-outline-primary');
    callback(mode);
  };
  btnA.addEventListener('click', () => activate(btnA, btnB, modes[0]));
  btnB.addEventListener('click', () => activate(btnB, btnA, modes[1]));
}

// 1. Aufenthaltstage pro Jahr, aufgeteilt in Wien / außerhalb
function drawYearsChart() {
  const allDays = new Map(); // Jahr -> Set von Tagen
  const viennaDays = new Map();
  features.forEach(f => {
    const vienna = inVienna(f);
    (f.properties?.timestamp || []).forEach(ts => {
      const year = ts.slice(0, 4);
      if (!allDays.has(year)) allDays.set(year, new Set());
      allDays.get(year).add(ts);
      if (vienna) {
        if (!viennaDays.has(year)) viennaDays.set(year, new Set());
        viennaDays.get(year).add(ts);
      }
    });
  });

  const years = [...allDays.keys()].sort();
  const minYear = parseInt(years[0], 10);
  const maxYear = parseInt(years[years.length - 1], 10);
  const labels = [];
  for (let y = minYear; y <= maxYear; y++) labels.push(String(y));

  const viennaData = labels.map(y => viennaDays.get(y)?.size || 0);
  const elsewhereData = labels.map(y => (allDays.get(y)?.size || 0) - (viennaDays.get(y)?.size || 0));

  new Chart(document.getElementById('chart-years'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: LABELS.daysVienna, data: viennaData, backgroundColor: '#1f77b4' },
        { label: LABELS.daysElsewhere, data: elsewhereData, backgroundColor: '#ff7f0e' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { maxRotation: 90, autoSkip: true } },
        y: { stacked: true, title: { display: true, text: LABELS.days } },
      },
      plugins: { tooltip: { mode: 'index' } },
      onClick: (event, elements, chart) => {
        if (!elements.length) return;
        const year = chart.data.labels[elements[0].index];
        const target = lang === 'en' ? 'jahr-en.html' : 'jahr.html';
        window.location.href = `${target}#${year}`;
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      },
    },
  });
}

// 2. Meistbesuchte Orte (Top 20), wahlweise Gebäude/Lokale oder Städte/Gemeinden
function drawPlacesChart(mode) {
  const filtered = features.filter(f => {
    const cls = featureClass(f);
    // Wien selbst und seine Bezirke würden die Skala sprengen, daher
    // im Ortschaften-Modus nur Ziele außerhalb Wiens
    if (mode === 'settlement') return SETTLEMENT_CLASSES.includes(cls) && !inVienna(f);
    return !SETTLEMENT_CLASSES.includes(cls) && !NATURE_CLASSES.includes(cls);
  });
  const top = filtered
    .sort((a, b) => (b.properties.importance || 0) - (a.properties.importance || 0))
    .slice(0, 20);

  const config = {
    type: 'bar',
    data: {
      labels: top.map(f => f.properties.title),
      datasets: [{
        label: LABELS.days,
        data: top.map(f => f.properties.importance || 0),
        backgroundColor: '#1f77b4',
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { title: { display: true, text: LABELS.days } } },
      plugins: { legend: { display: false } },
      onClick: (event, elements) => {
        if (!elements.length) return;
        const id = top[elements[0].index].properties.id;
        if (id) window.location.href = `${id}.html`;
      },
      onHover: (event, elements) => {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      },
    },
  };

  if (placesChart) {
    placesChart.destroy();
  }
  placesChart = new Chart(document.getElementById('chart-places'), config);
}

// 3. Verteilung nach Ortstypen, wahlweise nach Aufenthaltstagen oder Anzahl der Orte
function drawTypesChart(mode) {
  const counts = new Map();
  features.forEach(f => {
    const type = f.properties?.type;
    if (!type) return;
    const value = mode === 'days' ? (f.properties.importance || 0) : 1;
    counts.set(type, (counts.get(type) || 0) + value);
  });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const TOP_N = 12;
  const top = sorted.slice(0, TOP_N);
  const restSum = sorted.slice(TOP_N).reduce((sum, [, v]) => sum + v, 0);

  const labels = top.map(([t]) => translateType(t));
  const values = top.map(([, v]) => v);
  if (restSum > 0) {
    labels.push(LABELS.other);
    values.push(restSum);
  }

  const suffix = mode === 'days' ? LABELS.daysSuffix : LABELS.placesSuffix;
  const config = {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: PALETTE.slice(0, labels.length) }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: ctx => {
              const total = values.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return `${ctx.label}: ${ctx.parsed.toLocaleString(lang)}${suffix} (${pct} %)`;
            },
          },
        },
      },
    },
  };

  if (typesChart) {
    typesChart.destroy();
  }
  typesChart = new Chart(document.getElementById('chart-types'), config);
}
