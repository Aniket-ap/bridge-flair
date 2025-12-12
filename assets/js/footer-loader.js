document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('site-footer-root');
  if (!root) return;
  fetch('footer.html').then(r => r.text()).then(html => {
    root.innerHTML = html;
    const scripts = Array.from(root.querySelectorAll('script'));
    scripts.forEach(s => {
      const n = document.createElement('script');
      if (s.src) n.src = s.src;
      else n.textContent = s.textContent;
      root.appendChild(n);
      s.remove();
    });
  }).catch(() => {});
});
