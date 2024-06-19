
<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import type { Medallion } from "../types";
  import MedallionUpgradePalette from "./components/medallions/MedallionUpgradePalette.svelte";
  import MedallionAttributesTrigger from "./components/medallions/MedallionAttributesTrigger.svelte";
  import MedallionAttribute from './components/medallions/MedallionAttribute.svelte';
  import { selectedMedallionStore } from "../stores/medallion.store";
  import { get } from "svelte/store";
  import { buildStore } from "../stores/build.store";
    import MedallionDiamonds from "./components/MedallionDiamonds.svelte";


  const dispatch = createEventDispatcher();
  export let medallion: Medallion;
  export let showCurrentLevel = false;
  export let showTitle = false;
  export let imageDimension: ImageDimension = 'normal';
  export let selectable = true;

  let showPopup = false;
  let position = 'right'; // 'right' or 'left'
  let mainElement: HTMLElement;

  function handleMouseOver() {
    const rect = mainElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Decide position based on available space
    if (viewportWidth - rect.right < rect.left) {
      position = 'left';
    } else {
      position = 'right';
    }

    if(get(selectedMedallionStore)) {
      return;
    }

    showPopup = true;
  }

  function handleMouseOut() {
    //if(medallion.id !== 'flaming_kick')
    showPopup = false;
  }

  function selectMedallion() {
    if(!selectable) {
      return;
    }
    const selectedMedallion = get(selectedMedallionStore);
    
    for(const medallion of buildStore.getMedallionsInSlots()) {
      if(medallion && selectedMedallion) {
        // this is the click to release a medallion to the build component. Should not continue
        console.log("Stopping here!");
        return;
      }
    }


    if(medallion === selectedMedallion) {
      // click twice on the medallion in medallion's list. User want to deselect it.
      selectedMedallionStore.set(undefined);
      return;
    }
    selectedMedallionStore.set(medallion);
  }



  // Debounce function
  function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


</script>

<script context="module" lang="ts">
    export type ImageDimension = 'small' | 'normal' | 'large';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div 
  class="container" class:selected={$selectedMedallionStore?.id === medallion.id} 
  bind:this={mainElement}
  on:mouseover={handleMouseOver} 
  on:mouseout={handleMouseOut}
  on:click={selectMedallion}>
  
  <div class="main-element">
    {#if showTitle}
      <h3>{medallion.name}</h3>  
    {/if}
    
    {#await import(`$lib/assets/medallions/${medallion.imageName}.png`) then { default: src }}
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img {src} alt="Image" class={imageDimension} />
    {/await}
    {#if showCurrentLevel}
      <MedallionDiamonds level={medallion.currentLevel}></MedallionDiamonds>
    {/if}
  </div>

  {#if showPopup}
    <div class={`popup popup-${position}`}>
      <div class="popup-header">
        {#await import(`$lib/assets/medallions/${medallion.imageName}.png`) then { default: src }}
          <!-- svelte-ignore a11y-img-redundant-alt -->
          <img {src} alt="Image" class='normal' />
        {/await}

        <div class="popup-title">
          <h3>{medallion.name}</h3>  
          <MedallionUpgradePalette upgrades={medallion.upgradeMask}></MedallionUpgradePalette>
        </div>

      </div>
      
      

      <MedallionAttributesTrigger triggeringAction={medallion.triggeringAction}></MedallionAttributesTrigger>

      <div class="attributes">
        {#each medallion.attributes as medallionAttribute}
          <MedallionAttribute {medallionAttribute} medallionLevel={medallion.currentLevel}/>
        {/each}
      </div>
      
    </div>
  {/if}
</div>

<style>
  h3 {
    font-family: 'rogue_pop';
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 0;
    color: #E0CF9B;
  }

  .small {
    width: 60px;
    height: auto;
  }

  .normal {
    width: 80px;
    height: auto;
  }

  .large {
    width: 120px;
    height: auto;
  }

  .container {
    cursor: grab;
    display: inline-block;
    position: relative;
  }

  .popup {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    border: 2px solid #FFFEFF;
    white-space: nowrap;
    z-index: 10;
    min-width: 30rem;
    text-align: left;
  }

  .popup-header {
    display: flex;
    background-color: #363545;
  }

  .popup-title {
    background-color: #363545;
    padding: 10px;

  }

  .popup-right {
    left: 100%;
    margin-left: 10px;
  }

  .popup-left {
    right: 100%;
    margin-right: 10px;
  }

  .selected {
    border: 5px solid #FFBF4E;
  }

  .attributes {
    padding: 1rem;
    background-color: #231C2E;
  }

  .main-element {
    flex-direction: column;
    justify-content: center;
    display: flex;
    align-items: center;
  }

</style>