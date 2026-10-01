const bg = document.getElementById('bg');
const indicator = document.getElementById('indicator');
const progress = document.getElementById('progress');

// 1) Entrada: títulos, textos e mídia aparecem ao entrar na tela
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.hero, .intro, .media, .thanks-block, .anim-up, .title')
  .forEach(el => reveal.observe(el));

// 2) Fundo fixo: cor muda conforme a seção que está no centro da tela
const sections = [...document.querySelectorAll('[data-bg]')];
const colorObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) bg.style.backgroundColor = e.target.dataset.bg;
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => colorObserver.observe(s));

// 3) Indicador "Trabalho" + linha de progresso + leve parallax na mídia
const work = document.querySelector('main');
const medias = [...document.querySelectorAll('.media img, .media video, .placeholder')];

function onScroll() {
  const vh = innerHeight;
  const r = work.getBoundingClientRect();
  const visible = r.top < vh * 0.4 && r.bottom > vh * 0.6;
  indicator.classList.toggle('show', visible);

  const p = Math.min(1, Math.max(0, (vh * 0.4 - r.top) / (r.height - vh * 0.2)));
  progress.style.transform = `scaleY(${p})`;

  medias.forEach(m => {
    const mr = m.getBoundingClientRect();
    const t = (mr.top + mr.height / 2 - vh / 2) / vh; // -1..1
    m.style.transform = `translateY(${t * -30}px)`;
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();
