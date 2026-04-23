function onLangChange() { renderHouses(); }
function onCurrencyChange() { renderHouses(); }

function renderHouses() {
  const zoneVal = document.getElementById('filter-zone').value;
  let filtered = HOUSES.filter(h => {
    if (zoneVal !== 'all') {
      if (zoneVal === 'bellavita' && !h.id.includes('bellavita')) return false;
      if (zoneVal === 'greennest' && !h.id.includes('greennest')) return false;
    }
    return true;
  });

  document.getElementById('result-count').textContent =
    currentLang==='vi' ? `${filtered.length} bất động sản` : `${filtered.length} properties`;

  document.getElementById('houses-grid').innerHTML = filtered.map(p => {
    const type = currentLang==='vi' ? p.type_vi : p.type_en;
    return `
    <div class="property-card" data-id="${p.id}" style="cursor:pointer">
      <img class="property-img" src="${p.image}" alt="${p.name}" loading="lazy" />
      <div class="property-body">
        <div class="property-type-badge">${type}</div>
        <div class="property-name">${p.name}</div>
        <div class="property-meta">${p.bedrooms}${currentLang==='vi'?' PN':' bed'} · ${p.area}m² · ${currentLang==='vi'?'Đất':'Land'} ${p.land_area}m²</div>
        <div class="property-features">${(currentLang==='vi'?p.features_vi:p.features_en).slice(0,2).map(f=>`<span class="feature-tag">${f}</span>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:.75rem">
          <div>
            <div class="property-price">${formatPrice(p.price)}</div>
            <div class="property-price-rent">${formatRent(p.rent_price)}</div>
          </div>
          <button class="btn-primary btn-sm detail-btn" data-id="${p.id}">${currentLang==='vi'?'Chi tiết':'Details'}</button>
        </div>
      </div>
    </div>`;
  }).join('') || `<div class="text-muted text-center" style="grid-column:1/-1;padding:3rem">${currentLang==='vi'?'Không tìm thấy.':'Not found.'}</div>`;

  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openModal(btn.dataset.id); });
  });
  document.querySelectorAll('.property-card[data-id]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.id));
  });
  applyLang();
}

function openModal(id) {
  const p = HOUSES.find(h => h.id === id);
  if (!p) return;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-img').alt = p.name;
  const type = currentLang==='vi' ? p.type_vi : p.type_en;
  const desc = currentLang==='vi' ? p.desc_vi : p.desc_en;
  const features = (currentLang==='vi' ? p.features_vi : p.features_en).map(f=>`<span class="feature-tag">${f}</span>`).join('');
  document.getElementById('modal-body-content').innerHTML = `
    <p class="text-muted" style="margin-bottom:1rem">${desc}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem 1rem;margin-bottom:1rem;font-size:.9rem">
      <div><b>${currentLang==='vi'?'Loại':'Type'}:</b> ${type}</div>
      <div><b>${currentLang==='vi'?'Phòng ngủ':'Bedrooms'}:</b> ${p.bedrooms}</div>
      <div><b>${currentLang==='vi'?'Diện tích XD':'Build'}:</b> ${p.area}m²</div>
      <div><b>${currentLang==='vi'?'Diện tích đất':'Land'}:</b> ${p.land_area}m²</div>
      <div><b>${currentLang==='vi'?'Giá mua':'Buy'}:</b> <span style="color:var(--primary);font-weight:700">${formatPrice(p.price)}</span></div>
      <div><b>${currentLang==='vi'?'Giá thuê':'Rent'}:</b> ${formatRent(p.rent_price)}</div>
    </div>
    <div class="property-features">${features}</div>`;
  document.getElementById('modal-overlay').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav('houses');
  renderFooter();
  renderHouses();
  document.getElementById('filter-type').addEventListener('change', renderHouses);
  document.getElementById('filter-zone').addEventListener('change', renderHouses);
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal-overlay').style.display = 'none';
  });
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay'))
      document.getElementById('modal-overlay').style.display = 'none';
  });
  applyLang();
});
