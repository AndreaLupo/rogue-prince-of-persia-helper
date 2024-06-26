import medallionStore from "$lib/../stores/medallion.store";
import { get } from "svelte/store";
import type { Build, Medallion } from "../types";
import { updateElementalReactions } from "./elemental-reaction-checker";

import sha256 from 'crypto-js/sha256';

const medallions = get(medallionStore);

// Function to calculate the level of each position in the build based on upgrade masks
  function calculateLevels(build: Build): number[] {
    const levels = new Array(build.medallions.length).fill(0);

    build.medallions.forEach((medallion, position) => {
      medallion.upgradeMask.upgrades.forEach(upgrade => {
        const targetPosition = 
          upgrade.direction === 'Right' ? position + upgrade.hop :
          upgrade.direction === 'Left' ? position - upgrade.hop : position;

        if (targetPosition >= 0 && targetPosition < build.medallions.length) {
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
  

  function getValidBuildsWithLevels(medallions: Medallion[]): { build: Build, levels: number[] }[] {
    const comboLength = 4;
    const allCombinations = getPermutations(medallions, comboLength);
    
    const builds: Build[] = [];

    for(const combination of allCombinations) {
      const build: Build = {
        medallions: combination,
        reactions: [],
        hash: getBuildHash(combination)
      }
      updateElementalReactions(build);

      builds.push(build);
    }

    const newBuilds = builds
      .map(build => ({ build, levels: calculateLevels(build) }))
      .map(({ build, levels}) => {
        for(let index = 0; index < build.medallions.length; index++) {
          const medallion = build.medallions[index];
          medallion.currentLevel = levels[index];
          build.medallions[index] = copyMedallion(medallion);
        }
        return {build, levels};
      })
      .filter(({ build, levels }) => build.medallions.every((medallion, position) => hasUnlockedAttribute(medallion, levels[position])))
  
      newBuilds.forEach(buildLevel => updateElementalReactions(buildLevel.build));

    return newBuilds;
  }
  
  function getBuildHash(combination: Medallion[]): string {
    const ids = combination.map(medallion => medallion.id).join(',');
    const hash = sha256(ids);
    return hash.toString();
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
  function calculateBuildScore(build: Build, levels: number[]): number {
    const attributesWeight = 10; // Weight for the number of unlocked attributes
    const levelWeight = 1; // Weight for the levels

    const unlockedAttributesCount = build.medallions.reduce((sum, medallion, index) => sum + getUnlockedAttributes(medallion, levels[index]), 0);
    const totalLevel = levels.reduce((sum, level) => sum + level, 0);

    return (attributesWeight * unlockedAttributesCount) + (levelWeight * totalLevel);
  }

  // Function to sort builds based on the calculated score
  function sortBuilds(validBuildsWithLevels: { build: Build, levels: number[] }[]): { build: Build, levels: number[] }[] {
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
  

  function getPermutations<T>(medallions: T[], permLength: number): T[][] {
    const result: T[][] = [];
    
    function permute(perm: T[], used: boolean[]): void {
      if (perm.length === permLength) {
        result.push([...perm]);
        return;
      }
      for (let i = 0; i < medallions.length; i++) {
        if (!used[i]) {
          used[i] = true;
          perm.push(medallions[i]);
          permute(perm, used);
          perm.pop();
          used[i] = false;
        }
      }
    }
    
    permute([], new Array(medallions.length).fill(false));
    return result;
  }


  // Main function to get all builds
  export function getAllBuilds(): Build[] {
    const startTime = new Date().getTime();
    const validBuildsWithLevels = getValidBuildsWithLevels(medallions);

    console.log(validBuildsWithLevels[0]);

    // console.log('validBuildsWithLevels:', validBuildsWithLevels.length);
    const sortedBuildsWithLevels = sortBuilds(validBuildsWithLevels);
    
    const levels = sortedBuildsWithLevels.map(build => {
      return build.levels;  
    } )


    const allMedallionsLevel: {name: string,  level: number}[][] = [];
    for(const levelBuild of sortedBuildsWithLevels) {
      const build = levelBuild.build;
      const medallionsName = build.medallions.map(medallion => medallion.name);
      const buildLevels = [];
      for(let index = 0; index < build.medallions.length; index++) {
        const medallionsLevel = {
          name: medallionsName[index],
          level: levelBuild.levels[index]
        }
        buildLevels.push(medallionsLevel);
      }
      allMedallionsLevel.push(buildLevels);
    }

    //console.log('Sorted builds with levels', allMedallionsLevel);
    //console.log('Sorted:', levels);


    const sortedBuilds: Build[] =  sortedBuildsWithLevels.map(({ build }) => build);
    const endTime = new Date().getTime();

    const secondTime = (endTime - startTime) / 1000;

    console.log(`Builds generated in ${secondTime} milliseconds.`);

    return sortedBuilds;
}


