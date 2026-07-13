const WISPS = {};
const AUGMENTS = {};

const TFT_ONLY_UNITS = new Set([
  'Alune',
  'Cinderling',
  'Gromp',
  'Kobuko',
  'Krug',
  'Murkwolf',
  'Pebbles',
  'Raptor',
  'Scuttlecrab',
  'The Elder Dragon',
  'Yunara',
]);

const SET18_ASSET_OVERRIDES = {
  LeBlanc: 'TFT18_LeBlanc',
  "Kog'Maw": 'TFT18_KogMaw',
  "Master Yi": 'TFT18_MasterYi',
  "Rek'Sai": 'TFT18_RekSai',
  'The Elder Dragon': 'TFT18_ElderDragon',
};

const PORTRAIT_SLUG_OVERRIDES = {
  LeBlanc: 'Leblanc',
  "Kog'Maw": 'KogMaw',
  "Master Yi": 'MasterYi',
  "Rek'Sai": 'RekSai',
};

for (const [name, unit] of Object.entries(UNITS)) {
  const set18AssetId = SET18_ASSET_OVERRIDES[name] ?? `TFT18_${name.replaceAll(/[^A-Za-z0-9]/g, '')}`;
  const portraitSources = [
    `./assets/champions/${assetSlug(name)}.jpg`,
    `https://ap.tft.tools/img/gg17/face_full_ultrawide/${set18AssetId}.jpg?w=290`,
  ];

  if (!TFT_ONLY_UNITS.has(name)) {
    const slug = PORTRAIT_SLUG_OVERRIDES[name] ?? name.replaceAll(/[^A-Za-z]/g, '');
    portraitSources.push(`https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${slug}_0.jpg`);
  }

  unit.set18AssetId = set18AssetId;
  unit.portraitSources = portraitSources;
  unit.portraitFocus = '50% 50%';
  unit.fallbackGlyph = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

Object.assign(WISPS, {
  'All Ones': 'Reroll the shop with five 1-cost champions. Best used during the level 5 one-cost roll window.',
  'All Twos': 'Reroll the shop with five 2-cost champions. A direct accelerator for Kayle, Sejuani, or Murkwolf lines.',
  'All Threes': 'Reroll the shop with five 3-cost champions. Highest value when several three-cost targets are still buyable.',
  'All Fours': 'Reroll the shop with five 4-cost champions. Use after reaching the level where buying several results is affordable.',
  'All Fives': 'Reroll the shop with five 5-cost champions. A cap tool, not a substitute for stabilizing first.',
  Experienced: 'Spend 1 gold to gain 2 XP. Valuable when it preserves an interest breakpoint or advances a level timing.',
  Fertilize: 'Gain 1 XP for each enemy that dies this combat. Buy when the board can reliably kill several units.',
  Flood: 'Add 2 to the current win streak. Only valuable when the next fight is likely to preserve the streak.',
  'Blood Money': 'Gain 1 gold for every enemy champion killed this combat. Strong on boards that win or lose narrowly.',
  Freeroller: 'Spend 2 gold to gain two rerolls. It converts a Wisp purchase into a more efficient roll interval.',
  'Forest Guide': 'Gain a random 4-cost champion. Useful as a transition lottery before or during a Fast 8 stabilization.',
  'Border Village': 'Reroll the shop with five 2-star 2-cost champions. Extremely powerful when multiple two-costs fit the line.',
  'Solar Gift': 'Gain Leona, Sejuani, and Kayle. A direct entry or recovery tool for Solar reroll.',
  'Hand of Baron': 'With Riftbeast active, grant the team a Baron-style combat buff.',
  'Fake Level': 'Temporarily become level 10. Use it to access better high-cost shop odds during a prepared roll-down.',
  'Grow Up': 'Gain 16 XP. Best when it completes level 8 or 9 without destroying the roll-down bank.',
  'The Chariot': 'Rerolls and XP are half price while the effect applies. Preserve enough gold to exploit both sides.',
  'Hero of Prophecy': 'At level 10, gain the same random 5-cost each round. A long-horizon legendary upgrade engine.',
  'Circle of Elders': 'Gain one copy of every 5-cost champion. The strongest raw Peeba cap injection, at a very high price.',
});

Object.assign(AUGMENTS, {
  "Blossom's Call": 'Wisp purchases grant Blossom champions based on Wisp cost, immediately reinforcing both trait depth and economy.',
  'Wisp Rebate': 'Gain gold whenever a Wisp is purchased. It changes the acceptable price of otherwise marginal Wisps.',
  'Residual Magic': 'The team gains Health and each Wisp purchase increases the permanent bonus.',
  'Backup Bows': 'Grants a Recurve Bow and rewards repeated attacks, supporting Rapidfire and Hunter item lines.',
  'Flame On': 'Grants Varus and Akali; the highest-damage Inferno gains Attack Speed after each combat.',
  'Carve a Path': 'Grants a B.F. Sword and rewards repeated physical damage.',
  'Rolling For Days': 'Provides free shop rerolls, directly increasing reroll reach without consuming the entire interest bank.',
  "Caretaker's Ally": 'Gain a random 2-cost now and another copy whenever leveling, favoring flexible two-cost lines.',
  'Boxing Lessons': 'Front-row allies grant team Health, improving reroll boards with several melee units.',
  'Branching Out': 'Gain a random emblem, creating high-upside vertical or trait-bridge outcomes.',
  'Champ Delivery': 'Provides champions now and later, increasing natural-copy density before a committed roll-down.',
  'Capital Gains I': 'Stores part of earned interest and pays it later, supporting delayed Fast 8 or Fast 9 timings.',
  'Augmented Power': 'Raises the tier of the next augment, trading immediate certainty for a stronger future choice.',
});
