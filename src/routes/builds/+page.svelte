<script lang="ts">
    import BuildDetail from '$lib/components/BuildDetail.svelte';
    import MultiSelect from 'svelte-multiselect';
    
    import { getAllBuilds } from '../../helpers/build-generator';
    import type { Build, Elemental, Medallion, Reaction } from '../../types';
    import { elementalReactions } from '../../helpers/elemental-reaction-checker';

    import Fa from "svelte-fa";
    import { faCircle } from '@fortawesome/free-solid-svg-icons';
    import medallions from '../../stores/medallion.store';
    import { get } from 'svelte/store';
    import { filterBuilds } from '../../helpers/build-filter';
  
    const allBuilds = getAllBuilds();

    let builds: Build[] = [];
    let filteredBuilds: Build[] = [];
    let page = 0;    
    let size = 30;
    let showMedallionsNameFilter = false;
    let showPositionedMedallionsNameFilter = false;

    let reactionFilters: any[] = [];
    let medallionFilters: any[] = [];

    $: loadedResults = (page+1)*size;
    
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
    let allAttributesUnlocked = false;

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

    function filter() {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = filterBuilds(medallionFilters, reactionFilters, allAttributesUnlocked);


        filteredBuilds = [...newBuilds];
        page = 0;
        getNewPageOfFilteredBuilds();
    }

    function getNewPageOfFilteredBuilds() {
        builds = [
            ...builds,
            ...filteredBuilds.splice(size * page, size * (page + 1))
        ];
        page = page+1;
    }

    filteredBuilds = [...allBuilds];
    builds = allBuilds.splice(size * page, size * (page + 1));
  </script>

<main>
    <div>Total builds: {allBuilds.length}</div>

    <div class="filters">
        <div class="medallions">
            <span>Medallions</span>
            <MultiSelect bind:selected={medallionFilters} options={medallionsLabels} 
                placeholder="Type a medallion name or select it from the list.."
                minSelect={0} maxSelect={4} 
                on:change={ () => { filter()} } >
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
            <div class="reactions">
                <span>Reactions</span>
                <MultiSelect bind:selected={reactionFilters} options={reactionsLabels} minSelect={0} maxSelect={1} on:change={ () => { filter()} }>
                    <div slot="option" let:option>
                        <div class="multiselect-option">
                            {#await import(`$lib/assets/elements/${option.value.elements[0].toLowerCase()}+${option.value.elements[1].toLowerCase()}.png`) then { default: src }}
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img {src} alt="Image" style="width: 1.4rem"/>
                            {/await}
                            {option.label}
                        </div> 
                    </div>
                    <div slot="selected" let:option>
                        <div class="multiselect-option-selected">
                            {#await import(`$lib/assets/elements/${option.value.elements[0].toLowerCase()}+${option.value.elements[1].toLowerCase()}.png`) then { default: src }}
                                <!-- svelte-ignore a11y-img-redundant-alt -->
                                <img {src} alt="Image" style="width: 1.4rem"/>
                            {/await}
                            {option.label}
                        </div> 
                    </div>
                </MultiSelect>
            </div>
        </div>

        <div class="legend">
            <div class="legend-item">
                {#await import(`$lib/assets/elements/fire+resin.png`) then { default: src }}
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img {src} alt="Image" style="width: 2rem"/>
                {/await}
                <span>Fire+Resin</span>
            </div>
            <div class="legend-item">
                {#await import(`$lib/assets/elements/poison+resin.png`) then { default: src }}
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img {src} alt="Image"  style="width: 2rem"/>
                {/await}
                <span>Poison+Resin</span>
            </div>
            <div class="legend-item">
                <Fa size="lg" icon={faCircle} color={getElementColor('Resin')}/>
                <span>Poison+Fire</span>
            </div>
            
        </div>

        <div>
            <label>
                <input type="checkbox" bind:checked={allAttributesUnlocked} on:change={() => { filter()}}/>
                All attributes unlocked
            </label>
               
        </div>
    </div>

    <div>
        <button on:click={() => showPositionedMedallionsNameFilter=true}>Filter by medallions name and position</button>
    </div>
    {#if showMedallionsNameFilter}
        <input bind:value={medallionNameSearch}/>
        <button on:click={() => filter()}>Filter</button>
    {/if}

    {#if showPositionedMedallionsNameFilter}
        <input bind:value={medallionNameSearch}/>
        <input type="number" min=1 max=4 bind:value={positionSearch}/>
        <button on:click={() => filter()}>Filter</button>
    {/if}

    <div>Filtered builds: {filteredBuilds.length}</div>

    <div class="builds-grid">
        {#each builds as build}
            <BuildDetail {build}></BuildDetail>   
        {/each}
    </div>
   
    <div class="load-wrapper">
        <div>Loaded {loadedResults} of {filteredBuilds.length} total results</div>
        <button on:click={ () => { getNewPageOfFilteredBuilds() }}>Load more</button>
    </div>
</main>

<style lang="scss">
    main {
        margin: 0 auto;
        max-width: 1280px;
    }

    .filters {
        display: grid;
        grid-template-columns: 6fr 4fr 2fr;
        gap: 1rem;

        .medallions, .reactions {
            display: grid;
            grid-template-columns: 1fr 6fr;
            align-items: baseline;
            gap: 1rem;
        }
        
    }

    .multiselect .options [role=option] {
        background-color: #2A2A2A;
    }
    .multiselect-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #2A2A2A;
        font-family: 'rogue_pop';
        text-transform: uppercase;

        &-selected {
            color: #dddddd;
            font-family: 'rogue_pop';
            text-transform: uppercase;
        }
    }
    
    .builds-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 1rem;
        column-gap: 1rem;

        @media (max-width: 1200px) {
            grid-template-columns: 1fr 1fr;
        }

        @media (max-width: 700px) {
            grid-template-columns: 1fr;
        }
    }

    .legend {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        padding: 1rem;
        background-color: #2A2A2A;
        border-radius: 15px;

        &-item {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
           
        span {
            font-family: 'rogue_pop';
            text-transform: uppercase;
            font-weight: bold;
            font-size: 1.1rem;
        }
    }

    .load-wrapper {
        margin-top: 1rem;
        display: block;
        text-align: center;
    }
</style>
