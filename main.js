'use strict';
const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menuToggle = document.querySelector('.mobile-menu');
const nav = document.querySelector('#nav');
const navDrop = document.querySelector('.nav-drop');
const navGroup = document.querySelector('.nav-group');
const submenu = document.querySelector('#service-menu');
const serviceButtons = [...document.querySelectorAll('.accordion-trigger')];
const serviceItems = [...document.querySelectorAll('.accordion-item')];
function closeNavDropdown() { navGroup?.classList.remove('is-open'); navDrop?.setAttribute('aria-expanded','false'); }
function closeMobileMenu(){ nav?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded','false'); menuToggle?.setAttribute('aria-label','Open main menu');closeNavDropdown(); }
menuToggle?.addEventListener('click', ()=> { const open=menuToggle.getAttribute('aria-expanded')!=='true'; menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close main menu':'Open main menu');nav.classList.toggle('open',open);if(!open)closeNavDropdown(); });
navDrop?.addEventListener('click',()=>{const open=navDrop.getAttribute('aria-expanded')!=='true';navDrop.setAttribute('aria-expanded',String(open));navGroup.classList.toggle('is-open',open);});
for (const link of document.querySelectorAll('.nav a')) link.addEventListener('click',()=>closeMobileMenu());
document.addEventListener('pointerdown',e=>{ if(!e.target.closest('.nav-group'))closeNavDropdown();if(!e.target.closest('.nav-inner'))closeMobileMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNavDropdown();closeMobileMenu();}});
const year=document.querySelector('#year');if(year)year.textContent=new Date().getFullYear();
function openService(idx){serviceItems.forEach((item,i)=>{const open=i===idx;item.classList.toggle('is-open',open);serviceButtons[i].setAttribute('aria-expanded',String(open));});}
serviceButtons.forEach((b,i)=>b.addEventListener('click',()=>openService(b.getAttribute('aria-expanded')==='true'?-1:i)));
submenu?.querySelectorAll('[data-accordion]').forEach(a=>a.addEventListener('click',()=>openService(Number(a.dataset.accordion))));
for (const a of document.querySelectorAll('[data-pick]')) a.addEventListener('click',()=>{const select=document.querySelector('#service-select');if(select){const match=[...select.options].find(o=>o.textContent.trim()===a.dataset.pick);if(match)select.value=match.value;}});
if (!prefersLessMotion && 'IntersectionObserver' in window) {
 document.documentElement.classList.add('motion-enabled');
 const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.04,rootMargin:'0px 0px 55px 0px'});
 document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));
}
const progress=document.querySelector('.progress');let busy=false;
function updateProgress(){if(progress){const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=(total>0?100*scrollY/total:0)+'%';}busy=false;}
window.addEventListener('scroll',()=>{if(!busy){requestAnimationFrame(updateProgress);busy=true;}},{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
function setupCarousel(name){
 const track=document.querySelector(`[data-track="${name}"]`);if(!track)return;
 const items=[...track.children];const prev=document.querySelector(`[data-prev="${name}"]`);const next=document.querySelector(`[data-next="${name}"]`);
 const visibleStep=()=>items.length>1?items[1].offsetLeft-items[0].offsetLeft:items[0].offsetWidth;
 const indexAtScroll=()=>Math.min(items.length-1,Math.max(0,Math.round(track.scrollLeft/Math.max(1,visibleStep()))));
 let pos=0;
 function go(dir){const maxScroll=track.scrollWidth-track.clientWidth;const step=visibleStep();if(dir>0&&track.scrollLeft+step>=maxScroll-6){pos=0;track.scrollTo({left:0,behavior:prefersLessMotion?'instant':'smooth'});}else if(dir<0&&track.scrollLeft<step*.45){pos=items.length-1;track.scrollTo({left:maxScroll,behavior:prefersLessMotion?'instant':'smooth'});}else{pos=indexAtScroll()+dir;track.scrollBy({left:dir*step,behavior:prefersLessMotion?'instant':'smooth'});}}
 prev?.addEventListener('click',()=>go(-1));next?.addEventListener('click',()=>go(1));track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(e.key==='ArrowRight'?1:-1);}});
 // Auto advance only while visible; pause for hover, keyboard use, offscreen or reduced motion.
 if(!prefersLessMotion){let focused=false;let visible=false;let timer;
 track.addEventListener('mouseenter',()=>focused=true);track.addEventListener('mouseleave',()=>focused=false);track.addEventListener('focusin',()=>focused=true);track.addEventListener('focusout',()=>focused=false);
 const parent=track.closest('.industry-area,.resource-area');if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>visible=entries[0].isIntersecting,{threshold:.3});observer.observe(parent);}else visible=true;
 timer=setInterval(()=>{if(visible&&!focused&&!document.hidden)go(1);},5900);
 }
}
setupCarousel('industry');setupCarousel('resource');
const enquiry=document.querySelector('#enquiry-form');enquiry?.addEventListener('submit',e=>{
 e.preventDefault();if(!enquiry.reportValidity())return;
 const fields=new FormData(enquiry);const name=String(fields.get('name')||'').trim();const email=String(fields.get('email')||'').trim();const company=String(fields.get('company')||'').trim();const service=String(fields.get('service')||'').trim();const message=String(fields.get('message')||'').trim();
 const subject=`SHEQ & ESG consultation enquiry – ${service}`;
 const body=`Hello Munhungewarwa Consulting,\n\nI would like to discuss your consulting services.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company||'Not provided'}\nService: ${service}\nMessage: ${message||'Please contact me to discuss requirements.'}\n\nKind regards,\n${name}`;
 window.location.href=`mailto:dmunhungewarwa@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
