<script lang="ts">
    import { faCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import type { Build, Elemental } from "../../types";

    export let build: Build;

    const colorFire = '#ec8612';
    const colorResin = '#3b4091';
    const colorPoison = '#89ac4a';

    const getElementColor = (element: Elemental): string => {
    switch(element) {
        case "Fire":
            return colorFire;
        case "Resin":
            return colorResin;
        case "Poison":
            return colorPoison;
    }
  }
</script>

<div class="reactions-container">
    {#each build.reactions as reaction}
        <span class="reaction">
            {#each reaction.elements as element}
                <div>
                    <Fa size="lg" icon={faCircle} color={getElementColor(element)}/>
                    <!--<span>{element}</span>-->
                </div>
            {:else}
                <!-- this way the empty -->
                <div>No reaction.</div>
                <div></div>
                <div></div>
                <div></div>
            {/each}
        </span>
        
    {/each}
</div>

<style lang="scss">
.reactions-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    background-color: #2A2A2A;
    border-radius: 15px;
    padding: 1.2rem;
    gap: 1rem;
    .reaction {
        padding: 4px 8px;
        display: flex;
        gap: 1rem;
        align-items: center;
        
    }
    
}


</style>