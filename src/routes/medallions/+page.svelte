<script lang="ts">
  import MedallionUI from '$lib/MedallionUI.svelte';

  import Build from '$lib/Build.svelte';
  
  import { type Elemental, type Medallion, type MedallionPosition, type TriggeringAction, type Upgradable } from '$lib/../types';
  import { filteredMedallions } from '$lib/../stores/filtered-medallions.store';
  import { addFilterToMedallions, resetMedallionsFilters } from '$lib/../stores/medallions-filtering-criteria.store';

  let showFilters = false;

  const filterByAction = (triggeringAction: TriggeringAction) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'action', triggeringAction});
  }

  const filterByElemental = (elemental: Elemental) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'upgradable', upgradable: elemental as unknown as Upgradable});
  }

  filteredMedallions.subscribe((medallions) => {
    // console.log("Filtered medallions: ", medallions);
  })

</script>

<main id="medallions">
  
  <Build></Build>

  {#if showFilters}
    <button on:click={() => showFilters = false}>Hide filters</button>
  {:else}
    <button on:click={() => showFilters = true}>Show filters</button>
  {/if}
  {#if showFilters}
    <button on:click={() => filterByElemental('Poison')}>Poison</button>
    <button on:click={() => filterByElemental('Fire')}>Fire</button>
    <button on:click={() => filterByElemental('Resin')}>Resin</button>
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
  button {
    font-family: 'rogue_pop';
    text-transform: uppercase;
  }
</style>
