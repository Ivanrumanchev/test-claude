import type { WeddingConfig, RSVPFormData, RSVPStatus } from './types.js';
import { startCountdown, formatCountdownUnit } from './countdown.js';
import { initGallery } from './gallery.js';

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
    { time: '9:15',  title: 'Церемония бракосочетания', icon: '💍' },
    { time: '10:15', title: 'Фуршет и фотосессия', icon: '🥂' },
    { time: '11:45', title: 'Торжественный банкет', icon: '🍽️' },
    { time: '13:15', title: 'Первый танец', icon: '💃' },
    { time: '13:45', title: 'Торт и поздравления', icon: '🎂' },
    { time: '16:15', title: 'Завершение вечера', icon: '✨' },
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
  monthLabel.textContent = `${monthNames[month]} ${year}`;

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
    empty.textContent = '·';
    fragment.appendChild(empty);
  }

  // Day cells
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');

    if (d === highlightDay) {
      cell.className = 'calendar-day calendar-day--highlighted';
      cell.innerHTML = `
        ${d}
        <svg class="calendar-heart" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M50 30 C50 15 37 5 25 10 C13 15 5 27 5 38 C5 55 25 70 50 82 C75 70 95 55 95 38 C95 27 87 15 75 10 C63 5 50 15 50 30 Z"
                stroke="var(--gold)" stroke-width="3" fill="rgba(201,169,110,0.08)"/>
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

// ─── RSVP форма ───────────────────────────────────────────────────────────────

function handleRSVP(event: Event): void {
  event.preventDefault();

  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const data: RSVPFormData = {
    name: String(formData.get('name') ?? '').trim(),
    guestsCount: Number(formData.get('guests') ?? 1),
    status: (formData.get('status') as RSVPStatus) ?? 'pending',
    message: String(formData.get('message') ?? '').trim() || undefined,
  };

  if (!data.name) {
    showNotification('Пожалуйста, введите ваше имя', 'error');
    return;
  }

  // В реальном проекте здесь был бы API-запрос
  console.log('RSVP отправлен:', data);
  showNotification(
    data.status === 'attending'
      ? `Ура! Ждём вас, ${data.name}! 🎉`
      : `Спасибо за ответ, ${data.name}. Жаль, что не сможете присоединиться.`,
    'success',
  );

  form.reset();
}

function showNotification(message: string, type: 'success' | 'error'): void {
  const existing = document.getElementById('notification');
  existing?.remove();

  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('notification--visible');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('notification--visible');
    setTimeout(() => notification.remove(), 400);
  }, 4000);
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
    { threshold: 0.15 },
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
}

// ─── Мобильная навигация ──────────────────────────────────────────────────────

function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const links = document.querySelector<HTMLDivElement>('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    const icon = toggle.querySelector('.nav-toggle-icon');
    if (icon) icon.textContent = isOpen ? '✕' : '☰';
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
      const icon = toggle.querySelector('.nav-toggle-icon');
      if (icon) icon.textContent = '☰';
    });
  });
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
  initMobileNav();
  initCountdown();
  renderSchedule();
  renderSaveDateCalendar();
  initGallery();
  initSmoothScroll();
  initScrollAnimations();

  const rsvpForm = document.getElementById('rsvp-form');
  rsvpForm?.addEventListener('submit', handleRSVP);
});
