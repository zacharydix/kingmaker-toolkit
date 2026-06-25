// scripts/data/focus-data.js

export const FOCUS_IDS = {
  ALCHEMICAL_LAB: 'ALCHEMICAL_LAB',
  ARCANUM_GUILD: 'ARCANUM_GUILD',
  ARTISANS_GUILD: 'ARTISANS_GUILD',
  BAZAAR: 'BAZAAR',
  CARAVANSARAI: 'CARAVANSARAI',
  CASINO: 'CASINO',
  CASTLE: 'CASTLE',
  CIRCUS: 'CIRCUS',
  DRUIDS_GROVE: 'DRUIDS_GROVE',
  EXORCISTS_EXTRAORDINAIRE: 'EXORCISTS_EXTRAORDINAIRE',
  FARMING_INITIATIVE: 'FARMING_INITIATIVE',
  FAMOUS_TAVERN: 'FAMOUS_TAVERN',
  GOLD_MINE: 'GOLD_MINE',
  HEALING_HOUSES: 'HEALING_HOUSES',
  HUNTERS_LODGE: 'HUNTERS_LODGE',
  LIBRARY: 'LIBRARY',
  MAGICAL_CRAFTER: 'MAGICAL_CRAFTER',
  MARVELOUS_MARKETPLACE: 'MARVELOUS_MARKETPLACE',
  MASTER_BLACKSMITH: 'MASTER_BLACKSMITH',
  MINT: 'MINT',
  MONUMENT: 'MONUMENT',
  MUSEUM_OF_THE_ANCIENT_ARCANE: 'MUSEUM_OF_THE_ANCIENT_ARCANE',
  PALACE: 'PALACE',
  POTION_SELLER: 'POTION_SELLER',
  PRINTING_PRESS: 'PRINTING_PRESS',
  PUBLIC_FORUM: 'PUBLIC_FORUM',
  SCENIC_RETREAT: 'SCENIC_RETREAT',
  TEMPLE_DISTRICT: 'TEMPLE_DISTRICT',
  THIEVES_GUILD: 'THIEVES_GUILD',
  TRAINING_GROUND: 'TRAINING_GROUND',
  TRAINING_HOSPITAL: 'TRAINING_HOSPITAL',
  UNIVERSITY: 'UNIVERSITY',
  WALLS: 'WALLS',
};

