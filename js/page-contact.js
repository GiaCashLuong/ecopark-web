function onLangChange() { applyLang(); }

document.addEventListener('DOMContentLoaded', () => {
  renderNav('contact');
  renderFooter();
  applyLang();

  document.getElementById('contact-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    btn.textContent = '...'; btn.disabled = true;
    clearAlert('alert-box');

    const { error } = await window.supabase.from('ecopark_contacts').insert({
      name: document.getElementById('c-name').value.trim(),
      email: document.getElementById('c-email').value.trim(),
      phone: document.getElementById('c-phone').value.trim() || null,
      subject: document.getElementById('c-subject').value,
      message: document.getElementById('c-message').value.trim(),
    });

    if (error) {
      showAlert('alert-box', error.message);
    } else {
      showAlert('alert-box', currentLang==='vi'
        ? '✅ Đã gửi tin nhắn! Chúng tôi sẽ phản hồi trong vòng 24 giờ.'
        : '✅ Message sent! We will reply within 24 hours.', 'success');
      document.getElementById('contact-form').reset();
    }
    btn.textContent = currentLang==='vi'?'Gửi tin nhắn':'Send Message'; btn.disabled = false;
  });
});
