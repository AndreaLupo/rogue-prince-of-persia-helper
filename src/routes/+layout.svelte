<script lang="ts">
  import "$lib/assets/styles/app.css"
  import TheHeader from "$lib/components/TheHeader.svelte";
  console.log('Imported layout!');
</script>

<TheHeader/>

<slot/>