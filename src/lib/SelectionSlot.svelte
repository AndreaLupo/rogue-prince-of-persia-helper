<script lang="ts">
  import { dndzone, type DndEvent, type DndEventInfo } from "svelte-dnd-action";
  import type { Medallion, MedallionPosition, Slot, SlotHighlighting } from "../types";
  import MedallionUi from "./MedallionUI.svelte";
  import { flip } from "svelte/animate";
  import { selectedMedallionStore } from "../stores/medallion.store";
  import { buildStore } from "../stores/build.store";
  import { get } from "svelte/store";
  import { faDiamond } from '@fortawesome/free-solid-svg-icons';
  import Fa from "svelte-fa";


  const flipDurationMs = 200;
  export let slot: Slot;
  let spaceSlot = [ slot ];

  let diamondColors: string[] = [];

  $:  {
    diamondColors = [
    getColorCheckingLevels(slot.level, 1),
    getColorCheckingLevels(slot.level, 2),
    getColorCheckingLevels(slot.level, 3),
    ];
  };


  function getColorCheckingLevels(slotLevel: number, requestedLevel: number): string {
    return slotLevel >= requestedLevel ? '#FFBF4E' : '#483B35';
  }

  function handleDragEnter(event:  CustomEvent<DndEvent<Slot>>) {
    console.log('Drag enter to slot', slot.id, event.detail);
    spaceSlot = event.detail.items;
    const info: DndEventInfo = event.detail.info;
    // slot.isHighlighted = true;
    spaceSlot.forEach((slot) => {
      let slotHighlight: SlotHighlighting = 'None';
      if(slot.id === +info.id) {
        slotHighlight = 'Upgrading';
      }

      slot.highlighting = slotHighlight;
    })
  }

  function handleDrop(event: CustomEvent<DndEvent<Slot>>) {
    console.log('Drag drop to slot', slot.id, event.detail);
    const movingMedallion = event.detail.info;
    // remove the medallion that was previously there
    const previousSlot = event.detail.items.find(el => el.id !== +movingMedallion.id);
    if(previousSlot?.medallion) {
      // restore it to 
    } 

    // remove the other slot
    spaceSlot = event.detail.items;
    
  }

  // Debounce function
  function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }


  const considerMedallion = debounce(() => {
    slot.highlighting = 'Selected';

    selectedMedallionStore.subscribe((medallion) => {

      if(!medallion) {
        console.log('No medallion selected');
        return;
      }
      const positions: number[] = [];
      medallion?.upgradeMask.upgrades.forEach(upgrade => {
        let destinationIndex = -1;
        if(upgrade.direction === 'Left') {
          destinationIndex = slot.id - upgrade.hop;
        } else if(upgrade.direction === 'Right') {
          destinationIndex = slot.id + upgrade.hop;
        }

        if(destinationIndex >= 0 && destinationIndex <= 3 ) {
          positions.push(destinationIndex);
        }
      });
      buildStore.highlight(positions);
    })
  }, 500);

  function checkAndSetSelectedMedallion() {
    const medallion = get(selectedMedallionStore);
    if(medallion) {
      //slot.medallion = medallion;
      buildStore.setMedallionAtPosition(medallion, slot.id);
      selectedMedallionStore.set(undefined);
    }
  }

</script>
<!--use:dndzone={{items: spaceSlot, flipDurationMs}} on:consider={handleDragEnter} on:finalize={handleDrop}-->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="selection-slot dropzone" role="button" tabindex="0"
  on:mouseover={considerMedallion} on:click={checkAndSetSelectedMedallion} on:focus={() => {}}>
  <!-- just one slot! -->
  {#each spaceSlot as theSlot(theSlot.id)}
    <div class={slot.highlighting.toLowerCase()} animate:flip={{duration:flipDurationMs}}>
      <div>
        {#if $selectedMedallionStore && theSlot.highlighting === 'Selected'}
          <MedallionUi medallion={$selectedMedallionStore} showTitle={false} showCurrentLevel={true} imageDimension="large"></MedallionUi>
        {/if}
      </div>
      
      <div>
        {#if slot.medallion}
          <MedallionUi medallion={slot.medallion} showTitle={false} showCurrentLevel={false} imageDimension="large"></MedallionUi>
        {:else}
            {#await import(`$lib/assets/slot-empty-medallion.png`) then { default: src }}
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img {src} alt="Image" />
            {/await}
        {/if}
      </div>

      <Fa size="xs" icon={faDiamond} color={ diamondColors[0] }/>
      <Fa size="xs" icon={faDiamond} color={ diamondColors[1] }/>
      <Fa size="xs" icon={faDiamond} color={ diamondColors[2] }/>
    </div>
  {/each}
  
  </div>


<style lang="scss">
  .selection-slot {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropzone {
    min-width: 5rem;
    min-height: 200px;
  }
  .highlighted {
    border: 3px solid red;
  }

  .upgrading {
    border: 2px solid #A4DB41;
  }

  .selected {
    border: 2px solid #FFBF4E;
  }

  .downgrading {
    border: 2px solid #D82924;
  }

  img {
    width: 120px;
  }
</style>


