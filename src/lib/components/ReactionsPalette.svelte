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
                    <Fa size="sm" icon={faCircle} color={getElementColor(element)}/>
                    <span>{element}</span>
                </div>
            {/each}
        </span>
        
    {/each}
</div>

<style lang="scss">
.reactions-container {
    display: flex;
    align-self: flex-start;
    gap: 1rem;
    .reaction {
        padding: 4px 8px;
        border: 1px solid yellow;
        border-radius: 5px;
        display: flex;
        gap: 1rem;
        align-items: center;
        
    }
    
}


</style>