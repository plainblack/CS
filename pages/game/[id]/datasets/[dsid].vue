<template>
    <Toolbar>
        <template #start>
            <NuxtLink :to="`/game/${game.props?.id}/datasets`" class="mr-2 no-underline">
                <Button severity="secondary" title="Back" alt="Back to Game" class="p-button-sm p-1"><Icon name="dashicons:exit"/>Back to Game</Button>
            </NuxtLink>
        </template>
        <template #center></template>
        <template #end></template>
    </Toolbar>

    <div class="px-0 py-4 md:px-4">
        <div style="min-height: 20rem">

        </div>
    </div>
{{ game.props?.name }} /
{{ dataset.props?.name }} /
{{ rows.records.length }}

</template>
<script setup>
definePageMeta({
    middleware: ['auth'],
    layout: 'empty',
});
const route = useRoute();
const dt = useDateTime();
const notify = useNotifyStore();
const gameId = route.params.id.toString();
const datasetId = route.params.dsid.toString();
const game = useVingRecord({
    id: gameId,
    fetchApi: `/api/${restVersion()}/game/${gameId}`,
    createApi: `/api/${restVersion()}/game`,
    query: { includeMeta: true, includeOptions: true },
});
await game.fetch()
const dataset = useVingRecord({
    id: datasetId,
    fetchApi: `/api/${restVersion()}/dataset/${datasetId}`,
    createApi: `/api/${restVersion()}/dataset`,
    query: { includeMeta: true, includeOptions: true },
});
const rows = useVingKind({
    listApi: `/api/${restVersion()}/dataset/${datasetId}/rows`,
    createApi: `/api/${restVersion()}/row`,
    query: { includeMeta: true, sortBy: 'name', itemsPerPage: 100 },
    newDefaults: { name: '', gameId },
});
onBeforeRouteLeave(() => {
    game.dispose();
    dataset.dispose();
});
await Promise.all([
    game.fetch(),
    dataset.fetch(),
    rows.all(),
    rows.fetchPropsOptions(),
]);
</script>