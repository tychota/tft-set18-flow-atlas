const IMAGE_BOOTSTRAP_SOURCE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22%3E%3Crect width=%221%22 height=%221%22 fill=%22transparent%22/%3E%3C/svg%3E';

const state = {
  selectedId: 'blossom-fast-8',
  filters: { damage: 'All', plan: 'All', query: '' },
};

const elements = {
  list: document.querySelector('#composition-list'),
  workspace: document.querySelector('#composition-workspace'),
  resultCount: document.querySelector('#result-count'),
  damage: document.querySelector('#damage-filter'),
  plan: document.querySelector('#plan-filter'),
  search: document.querySelector('#search-filter'),
  dataStatus: document.querySelector('#data-status'),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function imageAttributes(sources) {
  return `data-sources="${escapeHtml(JSON.stringify(sources))}" data-source-index="-1"`;
}

function renderCompositionList() {
  const results = filterCompositions(state.filters);
  elements.resultCount.textContent = `${results.length} ${results.length === 1 ? 'line' : 'lines'}`;

  if (!results.some((composition) => composition.id === state.selectedId)) {
    state.selectedId = results[0]?.id ?? null;
  }

  elements.list.innerHTML = results.map((composition) => {
    const selected = composition.id === state.selectedId;
    const primaryTraits = getPhaseSynergies(composition, 'endgame')
      .filter((traitEntry) => traitEntry.activeThreshold)
      .slice(0, 2)
      .map((traitEntry) => `${traitEntry.count} ${traitEntry.name}`)
      .join(' · ');
    return `
      <button class="composition-row${selected ? ' is-selected' : ''}" type="button" data-composition-id="${composition.id}" aria-pressed="${selected}">
        <span class="composition-row-main">
          <strong>${escapeHtml(composition.name)}</strong>
          <span>${escapeHtml(composition.summary)}</span>
          <span class="composition-row-synergy">${escapeHtml(primaryTraits)}</span>
        </span>
        <span class="composition-row-meta">
          <span>${escapeHtml(composition.tier)}</span>
          <span>Lv ${composition.rollLevel}</span>
        </span>
      </button>
    `;
  }).join('');

  if (results.length === 0) {
    elements.list.innerHTML = `
      <div class="empty-state">
        <strong>No matching line</strong>
        <p>Clear one filter or search by a trait, damage type, or economy plan.</p>
      </div>
    `;
  }
}

function renderItemToken(itemName) {
  const item = ITEMS[itemName];
  if (!item) return '';
  return `
    <span class="item-token" title="${escapeHtml(itemName)}">
      <span class="item-icon-fallback" aria-hidden="true">${escapeHtml(item.short)}</span>
      <img class="item-icon fallback-image" src="${IMAGE_BOOTSTRAP_SOURCE}" ${imageAttributes(item.iconSources)} alt="${escapeHtml(itemName)}" width="28" height="28" loading="lazy" decoding="async">
    </span>
  `;
}

function renderUnit(slot) {
  const unit = UNITS[slot.unit];
  const portrait = `<img class="unit-portrait-image fallback-image" src="${IMAGE_BOOTSTRAP_SOURCE}" ${imageAttributes(unit.portraitSources)} alt="${escapeHtml(slot.unit)} Set 18 portrait" width="120" height="120" loading="lazy" decoding="async" style="object-position: ${unit.portraitFocus}">`;
  const items = slot.items ?? [];

  return `
    <article class="unit-tile cost-${unit.cost}">
      <div class="unit-tile-topline">
        <span class="cost-badge" aria-label="${unit.cost} gold">${unit.cost}g</span>
        <span class="star-goal">${escapeHtml(slot.targetStar)}</span>
      </div>
      <div class="unit-main">
        <div class="unit-portrait">
          <span class="unit-portrait-fallback" aria-hidden="true">${escapeHtml(unit.fallbackGlyph)}</span>
          ${portrait}
        </div>
        <div class="unit-tile-copy">
          <strong>${escapeHtml(slot.unit)}</strong>
          <span>${escapeHtml(unit.role)}</span>
        </div>
      </div>
      <div class="unit-traits" aria-label="${escapeHtml(slot.unit)} synergies">
        ${unit.traits.map((traitName) => `<span title="${escapeHtml(TRAITS[traitName]?.description ?? '')}">${escapeHtml(traitName)}</span>`).join('')}
      </div>
      <div class="unit-items${items.length ? ' has-items' : ''}" aria-label="${items.length ? `${slot.unit} item package` : `${slot.unit} has no committed item package`}">
        ${items.length ? items.map(renderItemToken).join('') : '<span class="item-space" aria-hidden="true"></span>'}
      </div>
    </article>
  `;
}

function advanceImageFallback(image) {
  let sources = [];
  try {
    sources = JSON.parse(image.dataset.sources ?? '[]');
  } catch {
    sources = [];
  }
  const nextIndex = Number(image.dataset.sourceIndex ?? 0) + 1;
  if (nextIndex < sources.length) {
    image.dataset.sourceIndex = String(nextIndex);
    image.src = sources[nextIndex];
    return;
  }
  image.hidden = true;
  image.closest('.unit-portrait, .item-token, .synergy-chip')?.classList.add('is-missing');
}

function bindImageFallbacks() {
  for (const image of document.querySelectorAll('.fallback-image')) {
    image.addEventListener('error', () => advanceImageFallback(image));
    advanceImageFallback(image);
  }
}
