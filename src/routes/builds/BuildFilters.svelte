<script lang="ts">
    import { faCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import MultiSelect from "svelte-multiselect";
    import { filterBuilds } from "../../helpers/build-filter";
    import type { Build, Elemental, Medallion, Reaction } from "../../types";
    import { get } from "svelte/store";
    import medallions from "../../stores/medallion.store";
    import { elementalReactions } from "../../helpers/elemental-reaction-checker";

    export let filteredBuilds: Build[] = [];
    export let builds: Build[] = [];

    export let page = 0;    
    export let size = 30;

    let elementsFilters: any[] = [];
    let reactionFilters: any[] = [];
    let medallionFilters: any[] = [];
    
    let allAttributesUnlocked = false;
    let activeLevelThreeAttribute = false;

    let elements: Elemental[] = ['Fire', 'Resin', 'Poison'];

    let elementsLabels: { label: string, value: Elemental}[] = [];
    for(const reaction of elements) {
        elementsLabels.push({
            label: reaction,
            value: reaction
        });
    }

    let reactionsLabels: { label: string, value: Reaction}[] = [];
    for(const reaction of elementalReactions) {
        reactionsLabels.push({
            label: reaction.name,
            value: reaction
        });
    }

    let medallionsLabels: {label: string, value: Medallion}[] = [];
    const medallionsList = get(medallions);
    for(const medallion of medallionsList) {
        medallionsLabels.push({
            label: medallion.name,
            value: medallion
        });
    }

    function filter() {
        filteredBuilds.splice(0, filteredBuilds.length);
        builds.splice(0, builds.length);

        const newBuilds = filterBuilds(medallionFilters, reactionFilters, elementsFilters, allAttributesUnlocked, activeLevelThreeAttribute);


        filteredBuilds = [...newBuilds];
        page = 0;
        getNewPageOfFilteredBuilds();
    }

    function getNewPageOfFilteredBuilds() {
        builds = [
            ...builds,
            ...filteredBuilds.splice(size * page, size * (page + 1))
        ];
        page = page+1;
    }
</script>



<div class="filters">
    <div id="column-1">
        <div class="medallions">
            <span>Medallions</span>
            <MultiSelect bind:selected={medallionFilters} options={medallionsLabels} 
                placeholder="Type a medallion name or select it from the list.."
                minSelect={0} maxSelect={4} 
                on:change={ () => { filter()} } >
                <div slot="option" let:option>
                    <div class="multiselect-option">
                        {#await import(`$lib/assets/medallions/${option.value.imageName}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 40px; height: auto;" />
                        {/await}
                        {option.label}
                    </div> 
                </div>

                <div slot="selected" let:option>
                    <div class="multiselect-option-selected">
                        {#await import(`$lib/assets/medallions/${option.value.imageName}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 2rem"/>
                        {/await}
                        {option.label}
                    </div> 
                </div>

            </MultiSelect>
        </div>
        
        <div>
            <label>
                <input type="checkbox" bind:checked={allAttributesUnlocked} on:change={() => { filter()}}/>
                All attributes unlocked
            </label>
        </div>      

        <div> 
            <label>
                <input type="checkbox" bind:checked={activeLevelThreeAttribute} on:change={() => { filter()}}/>
                At least a level three attribute unlocked
            </label>
        </div>

    </div>
    
    <div>
        <div class="reactions">
            <span>Elements</span>
            <MultiSelect bind:selected={elementsFilters} options={elementsLabels} minSelect={0} maxSelect={3} on:change={ () => { filter()} }>
                <div slot="option" let:option>
                    <div class="multiselect-option">
                        {#await import(`$lib/assets/elements/${option.value.toLowerCase()}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 1.4rem"/>
                        {/await}
                        {option.label}
                    </div> 
                </div>
                <div slot="selected" let:option>
                    <div class="multiselect-option-selected">
                        {#await import(`$lib/assets/elements/${option.value.toLowerCase()}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 1.4rem"/>
                        {/await}
                        {option.label}
                    </div> 
                </div>
            </MultiSelect>
        </div>

        <div class="reactions">
            <span>Reactions</span>
            <MultiSelect bind:selected={reactionFilters} options={reactionsLabels} minSelect={0} maxSelect={1} on:change={ () => { filter()} }>
                <div slot="option" let:option>
                    <div class="multiselect-option">
                        {#await import(`$lib/assets/elements/${option.value.elements[0].toLowerCase()}+${option.value.elements[1].toLowerCase()}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 1.4rem"/>
                        {/await}
                        {option.label}
                    </div> 
                </div>
                <div slot="selected" let:option>
                    <div class="multiselect-option-selected">
                        {#await import(`$lib/assets/elements/${option.value.elements[0].toLowerCase()}+${option.value.elements[1].toLowerCase()}.png`) then { default: src }}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img {src} alt="Image" style="width: 1.4rem"/>
                        {/await}
                        {option.label}
                    </div> 
                </div>
            </MultiSelect>
        </div>
    </div>

    

    <!--<div>
        <label>
            <input type="checkbox" bind:checked={allAttributesUnlocked} on:change={() => { filter()}}/>
            All attributes unlocked
        </label>
           
    </div>
    -->
</div>


<style lang="scss">
    .filters {
        display: grid;
        grid-template-columns: 6fr 4fr;
        gap: 1rem;

        .medallions, .reactions {
            display: grid;
            grid-template-columns: 1fr 6fr;
            align-items: baseline;
            gap: 1rem;
        }
        
    }

    .multiselect-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: #2A2A2A;
        font-family: 'rogue_pop';
        text-transform: uppercase;

        &-selected {
            color: #dddddd;
            font-family: 'rogue_pop';
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 4px;
        }
    }

</style>