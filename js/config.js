const SUPABASE_URL = 'https://jllirmrpkayiyajwebbr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbGlybXJwa2F5aXlhandlYmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDI5NDMsImV4cCI6MjA5MjM3ODk0M30.1_DZoCymoVUwdPrv_cZQPkF4NT9Rcucw7kvONvcCs0A';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51TOrhICJmqcefePCn4fUZblKi0qivAVicSdgjYnrn4PboIUQ0LXE3JtbmEaZlOz1ifpzyojXi8xw9MroZypL3z98005Yr5Xp48';

const { createClient } = window.supabase;
window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== CURRENCY =====
const USD_RATE = 25500; // 1 USD = 25,500 VND
let showUSD = false;

function formatVND(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + ' tỷ';
  if (n >= 1e6) return (n / 1e6).toFixed(0) + ' triệu';
  return n.toLocaleString('vi-VN') + ' ₫';
}
function formatUSD(n) {
  return '$' + Math.round(n / USD_RATE).toLocaleString('en-US');
}
function formatPrice(n) { return showUSD ? formatUSD(n) : formatVND(n); }
function formatRent(n) { return showUSD ? formatUSD(n) + '/mo' : formatVND(n) + '/tháng'; }

// ===== LANGUAGE =====
let currentLang = localStorage.getItem('ecopark_lang') || 'vi';

const i18n = {
  vi: {
    nav_home: 'Trang chủ', nav_apartments: 'Căn hộ', nav_houses: 'Nhà mặt đất',
    nav_contact: 'Liên hệ', nav_login: 'Đăng nhập', nav_dashboard: 'Dashboard',
    nav_logout: 'Đăng xuất',
    footer_copy: '© 2025 Ecopark Real Estate. Bảo lưu mọi quyền.',
    footer_tagline: 'Sống xanh – Sống đẹp – Sống khỏe',
  },
  en: {
    nav_home: 'Home', nav_apartments: 'Apartments', nav_houses: 'Houses',
    nav_contact: 'Contact', nav_login: 'Login', nav_dashboard: 'Dashboard',
    nav_logout: 'Sign out',
    footer_copy: '© 2025 Ecopark Real Estate. All rights reserved.',
    footer_tagline: 'Live Green – Live Beautiful – Live Healthy',
  }
};

function t(key) { return (i18n[currentLang] || i18n.vi)[key] || key; }

function applyLang() {
  document.querySelectorAll('[data-vi]').forEach(el => {
    el.innerHTML = currentLang === 'vi' ? el.dataset.vi : (el.dataset.en || el.dataset.vi);
  });
  document.querySelectorAll('[data-vi-ph]').forEach(el => {
    el.placeholder = currentLang === 'vi' ? el.dataset.viPh : (el.dataset.enPh || el.dataset.viPh);
  });
  const btn = document.getElementById('nav-lang-btn');
  if (btn) btn.textContent = currentLang === 'vi' ? '🌐 EN' : '🌐 VI';
  const currBtn = document.getElementById('nav-currency-btn');
  if (currBtn) currBtn.style.display = currentLang === 'en' ? 'flex' : 'none';
}

function toggleLang() {
  currentLang = currentLang === 'vi' ? 'en' : 'vi';
  localStorage.setItem('ecopark_lang', currentLang);
  if (currentLang === 'vi') { showUSD = false; }
  applyLang();
  if (typeof onLangChange === 'function') onLangChange();
}

function toggleCurrency() {
  showUSD = !showUSD;
  const btn = document.getElementById('nav-currency-btn');
  if (btn) btn.textContent = showUSD ? '💱 VNĐ' : '💱 USD';
  if (typeof onCurrencyChange === 'function') onCurrencyChange();
}

