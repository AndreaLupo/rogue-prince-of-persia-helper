<script lang="ts">
  import "$lib/assets/styles/app.css"
  import TheHeader from "$lib/components/TheHeader.svelte";
  console.log('Imported layout!');
</script>

<div class="app">
	<TheHeader />

	<main>
		<slot />
	</main>

	<footer>
		<p>visit <a href="https://therogueprinceofpersia.com/">therogueprinceofpersia.com</a> for the latest info</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
    	width: 100vw;
	}

	

	

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>