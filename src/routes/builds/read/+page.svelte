<script>
    import { onMount } from 'svelte';
    import buildMedallions from '$lib/data/builds-medallions.json';

    function executeAndGoBack() {
      // Your script logic here
      

      // Go back to the previous route
      //history.back();
    }
  
    onMount(() => {
      console.log('Builds hashes size: ', buildMedallions.length);
    });
  </script>