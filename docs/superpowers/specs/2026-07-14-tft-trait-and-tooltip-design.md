# TFT Set 18 Trait Badges and Tooltip Design

## Purpose

Improve the deployed TFT Set 18 Flow Atlas so trait breakpoints, champion abilities, and item effects behave like a compact in-game information layer rather than static labels.

The change must answer three questions immediately:

1. Which trait breakpoint is actually active?
2. What does that active breakpoint do?
3. What do the hovered champion and item do?

The site must keep the current dense product layout and avoid turning every board into a wall of explanatory text.

## Scope

This feature covers:

- repulling Set 18 trait, champion, and item data;
- replacing approximate trait thresholds and descriptions with structured breakpoint data;
- TFT-style trait badges with icon, current unit count, and tier treatment;
- hover and tap tooltips for traits, champions, and items;
- locally vendored champion, trait, and item assets where licensing and source availability permit;
- explicit fallbacks when a Set 18 asset or description is unavailable;
- tests for breakpoint activation, tooltip content, keyboard access, and mobile interaction.

It does not cover:

- live match data;
- automatic patch ingestion on every deployment;
- combat simulation;
- positioning recommendations;
- reproducing Riot's exact proprietary visual assets or animations when unavailable.

## Source hierarchy

Data must be pulled again before implementation rather than trusting the current hand-authored values.

Preferred order:

1. Riot or CommunityDragon structured game data for champion stats, abilities, traits, items, icons, and breakpoint styles.
2. Tactics.tools Set 18 data when it exposes pre-release units or assets absent from Riot's public data.
3. MetaTFT, Mobalytics, TFTFlow, and TFT Academy as corroborating presentation and strategy references, not as the canonical numerical source.
4. Existing hand-authored copy only as a temporary fallback, visibly marked as unverified.

Every generated data file records:

- source URL or source identifier;
- retrieval date;
- set and patch identifier when available;
- whether the value is canonical, corroborated, or fallback.

## Trait data model

A trait must no longer be represented as only a name, threshold array, and one generic description.

```ts
interface TraitDefinition {
  id: string;
  name: string;
  iconPath: string;
  summary: string;
  breakpoints: TraitBreakpoint[];
  source: DataSource;
}

interface TraitBreakpoint {
  requiredUnits: number;
  style: "bronze" | "silver" | "gold" | "prismatic" | "unique";
  effectText: string;
}

interface ActiveTraitState {
  traitId: string;
  unitCount: number;
  activeBreakpoint: TraitBreakpoint | null;
  nextBreakpoint: TraitBreakpoint | null;
  unitsToNext: number | null;
}
```

The active breakpoint is the highest breakpoint whose `requiredUnits` is less than or equal to the current unit count.

A count between breakpoints does not create a stronger effect. For example, when the repulled Blossom data contains breakpoints at 3 and 5, a board with 4 Blossom units still uses the 3-unit effect. The badge displays the raw count `4`, but its material and tooltip highlight remain those of the 3-unit breakpoint.

The breakpoint style should come from game metadata where available. Only when the source does not expose a tier should the site use this fallback mapping by breakpoint order:

- first active breakpoint: bronze;
- second: silver;
- third: gold;
- final chase breakpoint: prismatic;
- special one-unit or bespoke traits: unique.

This avoids falsely assuming that every trait has exactly four tiers.

## Trait badge design

Each board phase displays only traits that are active or one unit away from activation. The compact badge contains:

- trait icon;
- current unit count;
- trait name;
- active material treatment.

Example visual label:

```text
[Blossom icon] 4 Blossom
```

The badge color and border represent the active breakpoint, not the raw count.

States:

- inactive: neutral dark treatment;
- bronze: warm bronze border and icon frame;
- silver: cool silver treatment;
- gold: restrained gold treatment;
- prismatic: high-contrast iridescent treatment without animation by default;
- unique: trait-specific neutral accent when the game data marks a bespoke trait.

The badge must not display misleading wording such as `4 Blossom active`. The count and active effect remain separate concepts.

## Trait tooltip

Hovering, focusing, or tapping a trait badge opens a tooltip anchored to the badge.

Header:

- trait icon;
- trait name;
- current count;
- short summary.

Body:

- one row per breakpoint, in ascending order;
- required unit count;
- complete effect text;
- game tier styling.

The currently active breakpoint row is highlighted using its bronze, silver, gold, prismatic, or unique treatment. Higher breakpoints remain subdued. Earlier achieved breakpoints may retain a small completed marker, but only the highest active row receives the primary highlight.

A progress line appears below the rows:

```text
4 / 5 units — 1 more Blossom unit for the next breakpoint.
```

At the maximum breakpoint it becomes:

```text
Maximum breakpoint active.
```

At zero active breakpoints:

```text
2 / 3 units — trait not active yet.
```

## Champion tooltip

Hovering, focusing, or tapping a champion portrait or name opens a champion tooltip.

