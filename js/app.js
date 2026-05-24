/* ─── Shared helpers ────────────────────────────────────────── */
async function loadData() {
  const res = await fetch('../data/qaris.json');
  return res.json();
}

function getInitials(name) {
  return name.split(' ')
    .filter(w => !['al-', 'al', 'ibn', 'abd', 'sheikh', 'ustadha', 'imam'].includes(w.toLowerCase()))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

function pinIcon(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
}

function chevronRight(size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
}

function buildModal(qari) {
  const edu = qari.education;
  const initials = getInitials(qari.name);

  const institutionsHtml = edu.institutions.map(inst =>
    `<div class="edu-item"><div class="edu-dot"></div><span>${inst}</span></div>`
  ).join('');

  const ijazahHtml = edu.ijazah.map(ij => `
    <div class="ijazah-card">
      <div class="from-name">${ij.from}</div>
      <div class="from-qiraat">${ij.qiraat}</div>
      <div class="from-year">${ij.year}</div>
    </div>
  `).join('');

  const degreesHtml = edu.degrees.map(d =>
    `<div class="edu-item"><div class="edu-dot"></div><span>${d}</span></div>`
  ).join('');

  const bioParagraphs = qari.bio.split('\n\n').map(p => `<p>${p}</p>`).join('');

  return `
    <div class="modal-overlay" id="qariModal" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-avatar">${initials}</div>
            <div class="modal-header-info">
              <h2>${qari.name}</h2>
              <div class="modal-title">${qari.title}</div>
              <div class="modal-location">${pinIcon(13)} ${qari.location}</div>
            </div>
          </div>
          <button class="modal-close" onclick="closeModal()" aria-label="Close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-bio">
            <span class="modal-spec-tag">&#9670; ${qari.specialization}</span>
            <h3>Biography</h3>
            ${bioParagraphs}
          </div>
          <div class="modal-education">
            <div class="edu-section">
              <h4>&#9654; Ijazah Chain</h4>
              ${ijazahHtml}
            </div>
            <div class="edu-section">
              <h4>&#9654; Where They Studied</h4>
              ${institutionsHtml}
            </div>
            <div class="edu-section">
              <h4>&#9654; Degrees &amp; Certifications</h4>
              ${degreesHtml}
            </div>
            ${edu.additional ? `
            <div class="edu-section">
              <h4>&#9654; Additional Notes</h4>
              <div class="additional-note">${edu.additional}</div>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function openModal(qari) {
  const existing = document.getElementById('qariModal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', buildModal(qari));
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    document.getElementById('qariModal').classList.add('open');
  });
}

function closeModal() {
  const modal = document.getElementById('qariModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modal.addEventListener('transitionend', () => modal.remove(), { once: true });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', e => {
  if (e.target.id === 'qariModal') closeModal();
});