// ===== PROPERTY DATA =====
const APARTMENTS = [
  {
    id: 'aqua-t1-1201',
    name: 'Aqua Bay T1 - 1201',
    name_en: 'Aqua Bay T1 - 1201',
    area: 72, bedrooms: 2, bathrooms: 2, floor: 12,
    view_vi: 'View hồ sinh thái', view_en: 'Eco-lake view',
    price: 3400000000, rent_price: 18000000,
    image: '/assets/images/can-ho/20260421095322-bca0_wm.jpg',
    gallery: ['/assets/images/can-ho/20260421095326-47cd_wm.jpg'],
    desc_vi: 'Căn hộ 2 phòng ngủ view hồ, nội thất cao cấp, tầng 12 thoáng mát.',
    desc_en: '2-bedroom apartment with eco-lake view, premium furnishings, airy 12th floor.',
    features_vi: ['Ban công rộng', 'View hồ sinh thái', 'Nội thất đầy đủ', 'Smart home'],
    features_en: ['Wide balcony', 'Eco-lake view', 'Fully furnished', 'Smart home'],
  },
  {
    id: 'aqua-t1-1505',
    name: 'Aqua Bay T1 - 1505',
    name_en: 'Aqua Bay T1 - 1505',
    area: 48, bedrooms: 1, bathrooms: 1, floor: 15,
    view_vi: 'View khu biệt thự', view_en: 'Villa zone view',
    price: 2200000000, rent_price: 12000000,
    image: '/assets/images/can-ho/20260421095320-5aef_wm.jpg',
    gallery: ['/assets/images/can-ho/20260421095319-53ea_wm.jpg'],
    desc_vi: 'Căn hộ 1 phòng ngủ, view khu biệt thự xanh, thiết kế hiện đại tầng 15.',
    desc_en: '1-bedroom apartment overlooking the villa zone, modern design on the 15th floor.',
    features_vi: ['View khu biệt thự', 'Thiết kế hiện đại', 'Đầy đủ nội thất', 'An ninh 24/7'],
    features_en: ['Villa zone view', 'Modern design', 'Fully furnished', '24/7 security'],
  },
  {
    id: 'aqua-t2-2801',
    name: 'Aqua Bay T2 - 2801',
    name_en: 'Aqua Bay T2 - 2801',
    area: 35, bedrooms: 0, bathrooms: 1, floor: 28,
    view_vi: 'Toàn cảnh hồ cao tầng', view_en: 'Full eco-lake panorama',
    price: 1850000000, rent_price: 9000000,
    image: '/assets/images/can-ho/20260421095321-d4c1_wm.jpg',
    gallery: ['/assets/images/can-ho/20260421095320-1599_wm.jpg'],
    desc_vi: 'Studio cao cấp tầng 28, toàn cảnh hồ sinh thái Ecopark, thiết kế thông minh.',
    desc_en: 'Premium studio on the 28th floor, full eco-lake panorama, smart space design.',
    features_vi: ['Tầng cao view đẹp', 'Studio thông minh', 'Full nội thất', 'Hồ bơi tầng thượng'],
    features_en: ['High-floor views', 'Smart studio', 'Full furnishings', 'Rooftop pool'],
  },
  {
    id: 'aqua-t2-3501',
    name: 'Aqua Bay Penthouse 3501',
    name_en: 'Aqua Bay Penthouse 3501',
    area: 98, bedrooms: 3, bathrooms: 2, floor: 35,
    view_vi: 'Panoramic 360° Ecopark', view_en: '360° Ecopark panoramic',
    price: 6800000000, rent_price: 38000000,
    image: '/assets/images/can-ho/20260421095318-6956_wm.jpg',
    gallery: ['/assets/images/can-ho/20260421095323-7812_wm.jpg'],
    desc_vi: 'Penthouse tầng 35, sân thượng riêng 50m², view panoramic 360° toàn Ecopark.',
    desc_en: '35th-floor penthouse, private 50m² rooftop terrace, 360° Ecopark panoramic view.',
    features_vi: ['Sân thượng riêng 50m²', 'View 360° Ecopark', 'Nội thất hạng sang', 'Private elevator'],
    features_en: ['Private 50m² rooftop', '360° Ecopark view', 'Luxury furnishings', 'Private elevator'],
  }
];

