<section class="hero">
  <div class="left-half"></div>
  <div class="right-half">
    <div class="label"></div>
  </div>
</section>

<style lang="scss">
  /* Reset default margin and padding */
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  body {
    overflow-x: hidden;
  }

  .hero {
    position: relative;
    width: 100%;
    height: 95vh; /* Full viewport height */
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  /* Hero section style */
  .hero::before {
      content: "";
      background-image: url('/hero_background.jpg');
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: 130%;
      background-position: center;
      background-repeat: no-repeat;
      filter: brightness(0.8);
      transition: background-size 0.3s ease-in-out, filter 0.3s ease-in-out;
      z-index: -1;
  }

  section {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;

    background-size: cover;
    background-position: center;
    position: relative;

  }

  /* Left and right halves */
  .left-half, .right-half {
      width: 50%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
  }

  .left-half {
      background-image: url('/hero_prince.png');
      filter: brightness(0.8);
  }

  .right-half {
    background-image: url('/rpop_full_logo.png');
    max-height: 20rem;
    position: relative;

    .label {
      position: absolute;
      bottom: -5rem;
      right: 6rem;
      font-family: 'rogue_pop';
      text-transform: uppercase;
      font-size: 2.4rem;
      background-size: cover;
      background-position: center;
      background-image: url('/toolkit_logo.png');
      height: 6rem;
      width: 28rem;
      
    }
  }

</style>