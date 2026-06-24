// scripts/data/focus-data.js

export const FOCUS_IDS = {
  ALCHEMICAL_LAB: "ALCHEMICAL_LAB",
  ARCANUM_GUILD: "ARCANUM_GUILD",
  ARTISANS_GUILD: "ARTISANS_GUILD",
  BAZAAR: "BAZAAR",
  CARAVANSARAI: "CARAVANSARAI",
  CASINO: "CASINO",
  CASTLE: "CASTLE",
  CIRCUS: "CIRCUS",
  DRUIDS_GROVE: "DRUIDS_GROVE",
  EXORCISTS_EXTRAORDINAIRE: "EXORCISTS_EXTRAORDINAIRE",
  FARMING_INITIATIVE: "FARMING_INITIATIVE",
  FAMOUS_TAVERN: "FAMOUS_TAVERN",
  GOLD_MINE: "GOLD_MINE",
  HEALING_HOUSES: "HEALING_HOUSES",
  HUNTERS_LODGE: "HUNTERS_LODGE",
  LIBRARY: "LIBRARY",
  MAGICAL_CRAFTER: "MAGICAL_CRAFTER",
  MARVELOUS_MARKETPLACE: "MARVELOUS_MARKETPLACE",
  MASTER_BLACKSMITH: "MASTER_BLACKSMITH",
  MINT: "MINT",
  MONUMENT: "MONUMENT",
  MUSEUM_OF_THE_ANCIENT_ARCANE: "MUSEUM_OF_THE_ANCIENT_ARCANE",
  PALACE: "PALACE",
  POTION_SELLER: "POTION_SELLER",
  PRINTING_PRESS: "PRINTING_PRESS",
  PUBLIC_FORUM: "PUBLIC_FORUM",
  SCENIC_RETREAT: "SCENIC_RETREAT",
  TEMPLE_DISTRICT: "TEMPLE_DISTRICT",
  THIEVES_GUILD: "THIEVES_GUILD",
  TRAINING_GROUND: "TRAINING_GROUND",
  TRAINING_HOSPITAL: "TRAINING_HOSPITAL",
  UNIVERSITY: "UNIVERSITY",
  WALLS: "WALLS"
};