const HOUSES = [
  {
    id: 'bellavita-bv12',
    name: 'BellaVita BV-12',
    name_en: 'BellaVita BV-12',
    area: 220, land_area: 350, bedrooms: 4, bathrooms: 3,
    type_vi: 'Biệt thự đơn lập', type_en: 'Detached Villa',
    price: 12500000000, rent_price: 55000000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    desc_vi: 'Biệt thự đơn lập 4 phòng ngủ, sân vườn 150m², góc khu BellaVita xanh mát.',
    desc_en: '4-bedroom detached villa, 150m² garden, corner lot in the lush BellaVita zone.',
    features_vi: ['Sân vườn riêng 150m²', 'Garage 2 xe', 'Bể bơi riêng', 'Smart security'],
    features_en: ['Private 150m² garden', '2-car garage', 'Private pool', 'Smart security'],
  },
  {
    id: 'bellavita-bv34',
    name: 'BellaVita BV-34',
    name_en: 'BellaVita BV-34',
    area: 130, land_area: 180, bedrooms: 3, bathrooms: 2,
    type_vi: 'Nhà phố vườn', type_en: 'Garden Townhouse',
    price: 7800000000, rent_price: 32000000,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    desc_vi: 'Nhà phố vườn 3 phòng ngủ, hướng Đông Nam, gần hồ BellaVita 200m.',
    desc_en: '3-bedroom garden townhouse, southeast facing, 200m from BellaVita lake.',
    features_vi: ['Sân vườn 50m²', 'Hướng Đông Nam', 'Gần hồ 200m', 'Khu dân cư yên tĩnh'],
    features_en: ['50m² garden', 'Southeast facing', '200m to lake', 'Quiet neighborhood'],
  },
  {
    id: 'greennest-gn07',
    name: 'Green Nest GN-07',
    name_en: 'Green Nest GN-07',
    area: 180, land_area: 280, bedrooms: 4, bathrooms: 3,
    type_vi: 'Biệt thự song lập', type_en: 'Semi-detached Villa',
    price: 9500000000, rent_price: 45000000,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    desc_vi: 'Biệt thự song lập góc hồ, tầm nhìn hồ sinh thái 180°, khu Green Nest.',
    desc_en: 'Semi-detached villa on the lake corner, 180° eco-lake view, Green Nest zone.',
    features_vi: ['View hồ 180°', 'Góc 2 mặt thoáng', 'Sân vườn 100m²', 'Vị trí đắc địa'],
    features_en: ['180° lake view', 'Corner 2-sided open', '100m² garden', 'Prime location'],
  },
  {
    id: 'greennest-gn15',
    name: 'Green Nest GN-15',
    name_en: 'Green Nest GN-15',
    area: 145, land_area: 200, bedrooms: 3, bathrooms: 2,
    type_vi: 'Shophouse', type_en: 'Shophouse',
    price: 8200000000, rent_price: 38000000,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    desc_vi: 'Shophouse 3 phòng ngủ, mặt tiền đường chính, tầng 1 kinh doanh linh hoạt.',
    desc_en: '3-bedroom shophouse, main road frontage, flexible ground-floor commercial use.',
    features_vi: ['Mặt tiền đường chính', 'Tầng 1 kinh doanh', '3 tầng + tum', 'Kết cấu kiên cố'],
    features_en: ['Main road frontage', 'Ground-floor commercial', '3 floors + terrace', 'Solid structure'],
  }
];

// ===== AUTH HELPERS =====
async function getUser() {
  const { data: { user } } = await window.supabase.auth.getUser();
  return user;
}

async function signOut() {
  await window.supabase.auth.signOut();
  window.location.href = '/auth.html';
}

