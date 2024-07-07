<script lang="ts">

    import Fa from "svelte-fa";
    import type { Elemental } from "../../types";


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
    };
</script>


<div class="legend">
    <div class="legend-item">
        {#await import(`$lib/assets/elements/fire.png`) then { default: src }}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img {src} alt="Image" style="width: 2rem"/>
        {/await}
        <span>Fire</span>
    </div>
    <div class="legend-item">
        {#await import(`$lib/assets/elements/fire+resin.png`) then { default: src }}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img {src} alt="Image" style="width: 2rem"/>
        {/await}
        <span>Fire+Resin</span>
    </div>
    <div class="legend-item">
        {#await import(`$lib/assets/elements/resin.png`) then { default: src }}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img {src} alt="Image" style="width: 2rem"/>
        {/await}
        <span>Resin</span>
    </div>
    <div class="legend-item">
        {#await import(`$lib/assets/elements/poison+resin.png`) then { default: src }}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img {src} alt="Image"  style="width: 2rem"/>
        {/await}
        <span>Poison+Resin</span>
    </div>
    <div class="legend-item">
        {#await import(`$lib/assets/elements/poison.png`) then { default: src }}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img {src} alt="Image"  style="width: 2rem"/>
        {/await}
        <span>Poison</span>
    </div>
    <div class="legend-item">
        {#await import(`$lib/assets/elements/fire+poison.png`) then { default: src }}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img {src} alt="Image"  style="width: 2rem"/>
    {/await}
        <span>Poison+Fire</span>
    </div>
    
</div>

<style lang="scss">
    .legend {
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 1rem;
        column-gap: 1rem;
        padding: 1rem;
        background-color: #2A2A2A;
        border-radius: 15px;

        &-item {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
           
        span {
            font-family: 'rogue_pop';
            text-transform: uppercase;
            font-weight: bold;
            font-size: 1.1rem;
        }
    }

</style>