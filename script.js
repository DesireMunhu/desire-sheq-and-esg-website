document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Navigation ---------- */
const toggle = $('.menu-toggle'), nav = $('#main-nav'), header = $('.site-header');
function setNav(open) {
  nav.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
toggle?.addEventListener('click', () => setNav(!nav.classList.contains('open')));
$$('a', nav).forEach(a => a.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); } });

const toTop = $('.to-top');
function onScroll() {
  header.classList.toggle('scrolled', scrollY > 8);
  toTop.hidden = scrollY < 700;
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
// Gentle parallax on the hero photo
const heroPhoto = $('.hero-photo');
if (heroPhoto && !reduceMotion) addEventListener('scroll', () => { if (scrollY < 1000) heroPhoto.style.transform = `translateY(${scrollY * 0.25}px)`; }, { passive: true });
toTop.addEventListener('click', () => { scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); $('.brand').focus({ preventScroll: true }); });

// Highlight the menu item for the section in view
const links = $$('.nav a:not(.nav-cta)');
const sectionObserver = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) links.forEach(l => l.classList.toggle('current', l.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['services', 'who', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
}), { threshold: 0.12 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (el.closest('.size-grid') ? (i % 3) * 90 : 0) + 'ms'; revealObserver.observe(el); });

/* ---------- Hero rotator ---------- */
(function heroRotator() {
  const box = $('.hero-rotator'); if (!box) return;
  const cards = $$('[data-rot]', box), dots = $('.rot-dots', box), DURATION = 6000;
  let i = 0, start = performance.now(), paused = false, elapsed = 0;
  cards.forEach((c, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', c.querySelector('.rot-tag').textContent);
    b.addEventListener('click', () => show(n));
    dots.appendChild(b);
  });
  function show(n) {
    cards[i].hidden = true; i = (n + cards.length) % cards.length; cards[i].hidden = false;
    $$('button', dots).forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
    start = performance.now(); elapsed = 0;
  }
  box.addEventListener('mouseenter', () => { paused = true; elapsed = performance.now() - start; });
  box.addEventListener('mouseleave', () => { paused = false; start = performance.now() - elapsed; });
  box.addEventListener('focusin', () => { paused = true; elapsed = performance.now() - start; });
  box.addEventListener('focusout', () => { paused = false; start = performance.now() - elapsed; });
  show(0);
  if (reduceMotion) return;
  (function tick(now) {
    if (!paused) {
      const p = Math.min(1, (now - start) / DURATION);
      box.style.setProperty('--p', (p * 100).toFixed(1) + '%');
      if (p >= 1) show(i + 1);
    }
    requestAnimationFrame(tick);
  })(performance.now());
})();

/* ---------- Services carousel ---------- */
(function servicesCarousel() {
  const car = $('[data-carousel]'); if (!car) return;
  const track = $('.car-track', car), cards = $$('.service', track), dotsBox = $('.car-dots', car);
  const prev = $('[data-car-prev]'), next = $('[data-car-next]');
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
  const pages = () => Math.max(1, cards.length - perView() + 1);
  function drawDots() {
    dotsBox.innerHTML = Array.from({ length: pages() }, () => '<span></span>').join('');
    update();
  }
  function index() { return Math.round(track.scrollLeft / step()); }
  function update() {
    const i = index(), max = pages() - 1;
    $$('span', dotsBox).forEach((d, k) => d.classList.toggle('on', k === Math.min(i, max)));
    prev.disabled = i <= 0; next.disabled = i >= max;
  }
  function go(i) { const max = pages() - 1; if (i > max) i = 0; if (i < 0) i = max; track.scrollTo({ left: i * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); }
  prev.addEventListener('click', () => go(index() - 1));
  next.addEventListener('click', () => go(index() + 1));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); } });
  addEventListener('resize', drawDots);
  drawDots();
  // Autoplay, paused while the visitor is hovering, touching or focused on it
  let hold = false;
  ['mouseenter', 'focusin', 'touchstart'].forEach(ev => car.addEventListener(ev, () => hold = true, { passive: true }));
  ['mouseleave', 'focusout'].forEach(ev => car.addEventListener(ev, () => hold = false));
  [prev, next].forEach(b => { b.addEventListener('mouseenter', () => hold = true); b.addEventListener('mouseleave', () => hold = false); });
  if (!reduceMotion) setInterval(() => { if (!hold && !document.hidden) go(index() + 1); }, 5000);
})();

