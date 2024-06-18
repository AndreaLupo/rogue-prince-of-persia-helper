import medallionStore from "$lib/../stores/medallion.store";
import { get } from "svelte/store";
import type { Medallion } from "../types";
import { faBreadSlice } from "@fortawesome/free-solid-svg-icons";

const medallions = get(medallionStore);

// Function to calculate the level of each position in the build based on upgrade masks
  function calculateLevels(build: Medallion[]): number[] {
    const levels = new Array(build.length).fill(0);

    build.forEach((medallion, position) => {
      medallion.upgradeMask.upgrades.forEach(upgrade => {
        const targetPosition = 
          upgrade.direction === 'Right' ? position + upgrade.hop :
          upgrade.direction === 'Left' ? position - upgrade.hop : position;

        if (targetPosition >= 0 && targetPosition < build.length) {
          levels[targetPosition] += 1;
        }
      });
    });

    return levels;
  }
  
  // Function to check if a medallion has at least one attribute unlocked
  function hasUnlockedAttribute(medallion: Medallion, level: number): boolean {
    return medallion.attributes.some(attribute => level >= attribute.requiredLevel);
  }
  
  // Function to filter builds based on the criteria
  function isValidBuild(build: Medallion[]): boolean {
    const levels = calculateLevels(build);
    return build.every((medallion, position) => hasUnlockedAttribute(medallion, levels[position]));
  }
  
  // Utility function to create a deep copy of a medallion
  function copyMedallion(medallion: Medallion): Medallion {
    return {
      ...medallion,
      upgradeMask: {
        upgrades: medallion.upgradeMask.upgrades.map(upgrade => ({ ...upgrade }))
      },
      attributes: medallion.attributes.map(attribute => ({ ...attribute }))
    };
  }

  // Helper function to generate combinations
  function getCombinations<T>(medallions: T[], comboLength: number): T[][] {
    const result: T[][] = [];
  
    function combine(start: number, combo: T[]): void {
      if (combo.length === comboLength) {
        result.push([...combo]);
        return;
      }
      for (let i = start; i < medallions.length; i++) {
        combo.push(medallions[i]);
        combine(i + 1, combo);
        combo.pop();
      }
    }
  
    combine(0, []);
    return result;
  }
  
  // Main function to get all builds
  export function getAllBuilds(): Medallion[][] {
    const comboLength = 4;
    const allCombinations =  getCombinations(medallions, comboLength);
    console.log('allCombinations:', allCombinations.length);
    const filteredCombinations = allCombinations.filter(isValidBuild)
      .map(build => {
        // Deep copy medallions and set currentLevel
        const levels = calculateLevels(build);
        return build.map((medallion, position) => {
          const copiedMedallion = copyMedallion(medallion);
          copiedMedallion.currentLevel = levels[position];
          return copiedMedallion;
        });
      });
    console.log('filteredCombinations:', filteredCombinations.length);
    return filteredCombinations;

}
