let currentRequest = null;
let signatureData = null;
let canvas, ctx, isDrawing = false, lastX = 0, lastY = 0;

function getPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
}

function initCanvas() {
  canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth * window.devicePixelRatio || 600;
  canvas.height = 160 * window.devicePixelRatio || 160;
  ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  canvas.addEventListener('mousedown', e => { isDrawing = true; [lastX, lastY] = getPos(e, canvas); });
  canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    const [x, y] = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
    [lastX, lastY] = [x, y];
  });
  canvas.addEventListener('mouseup', () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); isDrawing = true; [lastX, lastY] = getPos(e, canvas); }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!isDrawing) return;
    const [x, y] = getPos(e, canvas);
    ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(x, y); ctx.stroke();
    [lastX, lastY] = [x, y];
  }, { passive: false });
  canvas.addEventListener('touchend', () => isDrawing = false);
}

function clearSignature() {
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  signatureData = null;
}

async function confirmSign() {
  if (!canvas) return;
  const blank = document.createElement('canvas');
  blank.width = canvas.width; blank.height = canvas.height;
  if (canvas.toDataURL() === blank.toDataURL()) {
    alert(currentLang==='vi'?'Vui lòng ký tên trước.':'Please sign first.'); return;
  }
  signatureData = canvas.toDataURL('image/png');
  const btn = document.getElementById('sign-btn');
  const payBtn = document.getElementById('pay-btn');
  btn.textContent = '...'; btn.disabled = true;

  const { error } = await window.supabase.from('ecopark_requests')
    .update({ signature: signatureData, status: 'signed' })
    .eq('id', currentRequest.id);

  if (error) {
    alert(error.message);
    btn.disabled = false; return;
  }
  btn.textContent = currentLang==='vi'?'✅ Đã ký':'✅ Signed';
  if (payBtn) payBtn.disabled = false;
}

async function startPayment() {
  const btn = document.getElementById('pay-btn');
  btn.textContent = '...'; btn.disabled = true;

  const { data, error } = await window.supabase.functions.invoke('ecopark-checkout', {
    body: { request_id: currentRequest.id }
  });

  if (error || !data?.url) {
    alert(currentLang==='vi'?'Không thể tạo phiên thanh toán.':'Could not create payment session.');
    btn.disabled = false; btn.textContent = currentLang==='vi'?'💳 Thanh toán':'💳 Pay Now'; return;
  }
  window.location.href = data.url;
}

