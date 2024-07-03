<script lang="ts">
    import MedallionUi from "$lib/MedallionUI.svelte";
    import type { Build } from "../../types";
    import ReactionsPalette from "./ReactionsPalette.svelte";

    export let build: Build;
    export let showDetailLink = false;

</script>

<div id={build.hash} class="grid">
    <div class="medallions">
        <MedallionUi medallion={build.medallions[0]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[1]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[2]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
        <MedallionUi medallion={build.medallions[3]} showCurrentLevel={true} selectable={false} imageDimension='small' ></MedallionUi>
    </div>
    <ReactionsPalette build={build}></ReactionsPalette>

    {#if showDetailLink}
        <div class="detail">
            <a href={'builds/' + build.hash}>
                Detail
            </a>
        </div>
    {/if}
</div>

<style lang="scss">
    .grid {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: space-evenly;
        column-gap: 2rem;
        .medallions {
            display: flex;
            gap: 1rem;
        }

        /*border: 2px solid #ffbf4e99;*/
        background-color: #323233;
        border-radius: 15px;
        padding: 1rem;

        .detail {
            position: absolute;
            right: 0;
            bottom: 0;
            padding: 8px 1rem;
        }
    }
</style>