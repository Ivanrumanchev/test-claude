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
      title: 'Регистрация брака во Дворце бракосочетания №2 (для желающих)',
      svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><circle cx="22" cy="30" r="13"/><circle cx="38" cy="30" r="13"/></svg>`,
    },
    {
      time: '15:00',
      title: 'Сбор гостей в "Русской рыбалке"',
      svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M30 8C19 8 11 17 11 27C11 40 30 54 30 54C30 54 49 40 49 27C49 17 41 8 30 8Z"/><circle cx="30" cy="27" r="7"/></svg>`,
    },
    {
      time: '16:00',
      title: 'Церемония бракосочетания и начало программы',
      svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M20 10L15 32H25Z"/><line x1="20" y1="32" x2="20" y2="50"/><line x1="14" y1="50" x2="26" y2="50"/><path d="M40 10L35 32H45Z"/><line x1="40" y1="32" x2="40" y2="50"/><line x1="34" y1="50" x2="46" y2="50"/></svg>`,
    },
    {
      time: '22:00',
      title: 'Торт и танцы',
      svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="30" y1="10" x2="30" y2="17"/><ellipse cx="30" cy="8" rx="2.5" ry="3.5"/><rect x="18" y="19" width="24" height="9" rx="2"/><rect x="13" y="28" width="34" height="9" rx="2"/><rect x="10" y="37" width="40" height="10" rx="2"/></svg>`,
    },
    {
      time: '23:00',
      title: 'Завершение вечера, трансфер до метро',
      svg: `<svg viewBox="0 0 60 60" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><rect x="7" y="15" width="46" height="26" rx="5"/><line x1="7" y1="27" x2="53" y2="27"/><rect x="11" y="18" width="11" height="8" rx="1"/><rect x="25" y="18" width="11" height="8" rx="1"/><circle cx="17" cy="44" r="5"/><circle cx="43" cy="44" r="5"/><line x1="22" y1="41" x2="38" y2="41"/></svg>`,
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

  WEDDING_CONFIG.schedule.forEach(({ time, title, icon }) => {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.innerHTML = `
      <span class="schedule-icon">${icon}</span>
      <span class="schedule-time">${time}</span>
      <span class="schedule-title">${title}</span>
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
