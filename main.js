// ── NAVBAR SCROLL ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ──
const ham = document.querySelector('.hamburger');
const nav = document.querySelector('.nav-links');
if (ham) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('open'); nav.classList.remove('open');
  }));
}

// ── SCROLL REVEAL ──
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── COUNTER ──
const co = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); co.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-n').forEach(el => co.observe(el));
function animCount(el) {
  const target = +el.dataset.t, dur = 1800, steps = 60, inc = target / steps;
  let cur = 0, s = 0;
  const t = setInterval(() => {
    s++; cur = Math.min(Math.round(inc * s), target); el.textContent = cur;
    if (s >= steps) clearInterval(t);
  }, dur / steps);
}

// ── FLASH AUTO-DISMISS ──
document.querySelectorAll('.flash').forEach(f => {
  setTimeout(() => { f.style.transition = 'opacity .4s'; f.style.opacity = '0'; setTimeout(() => f.remove(), 450); }, 5000);
});

// ── PORTFOLIO TABS ──
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = tab.dataset.tab;
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('on'));
    tab.classList.add('on');
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.style.display = p.dataset.panel === target ? 'grid' : 'none';
    });
    // Update banner
    const banner = document.getElementById('instaBanner');
    if (banner) banner.style.display = target === 'instagram' ? 'block' : 'none';
    const igCta = document.getElementById('igCta');
    if (igCta) igCta.style.display = target === 'instagram' ? 'flex' : 'none';
  });
});

// ── FILTER BUTTONS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.port-item').forEach(item => {
      item.style.display = (cat === 'All' || item.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// ── FILE INPUT LABEL ──
const fi = document.getElementById('files');
const fl = document.getElementById('fileLabel');
if (fi && fl) {
  fi.addEventListener('change', () => {
    const n = fi.files.length;
    fl.textContent = n > 0 ? `${n} file${n > 1 ? 's' : ''} selected` : 'Choose files...';
  });
}

// ── LOCAL UPLOAD PREVIEW (no server needed) ──
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', e => {
    e.preventDefault();
    const files = document.getElementById('files').files;
    const cat   = document.getElementById('uploadCat').value;
    const grid  = document.getElementById('uploadGrid');
    const empty = grid.querySelector('.empty');
    if (empty) empty.remove();
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const div = document.createElement('div');
        div.className = 'port-item';
        div.dataset.cat = cat;
        div.innerHTML = `
          <img src="${ev.target.result}" alt="${file.name}" loading="lazy">
          <div class="port-overlay">
            <span class="ov-cat">${cat}</span>
            <p class="ov-cap">${file.name.replace(/\.[^.]+$/,'').replace(/_/g,' ')}</p>
          </div>
          <span class="badge badge-upload"><i class="fas fa-check"></i> Uploaded</span>`;
        grid.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
    showFlash(`${files.length} image(s) added to portfolio!`, 'ok');
    uploadForm.reset();
    if (fl) fl.textContent = 'Choose files...';
    // Switch to upload tab
    document.querySelector('[data-tab="uploaded"]')?.click();
  });
}

function showFlash(msg, type='ok') {
  let wrap = document.querySelector('.flash-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'flash-wrap'; document.body.appendChild(wrap); }
  const f = document.createElement('div');
  f.className = `flash flash-${type}`;
  f.innerHTML = `<span>${msg}</span><button class="flash-x" onclick="this.parentElement.remove()">×</button>`;
  wrap.appendChild(f);
  setTimeout(() => { f.style.transition = 'opacity .4s'; f.style.opacity = '0'; setTimeout(() => f.remove(), 450); }, 5000);
}

// ── CONTACT FORM ──
const cf = document.getElementById('contactForm');
if (cf) {
  cf.addEventListener('submit', e => {
    e.preventDefault();
    const name = cf.querySelector('[name="name"]').value.trim();
    showFlash(`Thank you ${name}! We'll contact you within 24 hours.`, 'ok');
    cf.reset();
  });
}
