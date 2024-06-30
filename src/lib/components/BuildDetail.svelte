<script lang="ts">
    import MedallionUi from "$lib/MedallionUI.svelte";
    import type { Build } from "../../types";
    import ReactionsPalette from "./ReactionsPalette.svelte";

    export let build: Build;

</script>

<div id={build.hash} class="grid">
    <div class="medallions">
        <MedallionUi medallion={build.medallions[0]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[1]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[2]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[3]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
    </div>
    <ReactionsPalette build={build}></ReactionsPalette>

</div>

<style lang="scss">
    .grid {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        column-gap: 2rem;
        .medallions {
            display: flex;
            gap: 1rem;
        }

        border: 2px solid #ffbf4e99;
        border-radius: 15px;
        padding: 1rem;
    }
</style>