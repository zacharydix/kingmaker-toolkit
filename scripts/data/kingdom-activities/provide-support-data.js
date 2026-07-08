export const PROVIDE_SUPPORT_DATA = {
  name: 'Provide Support',
  dcModifier: -10,
  skills: [
    'agriculture',
    'arts',
    'boating',
    'defense',
    'engineering',
    'exploration',
    'folklore',
    'industry',
    'intrigue',
    'magic',
    'politics',
    'scholarship',
    'statecraft',
    'trade',
    'warfare',
    'wilderness',
  ],
  outcomes: {
    criticalSuccess:
      'You give a +2 circumstance bonus. If you are a master, +3 instead; if legendary, +4.',
    success: 'You give a +1 circumstance bonus.',
    failure: 'Gain 1 Unrest.',
    criticalFailure: 'Gain 2 Unrest.',
  },
};
