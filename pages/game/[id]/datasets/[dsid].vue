<template>
    <Title>{{ dataset.props?.name }} Dataset Editor</Title>
    <div class="flex flex-wrap gap-1">
        <ManageGameVariables :game="game" />
        <AddRowsCols :dataset="dataset" />
        <UserPreferences/>
        <BackToDatasets :game="game" />        
    </div>

    <DatasetTable :dataset="dataset"/>


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

const formatAllRows = () => {
    for (let i = 0; i < dataset.props.rows.length; i++) {
        for (const field in dataset.props.rowSchema) {
            dataset.props.rows[i].fields[field] = formatFieldType(dataset.props.rowSchema[field].type, dataset.props.rows[i].fields[field]);
        }
    }
}

await Promise.all([
    game.fetch(),
    dataset.fetch(),
]);
recalcGameFields(game);
formatAllRows();
recalcRows(dataset);



const gameTemplateVars = useGameTemplateVars();
const unsubscribeFromGameTemplateVars = gameTemplateVars.$onAction((e) => {
    if (e.name == 'set') {
        e.after((result) => {
            recalcRows(dataset);
        });
    }
  }
);

onBeforeRouteLeave(() => {
    unsubscribeFromGameTemplateVars();
    game.dispose();
    dataset.dispose();
});

</script>