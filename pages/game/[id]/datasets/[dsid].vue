<template>
    <Title>{{ dataset.props?.name }} Dataset Editor</Title>
    <div class="flex flex-wrap gap-1">
        <AddRowsCols :dataset="dataset" :rows="rows" />
        <UserPreferences/>
        <BackToDatasets :game="game" />        
    </div>
    <button @click="rename" class="ml-5">Rename</button>     {{ rows.records.length }}

    <DatasetTable :rows="rows" :dataset="dataset"/>


</template>
<script setup>
definePageMeta({
    middleware: ['auth'],
    layout: 'empty',
});
const route = useRoute();
const notify = useNotify();
const gameId = route.params.id.toString();
const datasetId = route.params.dsid.toString();
const game = useVingRecord({
    id: gameId,
    fetchApi: `/api/${useRestVersion()}/game/${gameId}`,
    createApi: `/api/${useRestVersion()}/game`,
    query: { includeMeta: true, includeOptions: true },
});
await game.fetch()
const dataset = useVingRecord({
    id: datasetId,
    fetchApi: `/api/${useRestVersion()}/dataset/${datasetId}`,
    createApi: `/api/${useRestVersion()}/dataset`,
    query: { includeMeta: true, includeOptions: true },
});
const rows = useVingKind({
    listApi: `/api/${useRestVersion()}/dataset/${datasetId}/rows`,
    createApi: `/api/${useRestVersion()}/row`,
    query: { includeMeta: true, sortBy: 'name', itemsPerPage: 100 },
    newDefaults: { name: '', gameId, datasetId },
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


function rename() {
    rows.records[0].props.name = 'Untitled'+Math.random().toString();
    rows.records[0].save('name');
}



</script>