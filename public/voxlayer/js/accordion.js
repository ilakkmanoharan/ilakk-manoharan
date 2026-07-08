document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.qa-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.qa-item');
      const wasOpen = item.classList.contains('open');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', !wasOpen);
    });
  });
});
