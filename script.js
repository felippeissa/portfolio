// Animação de entrada ao rolar a página
const items = document.querySelectorAll('.hero > *, .work > *, .job, footer > *');
items.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

items.forEach(el => io.observe(el));
