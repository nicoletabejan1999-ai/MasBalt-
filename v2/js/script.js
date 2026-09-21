document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header goes solid after scrolling past the hero
  const bar = document.getElementById('bar');
  const onScroll = () => bar.classList.toggle('solid', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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

  // Service list hover preview (desktop only)
  const preview = document.getElementById('svcPreview');
  const previewImg = document.getElementById('svcPreviewImg');
  const rows = document.querySelectorAll('.svc-row');
  if (preview && previewImg) {
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        previewImg.src = row.dataset.img;
        preview.classList.add('show');
      });
      row.addEventListener('mousemove', (e) => {
        preview.style.left = (e.clientX + 24) + 'px';
        preview.style.top = (e.clientY - 110) + 'px';
      });
      row.addEventListener('mouseleave', () => {
        preview.classList.remove('show');
      });
    });
  }

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
