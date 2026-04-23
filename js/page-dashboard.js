const STATUS_VI = { pending:'Chờ xử lý', quoted:'Đã báo giá', signed:'Đã ký', paid:'Đã thanh toán' };
const STATUS_EN = { pending:'Pending', quoted:'Quoted', signed:'Signed', paid:'Paid' };
const TYPE_VI = { buy:'Mua', rent:'Thuê' };
const TYPE_EN = { buy:'Buy', rent:'Rent' };
const PROP_VI = { apartment:'Căn hộ', house:'Nhà mặt đất' };
const PROP_EN = { apartment:'Apartment', house:'House' };

function onLangChange() { location.reload(); }

document.addEventListener('DOMContentLoaded', async () => {
  renderNav('dashboard');
  renderFooter();

  const user = await getUser();
  if (!user) { window.location.href = '/auth.html'; return; }

  const name = user.user_metadata?.full_name || user.email.split('@')[0];
  document.getElementById('dash-greeting').textContent =
    currentLang==='vi' ? `Xin chào, ${name} 👋` : `Hello, ${name} 👋`;

  const { data: requests, error } = await window.supabase
    .from('ecopark_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  document.getElementById('spinner').style.display = 'none';

  if (error) { showAlert('alert-box', error.message); return; }

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending' || r.status === 'quoted').length;
  const signed = requests.filter(r => r.status === 'signed').length;
  const paid = requests.filter(r => r.status === 'paid').length;

  document.getElementById('dash-stats').innerHTML = `
    <div class="stat-card"><div class="stat-icon">📋</div><div class="stat-val">${total}</div><div class="stat-label" data-vi="Tổng yêu cầu" data-en="Total Requests">${currentLang==='vi'?'Tổng yêu cầu':'Total Requests'}</div></div>
    <div class="stat-card"><div class="stat-icon">⏳</div><div class="stat-val">${pending}</div><div class="stat-label">${currentLang==='vi'?'Đang xử lý':'Pending'}</div></div>
    <div class="stat-card"><div class="stat-icon">✍️</div><div class="stat-val">${signed}</div><div class="stat-label">${currentLang==='vi'?'Đã ký':'Signed'}</div></div>
    <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-val">${paid}</div><div class="stat-label">${currentLang==='vi'?'Đã thanh toán':'Paid'}</div></div>`;

  document.getElementById('requests-section').style.display = 'block';

  if (requests.length === 0) {
    document.getElementById('requests-list').innerHTML = `
      <div class="card text-center" style="padding:3rem">
        <div style="font-size:3rem;margin-bottom:1rem">🏠</div>
        <p class="text-muted mb-2">${currentLang==='vi'?'Bạn chưa có yêu cầu nào.':'You have no requests yet.'}</p>
        <a href="/request.html" class="btn-primary">${currentLang==='vi'?'Gửi yêu cầu đầu tiên':'Send First Request'}</a>
      </div>`;
    return;
  }

  document.getElementById('requests-list').innerHTML = requests.map(r => {
    const statusClass = `status-${r.status}`;
    const statusText = currentLang==='vi' ? STATUS_VI[r.status] : STATUS_EN[r.status];
    const typeText = currentLang==='vi' ? TYPE_VI[r.type] : TYPE_EN[r.type];
    const propText = currentLang==='vi' ? PROP_VI[r.property_type] : PROP_EN[r.property_type];
    const date = new Date(r.created_at).toLocaleDateString(currentLang==='vi'?'vi-VN':'en-US');
    const deposit = formatPrice(r.deposit_amount);

    return `
    <div class="card" style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.75rem">
        <div>
          <div style="font-weight:700;margin-bottom:.3rem">${typeText} · ${propText}</div>
          <div class="text-muted text-sm">${currentLang==='vi'?'Ngân sách':'Budget'}: ${formatPrice(r.budget)} · ${currentLang==='vi'?'Cọc':'Deposit'}: ${deposit}</div>
          ${r.preferred_area ? `<div class="text-muted text-sm">${currentLang==='vi'?'Khu':'Zone'}: ${r.preferred_area}</div>` : ''}
          <div class="text-muted text-sm">${date}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem">
          <span class="status-badge ${statusClass}">${statusText}</span>
          ${r.status === 'quoted' || r.status === 'pending'
            ? `<a href="/quote.html?id=${r.id}" class="btn-primary btn-sm">${currentLang==='vi'?'Xem báo cọc':'View Quote'}</a>`
            : r.status === 'signed'
            ? `<a href="/quote.html?id=${r.id}" class="btn-accent btn-sm">${currentLang==='vi'?'Thanh toán':'Pay Now'}</a>`
            : `<span class="text-sm" style="color:var(--success)">✅ ${currentLang==='vi'?'Hoàn tất':'Complete'}</span>`}
        </div>
      </div>
    </div>`;
  }).join('');

  applyLang();
});