export const FOCI = {
  [FOCUS_IDS.ALCHEMICAL_LAB]: {
    id: FOCUS_IDS.ALCHEMICAL_LAB,
    name: "Alchemical Lab",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.ARCANUM_GUILD]: {
    id: FOCUS_IDS.ARCANUM_GUILD,
    name: "Arcanum Guild",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["arcana", "occultism"]
  },

  [FOCUS_IDS.ARTISANS_GUILD]: {
    id: FOCUS_IDS.ARTISANS_GUILD,
    name: "Artisan's Guild",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["crafting"]
  },

  [FOCUS_IDS.BAZAAR]: {
    id: FOCUS_IDS.BAZAAR,
    name: "Bazaar",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.CARAVANSARAI]: {
    id: FOCUS_IDS.CARAVANSARAI,
    name: "Caravansarai",
    minimumSettlementType: "Village",
    repeatable: false,
    earnIncomeSkills: ["deception", "diplomacy"]
  },

  [FOCUS_IDS.CASINO]: {
    id: FOCUS_IDS.CASINO,
    name: "Casino",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: ["deception", "thievery"]
  },

  [FOCUS_IDS.CASTLE]: {
    id: FOCUS_IDS.CASTLE,
    name: "Castle",
    minimumSettlementType: "Town",
    repeatable: true,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.CIRCUS]: {
    id: FOCUS_IDS.CIRCUS,
    name: "Circus",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["acrobatics", "performance"]
  },

  [FOCUS_IDS.DRUIDS_GROVE]: {
    id: FOCUS_IDS.DRUIDS_GROVE,
    name: "Druids' Grove",
    minimumSettlementType: "Village",
    repeatable: false,
    earnIncomeSkills: ["survival", "nature"]
  },

  [FOCUS_IDS.EXORCISTS_EXTRAORDINAIRE]: {
    id: FOCUS_IDS.EXORCISTS_EXTRAORDINAIRE,
    name: "Exorcists Extraordinaire",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["intimidation", "occultism"]
  },

  [FOCUS_IDS.FARMING_INITIATIVE]: {
    id: FOCUS_IDS.FARMING_INITIATIVE,
    name: "Farming Initiative",
    minimumSettlementType: "Village",
    repeatable: false,
    earnIncomeSkills: ["athletics", "nature"]
  },

  [FOCUS_IDS.FAMOUS_TAVERN]: {
    id: FOCUS_IDS.FAMOUS_TAVERN,
    name: "Famous Tavern",
    minimumSettlementType: "Village",
    repeatable: false,
    earnIncomeSkills: ["performance", "lore"]
  },

  [FOCUS_IDS.GOLD_MINE]: {
    id: FOCUS_IDS.GOLD_MINE,
    name: "Gold Mine",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.HEALING_HOUSES]: {
    id: FOCUS_IDS.HEALING_HOUSES,
    name: "Healing Houses",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["medicine", "religion"]
  },

  [FOCUS_IDS.HUNTERS_LODGE]: {
    id: FOCUS_IDS.HUNTERS_LODGE,
    name: "Hunter's Lodge",
    minimumSettlementType: "Village",
    repeatable: false,
    earnIncomeSkills: ["stealth", "survival"]
  },

  [FOCUS_IDS.LIBRARY]: {
    id: FOCUS_IDS.LIBRARY,
    name: "Library",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MAGICAL_CRAFTER]: {
    id: FOCUS_IDS.MAGICAL_CRAFTER,
    name: "Magical Crafter",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MARVELOUS_MARKETPLACE]: {
    id: FOCUS_IDS.MARVELOUS_MARKETPLACE,
    name: "Marvelous Marketplace",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MASTER_BLACKSMITH]: {
    id: FOCUS_IDS.MASTER_BLACKSMITH,
    name: "Master Blacksmith",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MINT]: {
    id: FOCUS_IDS.MINT,
    name: "Mint",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MONUMENT]: {
    id: FOCUS_IDS.MONUMENT,
    name: "Monument",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.MUSEUM_OF_THE_ANCIENT_ARCANE]: {
    id: FOCUS_IDS.MUSEUM_OF_THE_ANCIENT_ARCANE,
    name: "Museum of the Ancient Arcane",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: ["acrobatics", "arcana"]
  },

  [FOCUS_IDS.PALACE]: {
    id: FOCUS_IDS.PALACE,
    name: "Palace",
    minimumSettlementType: "Metropolis",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.POTION_SELLER]: {
    id: FOCUS_IDS.POTION_SELLER,
    name: "Potion Seller",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.PRINTING_PRESS]: {
    id: FOCUS_IDS.PRINTING_PRESS,
    name: "Printing Press",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["diplomacy", "society"]
  },

  [FOCUS_IDS.PUBLIC_FORUM]: {
    id: FOCUS_IDS.PUBLIC_FORUM,
    name: "Public Forum",
    minimumSettlementType: "City",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.SCENIC_RETREAT]: {
    id: FOCUS_IDS.SCENIC_RETREAT,
    name: "Scenic Retreat",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.TEMPLE_DISTRICT]: {
    id: FOCUS_IDS.TEMPLE_DISTRICT,
    name: "Temple District",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["religion", "society"]
  },

  [FOCUS_IDS.THIEVES_GUILD]: {
    id: FOCUS_IDS.THIEVES_GUILD,
    name: "Thieves' Guild",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["stealth", "thievery"]
  },

  [FOCUS_IDS.TRAINING_GROUND]: {
    id: FOCUS_IDS.TRAINING_GROUND,
    name: "Training Ground",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["athletics", "intimidation"]
  },

  [FOCUS_IDS.TRAINING_HOSPITAL]: {
    id: FOCUS_IDS.TRAINING_HOSPITAL,
    name: "Training Hospital",
    minimumSettlementType: "Town",
    repeatable: false,
    earnIncomeSkills: ["crafting", "medicine"]
  },

  [FOCUS_IDS.UNIVERSITY]: {
    id: FOCUS_IDS.UNIVERSITY,
    name: "University",
    minimumSettlementType: "Metropolis",
    repeatable: false,
    earnIncomeSkills: []
  },

  [FOCUS_IDS.WALLS]: {
    id: FOCUS_IDS.WALLS,
    name: "Walls",
    minimumSettlementType: "Village",
    repeatable: true,
    earnIncomeSkills: []
  }
};