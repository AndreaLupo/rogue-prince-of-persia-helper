<script lang="ts">
  import { faInfo } from "@fortawesome/free-solid-svg-icons";
  import { buildStore } from "../stores/build.store";
  import type { Medallion, Slot } from "../types";
  import SelectionSlot from "./SelectionSlot.svelte";

  import { dndzone, type DndEvent, type DndEventInfo } from 'svelte-dnd-action';
  import {flip} from 'svelte/animate';
  const flipDurationMs = 200;

  let slots: Slot[] = [];
  

  buildStore.subscribe( (updatedSlots: Slot[]) => {
    // console.log('New slots in build:', updatedSlots);
    slots = updatedSlots;
    
  });


  let draggedMedallion: Medallion | null = null;


</script>


<div class="slots-holder" >
  {#each slots as slot(slot.id)}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div >
      <SelectionSlot {slot}></SelectionSlot>
    </div>
    
  {/each}
</div>



<style lang="scss">
  .slots-holder {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: center;
  }
</style>