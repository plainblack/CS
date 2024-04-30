<template>
    <h1>Rows</h1>

    <div class="surface-card p-4 border-1 surface-border border-round">

        <InputGroup>
            <InputGroupAddon>
                <i class="pi pi-search" />
            </InputGroupAddon>
            <InputText type="text" placeholder="Rows" class="w-full"
                v-model="rows.query.search" @keydown.enter="rows.search()" />
            <Button label="Search" @click="rows.search()" />
        </InputGroup>

        <DataTable :value="rows.records" stripedRows @sort="(e) => rows.sortDataTable(e)">
            
            <Column field="props.id" header="Id" sortable>
                <template #body="slotProps">
                    <NuxtLink :to="`/row/${slotProps.data.props.id}`" v-ripple>
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
                    <NuxtLink :to="`/row/${slotProps.data.props.id}`" v-ripple>
                        {{ slotProps.data.props.name }}
                    </NuxtLink>
                </template>
            </Column>
            <Column field="props.quantity" header="Quantity" sortable></Column>
            <Column field="props.fields" header="Fields" sortable></Column>
            <Column field="props.datasetId" header="Dataset Id" sortable></Column>
            <Column header="Manage">
                <template #body="slotProps">
                    <NuxtLink :to="`/row/${slotProps.data.props.id}`" class="mr-2 no-underline">
                        <Button icon="pi pi-eye"  title="View" alt="View Row" />
                    </NuxtLink>
                    <NuxtLink v-if="slotProps.data.meta?.isOwner" :to="`/row/${slotProps.data.props.id}/edit`" class="mr-2 no-underline">
                        <Button icon="pi pi-pencil" severity="success" title="Edit" alt="Edit Row" />
                    </NuxtLink>
                    <Button v-if="slotProps.data.meta?.isOwner"  title="Delete" alt="Delete Row" icon="pi pi-trash" severity="danger" @click="slotProps.data.delete()" />
                </template>
            </Column>
        </DataTable>
        <Pager :kind="rows" />
    </div>
    <div class="mt-5 surface-card p-5 border-1 surface-border border-round">
        <h2 class="mt-0">Create Row</h2>

        <Form :send="() => rows.create()">
            <div class="flex gap-5 flex-column-reverse md:flex-row">
                <div class="flex-auto">
                    
                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="rows.new.name" required label="Name" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="datasetId" type="text" v-model="rows.new.datasetId" required label="Dataset Id" />
                    </div>
                    <div>
                        <Button type="submit" class="w-auto" severity="success">
                        <i class="pi pi-plus mr-1"></i> Create Row
                        </Button>
                    </div>
                </div>

            </div>
        </Form>
    </div>
</template>

<script setup>
const dt = useDateTime();
const rows = useVingKind({
    listApi: `/api/${restVersion()}/row`,
    createApi: `/api/${restVersion()}/row`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc' },
    newDefaults: { name: '', datasetId: '' },
});
await Promise.all([
    rows.search(),
    rows.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => rows.dispose());
</script>