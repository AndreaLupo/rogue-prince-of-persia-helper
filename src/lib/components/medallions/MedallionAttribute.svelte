<script lang="ts">
  import type { MedallionAttribute } from "../../../types";
  import Fa from 'svelte-fa';
  import { faDiamond, faCircle } from '@fortawesome/free-solid-svg-icons';

  export let medallionAttribute: MedallionAttribute;
  export let medallionLevel: number;

  const colorActive = '#F5C54C';
  const colorInactive = '#999894';
  const colorNotAvailable = '#473D36';

  let color =  colorNotAvailable;
  if(medallionAttribute.requiredLevel === 0) {
    color = colorActive;
  } else {
    if(medallionLevel < medallionAttribute.requiredLevel) {
      color = colorInactive;
    } else {
      color = colorActive;
    }
  }

  const getDiamondColor = (level: number): string => {
    if(medallionAttribute.requiredLevel < level) {
      return colorNotAvailable;
    }

    if(medallionLevel >= level) {
      return colorActive;
    }
    return colorInactive;
  }
  
</script>

<div class="container">
  <div class="level-required">
    {#if medallionAttribute.requiredLevel === 0}
    <Fa size="xs" icon={faCircle} {color}/>
     
    {:else}
      <Fa size="xs" icon={faDiamond} color={ getDiamondColor(1) }/>
      <Fa size="xs" icon={faDiamond} color={ getDiamondColor(2) }/>
      <Fa size="xs" icon={faDiamond} color={ getDiamondColor(3) }/>
    {/if}

  </div>
  <div class="description" class:not-locked={medallionLevel < medallionAttribute.requiredLevel} >
    {#if medallionAttribute.action === 'set'}
      Set <span>{medallionAttribute.upgradable}</span> on the area
    {/if}
    {#if medallionAttribute.action === 'restore'}
      Restore 
      <span class="amount">{medallionAttribute.amount}</span> {medallionAttribute.upgradable} 
      {#if medallionAttribute.measure} 
        {medallionAttribute.measure} 
      {/if}   
    {/if}
    {#if medallionAttribute.action === 'release'}
      Release 
      {#if medallionAttribute.upgradable === 'Poison'} 
        <span class="poison"> a cloud of poison</span>
      {/if}   
    {/if}
    {#if medallionAttribute.action === 'spread'}
      Spread
      {#if medallionAttribute.upgradable === 'Resin'} 
        <span class="resin">resin</span>
      {/if}
    {/if}

    {#if medallionAttribute.action === 'inflict'}
      {#if medallionAttribute.upgradable === 'Poison'} 
        <span class="poison">poison</span>
      {/if}
       the target
    {/if}
    {#if medallionAttribute.action === 'receive'}
      Receive
      {#if medallionAttribute.upgradable === 'Gold'} 
        <span class="amount">{medallionAttribute.amount}</span>
         gold coins
      {/if}
    {/if}
    {#if medallionAttribute.action === 'hurl'}
      {#if medallionAttribute.upgradable === 'Daggers'} 
        Hurl <span class="amount">{medallionAttribute.upgradable}</span>
         at nearby enemies ({medallionAttribute.amount} damage per dagger).
      {/if}
    {/if}
  </div>
  
</div>

<style>
.container {
  display: grid;
  row-gap: 2rem;
  grid-template-columns: 1fr 5fr;
  padding-bottom: 8px;
  color: #A4A3B3;
}

.level-required {
  display: flex;
  align-items: center;
  justify-content: center;
}

.poison {
  color: #648014;
}

.fire {
  color: orange;
}

.not-locked {
  opacity: 0.5;
}

.amount {
  color: #D6C090;
  font-weight: bold;
}
</style>