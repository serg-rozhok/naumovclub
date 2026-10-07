(() => {
  const $ = s => document.querySelector(s);
  const header = $('#header'), nav = $('#nav'), burger = $('#burger'), hero = $('.hero__bg');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const setMenu = open => { nav.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Compact header + light hero parallax
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      header.classList.toggle('is-small', y > 40);
      if (!reduce && y < innerHeight) hero.style.transform = `translateY(${y * .25}px)`;
      tick = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal on scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('is-in'));

  // Prefill the form from "Дізнатися більше" / "Замовити" buttons
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-dir],[data-msg]'); if (!a) return;
    if (a.dataset.dir) $('#dir').value = a.dataset.dir;
    if (a.dataset.msg) { $('#dir').value = 'Екіпірування'; $('#msg').value = a.dataset.msg; }
  });

  // Frontend-only form (connect fetch() here when a backend exists)
  const form = $('#form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'phone'].forEach(n => {
      const f = form.elements[n], bad = !f.value.trim() || (n === 'phone' && f.value.replace(/\D/g, '').length < 9);
      f.classList.toggle('is-invalid', bad); if (bad) ok = false;
    });
    if (!ok) return form.querySelector('.is-invalid').focus();
    form.reset(); $('#ok').hidden = false;
  });

  // Missing image -> show its label instead of a broken icon
  document.querySelectorAll('.media img').forEach(i => {
    const miss = () => i.parentElement.classList.add('is-missing');
    i.addEventListener('error', miss);
    if (i.complete && !i.naturalWidth && i.currentSrc) miss();
  });
})();
