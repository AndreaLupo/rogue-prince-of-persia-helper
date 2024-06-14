<script lang="ts">
  import type { TriggeringAction } from "../types";

  export let triggeringAction: TriggeringAction;

  let highlight = '';
  let intro = '';
  let outro = '';

  switch(triggeringAction) {
    case "Vault":
      intro = 'When an enemy';
      highlight = 'collides with an obstacle'
      break;
    case "Kick":
      intro = 'When an enemy';
      highlight = 'collides with an obstacle'
      break;
    case "AuraBreaker":
      intro = 'Every time you break a';
      highlight = 'protective aura';
      break;
    case "TakeHit":
      intro = 'When an enemy';
      highlight = 'collides with an obstacle'
      break;
    case "EnemyCollideOstacle":
      intro = 'When an enemy';
      highlight = 'collides with an obstacle'
      break;
    case "EnemyStunned":
      intro = 'Every time an enemy is';
      highlight = 'stunned';
      break;
    case "LandOnEnemyFromBehind":
      intro = 'For every hit you land on an enemy';
      highlight = 'from behind';
      break;
    case "EnemyKilled":
      intro = 'When an enemy is';
      highlight = 'killed';
      break;
    case "EnemyKilledUsingEnvironment":
      intro = 'When an enemy is killed';
      highlight = 'using the environment';
      break;
    case "HitEnemyFromAfar":
      intro = 'When hitting an enemy';
      highlight = 'from afar';
      break;
    case "GoldCoinSpent":
      intro = 'For every';
      highlight = 'gold coin spent';
      break;
    case "FindWellOfDreams":
      intro = 'When finding a new';
      highlight = 'Well of Dreams';
      break;
    case "DiveAttack":
      intro = 'When hitting the ground with a';
      highlight = 'dive attack';
      break;
  }
</script>

<div class="container">
  {intro} <span class="highlight">{highlight}<span>{outro}:
</div>

<style lang="scss">
.highlight {
  color: #B2A073;
}

.container {
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  background-color: #141622;
  padding: 1rem;
  color: #A4A3B3;
}

</style>