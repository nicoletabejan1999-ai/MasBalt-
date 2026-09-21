document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header goes solid after scrolling past the hero
  const bar = document.getElementById('bar');
  const onScroll = () => bar.classList.toggle('solid', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Hero video — a single-shot clip on tablet/desktop, a fully produced
  // vertical clip (title/stats/services already baked in as motion
  // graphics) on phone. Both are complete videos, not built from HTML
  // captions, so this just swaps the source and forces playback: some
  // browsers (notably Safari) don't reliably honor the declarative
  // autoplay attribute after src is assigned programmatically.
  const heroVideo = document.getElementById('heroVideo');
  const heroIsWide = window.matchMedia('(min-width: 768px)');

  if (heroVideo) {
    if (heroIsWide.matches) {
      heroVideo.poster = 'images/hero-bg-video-poster.jpg';
      heroVideo.src = 'images/hero-bg-video.mp4';
    } else {
      heroVideo.poster = 'images/hero-mobile-video-poster.jpg';
      heroVideo.src = 'images/hero-mobile-video.mp4';
    }
    heroVideo.load();
    const playPromise = heroVideo.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Autoplay was blocked (rare with muted+playsinline) — retry once
        // the page has had user interaction, or on the loadeddata event.
        heroVideo.addEventListener('loadeddata', () => heroVideo.play().catch(() => {}), { once: true });
      });
    }
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Animated stat counters
  const stats = document.querySelectorAll('.stat-num');
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      statsIO.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  stats.forEach(el => statsIO.observe(el));

  const rows = document.querySelectorAll('.svc-row');

  // Service list — tap/click a service to see the equipment used for it
  const FLEET_TOTAL = 36;
  const EQUIPMENT = {
    scania: { img: 'images/eq-scania.webp', label: 'Autobasculantă Scania G490' },
    cat: { img: 'images/eq-cat.webp', label: 'Excavator Caterpillar M316D' },
    e50: { img: 'images/eq-e50.webp', label: 'Mini-excavator Bobcat E50' },
    s185: { img: 'images/eq-s185.webp', label: 'Încărcător frontal Bobcat S185' },
    jcb: { img: 'images/eq-jcb.webp', label: 'Buldoexcavator JCB 3CX' },
    dynapac: { img: 'images/eq-dynapac.webp', label: 'Compactor Dynapac 10T' },
    'komatsu-d37': { img: 'images/eq-komatsu-d37.webp', label: 'Buldozer Komatsu D37PX-23' },
    'komatsu-pc78': { img: 'images/eq-komatsu-pc78.webp', label: 'Excavator pe șenile Komatsu PC78' },
    actros: { img: 'images/eq-actros.webp', label: 'Evacuator Mercedes-Benz Actros' },
  };

  rows.forEach(row => {
    const panel = row.querySelector('.svc-panel');
    const top = row.querySelector('.svc-row-top');
    if (!panel || !top) return;

    const slugs = (row.dataset.eq || '').split(',').map(s => s.trim()).filter(Boolean);
    const cardsHtml = slugs
      .map(slug => EQUIPMENT[slug])
      .filter(Boolean)
      .map(eq => `<div class="svc-eq-card"><img src="${eq.img}" alt="${eq.label}" loading="lazy"><span>${eq.label}</span></div>`)
      .join('');
    const restCount = FLEET_TOTAL - slugs.length;
    panel.innerHTML = `
      <div class="svc-panel-inner">
        ${cardsHtml}
        <p class="svc-panel-more">+ restul parcului — <a href="#parc">${restCount}+ utilaje proprii →</a></p>
      </div>`;

    top.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      rows.forEach(r => {
        r.classList.remove('open');
        r.querySelector('.svc-panel').hidden = true;
        const icon = r.querySelector('.svc-toggle-icon');
        if (icon) icon.textContent = '+';
      });
      if (!isOpen) {
        row.classList.add('open');
        panel.hidden = false;
        const icon = row.querySelector('.svc-toggle-icon');
        if (icon) icon.textContent = '–';
      }
    });
  });

  // Offer form — client-side only (no backend configured)
  const form = document.getElementById('offerForm');
  const ok = document.getElementById('formOk');
  if (form && ok) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      ok.classList.add('show');
      form.reset();
    });
  }
});
