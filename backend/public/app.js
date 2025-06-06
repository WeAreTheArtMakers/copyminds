// public/app.js
// Dinamik olarak current origin’i alır (https://copyminds.onrender.com gibi)
const BASE = window.location.origin;

// Kullanıcı arayüzünü göster
function showUserArea(username) {
  const authContainer = document.getElementById('auth-container');
  const userArea      = document.getElementById('user-area');
  const welcome       = document.getElementById('welcome-username');
  if (authContainer) authContainer.classList.add('d-none');
  if (userArea)      userArea.classList.remove('d-none');
  if (welcome)       welcome.innerText = username;
  document.body.classList.remove('auth-active');

  const dash    = document.getElementById('ai-dashboard-fake-widgets');
  const yatirim = document.getElementById('yatirim-firsatlari-wrapper');
  if (dash)    { dash.classList.remove('d-none'); dash.style.display = ''; }
  if (yatirim) { yatirim.style.removeProperty('display'); }

  setTimeout(() => {
    const onboarding = document.getElementById('fake-onboarding');
    if (onboarding) onboarding.style.display = 'flex';
  }, 500);

  showKycWarning();
  updateNavbarUserUI(username);
}

// Giriş formunu göster
function showAuth() {
  const authContainer = document.getElementById('auth-container');
  const userArea      = document.getElementById('user-area');
  if (authContainer) authContainer.classList.remove('d-none');
  if (userArea)      userArea.classList.add('d-none');
  document.body.classList.add('auth-active');

  const dash    = document.getElementById('ai-dashboard-fake-widgets');
  const yatirim = document.getElementById('yatirim-firsatlari-wrapper');
  if (dash)    { dash.classList.add('d-none'); dash.style.display = 'none'; }
  if (yatirim) { yatirim.style.setProperty('display', 'none'); }

  showKycWarning();
  updateNavbarUserUI(null);
}

// KYC uyarısını göster/gizle
function showKycWarning() {
  const kycWarning = document.getElementById('kyc-warning');
  if (!kycWarning) return;
  if (!window.kycCompleted) {
    kycWarning.style.removeProperty('display');
  } else {
    kycWarning.style.setProperty('display', 'none');
  }
}

