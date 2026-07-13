const normalizedUnitAlias = (value) => value
  .toLowerCase()
  .replaceAll('’', "'")
  .replace(/^the\s+/, '')
  .replaceAll(/[^a-z0-9]+/g, ' ')
  .trim();

function referencedUnits(label) {
  const normalizedLabel = normalizedUnitAlias(label);
  return Object.keys(UNITS)
    .filter((name) => normalizedLabel.includes(normalizedUnitAlias(name)))
    .sort((left, right) => label.indexOf(left) - label.indexOf(right));
}

function applyItemsToMatches(slots, candidateNames, items) {
  const matches = candidateNames
    .map((name) => slots.find((slotEntry) => slotEntry.unit === name))
    .filter(Boolean);
  for (const holder of matches) {
    holder.itemHolder = true;
    holder.items = [...items];
  }
}

function applyRouteItems(composition, route) {
  const fromUnits = referencedUnits(route.from);
  const toUnits = referencedUnits(route.to);

  for (const phase of ['starter', 'transition']) {
    applyItemsToMatches(composition[phase], [...fromUnits, ...toUnits], route.items);
  }
  applyItemsToMatches(composition.endgame, [...toUnits, ...fromUnits], route.items);
}

for (const composition of COMPOSITIONS) {
  Object.assign(composition, COMPOSITION_DETAILS[composition.id]);
  for (const phase of ['starter', 'transition', 'endgame']) {
    for (const slotEntry of composition[phase]) {
      slotEntry.items ??= [];
    }
  }
  for (const route of composition.itemRoutes) {
    applyRouteItems(composition, route);
  }
  for (const phase of ['starter', 'transition', 'endgame']) {
    for (const slotEntry of composition[phase]) {
      slotEntry.itemHolder = slotEntry.items.length > 0;
    }
  }
}


function targetCopies(starGoal) {
  const copies = { '1★': 1, '2★': 3, '3★': 9 }[starGoal];
  if (!copies) {
    throw new Error(`Unsupported star goal: ${starGoal}`);
  }
  return copies;
}

function filterCompositions(filters = {}) {
  const { damage = 'All', plan = 'All', query = '' } = filters;
  const normalizedQuery = query.trim().toLowerCase();

  return COMPOSITIONS.filter((composition) => {
    const matchesDamage = damage === 'All' || composition.damage.includes(damage);
    const matchesPlan = plan === 'All' || composition.plan === plan;
    const traitNames = composition.endgame.flatMap((slot) => UNITS[slot.unit].traits);
    const haystack = [composition.name, composition.summary, composition.plan, ...composition.damage, ...traitNames]
      .join(' ')
      .toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    return matchesDamage && matchesPlan && matchesQuery;
  });
}

function getComposition(id) {
  return COMPOSITIONS.find((composition) => composition.id === id) ?? null;
}

function getPhaseSynergies(composition, phase) {
  if (!composition?.[phase]) {
    throw new Error(`Unknown composition phase: ${phase}`);
  }

  const counts = new Map();
  for (const slot of composition[phase]) {
    for (const traitName of UNITS[slot.unit].traits) {
      counts.set(traitName, (counts.get(traitName) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => {
      const definition = TRAITS[name] ?? { thresholds: [1], description: '', iconUrl: '' };
      const activeThreshold = [...definition.thresholds]
        .filter((threshold) => threshold <= count)
        .sort((left, right) => right - left)[0] ?? null;
      const nextThreshold = definition.thresholds.find((threshold) => threshold > count) ?? null;
      return { name, count, activeThreshold, nextThreshold, ...definition };
    })
    .sort((left, right) => {
      const activeDifference = Number(Boolean(right.activeThreshold)) - Number(Boolean(left.activeThreshold));
      return activeDifference || right.count - left.count || left.name.localeCompare(right.name);
    });
}

function getRollSummary(composition, phase) {
  if (!composition?.[phase]) {
    throw new Error(`Unknown composition phase: ${phase}`);
  }

  const costs = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const slot of composition[phase]) {
    costs[UNITS[slot.unit].cost] += 1;
  }

  const targets = composition[phase]
    .filter((slot) => slot.targetStar === '3★')
    .map((slot) => ({ unit: slot.unit, cost: UNITS[slot.unit].cost, targetStar: slot.targetStar }))
    .sort((left, right) => left.unit.localeCompare(right.unit));

  const level = composition.rollLevel;
  const label = composition.plan === 'Reroll'
    ? `Roll at level ${level}`
    : `${composition.plan} · stabilize at level ${level}`;

  return { level, label, costs, targets };
}

