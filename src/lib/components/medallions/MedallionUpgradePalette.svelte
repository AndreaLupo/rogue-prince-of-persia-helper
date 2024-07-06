<script lang="ts">
  import type { MedallionLevelUpgrade, MedallionUpgradeMask } from "../../../types";
  import MedallionUpgradePaletteItem from "./MedallionUpgradePaletteItem.svelte";

  export let upgrades: MedallionUpgradeMask;
  const thisMedallion: MedallionLevelUpgrade = {
    direction: "None",
    hop: 0
  };
  
  const thisMedallionExists = upgrades.upgrades.find(up => up.direction === 'None');
  if(!thisMedallionExists) {
    upgrades.upgrades.push(thisMedallion);
  }
  upgrades.upgrades.sort((a, b) => {
    let points = 0;
    let aPoints = 0;
    let bPoints = 0;
    if(a.direction === 'Right') {
      aPoints = a.hop;
    } else {
      aPoints = -a.hop;
    }
    if(b.direction === 'Right') {
      bPoints = b.hop;
    } else {
      bPoints = -b.hop;
    }

    points = aPoints - bPoints;
    return points;
  });
</script>

<div class="upgrade-items">
  {#each upgrades.upgrades as upgrade}
    <MedallionUpgradePaletteItem up={upgrade.hop > 0}></MedallionUpgradePaletteItem>
  {/each}
</div>

<style lang="scss">
  .upgrade-items {
    display: flex;
    gap: 8px;
  }

</style>
