<script lang="ts">
    import { faCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import type { Build, Elemental } from "../../types";

    export let build: Build;

</script>

{#if build.reactions.length > 0}
    <div class="reactions-container">
        {#each build.reactions as reaction}
            <span class="reaction">
                {#await import(`$lib/assets/elements/${reaction.elements[0].toLowerCase()}+${reaction.elements[1].toLowerCase()}.png`) then { default: src }}
                    <!-- svelte-ignore a11y-img-redundant-alt -->
                    <img {src} alt="Image" style="width: 2.4rem"/>
                {/await}
            </span>
        {:else}
            <!-- this way the empty -->
            
        {/each}
    </div>
{:else}
    <div class="no-reactions">No reactions.</div>
{/if}

<style lang="scss">
.reactions-container {
    display: flex;
   
    background-color: #2A2A2A;
    border-radius: 15px;
    padding: 1.2rem;
    gap: 1rem;
    .reaction {
        padding: 4px 8px;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        
    }
    
}

.no-reactions {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2A2A2A;
}


</style>