// DOM hazır olduğunda çalışacak başlangıç kodu
window.addEventListener('DOMContentLoaded', function () {
  // Chart.js ile sahte grafikler
  if (window.Chart) {
    // Line Chart
    const lineCtx = document.getElementById('ultra-line-chart')?.getContext('2d');
    if (lineCtx) {
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz'],
          datasets: [{
            label: 'Aylık Getiri (%)',
            data: [2.5,4.1,3.2,6.7,5.3,7.8,6.1],
            borderColor: '#ffb86c',
            backgroundColor: 'rgba(255,184,108,0.12)',
            tension: 0.45,
            pointRadius: 5,
            pointBackgroundColor: '#f093fb',
            fill: true,
          }]
        },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#bfc6d1' } },
            y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#bfc6d1' }, beginAtZero: true }
          }
        }
      });
    }
    // Pie Chart
    const pieCtx = document.getElementById('ultra-pie-chart')?.getContext('2d');
    if (pieCtx) {
      new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['BTC','ETH','BNB','SOL','Diğer'],
          datasets: [{
            data: [38,22,16,12,12],
            backgroundColor: ['#ffb86c','#f093fb','#50fa7b','#8be9fd','#bd93f9'],
            borderWidth: 0
          }]
        },
        options: {
          plugins: { legend: { labels: { color: '#fff', font: { size: 14 } } } }
        }
      });
    }
  }

  // Sahte işlem geçmişi
  const userTradesList = document.getElementById('user-trades-list');
  if (userTradesList) {
    const fakeTrades = [
      { symbol:'BTC/USDT', side:'Al', amount:0.012, price:68750, date:'2025-05-28 21:12' },
      { symbol:'ETH/USDT', side:'Sat', amount:0.8,   price:3900,  date:'2025-05-28 19:44' },
      { symbol:'SOL/USDT', side:'Al', amount:5.4,   price:158,   date:'2025-05-27 15:09' },
      { symbol:'BNB/USDT', side:'Al', amount:1.1,   price:600,   date:'2025-05-26 09:30' }
    ];
    userTradesList.innerHTML = fakeTrades.map(trade =>
      `<li class="list-group-item d-flex justify-content-between align-items-center">
         <span><span class="badge bg-gradient me-2">${trade.side}</span><b>${trade.symbol}</b></span>
         <span class="text-muted small">${trade.amount} @ ${trade.price} <span class="ms-2">${trade.date}</span></span>
       </li>`
    ).join('');
  }

  // Başlangıç durumları
  window.kycCompleted    = false;
  const savedUser        = localStorage.getItem('username');
  if (savedUser) showUserArea(savedUser);
  else           showAuth();

  // Navbar güncelle
  updateNavbarUserUI(savedUser);

  // --- GİRİŞ İŞLEMİ ---
  const loginForm    = document.getElementById('login-form');
  const loginBtn     = document.getElementById('login-btn');
  const registerBtn  = document.getElementById('register-btn');
  if (loginForm && loginBtn && registerBtn) {
    loginForm.onsubmit = async function (e) {
      e.preventDefault();
      const authMessage = document.getElementById('auth-message');
      authMessage.innerHTML = '<span class="loading-spinner"></span> Giriş yapılıyor...';

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      try {
        const res  = await fetch(`${BASE}/api/user/login`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('Login failed:', data);
          authMessage.innerHTML = `<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> ${data.error || 'Sunucu hatası!'}</span>`;
          return;
        }

        localStorage.setItem('username', username);
        showUserArea(username);
        authMessage.innerHTML = '';
      }
      catch (err) {
        console.error('Fetch error:', err);
        authMessage.innerHTML = '<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> Sunucu hatası!</span>';
      }
    };

    // --- KAYIT İŞLEMİ (header buton) ---
    registerBtn.onclick = async function () {
      const authMessage = document.getElementById('auth-message');
      authMessage.innerHTML = '<span class="loading-spinner"></span> Kayıt olunuyor...';

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      try {
        const res  = await fetch(`${BASE}/api/user/register`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('Register failed:', data);
          authMessage.innerHTML = `<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> ${data.error || 'Kayıt başarısız!'}</span>`;
          return;
        }

        localStorage.setItem('registered_username', username);
        authMessage.innerHTML = '<span class="badge bg-success animate-in"><i class="fas fa-check-circle"></i> Kayıt başarılı! Giriş yapabilirsiniz.</span>';
      }
      catch (err) {
        console.error('Fetch error:', err);
        authMessage.innerHTML = '<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> Sunucu hatası!</span>';
      }
    };
  }

  // --- LOGOUT ---
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem('username');
      showAuth();
    };
  }

  // --- KYC Link’i ---
  const kycLink = document.querySelector('#kyc-warning .alert-link');
  if (kycLink) {
    kycLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.kycCompleted = true;
      showKycWarning();
    });
  }

  // --- REGISTER MODAL ---
  const showRegisterModalBtn = document.getElementById('show-register-modal');
  const registerModal        = document.getElementById('registerModal');
  let bsRegisterModal        = null;
  if (registerModal && window.bootstrap) {
    bsRegisterModal = new window.bootstrap.Modal(registerModal);
  }
  if (showRegisterModalBtn && bsRegisterModal) {
    showRegisterModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-form').reset();
      document.getElementById('register-message').innerHTML = '';
      bsRegisterModal.show();
    });
  }

  // --- KAYIT MODAL FORM ---
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.onsubmit = async function (e) {
      e.preventDefault();
      const registerMessage = document.getElementById('register-message');
      registerMessage.innerHTML = '<span class="loading-spinner"></span> Kayıt olunuyor...';

      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      try {
        const res  = await fetch(`${BASE}/api/user/register`, {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('Register (modal) failed:', data);
          registerMessage.innerHTML = `<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> ${data.error || 'Kayıt başarısız!'}</span>`;
          return;
        }

        registerMessage.innerHTML = '<span class="badge bg-success animate-in"><i class="fas fa-check-circle"></i> Kayıt başarılı! Giriş yapılıyor...</span>';
        setTimeout(() => {
          if (bsRegisterModal) bsRegisterModal.hide();
          document.getElementById('username').value = username;
          document.getElementById('password').value = password;
          document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }, 1200);
      }
      catch (err) {
        console.error('Fetch error:', err);
        registerMessage.innerHTML = '<span class="badge bg-danger animate-in"><i class="fas fa-times-circle"></i> Sunucu hatası!</span>';
      }
    };
  }

});

// Navbar’daki kullanıcı adı ve çıkış butonunu güncelle
function updateNavbarUserUI(username) {
  const navbarUsername = document.getElementById('navbar-username');
  const navLogoutBtn   = document.getElementById('nav-logout-btn');
  if (username) {
    navbarUsername?.classList.remove('d-none');
    navbarUsername.textContent = username;
    navLogoutBtn?.classList.remove('d-none');
  } else {
    navbarUsername?.classList.add('d-none');
    navLogoutBtn?.classList.add('d-none');
  }
}
