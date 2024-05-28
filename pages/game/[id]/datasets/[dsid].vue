<template>
    <Title>{{ dataset.props?.name }} Dataset Editor</Title>
    <div class="flex flex-wrap gap-1">
        <AddRowsCols :dataset="dataset" :rows="rows" />
        <UserPreferences/>
        <BackToDatasets :game="game" />        
    </div>

    <DatasetTable :rows="rows" :dataset="dataset"/>


</template>
<script setup>
definePageMeta({
    middleware: ['auth'],
    layout: 'empty',
});
const route = useRoute();
const notify = useNotify();
const gameId = useGameId(route.params.id.toString());
const game = useGame();
const datasetId = useDatasetId(route.params.dsid.toString());
const dataset = useDataset();
const appendNewRows = useAppendNewRows();;
const rows = useVingKind({
    listApi: `/api/${useRestVersion()}/dataset/${datasetId.value}/rows`,
    createApi: `/api/${useRestVersion()}/row`,
    query: { includeMeta: true, sortBy: 'name', itemsPerPage: 100 },
    newDefaults: { name: '', game: gameId.value, datasetId: datasetId.value },
    unshift : !appendNewRows.value,
    onEach(record) {
        for (const field in dataset.props.rowSchema) {
            record.props.fields[field] = formatFieldType(dataset.props.rowSchema[field].type, record.props.fields[field]);
        }
        record.props = recalcRow(record.props, dataset.props.rowSchema);
    }
});
onBeforeRouteLeave(() => {
    game.dispose();
    dataset.dispose();
    rows.dispose();
});
await Promise.all([
    game.fetch(),
    dataset.fetch(),
    rows.fetchPropsOptions(),
]);
await rows.all();


</script>