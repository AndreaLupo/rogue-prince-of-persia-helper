<script>
  import logo from '$lib/assets/logo.png';
</script>

<header id="header">
  <div class="corner">
		<a href="/">
			<img src={logo} alt="Home" />
		</a>
	</div>
  
  <nav id="navbar">
    <ul>
        <li class="menu-intern block-hide-small">
          <a href="medallions">Medallions</a>
        </li>
        
		<li class="menu-intern block-hide-small">
		  <a href="builds">Builds</a>
		</li>

        <li class="menu-intern block-hide-small">
        </li>
    </ul>       
  </nav>
</header>


<style lang="scss">
header {
		display: flex;
		justify-content: space-between;
		background-color: #0e1341;
		width: 100%;
	}

	.corner {
		width: 4em;
		height: 4em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 3em;
		height: 3em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		margin-right: 2rem;
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;

    li {
      position: relative;
      height: 100%;
      a {
        font-family: 'rogue_pop';
        font-size: 1.2rem;
      }
    }
	}

	

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>


