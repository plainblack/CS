<template>
    
    <NuxtLink :to="`/game/${game.props?.id}/datasets`" class="mr-2 no-underline">
        <Button severity="secondary" title="Back" alt="Back to Game" class="p-button-sm p-1"><Icon name="dashicons:exit"/>Back to Game</Button>
    </NuxtLink>

    <AddRowsCols/>
        
    <button @click="rename" class="ml-5">Rename</button>  <button @click="addRow" class="ml-5">Add Row</button>     {{ rows.records.length }}

    <DatasetTable :rows="rows" :dataset="dataset"/>


</template>
<script setup>
definePageMeta({
    middleware: ['auth'],
    layout: 'empty',
});
const route = useRoute();
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

function addRow() {
    rows.create({name: 'Untitled'+Math.random().toString()})
}


function rename() {
    rows.records[0].props.name = 'Untitled'+Math.random().toString();
    rows.records[0].save('name');
}



</script>