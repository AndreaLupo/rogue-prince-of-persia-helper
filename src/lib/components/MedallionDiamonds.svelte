<script lang="ts">

import { faDiamond } from '@fortawesome/free-solid-svg-icons';
import Fa from "svelte-fa";

export let level;

let diamondColors: string[] = [];


$:  {
    diamondColors = [
    getColorCheckingLevels(level, 1),
    getColorCheckingLevels(level, 2),
    getColorCheckingLevels(level, 3),
    ];
};

function getColorCheckingLevels(slotLevel: number, requestedLevel: number): string {
    return slotLevel >= requestedLevel ? '#FFBF4E' : '#483B35';
}

</script>

<div>
    <Fa size="xs" icon={faDiamond} color={ diamondColors[0] }/>
    <Fa size="xs" icon={faDiamond} color={ diamondColors[1] }/>
    <Fa size="xs" icon={faDiamond} color={ diamondColors[2] }/>
</div>