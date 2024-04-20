<template>

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