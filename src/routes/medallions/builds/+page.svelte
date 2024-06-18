<script lang="ts">
    import MedallionUi from '$lib/MedallionUI.svelte';

    
    import { getAllBuilds } from '../../../helpers/build-generator';
    import MedallionAttribute from '$lib/components/medallions/MedallionAttribute.svelte';
    import type { Medallion } from '../../../types';
  
    const allBuilds = getAllBuilds();
    let builds: Medallion[][] = [];
    let page = 0;    
    let size = 20;

    $: builds = [
        ...builds,
        ...allBuilds.splice(size * page, size * (page + 1) - 1)
    ];
  </script>

<div>
    <div>Total combinations: {allBuilds.length}</div>
    {#each builds as build, index}
        <div class="grid">
            <span>#{index+1}</span>
            <MedallionUi medallion={build[0]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[1]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[2]} showCurrentLevel={true} ></MedallionUi>
            <MedallionUi medallion={build[3]} showCurrentLevel={true} ></MedallionUi>
        </div>    
    {/each}
    <button on:click={ () => { page++ }}>Load more</button>
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        row-gap: 1rem;
        column-gap: 2rem;
    }
</style>