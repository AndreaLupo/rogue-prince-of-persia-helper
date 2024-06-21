<script lang="ts">
    import MedallionUi from '$lib/MedallionUI.svelte';

    
    import { getAllBuilds } from '../../../helpers/build-generator';
    import type { Medallion } from '../../../types';
  
    const allBuilds = getAllBuilds();

    let builds: Medallion[][] = [];
    let filteredBuilds: Medallion[][] = [];
    let page = 0;    
    let size = 20;
    let showMedallionsNameFilter = false;
    let showPositionedMedallionsNameFilter = false;

    let medallionNameSearch = '';
    let positionedMedallionNameSearch = '';
    let positionSearch = 0;


    function filterByMedallionsLevel(level: number) {
        const start = Date.now();
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = [];
        console.log('All builds:', allBuilds.length);
        for(const build of allBuilds) {
            for(const medallion of build) {
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
            for(const medallion of build) {
                
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
            for(let index = 0; index < build.length; index++) {
                const medallion = build[index];
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

    <div>Filtered combinations: {filteredBuilds.length}</div>

    {#each builds as build}
        <div class="grid">
            <MedallionUi medallion={build[0]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[1]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[2]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[3]} showCurrentLevel={true} selectable={false} ></MedallionUi>
        </div>    
    {/each}
    <button on:click={ () => { getNewPageOfFilteredBuilds() }}>Load more</button>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 1rem;
        column-gap: 2rem;
    }
</style>