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
          const drawerOverlay = drawer?.querySelector('.drawer-overlay');
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
          drawerOverlay?.addEventListener('click', closeDrawer);
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
          submenuButtons.forEach((btn) => {
            btn.addEventListener('click', () => { const parent = btn.closest('.has-submenu'); parent?.classList.toggle('open'); });
          });
          drawer?.querySelectorAll('.drawer-item a').forEach((a) => { a.addEventListener('click', closeDrawer); });

          const megaItems = el.querySelectorAll('.menu .menu-item.dropdown');
          const closeAllMega = () => { document.body.classList.remove('mega-open'); };
          megaItems.forEach((mi) => {
            mi.addEventListener('mouseenter', () => { document.body.classList.add('mega-open'); });
            mi.addEventListener('mouseleave', () => { document.body.classList.remove('mega-open'); });
            const link = mi.querySelector(':scope > a');
            if (link) {
              link.addEventListener('click', (ev) => {
                const href = link.getAttribute('href') || '';
                if (href === '#' || href === '') { ev.preventDefault(); }
              });
            }
          });
          document.addEventListener('click', (ev) => { const insideHeader = el.contains(ev.target); if (!insideHeader) closeAllMega(); });
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllMega(); });

          const searchToggle = el.querySelector('.header-search-toggle');
          const searchIcon = searchToggle?.querySelector('i');
          const searchModal = document.getElementById('search-modal');
          const searchOverlay = searchModal?.querySelector('.modal-overlay');
          const closeBtn = searchModal?.querySelector('.search-close');
          const openSearch = () => { searchModal?.classList.add('open'); searchModal?.setAttribute('aria-hidden', 'false'); if (searchIcon) { searchIcon.classList.remove('fa-magnifying-glass'); searchIcon.classList.add('fa-xmark'); } const input = searchModal?.querySelector('.search-full-input'); input && input.focus(); };
          const closeSearch = () => { searchModal?.classList.remove('open'); searchModal?.setAttribute('aria-hidden', 'true'); if (searchIcon) { searchIcon.classList.add('fa-magnifying-glass'); searchIcon.classList.remove('fa-xmark'); } };
          searchToggle?.addEventListener('click', (ev) => { ev.preventDefault(); openSearch(); });
          searchOverlay?.addEventListener('click', closeSearch);
          closeBtn?.addEventListener('click', closeSearch);
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });
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
    const applyOverlay = modal.querySelector('.modal-overlay');
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
    applyOverlay?.addEventListener('click', closeModal);
    closers.forEach((b) => b.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

  const vmodal = document.querySelector('#video-modal');
  if (vmodal) {
    const vOpeners = document.querySelectorAll('[data-open-modal="#video-modal"]');
    const vOverlay = vmodal.querySelector('.modal-overlay');
    const vClosers = vmodal.querySelectorAll('[data-modal-close]');
    const frame = vmodal.querySelector('#video-frame');
    const src = 'https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1';
    const open = () => { vmodal.classList.add('open'); vmodal.setAttribute('aria-hidden', 'false'); if (frame) frame.src = src; };
    const close = () => { vmodal.classList.remove('open'); vmodal.setAttribute('aria-hidden', 'true'); if (frame) frame.src = ''; };
    vOpeners.forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); open(); }));
    vOverlay?.addEventListener('click', close);
    vClosers.forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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

  // Simple tabs for industry details page
  const tabsRoot = document.querySelector('.industry-tabs');
  const tabNav = document.querySelector('.tab-nav');
  const tabLinks = tabNav ? Array.from(tabNav.querySelectorAll('[data-tab]')) : [];
  const panels = Array.from(document.querySelectorAll('.tab-panel'));
  if (tabsRoot && tabLinks.length && panels.length) {
    const sections = tabLinks.map((b) => document.getElementById(b.getAttribute('data-tab'))).filter(Boolean);
    const setActiveTab = (id) => {
      tabLinks.forEach((b) => {
        const on = b.getAttribute('data-tab') === id;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    };
    tabLinks.forEach((b) => {
      b.addEventListener('click', (e) => {
        e.preventDefault();
        const id = b.getAttribute('data-tab');
        const target = document.getElementById(id);
        if (!target) return;
        const y = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: y, behavior: 'smooth' });
        history.replaceState(null, '', '#' + id);
        setActiveTab(id);
      });
    });
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      const top = visible[0];
      if (top) setActiveTab(top.target.id);
    }, { rootMargin: '-120px 0px -70% 0px', threshold: 0.2 });
    sections.forEach((s) => obs.observe(s));
    const id = (location.hash || '').replace('#', '');
    if (id) setActiveTab(id);
    window.addEventListener('hashchange', () => { const hid = (location.hash || '').replace('#', ''); if (hid) setActiveTab(hid); });
  }

  const topbar = document.querySelector('.topbar');
  if (topbar) {
    let lastY = 0;
    const show = () => { document.body.classList.add('topbar-shown'); document.body.classList.remove('topbar-hidden'); };
    const hide = () => { document.body.classList.add('topbar-hidden'); document.body.classList.remove('topbar-shown'); };
    show();
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y <= 8) { show(); }
      else if (y > lastY && y > 80) { hide(); }
      else if (y < lastY) { show(); }
      lastY = y;
    });
  }
});
