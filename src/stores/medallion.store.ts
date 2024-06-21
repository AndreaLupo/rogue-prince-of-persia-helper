import { writable, type Writable } from 'svelte/store';
import type { AttributeAction, Direction, Hop, Measure, Medallion, Upgradable } from '$lib/../types';

const getUpgrade = (direction: Direction, hop: Hop) => { 
  return {direction, hop};
}

const getAttribute = (requiredLevel: number, description: string, action: AttributeAction, upgradable?: Upgradable, 
                    additional?: boolean, amount?: number, measure?: Measure) => {
  return {
    requiredLevel, description, action, upgradable, additional, amount, measure
  }
}

const poisonTarget = (requiredLevel: number, description: string) => {
  return getAttribute(requiredLevel, description, 'inflict', 'Poison');
}


const restoreEnergyPoints = (requiredLevel: number, description: string, amount: number, additional?: boolean) => {
  return getAttribute(requiredLevel, description, 'restore', 'Energy', additional, amount, 'points')
}

const restoreEnergyPointsPerc = (requiredLevel: number, description: string, amount: number, additional?: boolean) => {
  return getAttribute(requiredLevel, description, 'restore', 'Energy', additional, amount, 'percentage')
}

const restoreHealthPoints = (requiredLevel: number, description: string, amount: number, additional?: boolean) => {
  return getAttribute(requiredLevel, description, 'restore', 'Health', additional, amount, 'points')
}

const restoreHealthPointsPerc = (requiredLevel: number, description: string, amount: number, additional?: boolean) => {
  return getAttribute(requiredLevel, description, 'restore', 'Health', additional, amount, 'percentage')
}

const receiveGoldCoins = (requiredLevel: number, description: string, amount: number, additional?: boolean) => {
  return getAttribute(requiredLevel, description, 'receive', 'Gold', additional, amount, 'coins')
}

const getBonusDamage = (requiredLevel: number, description: string, amount: number) => {
  return getAttribute(requiredLevel, description, 'inflict', undefined, false, amount, 'bonusDamage')
}

const setElementToTheArea = (requiredLevel: number, description: string, upgradable: Upgradable, action: AttributeAction) => {
  return getAttribute(requiredLevel, description, action, upgradable);
}

const setFire = (requiredLevel: number) => {
  return setElementToTheArea(requiredLevel, 'Set {} to the area', 'Fire', 'set' );
}

const releaseCloudOfPoison = (requiredLevel: number) => {
  return setElementToTheArea(requiredLevel, 'Release a {}', 'Poison', 'release');
}

const spreadResin = (requiredLevel: number) => {
  return setElementToTheArea(requiredLevel, 'Spread {}', 'Resin', 'spread');
}

const hurlDaggers = (requiredLevel: number, description: string, damage: number) => {
  return getAttribute(requiredLevel, description, 'hurl', 'Daggers', false, damage);
}

