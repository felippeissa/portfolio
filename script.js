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

document.querySelectorAll('.hero, .intro, .media, .thanks-block, .anim-up, .title, .reveal-block')
  .forEach(el => reveal.observe(el));

// 2) Fundo fixo: cor muda conforme a seção que está no centro da tela
//    (no tema claro, cada cor escura vira o tom claro equivalente)
const root = document.documentElement;
const LIGHT_BG = { '#000000': '#f6f6f4', '#1c1c1c': '#ebebe8', '#2f2f2f': '#deded9' };
let currentBg = '#000000';
function paintBg() {
  if (!bg) return;
  const light = root.dataset.theme === 'light';
  bg.style.backgroundColor = light ? (LIGHT_BG[currentBg] || currentBg) : currentBg;
}
const sections = [...document.querySelectorAll('[data-bg]')];
const colorObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { currentBg = e.target.dataset.bg; paintBg(); }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => colorObserver.observe(s));

// 2b) Tema claro/escuro e idioma PT/EN (escolha fica salva no navegador)
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

function setTheme(t) {
  root.dataset.theme = t;
  store.set('theme', t);
  document.querySelectorAll('[data-theme-set]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
  paintBg();
}

function setLang(l) {
  root.lang = l === 'en' ? 'en' : 'pt-BR';
  store.set('lang', l);
  document.querySelectorAll('[data-en]').forEach(el => {
    if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
    el.innerHTML = l === 'en' ? el.dataset.en : el.dataset.pt;
  });
  document.querySelectorAll('[data-en-label]').forEach(el =>
    el.setAttribute('aria-label', l === 'en' ? el.dataset.enLabel : el.dataset.ptLabel));
  document.querySelectorAll('[data-en-content]').forEach(el =>
    el.setAttribute('content', l === 'en' ? el.dataset.enContent : el.dataset.ptContent));
  document.querySelectorAll('[data-lang-set]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.langSet === l)));
}

document.querySelectorAll('[data-theme-set]').forEach(b =>
  b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
document.querySelectorAll('[data-lang-set]').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.langSet)));

setTheme(store.get('theme') === 'light' ? 'light' : 'dark');
if (store.get('lang') === 'en') setLang('en');

// 3) Indicador "Trabalho" + linha de progresso + leve parallax na mídia
const work = document.querySelector('main');
const medias = [...document.querySelectorAll('.media img, .media video, .placeholder')];

function onScroll() {
  const vh = innerHeight;
  if (work && indicator && progress) {
    const r = work.getBoundingClientRect();
    const visible = r.top < vh * 0.4 && r.bottom > vh * 0.6;
    indicator.classList.toggle('show', visible);
    const p = Math.min(1, Math.max(0, (vh * 0.4 - r.top) / (r.height - vh * 0.2)));
    progress.style.transform = `scaleY(${p})`;
  }

  medias.forEach(m => {
    const mr = m.getBoundingClientRect();
    const t = (mr.top + mr.height / 2 - vh / 2) / vh; // -1..1
    m.style.transform = `translateY(${t * -30}px)`;
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// 4) Mídia clicável: selo "Ver projeto" segue o mouse
document.querySelectorAll('.media-link').forEach(link => {
  const move = (e) => {
    const r = link.getBoundingClientRect();
    link.style.setProperty('--cx', `${e.clientX - r.left}px`);
    link.style.setProperty('--cy', `${e.clientY - r.top}px`);
  };
  link.addEventListener('mouseenter', (e) => { move(e); link.classList.add('hovering'); });
  link.addEventListener('mousemove', move);
  link.addEventListener('mouseleave', () => link.classList.remove('hovering'));
});
