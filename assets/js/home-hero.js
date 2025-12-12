(() => {
  const hero = document.getElementById('home-hero');
  if (!hero) return;
  const slides = Array.from(hero.querySelectorAll('.hero-slide'));
  const prevBtn = hero.querySelector('.hero-arrow.prev');
  const nextBtn = hero.querySelector('.hero-arrow.next');
  const indicator = hero.querySelector('.hero-indicator');
  const dotsWrap = hero.querySelector('.indicator-dots');
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.dot')) : [];
  let index = 0;
  let timer = null;
  let fills = dots.map(d => d.querySelector('.dot-fill'));

  // Ensure dots match slides count (fallback)
  if (!dots.length && slides.length) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < slides.length; i++) {
      const d = document.createElement('div');
      d.className = 'dot';
      d.dataset.index = String(i);
      const f = document.createElement('div');
      f.className = 'dot-fill';
      d.appendChild(f);
      frag.appendChild(d);
    }
    if (indicator) {
      const wrap = document.createElement('div');
      wrap.className = 'indicator-dots';
      wrap.appendChild(frag);
      indicator.appendChild(wrap);
    }
    const newDots = indicator.querySelectorAll('.dot');
    fills = Array.from(indicator.querySelectorAll('.dot-fill'));
  }

  const show = (i) => {
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    index = i;
    if (dotsWrap) {
      const allDots = Array.from(dotsWrap.querySelectorAll('.dot'));
      allDots.forEach((d, k) => d.classList.toggle('active', k === i));
    }
    // restart animation on active dot
    const current = fills[i];
    if (current) {
      current.classList.remove('animating');
      current.style.width = '0%';
      current.style.animationPlayState = 'running';
      void current.offsetWidth;
      current.classList.add('animating');
    }
  };
  const next = () => show((index + 1) % slides.length);
  const prev = () => show((index - 1 + slides.length) % slides.length);
  const start = () => {
    stop();
    timer = setInterval(next, 5000);
    if (fills.length && fills[index]) fills[index].style.animationPlayState = 'running';
  };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; }
    if (fills.length && fills[index]) fills[index].style.animationPlayState = 'paused';
  };

  // Init
  if (slides.length) show(0);
  start();

  // Controls
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });

  // Pause on hover
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', start);

  // Dot click jumps to slide
  if (dotsWrap) {
    dotsWrap.addEventListener('click', (e) => {
      const d = e.target.closest('.dot');
      if (!d) return;
      const idx = Number(d.dataset.index || '0');
      show(idx);
      start();
    });
  }
})();
