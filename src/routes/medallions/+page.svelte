<script lang="ts">
  import MedallionUI from '$lib/MedallionUI.svelte';

  import Build from '$lib/Build.svelte';
  
  import { type Elemental, type Medallion, type MedallionPosition, type MedallionUpgradeMask, type TriggeringAction, type Upgradable } from '$lib/../types';
  import { filteredMedallions } from '$lib/../stores/filtered-medallions.store';
  import { addFilterToMedallions, resetMedallionsFilters } from '$lib/../stores/medallions-filtering-criteria.store';
    import MedallionUpgradePalette from '$lib/components/medallions/MedallionUpgradePalette.svelte';
    import { MultiSelect } from 'svelte-multiselect';


  let activeFilter = '';

  const medallionsUpgrade: MedallionUpgradeMask[] = [
    {
        upgrades: [
          {
              direction: 'None',
              hop: 0
          }
        ]
    },
    {
        upgrades: [
          {
              direction: 'Left',
              hop: 1
          }
        ]
    },
    {
        upgrades: [
          {
              direction: 'Left',
              hop: 1
          },
          {
              direction: 'Left',
              hop: 2
          }
        ]
    },
    {
        upgrades: [
          {
              direction: 'Right',
              hop: 1
          }
        ]
    },
    {
        upgrades: [
          {
              direction: 'Right',
              hop: 1
          },
          {
              direction: 'Right',
              hop: 2
          }
        ]
    },
  ]

  
  type MultiSelectOption = {label: string, value: MedallionUpgradeMask};

  const upgradeFiltersLabels: MultiSelectOption[] = [];
  let upgradeFilters: any[] = [];

  for(const upgrade of medallionsUpgrade) {
    upgradeFiltersLabels.push({
            label: '',
            value: upgrade
        });
    }


  const filterByAction = (triggeringAction: TriggeringAction) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'action', triggeringAction});
  }

  const filterByElemental = (elemental: Elemental) => {
    resetMedallionsFilters();
    addFilterToMedallions({type: 'upgradable', upgradable: elemental as unknown as Upgradable});
    activeFilter = elemental;
  }

  const filterByUpgradeMask = (event: any) => {
    console.log('event: ', event);
    const option: MultiSelectOption = event.value;
    console.log('event: ', option);

    resetMedallionsFilters();
    addFilterToMedallions({type:'upgradeMask', upgradeFilter: upgradeFilters})
  }

  const resetFilters = () => {
    resetMedallionsFilters();
  }

  filteredMedallions.subscribe((medallions) => {
    // console.log("Filtered medallions: ", medallions);
  })

</script>

<main id="medallions">
  
  <Build></Build>

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

    <div class="multiselect">
      <MultiSelect --sms-options-bg="#242424" --sms-width="20rem" bind:selected={upgradeFilters} options={upgradeFiltersLabels} 
        placeholder="Select one or more upgrades.."
        minSelect={0} maxSelect={4} 
        on:change={ (option) => { filterByUpgradeMask(option.detail.option)} }  let:option>
        <div >
            <div class="multiselect-option">
              <MedallionUpgradePalette upgrades={option.value}>
  
              </MedallionUpgradePalette>  
            </div> 
        </div>
  
  
     </MultiSelect>
    </div>
    
    <button on:click={resetFilters}>Reset filters</button>

  </div>

 

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
    border-radius: 15px;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    align-items: center;
    background-color: #46464b;
    
    row-gap: 1rem;
    column-gap: 1rem;
  }

  .filters {
    display: flex;
    gap: 1rem;
    align-items: center;

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
