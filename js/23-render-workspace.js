function renderWorkspace() {
  if (!state.selectedId) {
    elements.workspace.innerHTML = `
      <div class="workspace-empty">
        <h2 id="workspace-title">No composition selected</h2>
        <p>Adjust the filters to restore a composition line.</p>
      </div>
    `;
    return;
  }

  const composition = getComposition(state.selectedId);
  elements.workspace.innerHTML = `
    <header class="workspace-header">
      <div>
        <p class="workspace-kicker">${escapeHtml(composition.plan)} · roll or stabilize at level ${composition.rollLevel}</p>
        <h2 id="workspace-title">${escapeHtml(composition.name)}</h2>
        <p class="workspace-summary">${escapeHtml(composition.summary)}</p>
      </div>
      <div class="workspace-status">
        <span>${escapeHtml(composition.tier)}</span>
        <span>${composition.damage.join(' / ')}</span>
      </div>
    </header>

    <div class="board-flow" aria-label="Composition progression">
      ${renderBoard(composition, 'starter', 'Starter', 'The realistic Stage 2 shell: prioritize upgrades, frontline, and a usable item holder.')}
      ${renderBoard(composition, 'transition', 'Transition', 'The board that preserves tempo, displays the roll tier, and keeps every item transfer visible.')}
      ${renderBoard(composition, 'endgame', 'Endgame', 'The capped board. Cost borders and star goals show exactly what is upgraded versus merely included.')}
    </div>

    <section class="analysis-section analysis-intro" aria-labelledby="thesis-title">
      <div>
        <h3 id="thesis-title">Why this line works</h3>
        <p>${escapeHtml(composition.thesis)}</p>
        <p class="confidence-note"><strong>Confidence:</strong> ${escapeHtml(composition.confidenceReason)}</p>
      </div>
      <div class="entry-conditions">
        <div>
          <h4>Play when</h4>
          ${renderBulletList(composition.playWhen, 'positive')}
        </div>
        <div>
          <h4>Avoid when</h4>
          ${renderBulletList(composition.avoidWhen, 'negative')}
        </div>
      </div>
    </section>

    <section class="analysis-section" aria-labelledby="stage-plan-title">
      <header class="analysis-heading">
        <h3 id="stage-plan-title">Stage plan</h3>
        <p>The economy decision matters more than matching a final board screenshot.</p>
      </header>
      ${renderStagePlan(composition.stagePlan)}
    </section>

    <section class="analysis-section" aria-labelledby="item-routes-title">
      <header class="analysis-heading">
        <h3 id="item-routes-title">Item routes</h3>
        <p>The same packages are now aligned under their holders on every board above.</p>
      </header>
      ${renderItemRoutes(composition.itemRoutes)}
    </section>

    <section class="analysis-section recommendation-columns" aria-label="Wisp and augment recommendations">
      <div>
        <div class="analysis-heading">
          <h3>Wisps that change the plan</h3>
          <p>Buy for timing or direction—not merely because a Wisp is offered.</p>
        </div>
        ${renderRecommendations(composition.wispPlan, WISPS)}
      </div>
      <div>
        <div class="analysis-heading">
          <h3>Augments</h3>
          <p>Prioritize effects that reinforce the roll or level decision.</p>
        </div>
        ${renderRecommendations(composition.augmentPlan, AUGMENTS)}
      </div>
    </section>

    <section class="analysis-section pivot-section" aria-labelledby="pivot-title">
      <header class="analysis-heading">
        <h3 id="pivot-title">Pivot and exit rules</h3>
        <p>These rules prevent a good opener from becoming a forced eighth-place composition.</p>
      </header>
      ${renderBulletList(composition.pivotRules)}
    </section>
  `;
  bindImageFallbacks();
}

function render() {
  renderCompositionList();
  renderWorkspace();
}

function updateFilters() {
  state.filters = {
    damage: elements.damage.value,
    plan: elements.plan.value,
    query: elements.search.value,
  };
  render();
}

elements.list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-composition-id]');
  if (!button) return;
  state.selectedId = button.dataset.compositionId;
  render();
  elements.workspace.focus({ preventScroll: true });
});

elements.damage.addEventListener('change', updateFilters);
elements.plan.addEventListener('change', updateFilters);
elements.search.addEventListener('input', updateFilters);

elements.dataStatus.innerHTML = `
  <span>${escapeHtml(DATA_VERSION.label)}</span>
  <span>${escapeHtml(DATA_VERSION.updatedAt)}</span>
`;

render();
