document.addEventListener('DOMContentLoaded', async () => {
  applyLang();
  const user = await getUser();
  if (user) { window.location.href = '/dashboard.html'; return; }

  const tabLogin = document.getElementById('tab-login');
  const tabReg = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active'); tabReg.classList.remove('active');
    loginForm.style.display = ''; regForm.style.display = 'none';
    clearAlert('alert-box');
  });
  tabReg.addEventListener('click', () => {
    tabReg.classList.add('active'); tabLogin.classList.remove('active');
    regForm.style.display = ''; loginForm.style.display = 'none';
    clearAlert('alert-box');
  });

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    btn.textContent = '...'; btn.disabled = true;
    const { error } = await window.supabase.auth.signInWithPassword({
      email: document.getElementById('login-email').value.trim(),
      password: document.getElementById('login-password').value,
    });
    if (error) {
      showAlert('alert-box', currentLang==='vi' ? 'Email hoặc mật khẩu không đúng.' : 'Incorrect email or password.');
    } else {
      window.location.href = '/dashboard.html';
    }
    btn.textContent = currentLang==='vi'?'Đăng nhập':'Sign In'; btn.disabled = false;
  });

  regForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('reg-btn');
    btn.textContent = '...'; btn.disabled = true;
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const { error } = await window.supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) {
      showAlert('alert-box', error.message);
    } else {
      showAlert('alert-box', currentLang==='vi'
        ? 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.'
        : 'Registration successful! Please check your email to confirm your account.', 'success');
    }
    btn.textContent = currentLang==='vi'?'Tạo tài khoản':'Create Account'; btn.disabled = false;
  });

  document.getElementById('forgot-btn').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    if (!email) {
      showAlert('alert-box', currentLang==='vi'?'Nhập email trước.':'Enter your email first.');
      return;
    }
    const { error } = await window.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth.html'
    });
    if (error) {
      showAlert('alert-box', error.message);
    } else {
      showAlert('alert-box', currentLang==='vi'?'Đã gửi email đặt lại mật khẩu!':'Password reset email sent!', 'success');
    }
  });

  document.getElementById('google-btn').addEventListener('click', async () => {
    await window.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard.html' }
    });
  });
});
