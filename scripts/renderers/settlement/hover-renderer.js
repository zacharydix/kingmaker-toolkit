export function renderSettlementHover({ actorName, type, development, upgradeText, foci }) {
  return [
    `<div class="kingmaker-settlement-hover-title">${actorName}</div>`,
    `<div><strong>Type:</strong> ${type}</div>`,
    `<div><strong>Development:</strong> ${development}</div>`,
    `<div><strong>Upgrade:</strong> ${upgradeText}</div>`,
    `<div class="kingmaker-settlement-hover-divider"></div>`,
    renderFocusList(foci),
  ].join('');
}

function renderFocusList(foci) {
  if (!foci.length) {
    return `<em>No Foci</em>`;
  }

  return foci.map(renderFocus).join('');
}

function renderFocus(focus) {
  return [
    `<div class="kingmaker-settlement-hover-focus">`,
    `<div class="kingmaker-settlement-hover-focus-name">${focus.name}</div>`,
    `<div class="kingmaker-settlement-hover-focus-description">`,
    focus.quickDescription || 'No description available.',
    `</div>`,
    `</div>`,
  ].join('');
}
