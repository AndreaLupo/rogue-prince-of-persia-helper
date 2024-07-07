<script lang="ts">
    import BuildDetail from '$lib/components/BuildDetail.svelte';
    
    import type { Build, Elemental, Medallion, Reaction } from '../../types';
    import { elementalReactions } from '../../helpers/elemental-reaction-checker';

    import medallions from '../../stores/medallion.store';
    import { get } from 'svelte/store';
    import BuildFilters from './BuildFilters.svelte';
    import Legend from './Legend.svelte';
    import { onMount } from 'svelte';
  
    import medallionsBuilds from '../../stores/build-generation.store';

    let allBuilds = [];

    let builds: Build[] = [];
    let filteredBuilds: Build[] = [];
    let page = 0;    
    let size = 30;
    let pageLoading = true;

    $: loadedResults = (page+1)*size;
    

    let elements: Elemental[] = ['Fire', 'Resin', 'Poison'];

    let elementsLabels: { label: string, value: Elemental}[] = [];
    for(const reaction of elements) {
        elementsLabels.push({
            label: reaction,
            value: reaction
        });
    }

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

    
    function formatNumber(num: number) {
        return Intl.NumberFormat().format(num);
    }


    function getNewPageOfFilteredBuilds() {
        builds = [
            ...builds,
            ...filteredBuilds.splice(size * page, size * (page + 1))
        ];
        page = page+1;
    }


    onMount( () => {
        const startTime = new Date();
        setTimeout(
            () => {
                console.log('Start loading builds page...');
                medallionsBuilds.subscribe((medBuilds) => {
                    console.log('Got all builds!');
                    allBuilds = medBuilds;
                    pageLoading = false;
                    filteredBuilds = [...allBuilds];
                    builds = allBuilds.splice(size * page, size * (page + 1));
                    const endTime = new Date();

                    console.log('Load page in ', (endTime-startTime)/1000);
                });

                
            }, 10);
        
    });

  </script>

<main>
    
    <div class="filters-2">
        <BuildFilters bind:filteredBuilds={filteredBuilds} bind:builds={builds} ></BuildFilters>
        <Legend></Legend>
    </div>
    
    <div>Note: this page will show only builds where each medallion has at least one attribute activated.</div>

    <div class="counts">
        <div>Total builds: <span class="number">{formatNumber(allBuilds.length)}</span></div>
        <div>Filtered builds: <span class="number">{formatNumber(filteredBuilds.length)}</span></div>
    </div>

    {#if pageLoading}
        <div>Loading..</div>
    {:else}
        <div class="builds-grid">
            {#each builds as build}
                <BuildDetail {build} showDetailLink={true}></BuildDetail>   
            {/each}
        </div>
    
        <div class="load-wrapper">
            <div>Loaded {loadedResults} of {filteredBuilds.length} total results</div>
            <button on:click={ () => { getNewPageOfFilteredBuilds() }}>Load more</button>
        </div>
    {/if}
    
</main>

<style lang="scss">
    main {
        margin: 4rem auto;
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
    .filters-2 {
        display: grid;
        grid-template-columns: 10fr 2fr;
        gap: 1rem;
        
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
            display: flex;
            align-items: center;
            gap: 4px;
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
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 1rem;
        column-gap: 1rem;
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

    .counts {
        font-family: 'rogue_pop';
        font-size: 1.2em;
        text-transform: uppercase;
        text-align: right;
        margin-bottom: 1rem;

        .number {
            color: #D6C090;
        }

    }
</style>