const medallionsList: Medallion[] = [
  {
    id: 'neurotoxic-agent',
    name: 'Neurotoxic agent',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'EnemyStunned',
    attributes: [
      poisonTarget(0, '{} the target')
    ],
    currentLevel: 0,
    imageName: 'medallion-neurotoxic-agent',
    
  },
  {
    id: 'flaming-aura-breaker',
    name: 'Flaming aura Breaker',
    upgradeMask: {
      upgrades: [
        getUpgrade('Left', 1)
      ]
    },
    description: '',
    triggeringAction: 'AuraBreaker',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 35),
      restoreHealthPoints(2, 'Restore {} points', 50),
      setFire(3)
    ],
    currentLevel: 0,
    imageName: 'medallion-flaming-aura-breaker',
  },
  {
    id: 'sticky-aura-breaker',
    name: 'Sticky aura Breaker',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'AuraBreaker',
    attributes: [
      spreadResin(0)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-aura-breaker',
  },
  {
    id: 'flaming-counter',
    name: 'Flaming counter',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'TakeHit',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 20),
      receiveGoldCoins(1, 'Receive {} gold coins', 30),
      setFire(2)
    ],
    currentLevel: 0,
    imageName: 'medallion-flaming-counter',
  },
  {
    id: 'toxic-counter',
    name: 'Toxic counter',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'TakeHit',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 20),
      releaseCloudOfPoison(1)
    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-counter',
  },
  {
    id: 'sleight-of-poison',
    name: 'Sleight of Poison',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'LandOnEnemyFromBehind',
    attributes: [
      getBonusDamage(0, 'Inflict {} bonus damage', 20),
      restoreEnergyPoints(1, 'Restore {} points', 30),
      releaseCloudOfPoison(3)
    ],
    currentLevel: 0,
    imageName: 'medallion-sleight-of-poison',
  },
  {
    id: 'sticky-trick',
    name: 'Sticky Trick',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'LandOnEnemyFromBehind',
    attributes: [
      spreadResin(0)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-trick',
  },
  
  {
    id: 'vampiric_demise',
    name: 'Vampiric Demise',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'EnemyKilled',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 30),
      restoreHealthPoints(2, 'Restore {} points', 10),
      restoreHealthPoints(3, 'Restore {} additional points', 5, true),
    ],
    currentLevel: 0,
    imageName: 'medallion-vampiric-demise',
    
  },


  {
    id: 'opportunity_knocks',
    name: 'Opportunity Knocks',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'EnemyKilledUsingEnvironment',
    attributes: [
      restoreHealthPoints(0, 'Restore {} points', 25),
      restoreHealthPoints(1, 'Restore {} additional points', 5, true),
      restoreHealthPoints(2, 'Restore {} additional points', 5, true),
    ],
    currentLevel: 0,
    imageName: 'medallion-opportunity-knocks',
    
  },

  {
    id: 'bloody_spoils',
    name: 'Bloody spoils',
    upgradeMask: {
      upgrades: [
        getUpgrade('Left', 1),
        getUpgrade('Left', 2)
      ]
    },
    description: '',
    triggeringAction: 'EnemyKilled',
    attributes: [
      receiveGoldCoins(0, 'Receive {} gold coins', 5),
      receiveGoldCoins(1, 'Restore {} additional points', 5, true),
      receiveGoldCoins(2, 'Restore {} additional points', 5, true),
    ],
    currentLevel: 0,
    imageName: 'medallion-bloody-spoils',
    
  },
  {
    id: 'toxic_demise',
    name: 'Toxic Demise',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'EnemyKilled',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 30),
      releaseCloudOfPoison(2)
    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-demise',
    
  },

  {
    id: 'toxic_projectile',
    name: 'Toxic Projectile',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'HitEnemyFromAfar',
    attributes: [
      releaseCloudOfPoison(1)
    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-projectile',
    
  },
  {
    id: 'flaming_projectile',
    name: 'Flaming Projectile',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'HitEnemyFromAfar',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 30),
      receiveGoldCoins(1, 'Receive {} coins', 2),
      setFire(2)
    ],
    currentLevel: 0,
    imageName: 'medallion-flaming-projectile',
    
  },

  {
    id: 'health_insurance',
    name: 'Health Insurance',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'GoldCoinSpent',
    attributes: [
      restoreHealthPoints(0, 'Restore {} points', 0.5),
      restoreHealthPoints(1, 'Restore {} points', 0.25, true),
      restoreHealthPoints(2, 'Restore {} points', 0.25, true),
    ],
    currentLevel: 0,
    imageName: 'medallion-health-insurance',
    
  },

  {
    id: 'toxic_shock',
    name: 'Toxic Shock',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'EnemyCollideOstacle',
    attributes: [
      restoreEnergyPoints(0, '', 30),
      releaseCloudOfPoison(1)
    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-shock',
    
  },

  {
    id: 'flaming_kick',
    name: 'Flaming Kick',
    upgradeMask: {
      upgrades: [
        getUpgrade('Left', 1)
      ]
    },
    description: '',
    triggeringAction: 'Kick',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 20),
      getBonusDamage(1, 'Receive {} coins', 12),
      setFire(3)
    ],
    currentLevel: 0,
    imageName: 'medallion-flaming-kick',
    
  },

  {
    id: 'sticky_kick',
    name: 'Sticky Kick',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'Kick',
    attributes: [
      spreadResin(0)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-kick',
    
  },
  {
    id: 'slicing_kick',
    name: 'Slicing Kick',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'Kick',
    attributes: [
      hurlDaggers(0, 'Damage per dagger', 40)
    ],
    currentLevel: 0,
    imageName: 'medallion-slicing-kick',
    
  },
  {
    id: 'restorative_dream_fragment',
    name: 'Restorative Dream Fragment',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'FindWellOfDreams',
    attributes: [
      restoreHealthPoints(0, 'Restore {} points', 60),
      restoreHealthPoints(1, 'Restore {} additional points', 10),
      restoreHealthPoints(2, 'Restore {} additional points', 10),

    ],
    currentLevel: 0,
    imageName: 'medallion-restorative-dream-fragment',
    
  },

  {
    id: 'toxic_vault',
    name: 'Toxic Vault',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'Vault',
    attributes: [
      restoreEnergyPoints(0, 'Restore {} points', 30),
      releaseCloudOfPoison(2)

    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-vault',
    
  },

  {
    id: 'sticky_vault',
    name: 'Sticky Vault',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'Vault',
    attributes: [
      spreadResin(1)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-vault',
    
  },
  {
    id: 'slicing_vault',
    name: 'Slicing Vault',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
        getUpgrade('Right', 2)
      ]
    },
    description: '',
    triggeringAction: 'Vault',
    attributes: [
      hurlDaggers(0, '', 40)
    ],
    currentLevel: 0,
    imageName: 'medallion-slicing-vault',
    
  },

  {
    id: 'sticky_dive',
    name: 'Sticky Dive',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: '',
    triggeringAction: 'DiveAttack',
    attributes: [
      spreadResin(0)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-dive',
    
  },

  {
    id: 'spartan',
    name: 'Spartan',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1)
      ]
    },
    description: '',
    triggeringAction: 'EnemyCollideOstacle',
    attributes: [
      restoreEnergyPointsPerc(0, 'Restore {} points', 15),
      restoreEnergyPointsPerc(1, 'Restore {} points', 15, true),
      restoreEnergyPointsPerc(2, 'Restore {} points', 15, true),
    ],
    currentLevel: 0,
    imageName: 'medallion-spartan',
  },
  {
    id: 'aura-breaker',
    name: 'aura Breaker',
    upgradeMask: {
      upgrades: [
        getUpgrade('Left', 1),
        getUpgrade('Left', 2)
      ]
    },
    description: '',
    triggeringAction: 'AuraBreaker',
    attributes: [
      restoreEnergyPoints(1, '', 25),
      restoreEnergyPoints(1, '', 25, true)
    ],
    currentLevel: 0,
    imageName: 'medallion-aura-breaker',
  },
  {
    id: 'slicing_dive',
    name: 'Slicing Dive',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: '',
    triggeringAction: 'DiveAttack',
    attributes: [
      hurlDaggers(0, '', 40)
    ],
    currentLevel: 0,
    imageName: 'medallion-sticky-dive',
    
  },
  {
    id: 'immortal',
    name: 'Immortal',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: '',
    triggeringAction: 'Death',
    attributes: [
      restoreHealthPointsPerc(0, 'Restore % health', 50)
    ],
    currentLevel: 0,
    imageName: 'medallion-immortal',
    
  },
  {
    id: 'flaming_dive',
    name: 'Flaming Dive',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: '',
    triggeringAction: 'DiveAttack',
    attributes: [
      setFire(2)
    ],
    currentLevel: 0,
    imageName: 'medallion-flaming-dive',
    
  },
  {
    id: 'pyromaniac',
    name: 'Pyromaniac',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: '',
    triggeringAction: 'None',
    attributes: [
      {
        requiredLevel: 1,
        description: 'Killing a burning enemy spreads the fire to nearby enemies',
        action: 'set'
      }
    ],
    currentLevel: 0,
    imageName: 'medallion-pyromaniac',
    
  },
  {
    id: 'paper_lion',
    name: 'Paper Lion',
    upgradeMask: {
      upgrades: [
        getUpgrade('Right', 1),
      ]
    },
    description: 'This medallion increase the damage you inflict, as well as the damage you receive.',
    triggeringAction: 'None',
    attributes: [
      {
        requiredLevel: 0,
        description: '+25% damage inflicted and received',
        action: 'set'
      },
      {
        requiredLevel: 1,
        description: '+25% damage inflicted and received',
        action: 'set'
      },
      {
        requiredLevel: 2,
        description: '+25% damage inflicted and received',
        action: 'set'
      },
      {
        requiredLevel: 3,
        description: '+25% damage inflicted and received',
        action: 'set'
      },
    ],
    currentLevel: 0,
    imageName: 'medallion-paper-lion',
    
  },
];

const medallions = writable(medallionsList);
console.log(medallionsList);


export default medallions;

export const selectedMedallionStore: Writable<Medallion | undefined> = writable();