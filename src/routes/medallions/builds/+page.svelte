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
        const start = Date.now();
        builds = builds.splice(0, builds.length-1);

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
        builds = [...newBuilds];
        console.log('Filtered builds:', builds.length);
        console.log('Finish!');
        const end = Date.now();
        console.log('Time:', end - start);
        // allBuilds.filter(build => build.filter(medallion => medallion.currentLevel >= level));
    }

    function filterByAllAttributesUnlocked() {
        builds = builds.splice(0, builds.length-1);

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
        console.log(newBuilds);
        builds = [...newBuilds];
        console.log('Filtered builds:', builds.length);
        console.log('Finish!');
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
    <button on:click={() => filterByAllAttributesUnlocked()}>All attributes unlocked</button>

    {#each builds as build, index}
        <div class="grid">
            <MedallionUi medallion={build[0]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[1]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[2]} showCurrentLevel={true} selectable={false} ></MedallionUi>
            <MedallionUi medallion={build[3]} showCurrentLevel={true} selectable={false} ></MedallionUi>
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