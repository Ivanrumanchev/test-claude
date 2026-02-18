interface GalleryState {
  images: HTMLElement[];
  currentIndex: number;
}

export function initGallery(): void {
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox') as HTMLElement | null;
  const lightboxImg = document.querySelector<HTMLImageElement>('.lightbox-img');
  const closeBtn = document.querySelector<HTMLButtonElement>('.lightbox-close');
  const prevBtn = document.querySelector<HTMLButtonElement>('.lightbox-prev');
  const nextBtn = document.querySelector<HTMLButtonElement>('.lightbox-next');

  if (!grid || !lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn) return;

  const state: GalleryState = {
    images: Array.from(grid.querySelectorAll<HTMLElement>('.gallery-item')),
    currentIndex: 0,
  };

  function openLightbox(index: number): void {
    state.currentIndex = index;
    const item = state.images[index];
    const src = item.getAttribute('data-full') ?? (item.querySelector('img')?.src ?? '');
    lightboxImg!.src = src;
    lightbox!.classList.add('lightbox--visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox(): void {
    lightbox!.classList.remove('lightbox--visible');
    document.body.style.overflow = '';
    lightboxImg!.src = '';
  }

  function showPrev(): void {
    openLightbox((state.currentIndex - 1 + state.images.length) % state.images.length);
  }

  function showNext(): void {
    openLightbox((state.currentIndex + 1) % state.images.length);
  }

  const onKeydown = (e: KeyboardEvent): void => {
    if (!lightbox!.classList.contains('lightbox--visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  };

  state.images.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);

  document.addEventListener('keydown', onKeydown);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });
}
