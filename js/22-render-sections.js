function renderSynergyStrip(synergies) {
  const visible = synergies
    .filter((entry) => entry.activeThreshold || entry.count > 1)
    .slice(0, 8);
  return `
    <div class="synergy-strip" aria-label="Active and near-active synergies">
      ${visible.map((entry) => `
        <span class="synergy-chip${entry.activeThreshold ? ' is-active' : ''}" title="${escapeHtml(entry.description)}">
          <span class="synergy-icon-fallback" aria-hidden="true">${escapeHtml(entry.name.slice(0, 1))}</span>
          <img class="synergy-icon fallback-image" src="${IMAGE_BOOTSTRAP_SOURCE}" ${imageAttributes(entry.iconSources)} alt="" width="22" height="22" loading="lazy" decoding="async">
          <strong>${entry.count}</strong>
          <span>${escapeHtml(entry.name)}</span>
          ${entry.nextThreshold ? `<small>next ${entry.nextThreshold}</small>` : ''}
        </span>
      `).join('')}
    </div>
  `;
}

function renderRollSummary(summary) {
  const costBreakdown = Object.entries(summary.costs)
    .filter(([, count]) => count > 0)
    .map(([cost, count]) => `<span class="roll-cost cost-text-${cost}"><strong>${cost}g</strong> × ${count}</span>`)
    .join('');
  const targets = summary.targets.length
    ? summary.targets.map((target) => `<span>${escapeHtml(target.unit)} ${escapeHtml(target.targetStar)}</span>`).join('')
    : '<span>Upgrade carries and frontline; do not chase a fixed 3★.</span>';

  return `
    <div class="roll-summary">
      <div class="roll-summary-primary">
        <strong>${escapeHtml(summary.label)}</strong>
        <span>${targets}</span>
      </div>
      <div class="roll-costs" aria-label="Board cost distribution">${costBreakdown}</div>
    </div>
  `;
}

function renderBoard(composition, phase, title, caption) {
  const slots = composition[phase];
  const synergies = getPhaseSynergies(composition, phase);
  const rollSummary = getRollSummary(composition, phase);
  return `
    <section class="board-step">
      <div class="board-step-heading">
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(caption)}</p>
        </div>
        ${renderRollSummary(rollSummary)}
      </div>
      ${renderSynergyStrip(synergies)}
      <div class="unit-grid">
        ${slots.map(renderUnit).join('')}
      </div>
    </section>
  `;
}

function renderBulletList(items, className = '') {
  return `<ul class="decision-list ${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderStagePlan(stages) {
  return `
    <ol class="stage-plan">
      ${stages.map((step) => `
        <li>
          <strong>${escapeHtml(step.stage)}</strong>
          <p>${escapeHtml(step.action)}</p>
        </li>
      `).join('')}
    </ol>
  `;
}

function renderItemRoutes(routes) {
  return `
    <div class="item-routes">
      ${routes.map((route) => `
        <article class="item-route">
          <div class="item-transfer">
            <strong>${escapeHtml(route.from)}</strong>
            <span aria-hidden="true">→</span>
            <strong>${escapeHtml(route.to)}</strong>
          </div>
          <p class="item-family">${escapeHtml(route.family)}</p>
          <p>${escapeHtml(route.reason)}</p>
          <ul>${route.items.map((itemName) => `<li>${renderItemToken(itemName)}<span>${escapeHtml(itemName)}</span></li>`).join('')}</ul>
        </article>
      `).join('')}
    </div>
  `;
}

function renderRecommendations(items, dictionary) {
  return `
    <div class="recommendation-list">
      ${items.map((item) => `
        <article class="recommendation-row">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.reason)}</p>
          </div>
          <p class="recommendation-definition">${escapeHtml(dictionary[item.name] ?? '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}
