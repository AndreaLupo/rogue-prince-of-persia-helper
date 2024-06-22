import { isElemental, type Build, type Elemental, type Reaction } from "../types";



const elementalReactionsAvailable: Reaction[] = [
    {
        name: 'Flaming resin',
        elements: ['Fire', 'Resin']
    },
    {
        name: 'Sticky poison',
        elements: ['Poison', 'Resin']
    },
    {
        name: 'Toxic explosion',
        elements: ['Fire', 'Poison']
    }
    
]


export function updateElementalReactions(build: Build): Reaction[] {
    const activeElements: Elemental[] = [];
    
    for(const medallion of build.medallions) {
        for(const attribute of medallion.attributes) {
            if(medallion.currentLevel >= attribute.requiredLevel && isElemental(attribute.upgradable) ) {
                activeElements.push(attribute.upgradable);
            }
        }
    }

    build.reactions = []

    for(const reaction of elementalReactionsAvailable) {
        const elements = reaction.elements;
        if(activeElements.includes(elements[0]) && activeElements.includes(elements[1])) {
            build.reactions.push(reaction);
        }
    }


    return build.reactions;
}