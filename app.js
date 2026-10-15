const STORAGE_KEY = 'velvet_strand_data_v1';

const defaultData = {
  services: [
    { id: 's1', name: 'Signature Haircut & Blowout', category: 'Haircut', price: 95, duration: '60 min', description: 'Custom consultation, precision cut, scalp massage, and blowout finish.' },
    { id: 's2', name: 'Luxury Gloss & Tone', category: 'Coloring', price: 110, duration: '75 min', description: 'Semi-permanent gloss treatment to enrich tone and add mirror-like shine.' },
    { id: 's3', name: 'Full Balayage Highlights', category: 'Coloring', price: 210, duration: '150 min', description: 'Hand-painted multidimensional highlights tailored to your facial structure.' },
    { id: 's4', name: 'Botanical Repair Treatment', category: 'Treatment', price: 65, duration: '45 min', description: 'Deep conditioning plant infusion that restores moisture and strengthens strands.' },
    { id: 's5', name: 'Express Cleanse & Style', category: 'Haircut', price: 55, duration: '45 min', description: 'Shampoo, condition, and professional styling for events or refresh.' }
  ],
  stylists: [
    { id: 'st1', name: 'Elena Rostova', specialty: 'Master Colorist', bio: 'With over 12 years in editorial styling, Elena specializes in effortless balayage and rich, dimensional tones.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { id: 'st2', name: 'Marcus Vance', specialty: 'Precision Stylist', bio: 'Marcus is known for tailored cuts that complement natural texture and grow out seamlessly.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { id: 'st3', name: 'Chloe Lin', specialty: 'Treatment & Texture Specialist', bio: 'Chloe focuses on scalp health, deep restorative therapies, and vibrant fashion shades.', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' }
  ],
  appointments: [
    { id: 'a1', serviceId: 's1', stylistId: 'st1', date: '2025-05-12', time: '10:30 AM', clientName: 'Sarah Jenkins', clientEmail: 'sarah@example.com', clientPhone: '(555) 234-5678', status: 'Confirmed' },
    { id: 'a2', serviceId: 's3', stylistId: 'st2', date: '2025-05-14', time: '02:00 PM', clientName: 'David Miller', clientEmail: 'david@example.com', clientPhone: '(555) 876-5432', status: 'Confirmed' }
  ],
  reviews: [
    { id: 'r1', name: 'Jessica Taylor', comment: 'Elena transformed my hair completely! The color is stunning and feels so healthy.', rating: 5, date: 'April 2025' },
    { id: 'r2', name: 'Liam O\'Connor', comment: 'Best haircut experience in the city. The salon ambiance is so relaxing and chic.', rating: 5, date: 'April 2025' },
    { id: 'r3', name: 'Maya Patel', comment: 'Chloe gave me the best scalp treatment. Will definitely be returning monthly!', rating: 5, date: 'March 2025' }
  ]
};

function getAppData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
}

function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Router
function route() {
  const hash = (location.hash || '#home').slice(1);
  document.querySelectorAll('main section').forEach(sec => {
    sec.style.display = (sec.id === hash) ? 'block' : 'none';
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + hash);
  });

  if (hash === 'home') renderHome();
  if (hash === 'services') renderServices('all');
  if (hash === 'stylists') renderStylists();
  if (hash === 'book') initBookingWizard();
  if (hash === 'dashboard') initDashboard();
  if (hash === 'admin') initAdmin();
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  getAppData();
  route();
});

// Home
function renderHome() {
  const data = getAppData();
  const grid = document.getElementById('home-reviews-grid');
  grid.innerHTML = data.reviews.map(r => `
    <div class="review-card">
      <p class="service-desc">"${r.comment}"</p>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>${r.name}</strong>
        <span style="color:var(--primary); font-weight:bold;">${'★'.repeat(r.rating)}</span>
      </div>
    </div>
  `).join('');
}

