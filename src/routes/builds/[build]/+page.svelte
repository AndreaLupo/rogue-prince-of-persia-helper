<script lang="ts">
    import { page } from '$app/stores';
    import BuildDetail from '$lib/components/BuildDetail.svelte';
    import { getAllBuilds } from '../../../helpers/build-generator';
    import type { Build } from '../../../types';

    let build: Build;

    page.subscribe(( page => {
        const buildId = page.params.build;

        const builds = getAllBuilds();

        for(const currentBuild of builds) {
            if(currentBuild.hash === buildId) {
                build = currentBuild;
                break;
            }
        }

    }));
</script>

<BuildDetail {build}></BuildDetail>