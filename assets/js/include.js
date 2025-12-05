document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[data-include]');
  elements.forEach(async (el) => {
    const name = el.getAttribute('data-include');
    try {
      const res = await fetch('partials/' + name + '.html', { cache: 'no-cache' });
      if (res.ok) {
        const html = await res.text();
        el.innerHTML = html;
        if (name === 'header') {
          const links = el.querySelectorAll('.nav a');
          const current = location.pathname.split('/').pop() || 'index.html';
          links.forEach((a) => {
            if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
          });
          if (current === 'index.html') {
            document.body.classList.add('home');
          }

          const toggle = el.querySelector('.menu-toggle');
          const toggleIcon = toggle?.querySelector('i');
          const drawer = document.querySelector('.mobile-drawer');
          const overlay = drawer?.querySelector('.drawer-overlay');
          const submenuButtons = drawer?.querySelectorAll('.submenu-toggle') || [];

          const setIcon = (open) => {
            if (!toggleIcon) return;
            toggleIcon.classList.toggle('fa-bars', !open);
            toggleIcon.classList.toggle('fa-xmark', open);
          };

          const openDrawer = () => { document.body.classList.add('drawer-open'); drawer?.setAttribute('aria-hidden', 'false'); setIcon(true); };
          const closeDrawer = () => { document.body.classList.remove('drawer-open'); drawer?.setAttribute('aria-hidden', 'true'); setIcon(false); };

          toggle?.addEventListener('click', () => {
            if (document.body.classList.contains('drawer-open')) closeDrawer(); else openDrawer();
          });
          overlay?.addEventListener('click', closeDrawer);
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
          submenuButtons.forEach((btn) => {
            btn.addEventListener('click', () => { const parent = btn.closest('.has-submenu'); parent?.classList.toggle('open'); });
          });
          drawer?.querySelectorAll('.drawer-item a').forEach((a) => { a.addEventListener('click', closeDrawer); });

          // Desktop Services mega menu: click-to-open, persists on scroll
          const servicesLink = el.querySelector('.menu .menu-item.dropdown > a[href="services.html"]');
          const megaMenu = el.querySelector('.submenu.mega.services-mega');
          if (servicesLink && megaMenu) {
            servicesLink.addEventListener('click', (ev) => {
              ev.preventDefault();
              document.body.classList.toggle('mega-open');
            });
            document.addEventListener('click', (ev) => {
              const within = megaMenu.contains(ev.target) || servicesLink.contains(ev.target);
              if (!within) document.body.classList.remove('mega-open');
            });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('mega-open'); });
            megaMenu.querySelectorAll('a').forEach((a) => {
              a.addEventListener('click', () => { document.body.classList.remove('mega-open'); });
            });
          }
        }
      }
    } catch (e) {}
  });

  const items = document.querySelectorAll('.faq-accordion details.faq-item');
  if (items.length) {
    items.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          items.forEach((o) => { if (o !== d) { o.open = false; } });
        }
      });
    });
  }

  const lpItems = document.querySelectorAll('.lp-accordion details.lp-item');
  if (lpItems.length) {
    lpItems.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          lpItems.forEach((o) => { if (o !== d) { o.open = false; } });
        }
      });
    });
  }

  const modal = document.querySelector('#apply-modal');
  if (modal) {
    const openers = document.querySelectorAll('[data-open-modal="#apply-modal"]');
    const overlay = modal.querySelector('.modal-overlay');
    const closers = modal.querySelectorAll('[data-modal-close]');
    const roleInput = modal.querySelector('input[aria-label="Role"]');
    const openModal = (title) => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); if (roleInput && title) roleInput.value = title; };
    const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
    openers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.job-item');
        const title = item?.querySelector('.job-title')?.textContent?.trim() || '';
        openModal(title);
      });
    });
    overlay?.addEventListener('click', closeModal);
    closers.forEach((b) => b.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  document.querySelectorAll('.cta-form, .footer-newsletter, .modal-form, .form-grid').forEach((form) => {
    form.addEventListener('submit', (e) => { e.preventDefault(); });
  });

  // Simple hero slider (2 slides)
  const slider = document.querySelector('.hero-slider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    let index = 0;
    const titleEl = document.querySelector('.hero-title');
    const leadEl = document.querySelector('.hero-lead');
    const ctaEl = document.querySelector('.hero-cta');
    const contentEl = document.querySelector('.hero-content');
    const contentData = [
      { titleTop: 'Secure every identity.', titleAccent: 'Power every possibility.', lead: 'Your organization runs on identity — human, machine and AI. Secure them all with the right level of privilege controls.', cta: 'Explore the Platform' },
      { titleTop: 'Privileged access for every identity.', titleAccent: 'Scale with confidence.', lead: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer efficitur massa sed rhoncus pulvinar. Nibh augue ultrices velit, a gravida arcu sapien sit amet elit.', cta: 'Explore the Platform' }
    ];
    const updateContent = (i) => {
      const d = contentData[i % contentData.length];
      if (titleEl && leadEl && ctaEl) {
        contentEl?.classList.remove('animate');
        void contentEl?.offsetWidth;
        titleEl.innerHTML = `<span>${d.titleTop}</span><br><span class="accent">${d.titleAccent}</span>`;
        leadEl.textContent = d.lead;
        ctaEl.textContent = d.cta;
        contentEl?.classList.add('animate');
      }
    };
    const setActive = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      updateContent(i);
    };
    setActive(index);
    const prev = document.querySelector('.hero-prev');
    const next = document.querySelector('.hero-next');
    prev?.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; setActive(index); });
    next?.addEventListener('click', () => { index = (index + 1) % slides.length; setActive(index); });
    let timer = setInterval(() => { index = (index + 1) % slides.length; setActive(index); }, 6000);
    const bg = document.querySelector('.hero-bg');
    bg?.addEventListener('mouseenter', () => { clearInterval(timer); });
    bg?.addEventListener('mouseleave', () => { timer = setInterval(() => { index = (index + 1) % slides.length; setActive(index); }, 6000); });
  }
});
