// Mobile navigation
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open navigation');
}));
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// A mailto: navigation often appears to do nothing when no default mail client
// has been configured. Instead, prepare the enquiry visibly with three user-
// initiated methods. No form data is transmitted or saved by this page.
const enquiryForm = document.querySelector('#enquiry-form');
const result = document.querySelector('#enquiry-result');
const gmail = document.querySelector('#gmail-compose');
const mailapp = document.querySelector('#email-compose');
const preview = document.querySelector('#enquiry-preview');
const copy = document.querySelector('#copy-enquiry');
const copyStatus = document.querySelector('#copy-status');

enquiryForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;
  const values = new FormData(enquiryForm);
  const name = String(values.get('name') || '').trim();
  const organisation = String(values.get('organisation') || '').trim() || 'Not provided';
  const email = String(values.get('email') || '').trim();
  const service = String(values.get('service') || 'General consultancy enquiry');
  const message = String(values.get('message') || '').trim();
  const subject = `SHEQ & ESG Consultancy Enquiry - ${name}`;
  const body = `Name: ${name}\nOrganisation: ${organisation}\nEmail: ${email}\nService: ${service}\n\nEnquiry:\n${message}`;
  const recipient = 'dmunhungewarwa@gmail.com';
  const params = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  mailapp.href = `mailto:${recipient}?${params}`;
  gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  preview.value = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
  result.hidden = false;
  copyStatus.textContent = '';
  result.scrollIntoView({behavior:'smooth',block:'nearest'});
});

copy?.addEventListener('click', async () => {
  if (!preview.value) return;
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard not available');
    await navigator.clipboard.writeText(preview.value);
    copyStatus.textContent = 'Copied. Paste the enquiry into your preferred email service.';
  } catch (error) {
    preview.focus();
    preview.select();
    // Older browser fallback. If it is blocked, the preview stays selected.
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    copyStatus.textContent = copied
      ? 'Copied. Paste the enquiry into your preferred email service.'
      : 'Message selected. Press Ctrl+C (or Cmd+C) to copy it.';
  }
});
