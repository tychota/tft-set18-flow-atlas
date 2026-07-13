const item = (slug, short) => ({
  short,
  iconSources: [
    `./assets/items/${slug}.png`,
    `https://cdn.mobalytics.gg/assets/tft/images/items/icons/${slug}.png`,
    `https://raw.communitydragon.org/latest/game/assets/maps/tft/icons/items/hexcore/tft_item_${slug.replaceAll('-', '')}.png`,
  ],
});

const ITEMS = {
  'Bloodthirster': item('bloodthirster', 'BT'),
  'Bramble Vest': item('bramble-vest', 'BV'),
  'Dragon’s Claw': item('dragons-claw', 'DC'),
  'Evenshroud': item('evenshroud', 'ES'),
  'Gargoyle Stoneplate': item('gargoyle-stoneplate', 'GS'),
  'Giant Slayer': item('giant-slayer', 'GiS'),
  'Guardbreaker': item('guardbreaker', 'GB'),
  'Guinsoo’s Rageblade': item('guinsoos-rageblade', 'GR'),
  'Hand of Justice': item('hand-of-justice', 'HoJ'),
  'Infinity Edge': item('infinity-edge', 'IE'),
  'Jeweled Gauntlet': item('jeweled-gauntlet', 'JG'),
  'Kraken’s Fury': item('krakens-fury', 'KF'),
  'Last Whisper': item('last-whisper', 'LW'),
  'Morellonomicon': item('morellonomicon', 'MO'),
  'Nashor-style attack speed': item('nashors-tooth', 'NT'),
  'Nashor-style tempo': item('nashors-tooth', 'NT'),
  'Spear of Shojin': item('spear-of-shojin2', 'SoS'),
  'Sterak’s Gage': item('steraks-gage', 'SG'),
  'Titan’s Resolve': item('titans-resolve', 'TR'),
  'Void Staff': item('voidstaff', 'VS'),
  'Warmog’s Armor': item('warmogs-armor', 'WA'),
};

const assetSlug = (value) => value
  .toLowerCase()
  .replaceAll(/[^a-z0-9]+/g, '-')
  .replaceAll(/^-|-$/g, '');

const trait = (assetId, thresholds, description) => {
  const externalIconUrl = `https://ap.tft.tools/static/trait-icons/${assetId.toLowerCase()}_w.svg`;
  return {
    assetId,
    thresholds,
    description,
    iconUrl: externalIconUrl,
    iconSources: [externalIconUrl],
  };
};

const TRAITS = {
  Blossom: trait('TFT18_Blossom', [3, 5, 7, 9, 11], 'Improves Wisps and grants Blossom units AD, AP, and max Health.'),
  Inferno: trait('TFT18_Inferno', [3, 5, 7, 9], 'Ignites shop slots and rewards aggressive damage-focused boards.'),
  Elderwood: trait('TFT18_Elderwood', [3, 5, 7, 9, 11], 'Adds placeable plant value and scales into a flexible late board.'),
  Riftbeast: trait('TFT18_Riftbeast', [3, 5, 7, 9], 'Builds a creature vertical with Elder Dragon as the premium cap.'),
  Sprykin: trait('TFT18_Sprykin', [3, 5, 7], 'Summons a BFF rider and supports both ranged and melee branches.'),
  Solar: trait('TFT18_Solar', [2, 3, 4], 'A compact line centered on Leona, Kayle, and Sejuani.'),
  Fae: trait('TFT18_Fae', [2, 4], 'Pixies reward damage, healing, and shielding.'),
  Lunar: trait('TFT18_Lunar', [2, 3, 4], 'Scales its combat effects as Lunar units join the board.'),
  Eldritch: trait('TFT18_Eldritch', [2, 4, 6], 'Sacrifices or empowers allies for role- and cost-based bonuses.'),
  Primal: trait('TFT18_Primal', [2, 3, 4], 'Flexible animal blessings for mid- and late-game splashes.'),
  'Flora Fatalis': trait('TFT18_FloraFatalis', [2], 'A compact utility pair through Fiddlesticks and Soraka.'),
  Spellweaver: trait('TFT18_Spellweaver', [2, 4, 6], 'Grants team AP and additional AP whenever Spellweavers cast.'),
  Hunter: trait('TFT18_Hunter', [2, 4], 'Strengthens ranged physical carries.'),
  Rapidfire: trait('TFT18_Rapidfire', [2, 4, 6], 'Adds attack-speed scaling for backline carries.'),
  Ravager: trait('TFT18_Ravager', [2, 4, 6], 'Supports aggressive melee damage dealers.'),
  Brawler: trait('TFT18_Brawler', [2, 4, 6], 'Grants team Health and additional Health to Brawlers.'),
  Defender: trait('TFT18_Defender', [2, 4, 6], 'Provides a reliable defensive shell.'),
  Juggernaut: trait('TFT18_Juggernaut', [2, 4, 6], 'Grants team Durability, with extra durability for Juggernauts.'),
  Vanguard: trait('TFT18_Vanguard', [2, 4, 6], 'Uses shields and durability to anchor the frontline.'),
  Invoker: trait('TFT18_Invoker', [2, 4], 'Improves mana generation and casting frequency.'),
  Executioner: trait('TFT18_Executioner', [2, 4], 'Finishes weakened targets and amplifies carry pressure.'),
  Summoner: trait('TFT18_Summoner', [2, 3], 'Empowers the summons created by Yorick, Azir, Raptor, and Zyra.'),
  Adaptor: trait('TFT18_Adaptor', [2, 4], 'Keeps hybrid item and board directions flexible.'),
  Caustic: trait('TFT18_Caustic', [1], 'Kog’Maw’s unique damage utility.'),
  Thornmaiden: trait('TFT18_Thornmaiden', [1], 'Zyra’s unique summon identity.'),
  Attuned: trait('TFT18_Attuned', [1], 'Alune’s unique legendary utility.'),
  Avatar: trait('TFT18_Avatar', [1], 'Lux adapts to complete a valuable trait package.'),
  'Old Growth': trait('TFT18_OldGrowth', [1], 'Maokai’s unique legendary tank identity.'),
  'Emerald Aspect': trait('TFT18_EmeraldAspect', [1], 'Taric’s unique defensive legendary identity.'),
  'Apex Predator': trait('TFT18_ApexPredator', [1], 'Elder Dragon’s unique vertical payoff.'),
};

for (const [name, definition] of Object.entries(TRAITS)) {
  definition.iconSources.unshift(`./assets/traits/${assetSlug(name)}.svg`);
}
