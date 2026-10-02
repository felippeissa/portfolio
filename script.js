const bg = document.getElementById('bg');
const indicator = document.getElementById('indicator');
const progress = document.getElementById('progress');
const root = document.documentElement;

// 1) Entrada: títulos, textos e mídia aparecem ao entrar na tela
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.hero, .case-hero, .intro, .media, .contact, .thanks-block, .anim-up, .title, .reveal-block')
  .forEach(el => reveal.observe(el));

// 2) Fundo fixo: cor muda conforme a seção que está no centro da tela.
//    No tema claro, cada cor escura vira um tom claro equivalente.
let currentBg = '#000000';
function lightFor(hex) {
  const v = parseInt(hex.slice(1, 3), 16) || 0;
  const c = Math.round(246 - v * 0.55);
  const h = c.toString(16).padStart(2, '0');
  return '#' + h + h + Math.max(0, c - 2).toString(16).padStart(2, '0');
}
function paintBg() {
  if (!bg) return;
  bg.style.backgroundColor = root.dataset.theme === 'light' ? lightFor(currentBg) : currentBg;
}
const sections = [...document.querySelectorAll('[data-bg]')];
const colorObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { currentBg = e.target.dataset.bg; paintBg(); }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(s => colorObserver.observe(s));

// 3) Tema claro/escuro e idioma PT/EN (escolha fica salva no navegador)
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
  const t = document.querySelector('title');
  if (t && t.dataset.en) {
    if (t.dataset.pt === undefined) t.dataset.pt = t.textContent;
    document.title = l === 'en' ? t.dataset.en : t.dataset.pt;
  }
  document.querySelectorAll('[data-lang-set]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.langSet === l)));
}

document.querySelectorAll('[data-theme-set]').forEach(b =>
  b.addEventListener('click', () => setTheme(b.dataset.themeSet)));
document.querySelectorAll('[data-lang-set]').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.langSet)));

setTheme(store.get('theme') === 'light' ? 'light' : 'dark');
if (store.get('lang') === 'en') setLang('en');

// 4) Indicador "Trabalho", parallax na mídia e menu que some ao rolar para baixo
const work = document.querySelector('main#trabalho');
const medias = [...document.querySelectorAll('.media img, .media video, .media .cover, .placeholder')];
let lastY = scrollY;

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
    if (mr.bottom < -200 || mr.top > vh + 200) return;
    const t = (mr.top + mr.height / 2 - vh / 2) / vh; // -1..1
    m.style.transform = `translateY(${t * -30}px)`;
  });

  const y = scrollY;
  if (y > 240 && y > lastY + 4) document.body.classList.add('nav-hidden');
  else if (y < lastY - 4 || y <= 240) document.body.classList.remove('nav-hidden');
  lastY = y;
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// 5) Mídia clicável: selo "Ver projeto" segue o mouse
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

// 6) Copiar e-mail
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const en = root.lang === 'en';
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = en ? 'Copied!' : 'Copiado!';
    } catch (e) {
      location.href = 'mailto:' + btn.dataset.copy;
      return;
    }
    setTimeout(() => { btn.textContent = en ? 'Copy e-mail' : 'Copiar e-mail'; }, 1800);
  });
});

// 7) Ano no rodapé
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
