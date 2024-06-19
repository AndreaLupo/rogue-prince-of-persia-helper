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

  function getValidBuildsWithLevels(medallions: Medallion[]): { build: Medallion[], levels: number[] }[] {
    const comboLength = 4;
    const allCombinations = getCombinations(medallions, comboLength);
    

    return allCombinations
      .map(build => ({ build, levels: calculateLevels(build) }))
      .map(({ build, levels}) => {
        for(let index = 0; index < build.length; index++) {
          const medallion = build[index];
          medallion.currentLevel = levels[index];
          build[index] = copyMedallion(medallion);
        }
        return {build, levels};
      })
      .filter(({ build, levels }) => build.every((medallion, position) => hasUnlockedAttribute(medallion, levels[position])))
      ;
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

  // Function to get the number of unlocked attributes for a medallion
  function getUnlockedAttributes(medallion: Medallion, level: number): number {
    return medallion.attributes.filter(attribute => level >= attribute.requiredLevel).length;
  }

  // Function to get the highest level of unlocked attributes for a medallion
  function getHighestUnlockedAttributeLevel(medallion: Medallion, level: number): number {
    const unlockedAttributes = medallion.attributes.filter(attribute => level >= attribute.requiredLevel);
    if (unlockedAttributes.length > 0) {
      return Math.max(...unlockedAttributes.map(attribute => attribute.requiredLevel));
    }
    return 0;
  }

  // Function to calculate the score of a build based on the number of unlocked attributes and the levels of medallions
  function calculateBuildScore(build: Medallion[], levels: number[]): number {
    const attributesWeight = 10; // Weight for the number of unlocked attributes
    const levelWeight = 1; // Weight for the levels

    const unlockedAttributesCount = build.reduce((sum, medallion, index) => sum + getUnlockedAttributes(medallion, levels[index]), 0);
    const totalLevel = levels.reduce((sum, level) => sum + level, 0);

    return (attributesWeight * unlockedAttributesCount) + (levelWeight * totalLevel);
  }

  // Function to sort builds based on the calculated score
  function sortBuilds(validBuildsWithLevels: { build: Medallion[], levels: number[] }[]): { build: Medallion[], levels: number[] }[] {
    return validBuildsWithLevels.sort((buildA, buildB) => {
      const scoreA = calculateBuildScore(buildA.build, buildA.levels);
      const scoreB = calculateBuildScore(buildB.build, buildB.levels);

      return scoreB - scoreA; // Sort by score in descending order
    });
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
    const validBuildsWithLevels = getValidBuildsWithLevels(medallions);

    // console.log('validBuildsWithLevels:', validBuildsWithLevels.length);
    const sortedBuildsWithLevels = sortBuilds(validBuildsWithLevels);
    
    const levels = sortedBuildsWithLevels.map(build => {
      return build.levels;  
    } )


    const allMedallionsLevel: {name: string,  level: number}[][] = [];
    for(const levelBuild of sortedBuildsWithLevels) {
      const build = levelBuild.build;
      const medallionsName = build.map(medallion => medallion.name);
      const buildLevels = [];
      for(let index = 0; index < build.length; index++) {
        const medallionsLevel = {
          name: medallionsName[index],
          level: levelBuild.levels[index]
        }
        buildLevels.push(medallionsLevel);
      }
      allMedallionsLevel.push(buildLevels);
    }

    console.log('Sorted builds with levels', allMedallionsLevel);
    //console.log('Sorted:', levels);

    return sortedBuildsWithLevels.map(({ build }) => build);
}