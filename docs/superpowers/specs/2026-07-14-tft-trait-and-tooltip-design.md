# TFT Set 18 Trait Badges, Tooltips, and Composition Expansion

## Purpose

Improve the deployed TFT Set 18 Flow Atlas so trait activation, champion abilities, item effects, and composition paths behave like a compact in-game information layer rather than static labels.

The change must answer four questions immediately:

1. Which trait tier is actually active at this exact unit count?
2. What does that active tier do?
3. What do the hovered champion and item do?
4. Which other credible starter-to-endgame lines can be played from the same Set 18 roster?

The site must keep the current dense product layout and avoid turning every board into a wall of text.

## Scope

This feature covers:

- repulling Set 18 trait, champion, and item data;
- replacing approximate trait thresholds with explicit activation rules;
- supporting ordinary cumulative traits, exact-count traits, sparse traits, and traits with inactive gaps;
- TFT-style trait badges with icon, raw unit count, and active tier treatment;
- hover, focus, and tap tooltips for traits, champions, and items;
- locally vendored champion, trait, and item assets where source availability permits;
- adding between 2 and 6 additional complete compositions;
- providing starter, transition, endgame, item routes, roll timing, and pivot rules for every new composition;
- tests for activation rules, tooltip content, keyboard access, mobile interaction, and composition completeness.

It does not cover live match data, automatic patch ingestion on every deploy, combat simulation, exact positioning recommendations, or unsupported proprietary animations.

## Source hierarchy

Data must be pulled again before implementation rather than trusting the current hand-authored values.

Preferred order:

1. Riot or CommunityDragon structured game data for champion stats, abilities, traits, items, icons, activation rules, and tier styles.
2. Tactics.tools Set 18 data when it exposes pre-release units or assets absent from Riot's public data.
3. MetaTFT, Mobalytics, TFTFlow, and TFT Academy as corroborating strategy and presentation references rather than canonical numerical sources.
4. Existing hand-authored copy only as a temporary fallback, visibly marked as unverified.

Every generated file records the source identifier, retrieval date, set or patch identifier when available, and whether each value is canonical, corroborated, or fallback.

## Trait activation model

A trait cannot be represented as only an ordered list of minimum thresholds. Some TFT traits are cumulative, while others activate only at exact counts or have inactive gaps.

```ts
interface TraitDefinition {
  id: string;
  name: string;
  iconPath: string;
  summary: string;
  tiers: TraitTier[];
  source: DataSource;
}

interface TraitTier {
  id: string;
  label: string;
  style: "bronze" | "silver" | "gold" | "prismatic" | "unique";
  activation: TraitActivationRule;
  effectText: string;
}

type TraitActivationRule =
  | { kind: "range"; min: number; max: number | null }
  | { kind: "exact"; count: number }
  | { kind: "set"; counts: number[] };

interface ActiveTraitState {
  traitId: string;
  unitCount: number;
  activeTier: TraitTier | null;
  nextRelevantTier: TraitTier | null;
  progressText: string;
}
```

### Standard cumulative example

A normal trait with breakpoints at 3 and 5 is normalized to ranges:

- bronze: 3–4;
- silver: 5 until the next tier.

A board with 4 units therefore displays the raw count `4`, but still uses the bronze 3-unit effect.

### Exact-count and sparse example

The model must also support a trait shaped like:

- exactly 1 unit: bronze active;
- 2–3 units: inactive;
- exactly 4 units: gold active.

At counts 2 and 3, no trait tier is active. The badge remains neutral even though the raw count is visible. The tooltip highlights no row and explains that the current count is an inactive state.

This behavior must come from repulled game data. The implementation must not infer cumulative activation merely because tier counts are numerically ordered.

### Validation rules

- activation rules may contain intentional gaps;
- activation rules for the same trait must not overlap unless the source explicitly defines a priority;
- exactly zero or one tier must match a given count;
- exact and set-based activations are first-class, not special-case UI hacks;
- source-provided tier styling wins over fallback styling.

