document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header goes solid after scrolling past the hero
  const bar = document.getElementById('bar');
  const onScroll = () => bar.classList.toggle('solid', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // About video — click-to-play (not autoplay), so the browser only ever
  // starts it on a real user gesture, which always works reliably.
  const aboutVideoCard = document.getElementById('aboutVideo');
  if (aboutVideoCard) {
    const video = aboutVideoCard.querySelector('video');
    const playBtn = aboutVideoCard.querySelector('.about-video-play');
    playBtn.addEventListener('click', () => {
      video.controls = true;
      video.muted = false;
      video.play();
      playBtn.classList.add('hide');
    });
    video.addEventListener('pause', () => {
      if (!video.ended) playBtn.classList.remove('hide');
    });
    video.addEventListener('ended', () => {
      playBtn.classList.remove('hide');
      video.controls = false;
    });
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
  const EQUIPMENT = {
    scania: { img: 'images/eq-scania.webp', label: 'Autobasculantă Scania G490' },
    cat: { img: 'images/eq-cat.webp', label: 'Excavator Caterpillar M316D' },
    e50: { img: 'images/eq-e50.webp', label: 'Miniexcavator Bobcat E50' },
    s185: { img: 'images/eq-s185.webp', label: 'Încărcător frontal Bobcat S185' },
    jcb: { img: 'images/eq-jcb.webp', label: 'Buldoexcavator JCB 3CX' },
    dynapac: { img: 'images/eq-dynapac.webp', label: 'Compactor Dynapac de 10 t' },
    'komatsu-d37': { img: 'images/eq-komatsu-d37.webp', label: 'Buldozer Komatsu D37PX-23' },
    'komatsu-pc78': { img: 'images/eq-komatsu-pc78.webp', label: 'Excavator pe șenile Komatsu PC78' },
    actros: { img: 'images/eq-actros.webp', label: 'Platformă transport utilaje Actros' },
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
    panel.innerHTML = `
      <div class="svc-panel-inner">
        ${cardsHtml}
        <p class="svc-panel-more"><a href="#parc">Vezi întregul parc de utilaje →</a></p>
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
