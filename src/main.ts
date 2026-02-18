import type { WeddingConfig, RSVPFormData, RSVPStatus } from './types.js';
import { startCountdown, formatCountdownUnit } from './countdown.js';

// ─── Конфигурация свадьбы ────────────────────────────────────────────────────

const WEDDING_CONFIG: WeddingConfig = {
  bride: 'Яна',
  groom: 'Иван',
  date: new Date('2026-06-10T09:15:00'),
  venue: {
    name: 'Усадьба «Белый сад»',
    address: 'г. Москва, Рублёвское шоссе, 15',
    mapUrl: 'https://maps.google.com',
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
  initSmoothScroll();
  initScrollAnimations();

  const rsvpForm = document.getElementById('rsvp-form');
  rsvpForm?.addEventListener('submit', handleRSVP);
});
