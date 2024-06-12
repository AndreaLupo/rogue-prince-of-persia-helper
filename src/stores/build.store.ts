import { writable } from "svelte/store";
import type { Direction, Medallion, MedallionLevelUpgrade, MedallionPosition, Slot } from "../types";

const helper: Slot = {
  medallion: {
    id: 'toxic_demise',
    name: 'Toxic Demise',
    upgradeMask: {
      upgrades: [
        {
          direction: 'Right',
          hop: 1
        },
        {
          direction: 'Right',
          hop: 2
        }
      ]
    },
    description: '',
    triggeringAction: 'EnemyKilled',
    attributes: [
      {
        requiredLevel: 0,
        description: 'Restore {} points',
        upgradable: 'Energy',
        amount: 30,
        action: 'restore',
        measure: 'points'
      },
      {
        requiredLevel: 2,
        description: 'Release {}',
        upgradable: 'Poison',
        action: 'release',
      }
    ],
    currentLevel: 0,
    imageName: 'medallion-toxic-demise',
  },
  highlighting: 'None',
  id: 0,
  level: 0,
  previousLevel: 0
};

let slots: Slot[] = [
  {
    highlighting: 'None',
    id: 0,
    level: 0,
    previousLevel: 0
  },
  // helper,
  {
    highlighting: 'None',
    id: 1,
    level: 0,
    previousLevel: 0
  }, {
    highlighting: 'None',
    id: 2,
    level: 0,
    previousLevel: 0
  }, {
    highlighting: 'None',
    id: 3,
    level: 0,
    previousLevel: 0
  }
];


function createBuildStore() {
  const { subscribe, update } = writable(slots);

  const getNextMedallion = (updatedSlots: Slot[], index: number, hops: number, direction: Direction): Medallion | undefined => {
    let requestedIndex = 0;
    if(direction === "Left") {
      requestedIndex = index - hops;
    } else {
      requestedIndex = index + hops;
    }
    if(requestedIndex < 0 || requestedIndex >= slots.length) { return undefined };
    return updatedSlots[requestedIndex].medallion;
  }

  const isValidSlotPosition = (position: number) => {
    if(position < 0 || position > slots.length) { return false };
    return true;
  }

  const getNextSlot = (updatedSlots: Slot[], index: number, hops: number, direction: Direction): Slot | undefined => {
    let requestedIndex = 0;
    if(direction === "Left") {
      requestedIndex = index - hops;
    } else {
      requestedIndex = index + hops;
    }
    if(requestedIndex < 0 || requestedIndex > slots.length) { return undefined };
    return updatedSlots[requestedIndex];
  }

  const getUpgradedPositions = (position: number, upgrades: MedallionLevelUpgrade[]): number[] => {
    const positions = [0,0,0,0];
    
    for(const upgrade of upgrades) {
      let hops = upgrade.hop as number;
      if(upgrade.direction === 'Left') {
        hops = -hops;
      }
      const upgradablePosition = position + hops;
      if(isValidSlotPosition(upgradablePosition) && upgrade.direction !== 'None') {
        positions[upgradablePosition] = positions[upgradablePosition] + 1;
      }
    }

    return positions;
  }

  const updateMedallionsLevel = (updatedSlots: Slot[], newMedallionPosition: number) => {
    updatedSlots.forEach(slot => {
      if(slot.medallion) {
        slot.medallion.currentLevel = 0;
      }
    });

    const slotLevels = [0,0,0,0];
    for(let position = 0; position < updatedSlots.length; position++ ) {
      const slot = updatedSlots[position];
      const medallion = slot.medallion;
      const upgrades = medallion?.upgradeMask.upgrades || [];
      const upgradedPositions = getUpgradedPositions(position, upgrades);

      for(let index = 0; index < upgradedPositions.length; index++) {
        slotLevels[index]+= upgradedPositions[index];
      }
      /*
      for(const upgrade of upgrades) {
        const medallion = getNextMedallion(updatedSlots, index, upgrade.hop, upgrade.direction);
        if(medallion && index !== newMedallionPosition) {
          medallion.currentLevel = medallion.currentLevel + 1;
        }
      }
      */

    }

    for(let position = 0; position < updatedSlots.length; position++) {
      const slot = updatedSlots[position];
      const medallion = slot.medallion;
      slot.level = slotLevels[position];
      if(medallion) {
        medallion.currentLevel = slot.level;
      }
    }
  }

  const updateSlotsLevel = (updatedSlots: Slot[]) => {
    updatedSlots.forEach(slot => {
      if(slot.medallion) {
        slot.medallion.currentLevel = 0;
        slot.level = 0;
      }
    });

    for(let index = 0; index < updatedSlots.length; index++ ) {
      const medallion = updatedSlots[index].medallion;
      const upgrades = medallion?.upgradeMask.upgrades || [];
      for(const upgrade of upgrades) {
        const slot = getNextSlot(updatedSlots, index, upgrade.hop, upgrade.direction);
        
        if(slot) {
          slot.level = slot.level + 1;
          if(slot.medallion) {
            slot.medallion.currentLevel = slot.medallion.currentLevel + 1;
          }
        }
      }

    }
  }


  return {
    subscribe,
    setMedallionAtPosition: (medallion: Medallion, position: number) =>  {
      let updatedSlots = [...slots];
      updatedSlots[position] = {medallion, highlighting: 'None', id: position, level: 0, previousLevel: 0
      };
      updateMedallionsLevel(updatedSlots, position);
      // updateSlotsLevel(updatedSlots);
      update(() => slots = [...updatedSlots])
    },
    highlight(positions: number[]) {
      let updatedSlots = [...slots];
      for(let index = 0; index < slots.length; index++) {
        if(positions.includes(index)) {
          slots[index].highlighting = 'Upgrading';
        } else {
          slots[index].highlighting = 'None';

        }
      }
      update(() => slots = [...updatedSlots]);
    },
    getMedallionsInSlots: (): (Medallion | undefined )[] => {
      return slots.filter(s => s.medallion != undefined).map(s => s.medallion);
    },
    removeItem: (index: number) => update(() => slots = [...slots.slice(0, index), ...slots.slice(index + 1)]),
  };
}

export const buildStore = createBuildStore();

