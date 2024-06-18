<script lang="ts">
    import MedallionUi from '$lib/MedallionUI.svelte';

    
    import { getAllBuilds } from '../../../helpers/build-generator';
    import MedallionAttribute from '$lib/components/medallions/MedallionAttribute.svelte';
    import type { Medallion } from '../../../types';
  
    const allBuilds = getAllBuilds();
    let builds: Medallion[][] = [];
    let page = 0;    
    let size = 20;


    function filterByMedallionsLevel(level: number) {
        builds = builds.splice(0, builds.length-1);

        console.log('All builds:', allBuilds.length);
        for(const build of allBuilds) {
            for(const medallion of build) {
                if(medallion.currentLevel >= level) {
                    builds.push(build);
                    break;
                }
            }
        }
        console.log('Filtered builds:', builds.length);
        console.log('Finish!');
        // allBuilds.filter(build => build.filter(medallion => medallion.currentLevel >= level));
    }

    function addPage() {
        builds = [
            ...builds,
            ...allBuilds.splice(size * page, size * (page + 1) - 1)
        ];
    }

    builds = allBuilds.splice(size * page, size * (page + 1) - 1);

  </script>

<div>
    <div>Total combinations: {allBuilds.length}</div>

    <button on:click={() => filterByMedallionsLevel(3)}>Only level 3 medallions</button>

    {#each builds as build, index}
        <div class="grid">
            <MedallionUi medallion={build[0]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[1]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[2]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[3]} showCurrentLevel={true} ></MedallionUi>
        </div>    
    {/each}
    <button on:click={ () => { addPage() }}>Load more</button>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 1rem;
        column-gap: 2rem;
    }
</style>