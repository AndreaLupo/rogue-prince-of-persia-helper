<section class="hero">
  <div class="left-half"></div>
  <div class="right-half"></div>
</section>

<style lang="scss">
  /* Reset default margin and padding */
  * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }

  body, html {
      height: 100%;
  }


  /* Hero section style */
  .hero {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: calc(100vh - 70px); /* Full height minus the header height */
      background-image: url('/hero_background.jpg');
      position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      background-size: 130%;
      background-position: center;
      position: relative;
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
  }

  .right-half {
      background-image: url('/rpop_full_logo.png');
      max-height: 20rem;
    }

  .background-wrapper {
    background-image: url('/background_wall.jpg');
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

</style>