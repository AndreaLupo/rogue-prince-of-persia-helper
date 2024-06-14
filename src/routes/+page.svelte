<section class="hero">
  <div class="left-half"></div>
  <div class="right-half"></div>
</section>

<style>
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
      height: calc(100vh - 70px); /* Full height minus the header height */
      background-image: url('/hero_background.jpg');
      background-size: cover;
      background-position: center;
      position: relative;
  }

  /* Left and right halves */
  .left-half, .right-half {
      width: 50%;
      height: 100%;
      background-size: cover;
      background-position: center;
  }

  .left-half {
      background-image: url('/hero_prince.png');
  }

  .right-half {
      background-image: url('/rpop_full_logo.png');
  }
</style>