When tier styling is absent, the fallback order is bronze, silver, gold, then prismatic for the final chase tier. Bespoke one-unit traits use `unique` only when supported by the source.

## Trait badge design

Each board phase displays active traits and optionally traits one unit away from a relevant activation.

A compact badge contains:

- trait icon;
- raw unit count;
- trait name;
- material treatment for the currently active tier.

Example:

```text
[Blossom icon] 4 Blossom
```

The count communicates board composition. The material treatment communicates power.

States:

- inactive: neutral dark treatment;
- bronze: warm bronze frame;
- silver: cool silver frame;
- gold: restrained gold frame;
- prismatic: high-contrast iridescent frame without mandatory animation;
- unique: source-defined bespoke treatment.

A badge must never imply that an intermediate count grants a stronger tier. For exact-count traits, inactive counts remain visibly inactive.

## Trait tooltip

Hovering, focusing, or tapping a trait badge opens an anchored tooltip.

Header:

- icon;
- trait name;
- current count;
- short summary.

Body:

- one row per tier;
- activation requirement written exactly, such as `3+`, `3–4`, `exactly 1`, or `1 / 4`;
- complete effect text;
- source tier styling.

Only the tier matching the current count receives the primary highlight. Higher, lower, or currently invalid tiers remain subdued. Earlier tiers are not shown as active when the current count has moved into an inactive gap.

Progress examples:

```text
4 / 5 units — 1 more Blossom unit for the next tier.
```

```text
2 units — no Mentor tier is active at this count. Active again at 4.
```

```text
Maximum tier active.
```

The active row must be distinguishable by iconography and weight as well as color.

## Champion tooltip

Hovering, focusing, or tapping a portrait or champion name opens a tooltip containing available sourced data:

- portrait;
- name;
- cost and cost color;
- target star level for the selected phase;
- traits with icons;
- role;
- ability name and full description;
- starting and maximum mana;
- attack range;
- item-holder or final-recipient status;
- currently assigned items;
- pre-release or incomplete-data note when appropriate.

Missing fields are omitted rather than invented. Strategy prose must not be presented as canonical ability mechanics.

## Item assets and tooltips

Item icons must be downloaded into `assets/items/` and served locally by GitHub Pages.

The Python pipeline must:

1. resolve the canonical item identifier;
2. download the highest-quality square icon available;
3. validate MIME type and minimum dimensions;
4. save a deterministic filename;
5. record source and checksum in the manifest;
6. retain a generated fallback only if all sources fail.

Item tooltips contain icon, name, stat bonuses, complete effect text, deterministic functional tags, current holder, and final transfer target.

## Additional composition expansion

The current seven lines expand to between nine and thirteen total lines.

Implementation adds at least two and at most six new compositions after the data repull. The final count depends on whether a candidate has enough sourced information and a coherent path; weak filler lines must not be added merely to reach six.

### Candidate pool

The repulled roster should be evaluated for distinct archetypes not already represented, with likely candidates including:

- Coven-based Caitlyn or Elise lines;
- Eldritch Warwick or Azir lines;
- Lunar Aphelios or Alune lines;
- Primal Sivir or Nidalee flex;
- Fae Tristana or Lillia variants;
- another credible four-cost or legendary cap discovered during the data pull.

These are research candidates, not pre-approved final comps. The implementation chooses only lines supported by the repulled data and at least one corroborating strategy source or a clearly documented first-principles rationale.

### Required composition structure

Every new composition must contain:

- identity, damage profile, economy plan, roll or stabilization level, and confidence label;
- realistic Stage 2 starter board;
- Stage 3 or early Stage 4 transition board;
- endgame board;
- star targets on every unit;
- actual active trait states for every phase;
- item holders and final recipients;
- item routes;
- stage-by-stage economy plan;
- entry conditions and avoid conditions;
- Wisp and augment considerations;
- pivot and exit rules;
- explanation of why the line is distinct from an existing composition.

### Selection criteria

A candidate is included only when it:

