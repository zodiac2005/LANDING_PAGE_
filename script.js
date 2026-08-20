
// ── Sticky Nav ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Reveal on Scroll ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Contact Form ──
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

function getField(id) {
  return document.getElementById(id);
}

function setError(input, show) {
  input.style.borderColor = show ? '#c8472b' : '';
}

// Standard email format check (not restricted to any single provider)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function hideMessages() {
  formSuccess.classList.remove('show');
  formError.classList.remove('show');
}

function showError(message) {
  if (message) formError.textContent = message;
  formError.classList.add('show');
}

submitBtn.addEventListener('click', async () => {
  const nameEl    = getField('fullname');
  const emailEl   = getField('email');
  const messageEl = getField('message');

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const message = messageEl.value.trim();

  hideMessages();

  let valid = true;

  setError(nameEl,    !name);
  setError(emailEl,   !isValidEmail(email));
  setError(messageEl, !message);

  if (!name || !isValidEmail(email) || !message) {
    valid = false;
  }

  if (!valid) {
    showError('يرجى تعبئة جميع الحقول ببيانات صحيحة.');
    return;
  }

  // ── Send to backend ──
  submitBtn.disabled = true;
  const btnLabel = submitBtn.querySelector('span');
  const originalLabel = btnLabel.textContent;
  btnLabel.textContent = 'جاري الإرسال…';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: name, email, message })
    });

    let data = {};
    try { data = await response.json(); } catch (_) { /* no body */ }

    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء إرسال الرسالة.');
    }

    nameEl.value    = '';
    emailEl.value   = '';
    messageEl.value = '';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  } catch (err) {
    showError(err.message || 'تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.');
  } finally {
    btnLabel.textContent = originalLabel;
    submitBtn.disabled = false;
  }
});

// ── Dynamic Services (optional live data from backend) ──
// If a #services-dynamic-root element exists in the page, this will
// replace the static service cards with data fetched from /api/services.
async function loadServicesFromApi() {
  const root = document.querySelector('[data-services-root]');
  if (!root) return;

  try {
    const res = await fetch('/api/services');
    if (!res.ok) return;
    const services = await res.json();

    root.innerHTML = services.map((s, i) => `
      <div class="service-card reveal visible">
        <div class="service-number">${String(i + 1).padStart(2, '0')}</div>
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>
    `).join('');
  } catch (_) {
    // Silently keep the static markup if the API is unavailable
  }
}

loadServicesFromApi();
