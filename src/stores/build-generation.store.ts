import { writable, type Writable } from "svelte/store";
import { createBuildsFromPermutations, getAllBuilds } from "../helpers/build-generator";
import buildMedallions from '$lib/data/builds-medallions.json' assert { type: "json" };
import { medallionsMap } from "./medallion.store";
import type { Build, Medallion } from "../types";

//const builds = getAllBuilds();
let builds: Build[] = [];
let buildStore: Writable<Build[]> | undefined;


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


function createBuildStore() {
  if(buildStore != undefined) {
    return buildStore;
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

    const sortedBuilds: Build[] =  sortedBuildsWithLevels.map(({ build }) => build);
    builds = sortedBuilds;
  }

  console.log('First new build:', builds[0]);

  buildStore = writable(builds);
  return buildStore;
}



export default createBuildStore;