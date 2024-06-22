<script lang="ts">
    import MedallionUi from '$lib/MedallionUI.svelte';
    import BuildDetail from '$lib/components/BuildDetail.svelte';
    import ReactionsPalette from '$lib/components/ReactionsPalette.svelte';
    import ReactionPalette from '$lib/components/ReactionsPalette.svelte';
    import MultiSelect from 'svelte-multiselect';
    
    import { getAllBuilds } from '../../../helpers/build-generator';
    import medallions from '../../../stores/medallion.store';
    import type { Build, Medallion, Reaction } from '../../../types';
    import { elementalReactions } from '../../../helpers/elemental-reaction-checker';
  
    const allBuilds = getAllBuilds();

    let builds: Build[] = [];
    let filteredBuilds: Build[] = [];
    let page = 0;    
    let size = 20;
    let showMedallionsNameFilter = false;
    let showPositionedMedallionsNameFilter = false;
    let showReactionsFilter = false;

    let reactionFilters: any[] = [];


    let medallionNameSearch = '';
    let positionedMedallionNameSearch = '';
    let positionSearch = 0;

    let reactionsLabels: { label: string, value: Reaction}[] = [];
    for(const reaction of elementalReactions) {
        reactionsLabels.push({
            label: reaction.name,
            value: reaction
        });
    }


    function filterByMedallionsLevel(level: number) {
        const start = Date.now();
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        console.log('All builds:', allBuilds.length);
        for(const build of allBuilds) {
            for(const medallion of build.medallions) {
                if(!medallion.currentLevel) {
                    // this is just a medallion level 0
                }
                if(medallion.currentLevel >= level) {
                    newBuilds.push(build);
                    break;
                }
            }
        }
        console.log(newBuilds);
        filteredBuilds = [...newBuilds];
        console.log('Filtered builds:', filteredBuilds.length);
        console.log('Finish!');
        const end = Date.now();
        console.log('Time:', end - start);
        page = 0;
        getNewPageOfFilteredBuilds();
    }

    function filterByAllAttributesUnlocked() {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        console.log('All builds:', allBuilds.length);
        for(const build of allBuilds) {
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
        filteredBuilds = [...newBuilds];
        page = 0;
        getNewPageOfFilteredBuilds();
    }

    function filterByMedallionsName() {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        
        for(const build of allBuilds) {
            for(let index = 0; index < build.medallions.length; index++) {
                const medallion = build.medallions[index];
                if(showMedallionsNameFilter) {
                    if(medallion.name.toLowerCase().includes(medallionNameSearch.toLowerCase())) {
                        newBuilds.push(build);
                        break;
                    }
                }
                if(showPositionedMedallionsNameFilter) {
                    if(medallion.name.toLowerCase().includes(medallionNameSearch.toLowerCase()) && index === (positionSearch-1)) {
                        newBuilds.push(build);
                        break;
                    }
                }
            }
        }
        filteredBuilds = [...newBuilds];
        page = 0;
        getNewPageOfFilteredBuilds();
    }

    function filterByReactions() {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        
        for(const build of allBuilds) {
            for(let index = 0; index < build.reactions.length; index++) {
                debugger;
                const reaction = build.reactions[index];
                if(showReactionsFilter) {
                    const reactions: Reaction[] = reactionFilters.map(reactionLabel => reactionLabel.value);
                    if(reactions.includes(reaction)) {
                        newBuilds.push(build);
                        break;
                    }
                }
            }
        }
        filteredBuilds = [...newBuilds];
        page = 0;
        getNewPageOfFilteredBuilds();
    }


    function getNewPageOfFilteredBuilds() {
        builds = [
            ...builds,
            ...filteredBuilds.splice(size * page, size * (page + 1) - 1)
        ]
    }

    filteredBuilds = [...allBuilds];
    builds = allBuilds.splice(size * page, size * (page + 1) - 1);
  </script>

<div>
    <div>Total combinations: {allBuilds.length}</div>

    <div>
        <button on:click={() => filterByMedallionsLevel(3)}>Only level 3 medallions</button>
        <button on:click={() => filterByAllAttributesUnlocked()}>All attributes unlocked</button>
        <button on:click={() => showMedallionsNameFilter=true}>Filter by medallions name</button>
        <button on:click={() => showPositionedMedallionsNameFilter=true}>Filter by medallions name and position</button>
        <button on:click={() => showReactionsFilter=true}>Filter by reactions</button>
    </div>
    {#if showMedallionsNameFilter}
        <input bind:value={medallionNameSearch}/>
        <button on:click={() => filterByMedallionsName()}>Filter</button>
    {/if}

    {#if showPositionedMedallionsNameFilter}
        <input bind:value={medallionNameSearch}/>
        <input type="number" min=1 max=4 bind:value={positionSearch}/>
        <button on:click={() => filterByMedallionsName()}>Filter</button>
    {/if}

    {#if showReactionsFilter}
        <MultiSelect bind:selected={reactionFilters} options={reactionsLabels} minSelect={1} maxSelect={3} on:change={ () => { filterByReactions()} }/>
    {/if}

    <div>Filtered combinations: {filteredBuilds.length}</div>

    {#each builds as build}
        <BuildDetail {build}></BuildDetail>   
    {/each}
    <button on:click={ () => { getNewPageOfFilteredBuilds() }}>Load more</button>
</div>

