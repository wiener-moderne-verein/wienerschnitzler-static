const cal = new CalHeatmap();
const DECADE_LENGTH = 10;
const formatDate = date => window.dayjs(date).format('YYYY-MM-DD');

let events = [];
let eventByDate = {};
let availableDecades = [];
let selectedStartYear = 1891;
let minYear, maxYear;

function drawDecade(startYear) {
  const start = new Date(`${startYear}-01-01`);
  const end = new Date(`${startYear + DECADE_LENGTH - 1}-12-31`);
  selectedStartYear = startYear;

  cal.paint(
    {
      itemSelector: '#cal-heatmap',
      verticalOrientation: true,
      date: { start },
      range: 10,
      domain: {
        type: 'year',
        gutter: 10,
      },
      subDomain: {
        type: 'day',
        width: 16,
        height: 14,
        radius: 2,
      },
      data: {
        source: events,
        type: 'json',
        x: 'date',
        y: d => d.weight,
        groupY: 'sum',
        customData: true,
      },
      scale: {
        color: {
            domain: [0, 15],
            type: 'linear',
           scheme: 'YlGnBu'
          }
      },
    },
    [

    [
      Tooltip,
      {
        text: (date, value, dayjsDate) => {
          const key = dayjsDate.format('YYYY-MM-DD');
          const title = eventByDate[key] || '';
          return title;
        },
      } ],

      ]
  );

  cal.on('click', (event, timestamp, value) => {
    const formatted = window.dayjs(timestamp).format('YYYY-MM-DD');
    window.location.href = `https://wienerschnitzler.org/tag.html#${formatted}`;
  });

  updateActiveButton(startYear);
}

function drawComplete() {
  const start = new Date(`${minYear}-01-01`);
  const yearRange = maxYear - minYear + 1;

  cal.paint(
    {
      itemSelector: '#cal-heatmap',
      verticalOrientation: true,
      date: { start },
      range: yearRange,
      domain: {
        type: 'year',
        gutter: 5,
      },
      subDomain: {
        type: 'day',
        width: 8,
        height: 7,
        radius: 1,
      },
      data: {
        source: events,
        type: 'json',
        x: 'date',
        y: d => d.weight,
        groupY: 'sum',
        customData: true,
      },
      scale: {
        color: {
            domain: [0, 15],
            type: 'linear',
           scheme: 'YlGnBu'
          }
      },
    },
    [
    [
      Tooltip,
      {
        text: (date, value, dayjsDate) => {
          const key = dayjsDate.format('YYYY-MM-DD');
          const title = eventByDate[key] || '';
          return title;
        },
      } ],
      ]
  );

  cal.on('click', (event, timestamp, value) => {
    const formatted = window.dayjs(timestamp).format('YYYY-MM-DD');
    window.location.href = `https://wienerschnitzler.org/tag.html#${formatted}`;
  });

  updateActiveButton('complete');
}

function updateActiveButton(identifier) {
  document.querySelectorAll('#decade-buttons button').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.replace('btn-primary', 'btn-outline-primary');
  });

  if (identifier === 'complete') {
    const completeBtn = document.querySelector('#decade-buttons button[data-complete]');
    if (completeBtn) {
      completeBtn.classList.add('active');
      completeBtn.classList.replace('btn-outline-primary', 'btn-primary');
    }
  } else {
    const activeBtn = document.querySelector(`#decade-buttons button[data-start="${identifier}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.classList.replace('btn-outline-primary', 'btn-primary');
    }
  }
}

function generateDecadeButtons(min, max) {
  const container = document.getElementById('decade-buttons');
  container.innerHTML = '';

  // Button für Gesamtübersicht
  const completeBtn = document.createElement('button');
  completeBtn.className = 'btn btn-outline-primary btn-sm';
  completeBtn.style.margin = '10px';
  completeBtn.textContent = 'Gesamtübersicht';
  completeBtn.dataset.complete = 'true';
  completeBtn.addEventListener('click', () => drawComplete());
  container.appendChild(completeBtn);

  let start = Math.floor(min / 10) * 10 + 1;
  let end = Math.floor(max / 10) * 10 + 1;

  for (let y = start; y <= end; y += DECADE_LENGTH) {
    const label = `${y}–${y + DECADE_LENGTH - 1}`;
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary btn-sm';
    btn.style.margin = '10px';
    btn.textContent = label;
    btn.dataset.start = y;
    btn.addEventListener('click', () => drawDecade(y));
    container.appendChild(btn);
    availableDecades.push(y);
  }
}

// Initialisieren
fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/json/uebersicht.json')
  .then(res => res.json())
  .then(data => {
    events = data;
    eventByDate = {};
    events.forEach(e => {
      const key = dayjs(e.date).format('YYYY-MM-DD');
      eventByDate[key] = e.title;
    });
    const years = events.map(e => new Date(e.date).getFullYear());
    minYear = Math.min(...years);
    maxYear = Math.max(...years);

    generateDecadeButtons(minYear, maxYear);

    drawDecade(1891);
  });
