import { isElemental, type Build, type Medallion } from "../types";
import { getAllBuilds } from "./build-generator";
import { elementalReactions } from "./elemental-reaction-checker";

const allBuilds = getAllBuilds();

let builds: Build[] = [];
let filteredBuilds: Build[] = [];


let reactionFilters: any[] = [];
let medallionFilters: any[] = [];
let elementalFilters: any[] = [];
let allAttributesUnlocked = false;
const MAX_ATTRIBUTE_LEVEL = 3;


function filterByAllAttributesUnlocked(startBuilds: Build[]): Build[] {
    const newBuilds = [];
    for(const build of startBuilds) {
        const medallionsOk = [];
        for(const medallion of build.medallions) {
            
            let choose = true;
            for(const attribute of medallion.attributes) {
                if(medallion.currentLevel < attribute.requiredLevel) {
                    // attribute not unlocked - medallion not ok
                    choose = false;
                    break;
                }
            }
            medallionsOk.push(choose);
            if(!choose) {
                // not check other medallions in build since this one is already not ok!
                break;
            }
        }

        if(medallionsOk.every(el => el === true)) {
            newBuilds.push(build);
        }
    }
    return newBuilds
}

function filterByMedallionsName(startBuilds: Build[]): Build[] {
    const newBuilds = [];
    
    for(const build of startBuilds) {
        let matchingMedallion = 0;
        for(let index = 0; index < build.medallions.length; index++) {
            const medallion = build.medallions[index];
            
            for(const selectedMedallions of medallionFilters) {
                const selectedMedallion: Medallion = selectedMedallions.value;

                if(medallion.name.toLowerCase().includes(selectedMedallion.name.toLowerCase())) {
                    matchingMedallion++;
                    break;
                }
                
            }
            if(matchingMedallion === medallionFilters.length) {
                newBuilds.push(build);
            }
            
        }
    }

    return newBuilds;
}

function filterByElements(startBuilds: Build[]): Build[] {
    const newBuilds = [];
    
    for(const build of startBuilds) {
        if(elementalFilters.length === 0) {
            newBuilds.push(build);
            continue;
        }

        let included = false;

        for(let index = 0; index < elementalFilters.length; index++) {
            if(included) {
                break;
            }
            const element = elementalFilters[index].value;

            for(const medallion of build.medallions ) {
                if(included) {
                    break;
                }
                for(const attribute of medallion.attributes) {
                    if(isElemental(attribute.upgradable) && attribute.upgradable === element && medallion.currentLevel >= attribute.requiredLevel) {
                        newBuilds.push(build);
                        included = true;
                        break;
                    }
                }
            }
        }

    }
    return newBuilds;
}

function filterByReactions(startBuilds: Build[]): Build[] {
    const newBuilds = [];
    
    for(const build of startBuilds) {
        if(reactionFilters.length === 0) {
            newBuilds.push(build);
            continue;
        }

        let excluded = false;

        for(let index = 0; index < reactionFilters.length; index++) {
            const reaction = reactionFilters[index].value;

            if(!build.reactions.includes(reaction)) {
                excluded = true;
                break;
            }
        }
        if(!excluded) {
            newBuilds.push(build);
        }

    }
    return newBuilds;
}

export function filterBuildsWithActiveLevelThreeAttributes(startBuilds: Build[]): Build[] {
    const newBuilds = [];
    
    for(const build of startBuilds) {

        for(const medallion of build.medallions) {
            const maxAttributePresent = medallion.attributes.find(attr => attr.requiredLevel === MAX_ATTRIBUTE_LEVEL);

            if(maxAttributePresent && medallion.currentLevel === MAX_ATTRIBUTE_LEVEL) {
                newBuilds.push(build);
                break;
            }
        }

    }
    return newBuilds;
}


export function filterBuilds(medFilters: any[], reactFilters: any[], elemFilters: any[], allAttrUnlocked: boolean, activeLevelThreeAttribute: boolean): Build[] {
    medallionFilters = medFilters;
    reactionFilters = reactFilters;
    allAttributesUnlocked = allAttrUnlocked;
    elementalFilters = elemFilters;

    filteredBuilds.splice(0, filteredBuilds.length);
    builds.splice(0, builds.length);

    const newBuilds = [];
    const oldBuilds = allBuilds;

    if(medallionFilters.length > 0) {
        const filtered = filterByMedallionsName(oldBuilds);
        for(const build of filtered) {
            newBuilds.push(build);
        }
    }

    if(elementalFilters.length > 0) {
        const filtered = filterByElements(oldBuilds);
        // clear since only filtered element must be there, not the one from previous filter!
        newBuilds.splice(0, newBuilds.length);
        for(const build of filtered) {
            newBuilds.push(build);
        }
    }

    if(reactionFilters.length > 0) {
        const starting = newBuilds.length > 0? newBuilds : oldBuilds;

        const filtered = filterByReactions(starting);
        // clear since only filtered element must be there, not the one from previous filter!
        newBuilds.splice(0, newBuilds.length);
        for(const build of filtered) {
            newBuilds.push(build);
        }
    }
    if(allAttributesUnlocked) {
        const starting = newBuilds.length > 0? newBuilds : oldBuilds;

        const filtered = filterByAllAttributesUnlocked(starting);
        // clear since only filtered element must be there, not the one from previous filter!
        newBuilds.splice(0, newBuilds.length);
        for(const build of filtered) {
            newBuilds.push(build);
        }
    }

    if(activeLevelThreeAttribute) {
        const starting = newBuilds.length > 0? newBuilds : oldBuilds;

        const filtered = filterBuildsWithActiveLevelThreeAttributes(starting);
        // clear since only filtered element must be there, not the one from previous filter!
        newBuilds.splice(0, newBuilds.length);
        for(const build of filtered) {
            newBuilds.push(build);
        }
    }

    return newBuilds;
}