function onLangChange() { applyLang(); updateBudgetDisplay(); }
function onCurrencyChange() { updateBudgetDisplay(); }

function updateBudgetDisplay() {
  const val = parseInt(document.getElementById('budget-slider').value);
  document.getElementById('budget-display').textContent = formatPrice(val);
  document.getElementById('deposit-preview').textContent = formatPrice(Math.round(val * 0.1));
  if (currentLang === 'en') {
    document.getElementById('budget-usd').textContent = showUSD ? '' : `≈ ${formatUSD(val)}`;
    document.getElementById('deposit-usd').textContent = showUSD ? '' : `≈ ${formatUSD(Math.round(val * 0.1))}`;
  } else {
    document.getElementById('budget-usd').textContent = '';
    document.getElementById('deposit-usd').textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  renderNav('');
  renderFooter();
  applyLang();

  const user = await getUser();
  if (!user) { window.location.href = '/auth.html'; return; }

  updateBudgetDisplay();
  document.getElementById('budget-slider').addEventListener('input', updateBudgetDisplay);

  // Radio options
  ['opt-buy','opt-rent'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      document.querySelectorAll('#opt-buy,#opt-rent').forEach(el => el.classList.remove('selected'));
      document.getElementById(id).classList.add('selected');
      document.getElementById('req-type').value = document.getElementById(id).dataset.value;
    });
  });

  ['opt-apartment','opt-house'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      document.querySelectorAll('#opt-apartment,#opt-house').forEach(el => el.classList.remove('selected'));
      document.getElementById(id).classList.add('selected');
      document.getElementById('req-property-type').value = document.getElementById(id).dataset.value;
    });
  });

  document.getElementById('request-form').addEventListener('submit', async e => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.textContent = '...'; btn.disabled = true;
    clearAlert('alert-box');

    const budget = parseInt(document.getElementById('budget-slider').value);
    const deposit_amount = Math.round(budget * 0.1);

    const { error } = await window.supabase.from('ecopark_requests').insert({
      user_id: user.id,
      type: document.getElementById('req-type').value,
      property_type: document.getElementById('req-property-type').value,
      budget,
      deposit_amount,
      bedrooms: parseInt(document.getElementById('req-bedrooms').value),
      preferred_area: document.getElementById('req-area').value || null,
      description: document.getElementById('req-description').value.trim() || null,
      status: 'quoted',
    });

    if (error) {
      showAlert('alert-box', error.message);
      btn.textContent = currentLang==='vi'?'📋 Gửi yêu cầu':'📋 Submit Request'; btn.disabled = false;
    } else {
      window.location.href = '/dashboard.html';
    }
  });
});
