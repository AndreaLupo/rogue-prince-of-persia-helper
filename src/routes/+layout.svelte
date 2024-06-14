<script lang="ts">
  import "$lib/assets/styles/app.css"
  import TheHeader from "$lib/components/TheHeader.svelte";
  console.log('Imported layout!');
</script>

<div class="app">
	<TheHeader />

	<div class="background-wrapper"></div>

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

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;

    background-size: cover;
    background-position: center;
    position: relative;
	}

	.background-wrapper {
		background-image: url('/background.jpg');
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		filter: grayscale(100%) brightness(0.3); /* Apply greyscale effect */

		/* Or use blur effect: */
		/* filter: blur(5px); */
		z-index: -1;
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