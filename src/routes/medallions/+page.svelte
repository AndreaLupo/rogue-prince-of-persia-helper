<script lang="ts">
  import MedallionUI from '$lib/MedallionUI.svelte';

  import Build from '$lib/Build.svelte';
  
  import { type Chemical, type Medallion, type MedallionPosition, type TriggeringAction, type Upgradable } from '$lib/../types';
  import { filteredMedallions } from '$lib/../stores/filtered-medallions.store';
  import { addFilterToMedallions, resetMedallionsFilters } from '$lib/../stores/medallions-filtering-criteria.store';

  let showFilters = false;

  const filterByAction = (triggeringAction: TriggeringAction) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'action', triggeringAction});
  }

  const filterByChemical = (chemical: Chemical) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'upgradable', upgradable: chemical as unknown as Upgradable});
  }

  filteredMedallions.subscribe((medallions) => {
    // console.log("Filtered medallions: ", medallions);
  })

</script>

<main>
  
  <Build></Build>

  {#if showFilters}
    <button on:click={() => showFilters = false}>Hide filters</button>
  {:else}
    <button on:click={() => showFilters = true}>Show filters</button>
  {/if}
  {#if showFilters}
    <button on:click={() => filterByChemical('Poison')}>Poison</button>
    <button on:click={() => filterByChemical('Fire')}>Fire</button>
    <button on:click={() => filterByChemical('Resin')}>Resin</button>
    <button on:click={() => resetMedallionsFilters()}>Reset filters </button>
  {/if}

  <div class="medallions">
    {#each $filteredMedallions as medallion(medallion.name)}
      <div draggable="true">
        <MedallionUI {medallion} imageDimension="small" ></MedallionUI>
      </div>
    {/each}
  </div>

  
</main>

<style>
  .medallions {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    row-gap: 1rem;
    column-gap: 1rem;
  }
</style>
