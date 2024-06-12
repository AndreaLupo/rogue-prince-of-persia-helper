<script lang="ts">
  
  
  export let up: boolean;
  import levelup from '$lib/assets/levelup.svg';
  import emptyslot from '$lib/assets/emptyslot.svg';
</script>

<div>
  {#if up}
    <img class="circle-size level-up" src={levelup}  alt="level-up"/>
  {:else}
    <img class="circle-size" src={emptyslot}  alt="empty-slot"/>
  {/if}
</div>


<style>
  .circle-size {
    width: 24px;
    height: 24px;
  }
  .level-up {
    fill: #A3D234;
  }
</style>