<script lang="ts">
  import MedallionUI from '$lib/MedallionUI.svelte';

  import Build from '$lib/Build.svelte';
  
  import { type Elemental, type Medallion, type MedallionPosition, type TriggeringAction, type Upgradable } from '$lib/../types';
  import { filteredMedallions } from '$lib/../stores/filtered-medallions.store';
  import { addFilterToMedallions, resetMedallionsFilters } from '$lib/../stores/medallions-filtering-criteria.store';

  let showFilters = false;

  let activeFilter = '';

  const filterByAction = (triggeringAction: TriggeringAction) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'action', triggeringAction});
  }

  const filterByElemental = (elemental: Elemental) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'upgradable', upgradable: elemental as unknown as Upgradable});
    activeFilter = elemental;
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
  <div class="filters">
    <button on:click={() => filterByElemental('Poison')} class:active={activeFilter === 'Poison'}>
      {#await import(`$lib/assets/elements/poison.png`) then { default: src }}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img {src} alt="Image" style="width: 1.4rem"/>
      {/await}
      Poison</button>
    <button on:click={() => filterByElemental('Fire')} class:active={activeFilter === 'Fire'}>
      {#await import(`$lib/assets/elements/fire.png`) then { default: src }}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img {src} alt="Image" style="width: 1.4rem"/>
      {/await}
      Fire
    </button>
    <button on:click={() => filterByElemental('Resin')} class:active={activeFilter === 'Resin'}>
      {#await import(`$lib/assets/elements/resin.png`) then { default: src }}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img {src} alt="Image" style="width: 1.4rem"/>
      {/await}
      Resin
    </button>
    <button on:click={() => { resetMedallionsFilters(); activeFilter = ''} }>Reset filters </button>
  </div>
    
  {/if}

  <div class="medallions">
    {#each $filteredMedallions as medallion(medallion.name)}
      <div draggable="true">
        <MedallionUI {medallion} imageDimension="small" ></MedallionUI>
      </div>
    {/each}
  </div>

  
</main>

<style lang="scss">
  main {
    margin: 4rem auto;
    max-width: 1280px;
  }

  .medallions {
    margin-top: 3rem;
    padding: 1rem;
    border: 1px solid yellow;
    border-radius: 15px;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    align-items: center;
    
    row-gap: 1rem;
    column-gap: 1rem;
  }

  .filters {
    display: flex;
    gap: 1rem;


    button {
      font-family: 'rogue_pop';
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 1rem;

      &.active {
        border: 1px solid yellow;
      }
    }
  }
  
</style>
