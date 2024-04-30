<template>
    <div class="surface-ground px-4 md:px-6 lg:px-8">
        <h1> {{ game.props?.name }} Datasets</h1>

        <div class="flex flex-column lg:flex-row">
            <GameNav :game="game" />
            <div v-if="game.props" class="flex-auto">
                <div class="surface-card p-5 border-1 surface-border border-round">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto">

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
                                        <NuxtLink v-if="slotProps.data.meta?.isOwner" :to="`/game/${slotProps.data.props.gameId}/datasets/${slotProps.data.props.id}`" class="mr-2 no-underline">
                                            <Button icon="pi pi-pencil" severity="success" title="Edit" alt="Edit Dataset" />
                                        </NuxtLink>
                                        <Button v-if="slotProps.data.meta?.isOwner"  title="Delete" alt="Delete Dataset" icon="pi pi-trash" severity="danger" @click="slotProps.data.delete()" />
                                    </template>
                                </Column>
                            </DataTable>
                            <Pager :kind="datasets" />


                        </div>
                    </div>

                    </div>

                    <div class="surface-card mt-5 p-5 border-1 surface-border border-round">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto">


                            <h2 class="mt-0">Create Dataset</h2>

                                <Form :send="() => datasets.create()">
                                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                                        <div class="flex-auto">
                                            
                                            <div class="mb-4">
                                                <FormInput name="name" type="text" v-model="datasets.new.name" required label="Name" />
                                            </div>
                                            <div>
                                                <Button type="submit" class="w-auto" severity="success">
                                                <i class="pi pi-plus mr-1"></i> Create Dataset
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                </Form>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
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

</script>