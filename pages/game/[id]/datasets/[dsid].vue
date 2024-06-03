<template>
    <Title>{{ dataset.props?.name }} Dataset Editor</Title>
    <div class="flex flex-wrap gap-1">
        <ManageGameVariables :game="game" />
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
await Promise.all([
    game.fetch(),
    dataset.fetch(),
    rows.fetchPropsOptions(),
]);
recalcGameFields(game);
await rows.all();

const gameTemplateVars = useGameTemplateVars();
const unsubscribeFromGameTemplateVars = gameTemplateVars.$onAction(
    (e) => {
      /*  {
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }*/
    if (e.name == 'set') {
        e.after((result) => {
            
            console.log(`we should recalc rows because ${e.name} was triggered with ${e.store.vars.one} with ${result}`);
        });
    }
  }
)

onBeforeRouteLeave(() => {
    unsubscribeFromGameTemplateVars();
    game.dispose();
    dataset.dispose();
    rows.dispose();
});

</script>