function renderQuote(req) {
  const TYPE_VI = { buy:'Mua', rent:'Thuê' };
  const TYPE_EN = { buy:'Purchase', rent:'Rental' };
  const PROP_VI = { apartment:'Căn hộ', house:'Nhà mặt đất' };
  const PROP_EN = { apartment:'Apartment', house:'House' };
  const type = currentLang==='vi' ? TYPE_VI[req.type] : TYPE_EN[req.type];
  const prop = currentLang==='vi' ? PROP_VI[req.property_type] : PROP_EN[req.property_type];
  const date = new Date(req.created_at).toLocaleDateString(currentLang==='vi'?'vi-VN':'en-US');
  const isSigned = req.status === 'signed' || req.status === 'paid';
  const isPaid = req.status === 'paid';

  document.getElementById('quote-content').innerHTML = `
    <div class="quote-header">
      <h2>${currentLang==='vi'?'Báo đặt cọc bất động sản':'Property Deposit Quote'}</h2>
      <div class="meta">${currentLang==='vi'?'Ngày':'Date'}: ${date} · ID: ${req.id.slice(0,8).toUpperCase()}</div>
    </div>

    <div class="card mb-4">
      <div class="section-label">${currentLang==='vi'?'Chi tiết yêu cầu':'Request Details'}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1.5rem;font-size:.95rem">
        <div><b>${currentLang==='vi'?'Loại GD':'Type'}:</b> ${type}</div>
        <div><b>${currentLang==='vi'?'Loại BĐS':'Property'}:</b> ${prop}</div>
        <div><b>${currentLang==='vi'?'Ngân sách':'Budget'}:</b> ${formatPrice(req.budget)}</div>
        <div><b>${currentLang==='vi'?'Phòng ngủ':'Bedrooms'}:</b> ${req.bedrooms === 0 ? 'Studio' : req.bedrooms}</div>
        ${req.preferred_area ? `<div><b>${currentLang==='vi'?'Khu vực':'Zone'}:</b> ${req.preferred_area}</div>` : ''}
        ${req.description ? `<div style="grid-column:1/-1"><b>${currentLang==='vi'?'Ghi chú':'Notes'}:</b> ${req.description}</div>` : ''}
      </div>
    </div>

    <div class="deposit-box">
      <div class="section-label">${currentLang==='vi'?'Tiền đặt cọc (10% ngân sách)':'Deposit Amount (10% of budget)'}</div>
      <div class="deposit-amount">${formatPrice(req.deposit_amount)}</div>
      ${currentLang==='en' ? `<div class="currency-note">≈ ${formatUSD(req.deposit_amount)}</div>` : ''}
      <div class="text-muted text-sm mt-2">${currentLang==='vi'?'Thanh toán qua Stripe, bảo mật SSL':'Secure SSL payment via Stripe'}</div>
    </div>

    ${isPaid ? `
    <div class="alert alert-success">${currentLang==='vi'?'✅ Đã thanh toán thành công!':'✅ Payment completed successfully!'}</div>
    ` : `
    <div class="card mb-4">
      <div class="section-label">${currentLang==='vi'?'Chữ ký xác nhận':'Signature'}</div>
      ${isSigned
        ? `<div class="alert alert-success">${currentLang==='vi'?'✅ Đã ký xác nhận':'✅ Signed'}</div>`
        : `<div class="sign-area"><canvas id="signatureCanvas"></canvas></div>
           <div class="sign-controls">
             <button class="btn-outline btn-sm" id="clear-btn">${currentLang==='vi'?'🗑 Xóa':'🗑 Clear'}</button>
             <button class="btn-primary btn-sm" id="sign-btn">${currentLang==='vi'?'✍️ Xác nhận chữ ký':'✍️ Confirm Signature'}</button>
           </div>`}
    </div>

    <button class="btn-accent" style="width:100%;padding:1rem;font-size:1rem" id="pay-btn" ${isSigned?'':'disabled'}>
      ${currentLang==='vi'?'💳 Thanh toán đặt cọc':'💳 Pay Deposit'} – ${formatPrice(req.deposit_amount)}
    </button>
    <p class="text-muted text-sm text-center mt-2">${currentLang==='vi'?'Bảo mật bởi Stripe · Thẻ test: 4242 4242 4242 4242':'Secured by Stripe · Test card: 4242 4242 4242 4242'}</p>
    `}`;

  document.getElementById('quote-content').style.display = 'block';
  document.getElementById('spinner').style.display = 'none';

  if (!isPaid) {
    if (!isSigned) {
      initCanvas();
      document.getElementById('clear-btn').addEventListener('click', clearSignature);
      document.getElementById('sign-btn').addEventListener('click', confirmSign);
    }
    document.getElementById('pay-btn').addEventListener('click', startPayment);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNav('dashboard');
  const user = await getUser();
  if (!user) { window.location.href = '/auth.html'; return; }

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = '/dashboard.html'; return; }

  const { data, error } = await window.supabase
    .from('ecopark_requests').select('*').eq('id', id).eq('user_id', user.id).single();

  if (error || !data) {
    showAlert('alert-box', currentLang==='vi'?'Không tìm thấy yêu cầu.':'Request not found.');
    document.getElementById('spinner').style.display = 'none'; return;
  }
  currentRequest = data;
  renderQuote(data);
});
