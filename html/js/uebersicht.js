const cal = new CalHeatmap();
const DECADE_LENGTH = 9;
const formatDate = date => window.dayjs(date).format('YYYY-MM-DD');

let events = [];
let eventByDate = {};
let availableDecades = [];
let selectedStartYear = 1891;

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
        customData: true, // 👈 das ist entscheidend!
      },
      scale: {
        color: {
            domain: [0, 15],
            type: 'cyclical',
            range: ['#f7f7f7', '#d73027'],
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

function updateActiveButton(startYear) {
  document.querySelectorAll('#decade-buttons button').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.start) === startYear);
  });
}

function generateDecadeButtons(minYear, maxYear) {
  const container = document.getElementById('decade-buttons');
  container.innerHTML = '';

  let start = Math.floor(minYear / 10) * 10 + 1;
  let end = Math.floor(maxYear / 10) * 10 + 1;

  for (let y = start; y <= end; y += DECADE_LENGTH) {
    const label = `${y}–${y + DECADE_LENGTH - 1}`;
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary btn-sm';
    btn.styleName = 'margin: 10px;';
    btn.textContent = label;
    btn.dataset.start = y;
    btn.addEventListener('click', () => drawDecade(y));
    container.appendChild(btn);
    availableDecades.push(y);
  }
}

// Initialisieren
fetch('https://raw.githubusercontent.com/wiener-moderne-verein/wienerschnitzler-data/refs/heads/main/data/editions/uebersicht.json')
  .then(res => res.json())
  .then(data => {
    events = data;
    eventByDate = {};
    events.forEach(e => {
      const key = dayjs(e.date).format('YYYY-MM-DD');
      eventByDate[key] = e.title;
    });
    const years = events.map(e => new Date(e.date).getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    generateDecadeButtons(minYear, maxYear);

    drawDecade(1891);
  });
