<script>
    import { onMount } from 'svelte';
    import buildGenerationProcess from '$lib/../helpers/build-generation-process';

    function executeAndGoBack() {
      // Your script logic here
      buildGenerationProcess();

      // Go back to the previous route
      //history.back();
    }
  
    onMount(() => {
      const previousRoute = document.referrer;
      console.log('Previous Route:', previousRoute);
      executeAndGoBack();
    });
  </script>