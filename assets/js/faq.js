document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.faq-row');
  rows.forEach(row => {
    const trigger = row.querySelector('.faq-trigger');
    const panel = row.querySelector('.faq-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        panel.hidden = true;
        row.classList.remove('open');
      } else {
        panel.hidden = false;
        row.classList.add('open');
      }
    });
  });
});
