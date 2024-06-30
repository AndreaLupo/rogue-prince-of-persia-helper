export type Medallion = {
  id: string; // required for drag-&-drop
  key: string;
  name: string;
  upgradeMask: MedallionUpgradeMask;
  description: string;
  triggeringAction: TriggeringAction;
  attributes: MedallionAttribute[];
  currentLevel: number;
  imageName: string;
}

export type MedallionDraggable = Medallion & {name: string; label: string};

export type Slot = {
  id: number;
  medallion?: Medallion;
  highlighting: SlotHighlighting;
  level: number;
  previousLevel: number;
}
export type MedallionPosition = 0 | 1 | 2 | 3;

export type SlotHighlighting = 'None' | 'Selected' | 'Upgrading' | 'Downgrading';

export type TriggeringAction = 'None' | 'Vault' | 'Kick' | 'AuraBreaker' | 'TakeHit' | 'EnemyCollideOstacle' | 'EnemyKilled' | 'EnemyStunned' | 'LandOnEnemyFromBehind' |
                              'EnemyKilledUsingEnvironment' | 'HitEnemyFromAfar' | 'GoldCoinSpent' | 'FindWellOfDreams' | 'DiveAttack' | 'Death' | 'CustomDescription';

export type Direction = 'Left' | 'Right' | 'None';
export type Hop = 0 | 1 | 2;

export type MedallionLevelUpgrade = {
  direction: Direction;
  hop: Hop;
}

export type MedallionUpgradeMask = {
  upgrades: MedallionLevelUpgrade[];
}

export type Elemental = 'Fire' | 'Resin' | 'Poison';
export type Throwable = 'Daggers';
export type Resource = 'Gold' | 'Health' | 'Energy';

export type Upgradable = Elemental | Resource | Throwable;

export type AttributeAction = 'set' | 'inflict' | 'restore' | 'release' | 'spread' | 'receive' | 'hurl' | 'increaseDamage';

export type Measure = 'points' | 'bonusDamage' | 'coins' | 'percentage';

export type MedallionAttribute = {
  requiredLevel: number;
  description: string;
  action: AttributeAction;
  amount?: number;
  upgradable?: Upgradable;
  additional?: boolean;
  measure?: Measure;
}

export type Build = {
  medallions: Medallion[],
  reactions: Reaction[],
  hash: string
} ;

export type Reaction =  {
  name: string,
  elements: [Elemental, Elemental]
};

export function isElemental(upgradable: Upgradable | undefined): upgradable is Elemental {
  return upgradable === 'Fire' || upgradable === 'Resin' || upgradable === 'Poison';
}