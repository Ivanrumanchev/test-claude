import type { WeddingConfig } from './types.js';
import { startCountdown, formatCountdownUnit } from './countdown.js';

// ─── Конфигурация свадьбы ────────────────────────────────────────────────────

const WEDDING_CONFIG: WeddingConfig = {
  bride: 'Яна',
  groom: 'Иван',
  date: new Date('2026-06-10T09:15:00'),
  venue: {
    name: 'Русская рыбалка в Комарово',
    address: 'пос. Комарово, Приморское шоссе, 452',
    mapUrl: 'https://maps.google.com/maps?q=Русская+рыбалка+Комарово',
  },
  schedule: [
    {
      time: '9:40',
      title: 'Регистрация брака',
      svg: `<img src="https://cdn-icons-png.flaticon.com/128/706/706455.png" alt="">`,
    },
    {
      time: '15:00',
      title: 'Сбор гостей',
      svg: `<img src="https://cdn-icons-png.flaticon.com/128/2776/2776074.png" alt="">`,
    },
    {
      time: '16:00',
      title: 'Церемония и банкет',
      svg: `<img src="https://cdn-icons-png.flaticon.com/128/3314/3314457.png" alt="">`,
    },
    {
      time: '22:00',
      title: 'Торт и танцы',
      svg: `<img src="https://cdn-icons-png.flaticon.com/128/4214/4214366.png" alt="">`,
    },
    {
      time: '23:00',
      title: 'Завершение банкета, трансфер до метро',
      svg: `<img src="https://cdn-icons-png.flaticon.com/128/4274/4274245.png" alt="">`,
    },
  ],
  rsvpEmail: 'our.wedding@example.com',
  hashtag: '#ИванИЯна2026',
} as const;

// ─── Обратный отсчёт ─────────────────────────────────────────────────────────

function initCountdown(): void {
  const elements = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
  } as const;

  const allPresent = Object.values(elements).every((el) => el !== null);
  if (!allPresent) return;

  startCountdown(WEDDING_CONFIG.date, ({ days, hours, minutes, seconds }) => {
    (elements.days as HTMLElement).textContent = formatCountdownUnit(days);
    (elements.hours as HTMLElement).textContent = formatCountdownUnit(hours);
    (elements.minutes as HTMLElement).textContent = formatCountdownUnit(minutes);
    (elements.seconds as HTMLElement).textContent = formatCountdownUnit(seconds);
  });
}

// ─── Расписание ───────────────────────────────────────────────────────────────

function renderSchedule(): void {
  const container = document.getElementById('schedule-list');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  WEDDING_CONFIG.schedule.forEach(({ time, svg }) => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-icon">${svg}</div>
      <div class="timeline-spine">
        <div class="timeline-dot"></div>
      </div>
      <div class="timeline-content">
        <span class="timeline-time">${time}</span>
      </div>
    `;
    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}

// ─── Календарь Save the Date ──────────────────────────────────────────────────

function renderSaveDateCalendar(): void {
  const grid = document.getElementById('calendar-grid');
  const monthLabel = document.getElementById('save-date-month');
  if (!grid || !monthLabel) return;

  const date = WEDDING_CONFIG.date;
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const highlightDay = date.getDate();

  // Month label in Russian
  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',
  ];
  monthLabel.textContent = '';

  // Weekday headers (Mon-first)
  const weekdays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  const fragment = document.createDocumentFragment();

  weekdays.forEach((day) => {
    const cell = document.createElement('div');
    cell.className = 'calendar-weekday';
    cell.textContent = day;
    fragment.appendChild(cell);
  });

  // First day of the month: getDay() returns 0=Sun..6=Sat, convert to Mon=0..Sun=6
  const firstDate = new Date(year, month, 1);
  const firstDow = (firstDate.getDay() + 6) % 7; // Mon=0, Sun=6

  // Empty cells before first day
  for (let i = 0; i < firstDow; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day calendar-day--empty';
    empty.setAttribute('aria-hidden', 'true');
    empty.textContent = '';
    fragment.appendChild(empty);
  }

  // Day cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');

    if (d === highlightDay) {
      cell.className = 'calendar-day calendar-day--highlighted';
      const heartPath = 'M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z';
      cell.innerHTML = `
        ${d}
        <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="rgba(255,255,255,0.9)" stroke-width="3" fill="rgba(255,255,255,0.12)"/>
        </svg>
        <svg class="calendar-heart-ripple calendar-heart-ripple--1" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="rgba(255,255,255,0.7)" stroke-width="2" fill="none"/>
        </svg>
        <svg class="calendar-heart-ripple calendar-heart-ripple--2" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="${heartPath}" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none"/>
        </svg>
      `;
    } else {
      cell.className = 'calendar-day';
      cell.textContent = String(d);
    }

    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
}


// ─── Плавная прокрутка ────────────────────────────────────────────────────────

function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href') ?? '');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Анимации при прокрутке ───────────────────────────────────────────────────

function initScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.05 },
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}

// ─── Инициализация ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Вставляем данные из конфига
  const groomEl = document.querySelectorAll('[data-groom]');
  const brideEl = document.querySelectorAll('[data-bride]');
  const venueEl = document.querySelectorAll('[data-venue]');
  const hashtagEl = document.querySelectorAll('[data-hashtag]');

  groomEl.forEach((el) => (el.textContent = WEDDING_CONFIG.groom));
  brideEl.forEach((el) => (el.textContent = WEDDING_CONFIG.bride));
  venueEl.forEach((el) => (el.textContent = WEDDING_CONFIG.venue.name));
  hashtagEl.forEach((el) => (el.textContent = WEDDING_CONFIG.hashtag));

  const mapLink = document.getElementById('venue-map-link') as HTMLAnchorElement | null;
  if (mapLink) mapLink.href = WEDDING_CONFIG.venue.mapUrl;

  const addressEl = document.getElementById('venue-address');
  if (addressEl) addressEl.textContent = WEDDING_CONFIG.venue.address;

  // Запускаем модули
  initCountdown();
  renderSchedule();
  renderSaveDateCalendar();
  initSmoothScroll();
  initScrollAnimations();

});