- adds a meaningfully different roll level, carry profile, or trait shell;
- has a starter and transition that can reasonably exist before the final board;
- does not depend on an exact legendary appearing without a fallback;
- can absorb a coherent item package;
- is not merely an alternate endgame screenshot of an existing line;
- has enough sourced unit and trait data to avoid inventing mechanics.

### Presentation

The composition index gains optional filters for primary trait and carry cost. New lines use the same board, tooltip, and breakpoint system rather than bespoke markup.

## Interaction model

Desktop:

- hover opens after about 150 ms;
- moving between trigger and tooltip keeps it open;
- focus opens the same content;
- Escape closes it;
- only one tooltip is open at once.

Touch:

- first tap opens;
- tapping outside closes;
- tapping another trigger replaces it;
- narrow screens use a bottom sheet.

Tooltips remain inside the viewport and restore focus correctly.

## Architecture

### 1. Python data ingestion

Generate versioned files:

- `data/set18/champions.json`;
- `data/set18/traits.json`;
- `data/set18/items.json`;
- `data/set18/compositions.json`;
- `data/set18/manifest.json`.

The ingestion layer contains no DOM code and retains the last verified output when a refresh fails.

### 2. Domain derivation

Pure JavaScript modules:

- count traits from each board phase;
- match exact, range, or set activation rules;
- derive active tier and progress text;
- derive champion, trait, and item tooltip view models;
- validate complete composition paths.

### 3. Rendering

Reusable components:

- `TraitBadge`;
- `TraitTooltip`;
- `ChampionTooltip`;
- `ItemIcon`;
- `ItemTooltip`;
- existing board and composition components consuming shared models.

### 4. Tooltip controller

One controller owns open state, pointer and keyboard events, touch behavior, focus restoration, viewport positioning, and mobile bottom-sheet presentation.

## Error handling

- missing effect text: show an explicit unavailable marker;
- missing ability data: omit the section and mark data incomplete;
- failed local image: preserve dimensions and show a deterministic fallback;
- overlapping activation rules: block generation unless source priority is explicit;
- inactive gaps: preserve the gap and render neutral state;
- failed refresh: retain the last valid generated dataset;
- incomplete composition: fail validation rather than publishing a board without starter or transition data.

## Tests

### Python ingestion tests

- every trait tier has a valid activation rule;
- exact-count and sparse activation rules survive normalization;
- rules do not overlap unexpectedly;
- gaps are allowed;
- every champion references existing traits;
- every local item icon exists and matches its checksum;
- source metadata is present;
- every new composition has starter, transition, and endgame phases.

### JavaScript unit tests

- normal intermediate counts retain the previous cumulative tier;
- exact count 1 can be active while counts 2 and 3 are inactive;
- exact count 4 can activate a later tier;
- no tier matches an intentional gap;
- counts above a normal maximum retain the maximum tier only when its rule is open-ended;
- tooltip progress text describes both next thresholds and inactive gaps;
- each composition phase derives the correct trait state.

### Browser tests

- hover, focus, Escape, tap, and outside-click behavior;
- mobile bottom sheet;
- viewport collision handling;
- active tier row distinguishable without color alone;
- exact-count inactive badge remains neutral;
- local item images load without third-party requests;
- champion and item tooltips contain sourced fields;
- all 9–13 composition lines render starter, transition, and endgame boards;
- no horizontal overflow at 390, 768, 1024, and 1440 px.

## Acceptance criteria

The feature is complete when:

- all used Set 18 traits have repulled activation data;
- exact-count and inactive-gap traits are represented without cumulative assumptions;
- raw count and active tier are visually distinct;
- each trait tooltip highlights exactly one matching tier or clearly shows no active tier;
- champion tooltips show sourced abilities and available stats;
- item icons are served locally;
- between two and six credible new compositions are added;
- every new composition includes starter, transition, endgame, items, economy, and pivot guidance;
- the site works with mouse, keyboard, and touch;
- validation, unit tests, and browser tests pass;
- GitHub Pages deploys without third-party item-image hotlinks.
