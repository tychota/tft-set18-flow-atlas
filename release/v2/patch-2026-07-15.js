window.__patchAtlasHtml = function patchAtlasHtml(html) {
  const itemBlock = `const ITEM_ART_URLS = {
  'bloodthirster': 'https://ap.tft.tools/img/items_s14/Bloodthirster.png?w=72',
  'bramble-vest': 'https://ap.tft.tools/img/items_s14/BrambleVest.png?w=72',
  'dragons-claw': 'https://ap.tft.tools/img/items_s14/DragonsClaw.png?w=72',
  'evenshroud': 'https://ap.tft.tools/img/items_s14/SpectralGauntlet.png?w=72',
  'gargoyle-stoneplate': 'https://ap.tft.tools/img/items_s14/GargoyleStoneplate.png?w=72',
  'giant-slayer': 'https://ap.tft.tools/img/items_s14/MadredsBloodrazor.png?w=72',
  'guardbreaker': 'https://ap.tft.tools/img/items_s14/Guardbreaker.png?w=72',
  'guinsoos-rageblade': 'https://ap.tft.tools/img/items_s14/GuinsoosRageblade.png?w=72',
  'hand-of-justice': 'https://ap.tft.tools/img/items_s14/UnstableConcoction.png?w=72',
  'infinity-edge': 'https://ap.tft.tools/img/items_s14/InfinityEdge.png?w=72',
  'jeweled-gauntlet': 'https://ap.tft.tools/img/items_s14/JeweledGauntlet.png?w=72',
  'krakens-fury': 'https://ap.tft.tools/img/items_s14/RunaansHurricane.png?w=72',
  'last-whisper': 'https://ap.tft.tools/img/items_s14/LastWhisper.png?w=72',
  'morellonomicon': 'https://ap.tft.tools/img/items_s14/Morellonomicon.png?w=72',
  'nashors-tooth': 'https://ap.tft.tools/img/items_s14/Leviathan.png?w=72',
  'spear-of-shojin2': 'https://ap.tft.tools/img/items_s14/SpearOfShojin.png?w=72',
  'steraks-gage': 'https://ap.tft.tools/img/items_s14/SteraksGage.png?w=72',
  'titans-resolve': 'https://ap.tft.tools/img/items_s14/TitansResolve.png?w=72',
  'voidstaff': 'https://ap.tft.tools/img/items_s14/StatikkShiv.png?w=72',
  'warmogs-armor': 'https://ap.tft.tools/img/items_s14/WarmogsArmor.png?w=72',
};

const item = (slug, short) => ({
  short,
  iconSources: [
    \`./assets/items/\${slug}.png\`,
    ITEM_ART_URLS[slug],
  ].filter(Boolean),
});

const ITEMS = {`;

  html = html.replace(
    /const MOBALYTICS_ITEM_SLUGS = \{[\s\S]*?const ITEMS = \{/,
    itemBlock,
  );

  const replacements = new Map([
    ["starter: [slot('Diana', '1★'), slot('Rakan', '2★'), slot('Xayah', '2★', true), slot('Karma', '2★', true)],", "starter: [slot('Leona', '2★'), slot('Kayle', '2★', true), slot('Xayah', '2★', true), slot('Rakan', '2★')],"],
    ["starter: [slot('Vi', '1★'), slot('Xayah', '2★', true), slot('Rakan', '2★'), slot('Karma', '2★', true)],", "starter: [slot('Xayah', '2★', true), slot('Ornn', '2★'), slot('Alistar', '2★'), slot('Rakan', '2★')],"],
    ["endgame: [slot('Tristana', '3★', true), slot(\"Kog'Maw\", '3★', true), slot('Rammus', '3★'), slot('Kobuko', '3★'), slot('Teemo', '3★'), slot('Sivir', '2★'), slot('Gnar', '1★'), slot('Nidalee', '2★')],", "endgame: [slot('Tristana', '3★', true), slot(\"Kog'Maw\", '2★', true), slot('Rammus', '3★'), slot('Kobuko', '2★'), slot('Teemo', '2★'), slot('Sivir', '2★'), slot('Gnar', '1★'), slot('Nidalee', '2★')],"],
    ["endgame: [slot('Raptor', '3★', true), slot('Murkwolf', '3★', true), slot('Scuttlecrab', '3★'), slot('Krug', '2★'), slot('Gromp', '2★'), slot('Pebbles', '2★'), slot('Cinderling', '2★'), slot('The Elder Dragon', '1★', true)],", "endgame: [slot('Raptor', '3★', true), slot('Murkwolf', '2★', true), slot('Scuttlecrab', '3★'), slot('Krug', '2★'), slot('Gromp', '2★'), slot('Pebbles', '2★'), slot('Cinderling', '2★'), slot('The Elder Dragon', '1★', true)],"],
    ["transition: [slot('Akali', '3★', true), slot('Varus', '3★', true), slot('Leona', '3★'),", "transition: [slot('Akali', '3★', true), slot('Varus', '3★', true), slot('Leona', '2★'),"],
    ["endgame: [slot('Akali', '3★', true), slot('Varus', '3★', true), slot('Leona', '3★'),", "endgame: [slot('Akali', '3★', true), slot('Varus', '3★', true), slot('Leona', '2★'),"],
    ["transition: [slot('Kayle', '3★', true), slot('Sejuani', '3★'), slot('Leona', '3★'),", "transition: [slot('Kayle', '3★', true), slot('Sejuani', '3★'), slot('Leona', '2★'),"],
    ["endgame: [slot('Kayle', '3★', true), slot('Sejuani', '3★'), slot('Leona', '3★'),", "endgame: [slot('Kayle', '3★', true), slot('Sejuani', '3★'), slot('Leona', '2★'),"],
    ["tier: 'S hypothesis'", "tier: 'High-confidence shell'"],
    ["tier: 'A hypothesis'", "tier: 'Medium-confidence shell'"],
    ["tier: 'B hypothesis'", "tier: 'Conditional shell'"],
    ["tier: 'High-roll'", "tier: 'High-roll only'"],
    ["updatedAt: '2026-07-13'", "updatedAt: '2026-07-15'"],
  ]);
  for (const [before, after] of replacements) html = html.split(before).join(after);

  const economyData = `const ECON_GUIDANCE = {
  'blossom-fast-8': { objective: 'Preserve HP with upgraded holders, then convert a 40g+ level-8 roll-down into one upgraded carry and one upgraded frontline.', streak: 'Prefer a win streak. Four Blossom is not stronger than three unless it reaches the next sourced breakpoint; field the strongest upgraded board and buy Wisps only when they beat the interest gold they cost.', checkpoints: ['2-1: level only with two upgrades or a slam that makes the next fight highly likely.', '3-2: level 6 if it adds real frontline or damage; otherwise retain 30–50g.', '4-2: level 8 with about 40g; delay to 4-5 if earlier stabilization preserved HP but reduced the bank.'], carousel: ['Bow or Sword for the physical holder', 'Tear or Rod for the caster holder', 'Belt / Vest / Cloak when frontline is why fights are lost'] },
  'inferno-reroll': { objective: 'Trade early levels for one-cost odds, then spend enough at 3-1 to make Stage 3 genuinely stronger.', streak: 'Loss streak only when it preserves 30–50g and core copies. Do not hold every pair and miss interest.', checkpoints: ['Do not level in Stage 2.', '3-1 at level 4: roll for Varus/Akali when copies are dense; stop once stable or one carry is complete.', 'After the first 3★: rebuild economy and level instead of chasing Leona 3★.'], carousel: ['Bow / Sword for Varus', 'Glove / Sword / Cloak for Akali', 'Defensive component only when frontline has no completed item'] },
  'solar-kayle-reroll': { objective: 'Use level-6 two-cost odds to complete Kayle and Sejuani without surrendering Stage 4 tempo.', streak: 'An upgraded Leona/Kayle opener may win streak; otherwise loss streak cleanly and arrive at 3-2 with a bank. Spending must produce Kayle 2★ plus frontline upgrades.', checkpoints: ['3-2: level 6 and stabilize, ideally retaining 30g.', 'Slow roll above 50g while healthy.', 'By 4-1, complete the main pair or abandon the chase and level.'], carousel: ['Bow first', 'Sword or Glove second', 'Belt / Vest when Kayle already has two usable items'] },
  'sprykin-flex-reroll': { objective: 'Reach level 7 with enough HP and gold to choose one three-cost branch instead of funding every pair.', streak: 'Upgraded Kobuko/Veigar/Teemo can streak. Otherwise sell low-value pairs to preserve interest and let HP buy the level-7 bank.', checkpoints: ['3-2: level 6 for board quality; avoid rolling for three-costs unless near lethal.', '3-5 or 4-1: level 7 and find one carry 2★ plus Rammus 2★.', 'Slow roll only the branch with superior copies and items.'], carousel: ['Bow for Tristana', 'Tear / Rod for Kog’Maw', 'Tank component when Rammus collapses too early'] },
  'riftbeast-vertical': { objective: 'Follow natural copies and choose the level-6 two-cost pair or the level-7 Raptor line; never pay for both windows.', streak: 'Trait count alone is not tempo. Field upgraded creatures and preserve either HP through strength or gold through a clean loss streak.', checkpoints: ['Level 6 reroll only with many Murkwolf + Scuttlecrab copies.', 'Otherwise reach level 7 at 3-5/4-1 and stabilize Raptor/Krug.', 'After the primary 3★, level toward Elder Dragon rather than chasing every unit.'], carousel: ['Sword / Bow for the chosen carry', 'Cloak or Belt for frontline', 'Do not split components across two carry branches'] },
  'elderwood-fast-8': { objective: 'Use cheap upgraded holders to preserve HP and enter level 8 with enough gold to buy whichever four-cost pair appears.', streak: 'This is a strong win-streak shell only when upgraded. Xayah 2★ and Ornn 2★ matter more than a weak vertical count.', checkpoints: ['2-1/2-5: level only to protect a real streak.', '3-2: level 6 with 30–40g if it adds Alistar/LeBlanc/Hecarim quality.', '4-2: level 8 with about 40g; stop after one upgraded carry and two upgraded frontliners.'], carousel: ['Bow / Sword for Xayah → Aphelios', 'Tear / Rod for LeBlanc → Alune', 'Defensive component if damage already has two items'] },
  'fast-9-peeba': { objective: 'Convert an already-winning level-8 board and excess economy into legendary upgrades; level 9 is the reward, not the stabilization plan.', streak: 'Must preserve both HP and gold. If spending at 8 does not stop losses, abandon Fast 9 and finish the level-8 board.', checkpoints: ['4-2: stabilize level 8 without going to zero.', 'Push 9 only when the remaining bank can still buy and roll—normally 30g+ or with major XP help.', 'At 9, buy upgraded power first and elegant synergies second.'], carousel: ['Complete the nearest real slam', 'Prefer flexible Tear/Sword/Belt over waiting for a perfect legendary', 'Spatula only for immediate board value'] },
  'coven-caitlyn-reroll': { objective: 'Use level-6 odds for Caitlyn and Elise while Cassiopeia or Morgana absorbs AP components.', streak: 'Caitlyn 2★ plus a tank can streak; otherwise loss streak to a healthy 3-2 bank. Coven count is secondary to upgrades.', checkpoints: ['3-2: level 6 and find Caitlyn 2★ / Elise 2★.', 'Slow roll only with at least five Caitlyn copies and low contest.', 'After Caitlyn 3★, level; Elise 3★ is optional.'], carousel: ['Sword / Bow for Caitlyn', 'Tear / Rod for AP branch', 'Tank component if Elise has no completed item'] },
  'eldritch-warwick-reroll': { objective: 'Complete Warwick at level 6, use Rek’Sai only when copies are natural, then level for Azir and Malphite utility.', streak: 'Warwick items plus upgraded frontline can streak; otherwise preserve interest and sell speculative pairs that cost a breakpoint.', checkpoints: ['3-2: level 6 and roll until Warwick 2★ plus two upgraded frontliners.', 'Slow roll Warwick above 50; finish Rek’Sai only if close.', 'Push levels after Warwick 3★.'], carousel: ['Sword / Cloak / Bow for Warwick', 'Tank component for Rek’Sai/Malphite', 'Rod/Tear after the main carry package works'] },
  'lunar-aphelios-fast-8': { objective: 'Use a Solar/Rapidfire opener to hold Aphelios items, then pivot through Diana into Aphelios + Alune.', streak: 'Kayle/Xayah upgrades preserve HP. Do not force Lunar early: Diana is a transition unit, not an honest Stage-2 requirement.', checkpoints: ['3-2: level 6 if it adds Diana plus frontline quality.', '4-2: level 8 with roughly 40g.', 'Stop after Aphelios 2★ or Alune plus stable frontline; do not die searching for both.'], carousel: ['Bow / Sword for Aphelios', 'Tear / Rod for Alune', 'Belt/Vest when frontline time is insufficient'] },
  'primal-sivir-flex': { objective: 'Treat Primal as a level-8 pivot: preserve HP with generic upgrades, then pair Sivir and Nidalee with the frontline actually hit.', streak: 'There is no honest low-cost Primal opener. Win streak with Xayah/Ornn/Alistar or loss streak cleanly; never weaken Stage 2 to imitate the final trait.', checkpoints: ['3-2: level 6 with the strongest upgraded shell.', '4-2/4-5: level 8 with enough gold for Sivir/Nidalee and two frontliners.', 'If one carry appears, itemize it and use a generic secondary rather than donkey rolling.'], carousel: ['Sword / Bow for Sivir', 'Rod / Tear for Nidalee or an AP holder', 'Tank components when the carry already has two items'] },
};

`;
  html = html.replace('const MOBALYTICS_ITEM_SLUGS = {', economyData + 'const MOBALYTICS_ITEM_SLUGS = {');
  html = html.replace(
    'Object.assign(composition, COMPOSITION_DETAILS[composition.id]);',
    'Object.assign(composition, COMPOSITION_DETAILS[composition.id], ECON_GUIDANCE[composition.id]);',
  );

  const economyMarkup = `    <section class="analysis-section economy-section" aria-labelledby="economy-title">
      <header class="analysis-heading">
        <h3 id="economy-title">Gold, HP, tempo, and carousel</h3>
        <p>Spend gold only when the resulting board is expected to preserve HP; spend HP only when it preserves meaningful interest or a deliberate streak.</p>
      </header>
      <div class="economy-grid">
        <article><h4>Composition objective</h4><p>\${escapeHtml(composition.objective)}</p></article>
        <article><h4>Streak logic</h4><p>\${escapeHtml(composition.streak)}</p></article>
        <article><h4>Level / roll checkpoints</h4>\${renderBulletList(composition.checkpoints)}</article>
        <article><h4>Carousel priority</h4>\${renderBulletList(composition.carousel)}</article>
      </div>
    </section>

`;
  html = html.replace(
    '    <section class="analysis-section analysis-intro" aria-labelledby="thesis-title">',
    economyMarkup + '    <section class="analysis-section analysis-intro" aria-labelledby="thesis-title">',
  );

  const economyCss = `.economy-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;overflow:hidden;border-radius:var(--radius-surface);background:var(--color-border)}.economy-grid article{padding:var(--space-4);background:var(--color-surface)}.economy-grid h4{margin:0 0 var(--space-2);color:var(--color-gold)}.economy-grid p{margin:0}@media(max-width:720px){.economy-grid{grid-template-columns:1fr}}`;
  html = html.replace('</style>', economyCss + '</style>');
  html = html.replace(
    'Set 18 portrait and trait assets load from tactics.tools; deterministic initials keep every board readable offline.',
    'Set 18 champion, trait, and current item artwork loads from tactics.tools with deterministic fallbacks. Every line now states its gold, HP, streak, roll, level, and carousel assumptions.',
  );

  return html;
};
