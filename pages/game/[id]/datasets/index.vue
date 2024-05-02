<template>
    <PanelFrame :title="`${game.props?.name} Datasets`">
        <template #left>
            <PanelNav :links="links" :buttons="buttons" />
        </template>
        <template #content>
            <PanelZone v-if="game.props" title="Existing Datasets">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-search" />
                    </InputGroupAddon>
                    <InputText type="text" placeholder="Datasets" class="w-full"
                        v-model="datasets.query.search" @keydown.enter="datasets.search()" />
                    <Button label="Search" @click="datasets.search()" />
                </InputGroup>

                <DataTable :value="datasets.records" stripedRows @sort="(e) => datasets.sortDataTable(e)">
                    <Column field="props.name" header="Name" sortable>
                        <template #body="slotProps">
                            <NuxtLink :to="`/game/${slotProps.data.props.gameId}/datasets/${slotProps.data.props.id}`" v-ripple>
                                {{ slotProps.data.props.name }}
                            </NuxtLink>
                        </template>
                    </Column>
                    <Column field="extra.rowCount" header="Row Count" sortable></Column>
                    <Column field="extra.totalQuantity" header="Total Quantity" sortable></Column>
                    <Column header="Manage">
                        <template #body="slotProps">
                            <ManageButton severity="success" :items="[
                                { to:`/game/${slotProps.data.props.gameId}/datasets/${slotProps.data.props.id}`, label: 'Edit', icon:'ph:pencil' },
                                { action: slotProps.data.delete, label: 'Delete', icon:'ph:trash' },
                            ]" />
                        </template>
                    </Column>
                </DataTable>
                <Pager :kind="datasets" />

            </PanelZone>
            <PanelZone title="Create Dataset">
                <Form :send="() => datasets.create()">
                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="datasets.new.name" required label="Name" />
                    </div>
                    <div>
                        <Button type="submit" class="w-auto" severity="success">
                        <i class="pi pi-plus mr-1"></i> Create Dataset
                        </Button>
                    </div>
                </Form>
            </PanelZone>
        </template>
    </PanelFrame>
</template>


<script setup>
definePageMeta({
    middleware: ['auth']
});
const route = useRoute();
const id = route.params.id.toString();
const game = useVingRecord({
    id,
    fetchApi: `/api/${restVersion()}/game/${id}`,
    query: { includeMeta: true, includeOptions: true },
    async onDelete() {
        await navigateTo('/game');
    },
});
await game.fetch();
onBeforeRouteLeave(() => game.dispose());

const datasets = useVingKind({
    listApi: `/api/${restVersion()}/dataset`,
    createApi: `/api/${restVersion()}/dataset`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc', includeExtra: ['totalQuantity','rowCount'] },
    newDefaults: { name: '', gameId: id },
});
await Promise.all([
    datasets.search(),
    datasets.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => datasets.dispose());

const dt = useDateTime();
const links = useGameLinks(game);
const buttons = useGameButtons(game);

</script>