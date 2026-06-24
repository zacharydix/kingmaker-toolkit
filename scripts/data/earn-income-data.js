// scripts/data/earn-income-data.js

export const EARN_INCOME_TASK_DCS = {
  0: 14,
  1: 15,
  2: 16,
  3: 18,
  4: 19,
  5: 20,
  6: 22,
  7: 23,
  8: 24,
  9: 26,
  10: 27,
  11: 28,
  12: 30,
  13: 31,
  14: 32,
  15: 34,
  16: 35,
  17: 36,
  18: 38,
  19: 39,
  20: 40
};

export const EARN_INCOME_TABLE = {
  0: { failure: 1, trained: 5, expert: 5, master: 5, legendary: 5 },
  1: { failure: 2, trained: 20, expert: 20, master: 20, legendary: 20 },
  2: { failure: 4, trained: 30, expert: 30, master: 30, legendary: 30 },
  3: { failure: 8, trained: 50, expert: 50, master: 50, legendary: 50 },
  4: { failure: 10, trained: 70, expert: 80, master: 80, legendary: 80 },
  5: { failure: 20, trained: 90, expert: 100, master: 100, legendary: 100 },
  6: { failure: 30, trained: 150, expert: 200, master: 200, legendary: 200 },
  7: { failure: 40, trained: 200, expert: 250, master: 250, legendary: 250 },
  8: { failure: 50, trained: 250, expert: 300, master: 300, legendary: 300 },
  9: { failure: 60, trained: 300, expert: 400, master: 400, legendary: 400 },
  10: { failure: 70, trained: 400, expert: 500, master: 600, legendary: 600 },
  11: { failure: 80, trained: 500, expert: 600, master: 800, legendary: 800 },
  12: { failure: 90, trained: 600, expert: 800, master: 1000, legendary: 1000 },
  13: { failure: 100, trained: 700, expert: 1000, master: 1500, legendary: 1500 },
  14: { failure: 150, trained: 800, expert: 1500, master: 2000, legendary: 2000 },
  15: { failure: 200, trained: 1000, expert: 2000, master: 2800, legendary: 2800 },
  16: { failure: 250, trained: 1300, expert: 2500, master: 3600, legendary: 4000 },
  17: { failure: 300, trained: 1500, expert: 3000, master: 4500, legendary: 5500 },
  18: { failure: 400, trained: 2000, expert: 4500, master: 7000, legendary: 9000 },
  19: { failure: 600, trained: 3000, expert: 6000, master: 10000, legendary: 13000 },
  20: { failure: 800, trained: 4000, expert: 7500, master: 15000, legendary: 20000 },
  21: { trained: 5000, expert: 9000, master: 17500, legendary: 30000 }
};

// scripts/data/earn-income-data.js

export const EARN_INCOME_FOCI = {
  ARCANUM_GUILD: {
    name: "Arcanum Guild",
    skills: ["arcana", "occultism"]
  },
  ARTISANS_GUILD: {
    name: "Artisan's Guild",
    skills: ["crafting"]
  },
  CARAVANSARAI: {
    name: "Caravansarai",
    skills: ["deception", "diplomacy"]
  },
  CASINO: {
    name: "Casino",
    skills: ["deception", "thievery"]
  },
  CIRCUS: {
    name: "Circus",
    skills: ["acrobatics", "performance"]
  },
  DRUIDS_GROVE: {
    name: "Druids' Grove",
    skills: ["survival", "nature"]
  },
  EXORCISTS_EXTRAORDINAIRE: {
    name: "Exorcists Extraordinaire",
    skills: ["intimidation", "occultism"]
  },
  FARMING_INITIATIVE: {
    name: "Farming Initiative",
    skills: ["athletics", "nature"]
  },
  FAMOUS_TAVERN: {
    name: "Famous Tavern",
    skills: ["performance", "lore"]
  },
  HEALING_HOUSES: {
    name: "Healing Houses",
    skills: ["medicine", "religion"]
  },
  HUNTERS_LODGE: {
    name: "Hunter's Lodge",
    skills: ["stealth", "survival"]
  },
  MUSEUM_OF_THE_ANCIENT_ARCANE: {
    name: "Museum of the Ancient Arcane",
    skills: ["acrobatics", "arcana"]
  },
  PRINTING_PRESS: {
    name: "Printing Press",
    skills: ["diplomacy", "society"]
  },
  TEMPLE_DISTRICT: {
    name: "Temple District",
    skills: ["religion", "society"]
  },
  THIEVES_GUILD: {
    name: "Thieves' Guild",
    skills: ["stealth", "thievery"]
  },
  TRAINING_GROUND: {
    name: "Training Ground",
    skills: ["athletics", "intimidation"]
  },
  TRAINING_HOSPITAL: {
    name: "Training Hospital",
    skills: ["crafting", "medicine"]
  }
};