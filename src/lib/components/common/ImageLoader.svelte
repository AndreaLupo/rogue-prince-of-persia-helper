<script lang="ts">
    export let imagePath: string;
    export let imagesClass = '';

    const path = `$lib/assets/elements/fire.png`;
</script>

{#await import('$lib/assets/elements/fire.png') then { default: src }}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img {src} alt="Image" class={imagesClass} />
{/await}
