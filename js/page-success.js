function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#1B5E20','#4CAF50','#F59E0B','#86EFAC','#FCD34D','#fff'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 12 + 6,
    h: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    vr: (Math.random() - 0.5) * 0.15,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
    if (frame++ < 300) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNav('dashboard');
  applyLang();
  launchConfetti();

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (sessionId) {
    const receiptBox = document.getElementById('receipt-box');
    receiptBox.innerHTML = `
      <div class="section-label">${currentLang==='vi'?'Thông tin thanh toán':'Payment Info'}</div>
      <div class="text-sm text-muted">${currentLang==='vi'?'Mã phiên':'Session'}: ${sessionId.slice(0,16)}...</div>
      <div class="alert alert-success" style="margin-top:.75rem">${currentLang==='vi'?'Đã xác nhận qua Stripe':'Confirmed via Stripe'}</div>`;
  }
});
