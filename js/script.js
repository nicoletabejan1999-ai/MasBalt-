document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile hamburger menu
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Desktop "Servicii" dropdown
  const serviciiToggle = document.getElementById('serviciiToggle');
  const serviciiMenu = document.getElementById('serviciiMenu');
  if (serviciiToggle && serviciiMenu) {
    serviciiToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = serviciiMenu.classList.toggle('open');
      serviciiToggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', (e) => {
      if (!serviciiMenu.contains(e.target) && e.target !== serviciiToggle) {
        serviciiMenu.classList.remove('open');
        serviciiToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Service card "Afișează toate" — expand bullet list
  document.querySelectorAll('.show-all-btn').forEach(btn => {
    if (btn.classList.contains('show-all-btn--machines')) return;
    btn.addEventListener('click', () => {
      const list = btn.previousElementSibling;
      if (list && list.classList.contains('service-list')) {
        list.classList.add('expanded');
        btn.classList.add('is-hidden');
      }
    });
  });

  // Machines "Afișează toate"
  const showAllMachines = document.getElementById('showAllMachines');
  if (showAllMachines) {
    showAllMachines.addEventListener('click', () => {
      document.querySelectorAll('.machine-card--extra').forEach(card => card.classList.add('show'));
      showAllMachines.classList.add('is-hidden');
    });
  }

  // Offer form — client-side only (no backend configured)
  const offerForm = document.getElementById('offerForm');
  const formSuccess = document.getElementById('formSuccess');
  if (offerForm && formSuccess) {
    offerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!offerForm.checkValidity()) {
        offerForm.reportValidity();
        return;
      }
      formSuccess.classList.add('show');
      offerForm.reset();
    });
  }
});