/* ---------- Footer year ---------- */
const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

/* ---------- Enquire buttons pre-select the service ---------- */
const serviceSelect = $('#service');
function preselect(service) {
  const match = [...serviceSelect.options].find(o => (o.value || o.text) === service);
  if (match) serviceSelect.value = match.value;
  const field = serviceSelect.closest('.field');
  field.classList.remove('flash'); void field.offsetWidth; field.classList.add('flash');
}
$$('[data-service]').forEach(btn => btn.addEventListener('click', () => {
  preselect(btn.dataset.service);
  showForm();
  $('#contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  setTimeout(() => $('#name')?.focus({ preventScroll: true }), 700);
}));

/* ---------- Enquiry: prepared here, sent by the visitor (Gmail / email app / copy).
   No form data is transmitted or stored by this page. ---------- */
const enquiryForm = $('#enquiry-form'), result = $('#enquiry-result');
const gmail = $('#gmail-compose'), mailapp = $('#email-compose'), preview = $('#enquiry-preview');
const copyBtn = $('#copy-enquiry'), copyStatus = $('#copy-status'), formError = $('#form-error');
const RECIPIENT = 'dmunhungewarwa@outlook.com';

function showForm() { if (!result.hidden) { result.hidden = true; enquiryForm.hidden = false; } }

enquiryForm.addEventListener('submit', e => {
  e.preventDefault();
  const required = $$('[required]', enquiryForm);
  required.forEach(f => f.removeAttribute('aria-invalid'));
  const missing = required.filter(f => !f.value.trim() || (f.type === 'email' && !f.checkValidity()));
  if (missing.length) {
    missing.forEach(f => f.setAttribute('aria-invalid', 'true'));
    const emailBad = missing.find(f => f.type === 'email' && f.value.trim());
    formError.textContent = emailBad ? 'Enter a valid email address, for example name@company.co.zw.' : 'Add your name, email address and a short message to continue.';
    missing[0].focus();
    return;
  }
  formError.textContent = '';
  const v = new FormData(enquiryForm), get = k => String(v.get(k) || '').trim();
  const name = get('name'), email = get('email'), message = get('message');
  const organisation = get('organisation') || 'Not provided', industry = get('industry') || 'Not provided';
  const service = get('service') || 'General consultancy enquiry';
  const subject = `SHEQ & ESG Consultancy Enquiry - ${name}`;
  const body = `Name: ${name}\nOrganisation: ${organisation}\nIndustry: ${industry}\nEmail: ${email}\nService: ${service}\n\nEnquiry:\n${message}`;
  mailapp.href = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECIPIENT)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  preview.value = `To: ${RECIPIENT}\nSubject: ${subject}\n\n${body}`;
  enquiryForm.hidden = true; result.hidden = false; copyStatus.textContent = '';
  const h = $('h3', result); h.setAttribute('tabindex', '-1'); h.focus();
});

$('#edit-enquiry').addEventListener('click', () => { showForm(); $('#message').focus(); });

copyBtn.addEventListener('click', async () => {
  if (!preview.value) return;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard not available');
    await navigator.clipboard.writeText(preview.value);
    copyStatus.textContent = 'Copied. Paste it into your preferred email service.';
  } catch (_) {
    preview.focus(); preview.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (__) {}
    copyStatus.textContent = copied ? 'Copied. Paste it into your preferred email service.' : 'Message selected. Press Ctrl+C (or Cmd+C) to copy it.';
  }
});