Required fields:

- portrait;
- name;
- shop cost and cost color;
- target star level for the selected board phase;
- traits with icons;
- role;
- ability name;
- complete ability description;
- mana start and maximum mana when available;
- attack range when available;
- whether the unit is an interim item holder or final item recipient;
- currently assigned items.

The ability text must come from the repulled source and preserve numerical values when available. Unverified pre-PBE values receive a visible `pre-release` note.

The tooltip must not infer exact mechanics from strategy prose. Missing fields are omitted rather than invented.

## Item assets and tooltips

Item icons must be downloaded into the repository and referenced locally from `assets/items/`.

The fetch pipeline should:

1. read the canonical item identifier from structured data;
2. download the highest-quality square icon available;
3. validate MIME type and minimum dimensions;
4. save a deterministic filename;
5. record the source and checksum in an asset manifest;
6. use a generated text fallback only if every source fails.

Item tooltip fields:

- icon;
- item name;
- stat bonuses;
- full effect text;
- tags such as `carry`, `tank`, `anti-heal`, or `shred` only when derived from deterministic project metadata;
- holder and final transfer target in the selected composition phase.

The board continues to show compact icon trays. Detailed text lives only in the tooltip.

## Interaction model

Desktop:

- pointer hover opens after a short delay of roughly 150 ms;
- moving between the trigger and tooltip keeps it open;
- Escape closes it;
- keyboard focus opens the same content;
- only one tooltip is open at a time.

Touch devices:

- first tap opens the tooltip;
- tapping outside closes it;
- tapping another trigger replaces it;
- no behavior relies exclusively on hover.

Tooltips use semantic popover or dialog behavior according to browser support, with an accessible fallback.

They must remain inside the viewport, flipping above or sideways when required. On narrow mobile screens, they become a bottom sheet rather than a tiny floating panel.

## Architecture

The feature is split into four boundaries.

### 1. Data ingestion

Python scripts fetch and normalize raw data into versioned JSON:

- `data/set18/champions.json`
- `data/set18/traits.json`
- `data/set18/items.json`
- `data/set18/manifest.json`

The ingestion layer contains no rendering code.

### 2. Domain derivation

JavaScript functions derive board-specific state:

- count each trait once per unique fielded champion;
- find the active and next breakpoints;
- attach target stars and item-holder status;
- expose structured tooltip view models.

The derivation layer contains no DOM manipulation.

### 3. Rendering

Reusable components render:

- `TraitBadge`;
- `TraitTooltip`;
- `ChampionTooltip`;
- `ItemIcon`;
- `ItemTooltip`.

The existing board renderer consumes these components rather than constructing tooltip markup ad hoc.

### 4. Tooltip controller

One controller owns:

- open and close state;
- pointer, keyboard, and touch events;
- focus restoration;
- viewport positioning;
- mobile bottom-sheet behavior.

## Error handling

- Missing trait effect text: show the breakpoint and `Description unavailable in current data source`.
- Missing champion ability: omit the ability section and mark the champion data as incomplete.
- Failed local image: use the deterministic fallback glyph without shifting layout.
- Invalid breakpoint ordering: fail the data validation and block deployment.
- Duplicate trait counts from duplicated board entries: count unique fielded unit instances as represented by the board model, not repeated metadata rows.
- Source fetch failure: retain the last verified generated data and report the failed refresh; never replace good data with an empty file.

## Tests

### Python ingestion tests

- each trait has strictly increasing breakpoint counts;
- each breakpoint has non-empty effect text or an explicit unavailable marker;
- each champion references existing traits;
- every item icon in generated data exists locally;
- asset checksums match the manifest;
- source metadata is present.

### JavaScript unit tests

- counts below the first threshold are inactive;
- an intermediate count such as 4 with thresholds 3 and 5 activates only 3;
- exact thresholds activate the matching row;
- counts above the maximum retain the maximum breakpoint;
- unique traits use their source style;
- tooltip view models contain the correct active row and progress text.

### Browser tests

- hover opens and closes correctly;
- keyboard focus and Escape work;
- touch tap opens the bottom sheet;
- tooltip remains within desktop and mobile viewports;
- active breakpoint row is visually distinguishable without relying only on color;
- missing images preserve tile dimensions;
- no horizontal overflow at 390, 768, 1024, and 1440 px widths.

## Acceptance criteria

The feature is complete when:

- all Set 18 traits used by the seven compositions have repulled breakpoint data;
- raw unit count and active breakpoint are visually distinct;
- a non-breakpoint count never receives a higher tier treatment;
- every active trait badge has an icon;
- each trait tooltip highlights exactly one highest active breakpoint row;
- champion tooltips show sourced abilities and available stats;
- item icons are served locally from the GitHub Pages repository;
- trait, champion, and item details work with mouse, keyboard, and touch;
- automated validation and browser tests pass;
- the deployed Pages site still works without third-party item-image hotlinks.