// Services
function renderServices(category) {
  const data = getAppData();
  const grid = document.getElementById('services-grid');
  const filtered = category === 'all' ? data.services : data.services.filter(s => s.category === category);
  
  grid.innerHTML = filtered.map(s => `
    <div class="service-card">
      <div>
        <div class="service-header">
          <h3>${s.name}</h3>
          <span class="service-price">$${s.price}</span>
        </div>
        <p class="service-desc">${s.description}</p>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.85rem; color:var(--text-muted);">⏱ ${s.duration}</span>
        <a href="#book" class="btn btn-primary" onclick="prepareBooking('${s.id}')">Book Service</a>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
    btn.onclick = () => renderServices(btn.dataset.category);
  });
}

// Stylists
function renderStylists() {
  const data = getAppData();
  const grid = document.getElementById('stylists-grid');
  grid.innerHTML = data.stylists.map(st => `
    <div class="stylist-card">
      <div>
        <img src="${st.image}" alt="${st.name}">
        <h3>${st.name}</h3>
        <p class="specialty">${st.specialty}</p>
        <p class="bio">${st.bio}</p>
      </div>
      <a href="#book" class="btn btn-secondary" style="text-align:center;" onclick="prepareStylistBooking('${st.id}')">Book with ${st.name.split(' ')[0]}</a>
    </div>
  `).join('');
}

// Booking Wizard State
let bookingState = { serviceId: null, stylistId: null, date: null, time: null };

function prepareBooking(serviceId) {
  bookingState.serviceId = serviceId;
}

function prepareStylistBooking(stylistId) {
  bookingState.stylistId = stylistId;
}

function initBookingWizard() {
  const data = getAppData();
  
  // Render services list
  const sList = document.getElementById('booking-services-list');
  sList.innerHTML = data.services.map(s => `
    <div class="select-card ${bookingState.serviceId === s.id ? 'selected' : ''}" data-id="${s.id}" onclick="selectBookingService('${s.id}')">
      <h4>${s.name}</h4>
      <p style="color:var(--primary); font-weight:bold; margin-top:0.25rem;">$${s.price} &bull; ${s.duration}</p>
    </div>
  `).join('');

  // Render stylists list
  const stList = document.getElementById('booking-stylists-list');
  stList.innerHTML = data.stylists.map(st => `
    <div class="select-card ${bookingState.stylistId === st.id ? 'selected' : ''}" data-id="${st.id}" onclick="selectBookingStylist('${st.id}')">
      <h4>${st.name}</h4>
      <p style="color:var(--text-muted); font-size:0.9rem; margin-top:0.25rem;">${st.specialty}</p>
    </div>
  `).join('');

  updateWizardSteps();

  // Setup step buttons
  let currentStep = 1;
  const steps = document.querySelectorAll('.wizard-step-content');
  const indicators = document.querySelectorAll('.step-indicator');

  function showStep(step) {
    currentStep = step;
    steps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === step));
    indicators.forEach(i => {
      const sNum = parseInt(i.dataset.step);
      i.classList.toggle('active', sNum === step);
    });
    if (step === 4) updateBookingSummary();
  }

  document.querySelectorAll('.next-step').forEach(btn => {
    btn.onclick = () => {
      if (currentStep === 1 && !bookingState.serviceId) { alert('Please select a service.'); return; }
      if (currentStep === 2 && !bookingState.stylistId) { alert('Please select a stylist.'); return; }
      if (currentStep === 3) {
        const dateVal = document.getElementById('booking-date').value;
        const timeVal = document.getElementById('booking-time').value;
        if (!dateVal || !timeVal) { alert('Please pick a date and time.'); return; }
        bookingState.date = dateVal;
        bookingState.time = timeVal;
      }
      showStep(currentStep + 1);
    };
  });

  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.onclick = () => showStep(currentStep - 1);
  });

  const form = document.getElementById('booking-form');
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;

    const newAppt = {
      id: 'a_' + Date.now(),
      serviceId: bookingState.serviceId,
      stylistId: bookingState.stylistId,
      date: bookingState.date,
      time: bookingState.time,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      status: 'Confirmed'
    };

    const currentData = getAppData();
    currentData.appointments.push(newAppt);
    saveAppData(currentData);

    alert('Appointment successfully booked! You can view it in your Dashboard.');
    bookingState = { serviceId: null, stylistId: null, date: null, time: null };
    form.reset();
    location.hash = '#dashboard';
  };
}

function selectBookingService(id) {
  bookingState.serviceId = id;
  document.querySelectorAll('#booking-services-list .select-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === id);
  });
}

function selectBookingStylist(id) {
  bookingState.stylistId = id;
  document.querySelectorAll('#booking-stylists-list .select-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.id === id);
  });
}

function updateWizardSteps() {}

function updateBookingSummary() {
  const data = getAppData();
  const service = data.services.find(s => s.id === bookingState.serviceId);
  const stylist = data.stylists.find(st => st.id === bookingState.stylistId);
  const box = document.getElementById('booking-summary');
  box.innerHTML = `
    <h4>Review Appointment</h4>
    <p><strong>Service:</strong> ${service ? service.name : 'N/A'} ($${service ? service.price : 0})</p>
    <p><strong>Stylist:</strong> ${stylist ? stylist.name : 'N/A'}</p>
    <p><strong>Date & Time:</strong> ${bookingState.date} at ${bookingState.time}</p>
  `;
}

// Dashboard
function initDashboard() {
  const searchBtn = document.getElementById('dashboard-search-btn');
  searchBtn.onclick = () => {
    const email = document.getElementById('dashboard-email-filter').value.trim();
    renderClientAppointments(email);
  };
}

function renderClientAppointments(email) {
  const data = getAppData();
  const container = document.getElementById('dashboard-content');
  if (!email) {
    container.innerHTML = '<p class="error-msg">Please enter your email address to view appointments.</p>';
    return;
  }

  const appts = data.appointments.filter(a => a.clientEmail.toLowerCase() === email.toLowerCase());
  if (appts.length === 0) {
    container.innerHTML = `<p>No appointments found for ${email}.</p>`;
    return;
  }

  container.innerHTML = appts.map(a => {
    const service = data.services.find(s => s.id === a.serviceId);
    const stylist = data.stylists.find(st => st.id === a.stylistId);
    return `
      <div class="admin-card">
        <div>
          <h4>${service ? service.name : 'Service'} with ${stylist ? stylist.name : 'Stylist'}</h4>
          <p style="color:var(--text-muted); font-size:0.9rem;">${a.date} at ${a.time} &bull; <span style="color:var(--primary); font-weight:600;">${a.status}</span></p>
        </div>
        <div>
          <button class="btn btn-secondary" onclick="cancelAppointment('${a.id}', '${email}')">Cancel</button>
        </div>
      </div>
    `;
  }).join('');
}

function cancelAppointment(id, email) {
  if (confirm('Are you sure you want to cancel this appointment?')) {
    const data = getAppData();
    data.appointments = data.appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
    saveAppData(data);
    renderClientAppointments(email);
  }
}

// Admin
function initAdmin() {
  const loginBtn = document.getElementById('admin-login-btn');
  const passcodeIn = document.getElementById('admin-passcode');
  const errorMsg = document.getElementById('admin-error');
  const authDiv = document.getElementById('admin-auth');
  const panelDiv = document.getElementById('admin-panel');
  const logoutBtn = document.getElementById('admin-logout-btn');

  loginBtn.onclick = () => {
    if (passcodeIn.value === 'admin123') {
      authDiv.style.display = 'none';
      panelDiv.style.display = 'block';
      errorMsg.textContent = '';
      renderAdminAppointments();
    } else {
      errorMsg.textContent = 'Incorrect passcode. Try admin123';
    }
  };

  logoutBtn.onclick = () => {
    authDiv.style.display = 'block';
    panelDiv.style.display = 'none';
    passcodeIn.value = '';
  };
}

function renderAdminAppointments() {
  const data = getAppData();
  const list = document.getElementById('admin-appointments-list');
  
  if (data.appointments.length === 0) {
    list.innerHTML = '<p>No appointments recorded.</p>';
    return;
  }

  list.innerHTML = data.appointments.map(a => {
    const service = data.services.find(s => s.id === a.serviceId);
    const stylist = data.stylists.find(st => st.id === a.stylistId);
    return `
      <div class="admin-card">
        <div>
          <h4>${a.clientName} (${a.clientPhone})</h4>
          <p style="font-size:0.95rem; font-weight:600; color:var(--primary);">${service ? service.name : ''} with ${stylist ? stylist.name : ''}</p>
          <p style="color:var(--text-muted); font-size:0.85rem;">${a.date} at ${a.time} &bull; Email: ${a.clientEmail}</p>
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center;">
          <span style="font-weight:600; font-size:0.85rem; color:${a.status === 'Cancelled' ? 'var(--error)' : 'var(--success)'}">${a.status}</span>
          <button class="btn btn-secondary" style="padding:0.4rem 0.8rem; font-size:0.8rem;" onclick="adminToggleStatus('${a.id}')">Toggle Status</button>
        </div>
      </div>
    `;
  }).join('');
}

function adminToggleStatus(id) {
  const data = getAppData();
  data.appointments = data.appointments.map(a => {
    if (a.id === id) {
      const nextStatus = a.status === 'Confirmed' ? 'Completed' : (a.status === 'Completed' ? 'Cancelled' : 'Confirmed');
      return { ...a, status: nextStatus };
    }
    return a;
  });
  saveAppData(data);
  renderAdminAppointments();
}
