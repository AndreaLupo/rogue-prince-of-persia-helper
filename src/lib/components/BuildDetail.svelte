<script lang="ts">
    import MedallionUi from "$lib/MedallionUI.svelte";
    import type { Build } from "../../types";
    import ReactionsPalette from "./ReactionsPalette.svelte";

    export let build: Build;

</script>

<div class="grid">
    <div class="medallions">
        <MedallionUi medallion={build.medallions[0]} showCurrentLevel={true} selectable={false} ></MedallionUi>
        <MedallionUi medallion={build.medallions[1]} showCurrentLevel={true} selectable={false} ></MedallionUi>
        <MedallionUi medallion={build.medallions[2]} showCurrentLevel={true} selectable={false} ></MedallionUi>
        <MedallionUi medallion={build.medallions[3]} showCurrentLevel={true} selectable={false} ></MedallionUi>
    </div>
    <ReactionsPalette build={build}></ReactionsPalette>

</div>

<style lang="scss">
    .grid {
        display: grid;
        grid-template-columns: 4fr 3fr;
        row-gap: 1rem;
        column-gap: 2rem;
        .medallions {
            display: flex;
            gap: 1rem;
        }
    }
</style>