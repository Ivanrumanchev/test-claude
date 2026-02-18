# Дизайн: Визуальные улучшения свадебного лендинга

**Дата:** 2026-02-18
**Статус:** Утверждён

---

## Цель

Улучшить визуальную составляющую сайта без изменения архитектуры: добавить фотогалерею, обновить шрифт для имён, улучшить мобильную навигацию и подтянуть типографику.

---

## Изменения

### 1. Шрифт Pinyon Script для имён

**Что:** Добавить Google Font `Pinyon Script` — каллиграфический скрипт с "загогулинками".

**Где применяется:**
- `.hero-names` — имена `Иван & Яна` в hero-секции
- `.footer-names` — имена в футере

**Как:** Подключить через `<link>` в `<head>`, добавить новую CSS-переменную `--font-script: 'Pinyon Script', cursive` и применить к двум элементам.

Раздел headings (`.section-title`, `.story-year`) остаётся на Cormorant Garamond.

---

### 2. Masonry-галерея с JS-lightbox

**Что:** Новая секция `#gallery` между «Историей» и «Программой».

**Структура HTML:**
```html
<section class="gallery-section" id="gallery">
  <h2>Наши моменты</h2>
  <div class="gallery-grid">
    <img src="..." data-full="..." />
    ...9-12 фото...
  </div>
  <div id="lightbox" class="lightbox">
    <button class="lightbox-close">✕</button>
    <button class="lightbox-prev">‹</button>
    <img class="lightbox-img" />
    <button class="lightbox-next">›</button>
  </div>
</section>
```

**CSS (masonry):**
```css
.gallery-grid {
  columns: 3;
  column-gap: 1rem;
}
@media (max-width: 640px) {
  .gallery-grid { columns: 1; }
}
```

**JS:**
- Клик по фото → показать lightbox с этим фото
- Кнопки ‹ › → навигация между фото
- Клик на крестик или клавиша Escape → закрыть
- Свайп на мобиле (touchstart/touchend) → навигация

**Плейсхолдеры:** 9 изображений-заглушек с нейтральными цветами в палитре сайта (CSS-generated, без внешних картинок).

**TypeScript:** логика lightbox выносится в `src/gallery.ts`, импортируется в `main.ts`.

---

### 3. Мобильная навигация — гамбургер

**Что:** На экранах до 640px вместо горизонтального ряда ссылок — кнопка `☰`, которая открывает вертикальное меню.

**HTML:** Добавить `<button class="nav-toggle">` в `.nav`.

**CSS:**
```css
@media (max-width: 640px) {
  .nav { justify-content: space-between; }
  .nav-links { display: none; flex-direction: column; ... }
  .nav-links.is-open { display: flex; }
  .nav-toggle { display: block; }
}
```

**JS:** `nav-toggle.addEventListener('click', () => navLinks.classList.toggle('is-open'))`
Клик по ссылке → закрыть меню.

---

### 4. Типографика и макет

**Конкретные правки:**

| Что | Сейчас | После |
|-----|--------|-------|
| Отступы секций на мобиле | `clamp(4rem, 10vw, 8rem)` | Добавить `@media (max-width: 640px) { --section-pad: 3rem }` |
| Кернинг hero-names | нет | `letter-spacing: -0.02em` |
| Межстрочный у story-text | `1.8` | `2` |
| Venue card на мобиле | padding `2rem 1.5rem` | без изменений |

---

## Файлы, которые изменятся

| Файл | Что меняется |
|------|-------------|
| `index.html` | Подключение Pinyon Script, секция галереи, кнопка гамбургера, ссылка в nav на `#gallery` |
| `src/main.ts` | Инициализация мобильного nav, импорт gallery |
| `src/gallery.ts` | Новый файл: логика lightbox |
| `src/types.ts` | Опционально: тип `GalleryItem` |
| `index.html` `<style>` | CSS для галереи, lightbox, гамбургера, типографики |

---

## Что не меняется

- Архитектура (Vanilla TS, без фреймворков)
- Существующие секции (countdown, story, schedule, venue, rsvp)
- Цветовая палитра
- Деплой на GitHub Pages