// ===== NAV =====
async function renderNav(activePage) {
  const user = await getUser();
  const nav = document.getElementById('nav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/index.html" class="nav-brand">🌿 Eco<span>park</span></a>
      <div class="nav-links">
        <a href="/index.html" ${activePage==='home'?'class="active"':''} data-vi="Trang chủ" data-en="Home">Trang chủ</a>
        <a href="/can-ho.html" ${activePage==='apartments'?'class="active"':''} data-vi="Căn hộ" data-en="Apartments">Căn hộ</a>
        <a href="/nha-mat-dat.html" ${activePage==='houses'?'class="active"':''} data-vi="Nhà mặt đất" data-en="Houses">Nhà mặt đất</a>
        <a href="/contact.html" ${activePage==='contact'?'class="active"':''} data-vi="Liên hệ" data-en="Contact">Liên hệ</a>
        ${user
          ? `<a href="/dashboard.html" ${activePage==='dashboard'?'class="active"':''} data-vi="Dashboard" data-en="Dashboard">Dashboard</a>`
          : ''}
      </div>
      <div class="nav-actions">
        <button id="nav-currency-btn" class="nav-currency" style="display:none">💱 USD</button>
        <button id="nav-lang-btn" class="nav-lang">🌐 EN</button>
        ${user
          ? `<button id="nav-signout-btn" class="btn-outline btn-sm" data-vi="Đăng xuất" data-en="Sign out">Đăng xuất</button>`
          : `<a href="/auth.html" class="btn-primary btn-sm" data-vi="Đăng nhập" data-en="Login">Đăng nhập</a>`}
      </div>
      <button class="nav-menu-btn" id="nav-menu-btn">☰</button>
    </div>`;

  document.getElementById('nav-lang-btn').addEventListener('click', toggleLang);
  document.getElementById('nav-currency-btn').addEventListener('click', toggleCurrency);
  document.getElementById('nav-menu-btn').addEventListener('click', () => nav.classList.toggle('open'));
  document.getElementById('nav-signout-btn')?.addEventListener('click', signOut);

  applyLang();
}

// ===== FOOTER =====
function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">🌿 Ecopark Real Estate</div>
          <p class="footer-desc" data-vi="Đơn vị phân phối bất động sản Ecopark uy tín. Đồng hành cùng bạn tìm ngôi nhà mơ ước trong không gian xanh." data-en="Trusted Ecopark real estate distributor. Helping you find your dream home in a green environment.">Đơn vị phân phối bất động sản Ecopark uy tín. Đồng hành cùng bạn tìm ngôi nhà mơ ước trong không gian xanh.</p>
        </div>
        <div>
          <div class="footer-heading" data-vi="Sản phẩm" data-en="Products">Sản phẩm</div>
          <ul class="footer-links">
            <li><a href="/can-ho.html" data-vi="Căn hộ chung cư" data-en="Apartments">Căn hộ chung cư</a></li>
            <li><a href="/nha-mat-dat.html" data-vi="Nhà ở mặt đất" data-en="Ground Houses">Nhà ở mặt đất</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading" data-vi="Hỗ trợ" data-en="Support">Hỗ trợ</div>
          <ul class="footer-links">
            <li><a href="/contact.html" data-vi="Liên hệ" data-en="Contact">Liên hệ</a></li>
            <li><a href="/auth.html" data-vi="Đăng nhập" data-en="Login">Đăng nhập</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading" data-vi="Liên hệ" data-en="Contact">Liên hệ</div>
          <ul class="footer-links">
            <li>📧 gsg.zero@gmail.com</li>
            <li>📞 0797 986 525</li>
            <li>📍 Ecopark, Hưng Yên</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span data-vi="© 2025 Ecopark Real Estate. Bảo lưu mọi quyền." data-en="© 2025 Ecopark Real Estate. All rights reserved.">© 2025 Ecopark Real Estate. Bảo lưu mọi quyền.</span>
        <span data-vi="Sống xanh – Sống đẹp – Sống khỏe" data-en="Live Green – Live Beautiful – Live Healthy">Sống xanh – Sống đẹp – Sống khỏe</span>
      </div>
    </div>`;
  applyLang();
}

// ===== ALERT =====
function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
}
function clearAlert(id) { const el = document.getElementById(id); if (el) el.innerHTML = ''; }