export const FOCI = {
  [FOCUS_IDS.ALCHEMICAL_LAB]: {
    id: FOCUS_IDS.ALCHEMICAL_LAB,
    name: 'Alchemical Lab',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: 'Craft alchemical items at 3 levels higher.',
    benefit:
      '+3 circumstance bonus to Craft alchemical items. Craft as if 3 levels higher when reducing the cost of alchemical items.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.ARCANUM_GUILD]: {
    id: FOCUS_IDS.ARCANUM_GUILD,
    name: 'Arcanum Guild',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Arcana, Occultism)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['arcana', 'occultism'],
  },

  [FOCUS_IDS.ARTISANS_GUILD]: {
    id: FOCUS_IDS.ARTISANS_GUILD,
    name: "Artisan's Guild",
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Crafting)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['crafting'],
  },

  [FOCUS_IDS.BAZAAR]: {
    id: FOCUS_IDS.BAZAAR,
    name: 'Bazaar',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: 'Sell non-magical items at full value.',
    benefit:
      'After one month of downtime, sell non-magical items for their full value instead of half.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.CARAVANSARAI]: {
    id: FOCUS_IDS.CARAVANSARAI,
    name: 'Caravansarai',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Deception, Diplomacy)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['deception', 'diplomacy'],
  },

  [FOCUS_IDS.CASINO]: {
    id: FOCUS_IDS.CASINO,
    name: 'Casino',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Deception, Thievery)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['deception', 'thievery'],
  },

  [FOCUS_IDS.CASTLE]: {
    id: FOCUS_IDS.CASTLE,
    name: 'Castle',
    minimumSettlementType: 'Town',
    repeatable: true,
    quickDescription: 'Armies begin battles fortified.',
    benefit:
      'Armies begin battles fortified. If this settlement also has Walls, the first damage each army would take in battle is negated. Multiple settlements can choose this Focus.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.CIRCUS]: {
    id: FOCUS_IDS.CIRCUS,
    name: 'Circus',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Acrobatics, Performance)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['acrobatics', 'performance'],
  },

  [FOCUS_IDS.DRUIDS_GROVE]: {
    id: FOCUS_IDS.DRUIDS_GROVE,
    name: "Druids' Grove",
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Survival, Nature)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['survival', 'nature'],
  },

  [FOCUS_IDS.EXORCISTS_EXTRAORDINAIRE]: {
    id: FOCUS_IDS.EXORCISTS_EXTRAORDINAIRE,
    name: 'Exorcists Extraordinaire',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Intimidation, Occultism)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['intimidation', 'occultism'],
  },

  [FOCUS_IDS.FARMING_INITIATIVE]: {
    id: FOCUS_IDS.FARMING_INITIATIVE,
    name: 'Farming Initiative',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Athletics, Nature)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['athletics', 'nature'],
  },

  [FOCUS_IDS.FAMOUS_TAVERN]: {
    id: FOCUS_IDS.FAMOUS_TAVERN,
    name: 'Famous Tavern',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Performance, Lore)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['performance', 'lore'],
  },

  [FOCUS_IDS.GOLD_MINE]: {
    id: FOCUS_IDS.GOLD_MINE,
    name: 'Gold Mine',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: 'Monthly passive income.',
    benefit: 'Each month, each PC receives gold equal to half the settlement level.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.HEALING_HOUSES]: {
    id: FOCUS_IDS.HEALING_HOUSES,
    name: 'Healing Houses',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Medicine, Religion)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['medicine', 'religion'],
  },

  [FOCUS_IDS.HUNTERS_LODGE]: {
    id: FOCUS_IDS.HUNTERS_LODGE,
    name: "Hunter's Lodge",
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Stealth, Survival)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['stealth', 'survival'],
  },

  [FOCUS_IDS.LIBRARY]: {
    id: FOCUS_IDS.LIBRARY,
    name: 'Library',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: '+3 to research.',
    benefit: '+3 circumstance bonus to research-related skill checks while in this settlement.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MAGICAL_CRAFTER]: {
    id: FOCUS_IDS.MAGICAL_CRAFTER,
    name: 'Magical Crafter',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: 'Craft magical equipment at 3 levels higher.',
    benefit:
      '+3 to transfer runes and Craft magical equipment. Craft as if 3 levels higher when reducing the cost of magical equipment.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MARVELOUS_MARKETPLACE]: {
    id: FOCUS_IDS.MARVELOUS_MARKETPLACE,
    name: 'Marvelous Marketplace',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: 'Sell magical items at full value.',
    benefit:
      'After one month of downtime, sell magical items for their full value instead of half.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MASTER_BLACKSMITH]: {
    id: FOCUS_IDS.MASTER_BLACKSMITH,
    name: 'Master Blacksmith',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: 'Craft magical weapons and armor at 3 levels higher.',
    benefit:
      '+3 circumstance bonus to Craft magical weapons and armor. Craft as if 3 levels higher when reducing the cost of magical weapons and armor.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MINT]: {
    id: FOCUS_IDS.MINT,
    name: 'Mint',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: 'Monthly passive income.',
    benefit: 'Each month, each PC receives gold equal to the settlement level.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MONUMENT]: {
    id: FOCUS_IDS.MONUMENT,
    name: 'Monument',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: 'Reroll one critical failure.',
    benefit: 'Once per Kingdom Turn, reroll one critical failure. You must use the new result.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.MUSEUM_OF_THE_ANCIENT_ARCANE]: {
    id: FOCUS_IDS.MUSEUM_OF_THE_ANCIENT_ARCANE,
    name: 'Museum of the Ancient Arcane',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Acrobatics, Arcana)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['acrobatics', 'arcana'],
  },

  [FOCUS_IDS.PALACE]: {
    id: FOCUS_IDS.PALACE,
    name: 'Palace',
    minimumSettlementType: 'Metropolis',
    repeatable: false,
    quickDescription: 'Reduce Unrest each Kingdom Turn.',
    benefit: 'At the beginning of each Kingdom Turn, automatically reduce Unrest by 1.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.POTION_SELLER]: {
    id: FOCUS_IDS.POTION_SELLER,
    name: 'Potion Seller',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: 'Craft magical potions at 3 levels higher.',
    benefit:
      '+3 circumstance bonus to Craft magical potions. Craft as if 3 levels higher when reducing the cost of magical potions.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.PRINTING_PRESS]: {
    id: FOCUS_IDS.PRINTING_PRESS,
    name: 'Printing Press',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Diplomacy, Society)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['diplomacy', 'society'],
  },

  [FOCUS_IDS.PUBLIC_FORUM]: {
    id: FOCUS_IDS.PUBLIC_FORUM,
    name: 'Public Forum',
    minimumSettlementType: 'City',
    repeatable: false,
    quickDescription: 'Gain half Unrest from Events.',
    benefit:
      'Once per Kingdom Turn, when you would gain Unrest from an Event, gain half as much Unrest instead.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.SCENIC_RETREAT]: {
    id: FOCUS_IDS.SCENIC_RETREAT,
    name: 'Scenic Retreat',
    minimumSettlementType: 'Town',
    repeatable: false,
    quickDescription: '+3 to Influence checks.',
    benefit: '+3 circumstance bonus to checks made to gain Influence with NPCs at this settlement.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.TEMPLE_DISTRICT]: {
    id: FOCUS_IDS.TEMPLE_DISTRICT,
    name: 'Temple District',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Religion, Society)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['religion', 'society'],
  },

  [FOCUS_IDS.THIEVES_GUILD]: {
    id: FOCUS_IDS.THIEVES_GUILD,
    name: "Thieves' Guild",
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Stealth, Thievery)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['stealth', 'thievery'],
  },

  [FOCUS_IDS.TRAINING_GROUND]: {
    id: FOCUS_IDS.TRAINING_GROUND,
    name: 'Training Ground',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Athletics, Intimidation)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['athletics', 'intimidation'],
  },

  [FOCUS_IDS.TRAINING_HOSPITAL]: {
    id: FOCUS_IDS.TRAINING_HOSPITAL,
    name: 'Training Hospital',
    minimumSettlementType: 'Village',
    repeatable: false,
    quickDescription: 'Earn Income (Crafting, Medicine)',
    benefit: 'Jobs up to kingdom level. +3 circumstance bonus.',
    earnIncomeSkills: ['crafting', 'medicine'],
  },

  [FOCUS_IDS.UNIVERSITY]: {
    id: FOCUS_IDS.UNIVERSITY,
    name: 'University',
    minimumSettlementType: 'Metropolis',
    repeatable: false,
    quickDescription: '+3 to Intelligence- or Wisdom-based checks.',
    benefit:
      '+3 circumstance bonus to all Intelligence- or Wisdom-based skill checks while in this settlement.',
    earnIncomeSkills: [],
  },

  [FOCUS_IDS.WALLS]: {
    id: FOCUS_IDS.WALLS,
    name: 'Walls',
    minimumSettlementType: 'Village',
    repeatable: true,
    quickDescription: 'Armies begin battles fortified.',
    benefit:
      'If a battle occurs in this hex, your armies begin with the fortified condition. Multiple settlements can choose this Focus.',
    earnIncomeSkills: [],
  },
};
