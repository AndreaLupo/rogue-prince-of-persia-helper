import { writable } from "svelte/store";
import { createBuildsFromPermutations, getAllBuilds } from "../helpers/build-generator";
import buildMedallions from '$lib/data/builds-medallions.json' assert { type: "json" };
import { medallionsMap } from "./medallion.store";
import type { Build, Medallion } from "../types";

//const builds = getAllBuilds();
let builds: Build[] = [];


// Function to sort builds based on the calculated score
function sortBuilds(validBuildsWithLevels: { build: Build, levels: number[] }[]): { build: Build, levels: number[] }[] {
    return validBuildsWithLevels.sort((buildA, buildB) => {
      const scoreA = calculateBuildScore(buildA.build, buildA.levels);
      const scoreB = calculateBuildScore(buildB.build, buildB.levels);

      return scoreB - scoreA; // Sort by score in descending order
    });
  }

   // Function to get the number of unlocked attributes for a medallion
   function getUnlockedAttributes(medallion: Medallion, level: number): number {
    return medallion.attributes.filter(attribute => level >= attribute.requiredLevel).length;
  }

  // Function to calculate the score of a build based on the number of unlocked attributes and the levels of medallions
  function calculateBuildScore(build: Build, levels: number[]): number {
    const attributesWeight = 10; // Weight for the number of unlocked attributes
    const levelWeight = 1; // Weight for the levels

    const unlockedAttributesCount = build.medallions.reduce((sum, medallion, index) => sum + getUnlockedAttributes(medallion, levels[index]), 0);
    const totalLevel = levels.reduce((sum, level) => sum + level, 0);

    return (attributesWeight * unlockedAttributesCount) + (levelWeight * totalLevel);
  }



if(Array.isArray(buildMedallions)) {
    const allMedallionsBuilds: Medallion[][] = [];
    for(const build of buildMedallions) {
        const medallions: Medallion[] = [];
        for(const medallionId of build) {
            medallions.push(medallionsMap.get(medallionId)!);
        }
        allMedallionsBuilds.push(medallions);
    }
    let validBuildsWithLevels: {build: Build, levels: number[]}[] = [];
    validBuildsWithLevels = createBuildsFromPermutations(allMedallionsBuilds);

    console.log('Created builds with levels');

    const sortedBuildsWithLevels = sortBuilds(validBuildsWithLevels);
    
    console.log('Sorted builds with levels');

    /*
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

    console.log('Sorted builds with levels', allMedallionsLevel);
    */
    //console.log('Sorted:', levels);


    const sortedBuilds: Build[] =  sortedBuildsWithLevels.map(({ build }) => build);
    builds = sortedBuilds;
}

  


console.log('First new build:', builds[0]);

const allBuilds = writable(builds);


export default allBuilds;