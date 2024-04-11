<template>
    <h1>Datasets</h1>

    <div class="surface-card p-4 border-1 surface-border border-round">

        <InputGroup>
            <InputGroupAddon>
                <i class="pi pi-search" />
            </InputGroupAddon>
            <InputText type="text" placeholder="Datasets" class="w-full"
                v-model="datasets.query.search" @keydown.enter="datasets.search()" />
            <Button label="Search" @click="datasets.search()" />
        </InputGroup>

        <DataTable :value="datasets.records" stripedRows @sort="(e) => datasets.sortDataTable(e)">
            
            <Column field="props.id" header="Id" sortable>
                <template #body="slotProps">
                    <NuxtLink :to="`/dataset/${slotProps.data.props.id}`" v-ripple>
                        {{ slotProps.data.props.id }}
                    </NuxtLink>
                </template>
            </Column>
            <Column field="props.createdAt" header="Created At" sortable>
                <template #body="slotProps">
                    {{ dt.formatDateTime(slotProps.data.props.createdAt) }}
                </template>
            </Column>
            <Column field="props.updatedAt" header="Updated At" sortable>
                <template #body="slotProps">
                    {{ dt.formatDateTime(slotProps.data.props.updatedAt) }}
                </template>
            </Column>
            <Column field="props.name" header="Name" sortable>
                <template #body="slotProps">
                    <NuxtLink :to="`/dataset/${slotProps.data.props.id}`" v-ripple>
                        {{ slotProps.data.props.name }}
                    </NuxtLink>
                </template>
            </Column>
            <Column field="props.enumerateOn" header="Enumerate On" sortable></Column>
            <Column field="props.sheetsUrl" header="Sheets Url" sortable></Column>
            <Column field="props.fields" header="Fields" sortable></Column>
            <Column field="props.fieldSchema" header="Field Schema" sortable></Column>
            <Column field="props.rowFieldOrder" header="Row Field Order" sortable></Column>
            <Column field="props.rowSchema" header="Row Schema" sortable></Column>
            <Column field="props.gameId" header="Game Id" sortable></Column>
            <Column header="Manage">
                <template #body="slotProps">
                    <NuxtLink :to="`/dataset/${slotProps.data.props.id}`" class="mr-2 no-underline">
                        <Button icon="pi pi-eye"  title="View" alt="View Dataset" />
                    </NuxtLink>
                    <NuxtLink v-if="slotProps.data.meta?.isOwner" :to="`/dataset/${slotProps.data.props.id}/edit`" class="mr-2 no-underline">
                        <Button icon="pi pi-pencil" severity="success" title="Edit" alt="Edit Dataset" />
                    </NuxtLink>
                    <Button v-if="slotProps.data.meta?.isOwner"  title="Delete" alt="Delete Dataset" icon="pi pi-trash" severity="danger" @click="slotProps.data.delete()" />
                </template>
            </Column>
        </DataTable>
        <Pager :kind="datasets" />
    </div>
    <div class="mt-5 surface-card p-5 border-1 surface-border border-round">
        <h2 class="mt-0">Create Dataset</h2>

        <Form :send="() => datasets.create()">
            <div class="flex gap-5 flex-column-reverse md:flex-row">
                <div class="flex-auto p-fluid">
                    
                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="datasets.new.name" required label="Name" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="gameId" type="text" v-model="datasets.new.gameId" required label="Game Id" />
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
</template>

<script setup>
const dt = useDateTime();
const datasets = useVingKind({
    listApi: `/api/${restVersion()}/dataset`,
    createApi: `/api/${restVersion()}/dataset`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc' },
    newDefaults: { name: '', gameId: '' },
});
await Promise.all([
    datasets.search(),
    datasets.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => datasets.dispose());
</script>