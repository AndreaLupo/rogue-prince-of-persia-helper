<script lang="ts">
    import BuildDetail from '$lib/components/BuildDetail.svelte';
    import MultiSelect from 'svelte-multiselect';
    
    import { getAllBuilds } from '../../../helpers/build-generator';
    import type { Build, Elemental, Medallion, Reaction } from '../../../types';
    import { elementalReactions } from '../../../helpers/elemental-reaction-checker';

    import Fa from "svelte-fa";
    import { faCircle } from '@fortawesome/free-solid-svg-icons';
    import medallions from '../../../stores/medallion.store';
    import { get } from 'svelte/store';
  
    const allBuilds = getAllBuilds();

    let builds: Build[] = [];
    let filteredBuilds: Build[] = [];
    let page = 0;    
    let size = 20;
    let showMedallionsNameFilter = false;
    let showPositionedMedallionsNameFilter = false;
    let showReactionsFilter = false;

    let reactionFilters: any[] = [];
    let medallionFilters: any[] = [];

    const colorFire = '#ec8612';
    const colorResin = '#3b4091';
    const colorPoison = '#89ac4a';

    const getElementColor = (element: Elemental): string => {
        switch(element) {
            case "Fire":
                return colorFire;
            case "Resin":
                return colorResin;
            case "Poison":
                return colorPoison;
        }
    };


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

    let medallionsLabels: {label: string, value: Medallion}[] = [];
    const medallionsList = get(medallions);
    for(const medallion of medallionsList) {
        medallionsLabels.push({
            label: medallion.name,
            value: medallion
        });
    }

    function filterByMedallionsLevel(level: number) {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
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
        filteredBuilds = [...newBuilds];
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
        debugger;
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        
        for(const build of allBuilds) {
            for(let index = 0; index < build.medallions.length; index++) {
                const medallion = build.medallions[index];
                
                for(const selectedMedallions of medallionFilters) {
                    const selectedMedallion: Medallion = selectedMedallions.value;

                    if(medallion.name.toLowerCase().includes(selectedMedallion.name.toLowerCase())) {
                        newBuilds.push(build);
                        break;
                    }
                    
                    if(showPositionedMedallionsNameFilter) {
                        if(medallion.name.toLowerCase().includes(medallionNameSearch.toLowerCase()) && index === (positionSearch-1)) {
                            newBuilds.push(build);
                            break;
                        }
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
                const reactions: Reaction[] = reactionFilters.map(reactionLabel => reactionLabel.value);
                if(reactions.includes(reaction)) {
                    newBuilds.push(build);
                    break;
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

<main>
    <div>Total builds: {allBuilds.length}</div>

    <div class="filters">
        <div>
            <MultiSelect bind:selected={medallionFilters} options={medallionsLabels} 
                minSelect={0} maxSelect={4} 
                on:change={ () => { filterByMedallionsName()} } >
                <div slot="option" let:option>
                    <div class="multiselect-option">
                        {#await import(`$lib/assets/medallions/${option.value.imageName}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 40px; height: auto;" />
                        {/await}
                        {option.label}
                    </div> 
                </div>
            </MultiSelect>
        </div>

        <div>
            <div>
                All attributes unlocked
            </div>

            <div>
                <span>Reactions</span>
                <MultiSelect bind:selected={reactionFilters} options={reactionsLabels} minSelect={0} maxSelect={3} on:change={ () => { filterByReactions()} }/>
            </div>
        </div>

        <div class="legend">
            <div>
                <Fa size="lg" icon={faCircle} color={getElementColor('Fire')}/>
                <span>Fire</span>
            </div>
            <div>
                <Fa size="lg" icon={faCircle} color={getElementColor('Poison')}/>
                <span>Poison</span>
            </div>
            <div>
                <Fa size="lg" icon={faCircle} color={getElementColor('Resin')}/>
                <span>Resin</span>
            </div>
            
        </div>
    </div>

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
        <MultiSelect bind:selected={reactionFilters} options={reactionsLabels} minSelect={0} maxSelect={3} on:change={ () => { filterByReactions()} }/>
    {/if}

    <div>Filtered builds: {filteredBuilds.length}</div>

    <div class="builds-grid">
        {#each builds as build}
            <BuildDetail {build}></BuildDetail>   
        {/each}
    </div>
   
    <button on:click={ () => { getNewPageOfFilteredBuilds() }}>Load more</button>
</main>

<style lang="scss">
    main {
        margin: 0 auto;
        max-width: 1280px;
    }

    .filters {
        display: grid;
        grid-template-columns: 6fr 4fr 2fr;
    }

    .multiselect .options [role=option] {
        background-color: #2A2A2A;
    }
    .multiselect-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #2A2A2A;
    }
    
    .builds-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 1rem;
        column-gap: 1rem;
    }

    .legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 1rem;
        padding: 1rem;
        background-color: #2A2A2A;
        border-radius: 15px;
    }
</style>
