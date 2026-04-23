function onLangChange() { renderFeatured(); renderSteps(); renderTestimonials(); }
function onCurrencyChange() { renderFeatured(); }

function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  const items = [...APARTMENTS.slice(0,2), ...HOUSES.slice(0,2)];
  grid.innerHTML = items.map(p => {
    const isApt = !!p.bedrooms !== undefined && p.floor !== undefined;
    const typeLabel = isApt && p.floor ? (currentLang==='vi'?'Căn hộ':'Apartment') : (currentLang==='vi'?(p.type_vi||'Nhà mặt đất'):(p.type_en||'House'));
    const beds = p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} ${currentLang==='vi'?'PN':'bed'}`;
    return `
    <div class="property-card">
      <img class="property-img" src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="property-body">
        <div class="property-type-badge">${typeLabel}</div>
        <div class="property-name">${p.name}</div>
        <div class="property-meta">${beds} · ${p.area}m² ${p.floor ? `· ${currentLang==='vi'?'Tầng':'Floor'} ${p.floor}` : `· ${currentLang==='vi'?'Đất':'Land'} ${p.land_area}m²`}</div>
        <div class="property-price">${formatPrice(p.price)}</div>
        ${showUSD ? '' : `<div class="property-price-rent">${formatRent(p.rent_price)}</div>`}
      </div>
    </div>`;
  }).join('');
}

function renderSteps() {
  const steps = currentLang === 'vi'
    ? [
        { icon:'📝', title:'Gửi yêu cầu', desc:'Mô tả nhu cầu và ngân sách của bạn' },
        { icon:'📋', title:'Nhận báo cọc', desc:'Nhận báo đặt cọc 10% trong vài phút' },
        { icon:'✍️', title:'Ký số', desc:'Ký xác nhận trên nền tảng trực tuyến' },
        { icon:'💳', title:'Thanh toán', desc:'Thanh toán an toàn qua Stripe' },
      ]
    : [
        { icon:'📝', title:'Submit Request', desc:'Describe your needs and budget' },
        { icon:'📋', title:'Receive Quote', desc:'Get a 10% deposit quote in minutes' },
        { icon:'✍️', title:'Sign Digitally', desc:'Sign your confirmation online' },
        { icon:'💳', title:'Pay Securely', desc:'Safe payment via Stripe' },
      ];
  document.getElementById('steps-grid').innerHTML = steps.map((s,i) => `
    <div class="card text-center">
      <div style="font-size:2.5rem;margin-bottom:.75rem">${s.icon}</div>
      <div style="font-size:.72rem;font-weight:700;color:var(--primary);letter-spacing:.06em;margin-bottom:.4rem">${currentLang==='vi'?'BƯỚC':'STEP'} ${i+1}</div>
      <div style="font-weight:700;margin-bottom:.4rem">${s.title}</div>
      <div class="text-muted text-sm">${s.desc}</div>
    </div>`).join('');
}

function renderTestimonials() {
  const items = currentLang === 'vi'
    ? [
        { stars:'★★★★★', text:'"Quy trình đặt cọc online rất tiện lợi, ký số và thanh toán chỉ mất 10 phút. Căn hộ đẹp hơn mong đợi!"', name:'Chị Lan Anh', role:'Căn hộ Aqua Bay T1-1201', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
        { stars:'★★★★★', text:'"Đội ngũ tư vấn nhiệt tình, thủ tục rõ ràng minh bạch. Biệt thự BellaVita vượt kỳ vọng của gia đình tôi."', name:'Anh Minh Tuấn', role:'Biệt thự BellaVita BV-12', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
        { stars:'★★★★☆', text:'"Trang web dễ dùng, thông tin chi tiết. Tôi tìm được căn hộ phù hợp ngay lần đầu sử dụng."', name:'Chị Thu Hương', role:'Studio Aqua Bay T2-2801', avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
      ]
    : [
        { stars:'★★★★★', text:'"The online deposit process was so convenient – signing and paying took just 10 minutes. The apartment exceeded my expectations!"', name:'Ms. Lan Anh', role:'Aqua Bay T1-1201 Apartment', avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
        { stars:'★★★★★', text:'"The consulting team was enthusiastic, procedures clear and transparent. BellaVita Villa exceeded my family\'s expectations."', name:'Mr. Minh Tuan', role:'BellaVita BV-12 Villa', avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
        { stars:'★★★★☆', text:'"Easy-to-use website with detailed information. I found the right apartment on my very first visit."', name:'Ms. Thu Huong', role:'Aqua Bay T2-2801 Studio', avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
      ];

  document.getElementById('testimonials-grid').innerHTML = items.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">${t.stars}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <img class="testimonial-avatar" src="${t.avatar}" alt="${t.name}" loading="lazy" />
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav('home');
  renderFooter();
  renderFeatured();
  renderSteps();
  renderTestimonials();
  applyLang();
});
