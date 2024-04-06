<template>
    <h1>Games</h1>

    <div class="surface-card p-4 border-1 surface-border border-round">

        <div class="p-inputgroup flex-1">
            <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText type="text" placeholder="Search Games" class="w-full" v-model="games.query.search"
                    @keydown.enter="games.search()" />
            </span>
            <Button label="Search" @click="games.search()" />
        </div>

        <DataTable :value="games.records" stripedRows @sort="(e) => games.sortDataTable(e)">

            <Column field="props.id" header="Id" sortable></Column>
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
            <Column field="props.name" header="Name" sortable></Column>
            <Column field="props.notes" header="Notes" sortable></Column>
            <Column field="props.fieldSchema" header="Field Schema" sortable></Column>
            <Column field="props.fields" header="Fields" sortable></Column>
            <Column field="props.userId" header="User Id" sortable></Column>
            <Column field="props.archived" header="Archived" sortable></Column>
            <Column field="props.collection" header="Collection" sortable></Column>
            <Column header="Manage">
                <template #body="slotProps">
                    <NuxtLink :to="`/game/${slotProps.data.props.id}`" class="mr-2 no-underline">
                        <Button icon="pi pi-eye" title="View" alt="View Game" />
                    </NuxtLink>
                    <NuxtLink v-if="slotProps.data.meta?.isOwner" :to="`/game/${slotProps.data.props.id}/edit`"
                        class="mr-2 no-underline">
                        <Button icon="pi pi-pencil" severity="success" title="Edit" alt="Edit Game" />
                    </NuxtLink>
                    <Button v-if="slotProps.data.meta?.isOwner" title="Delete" alt="Delete Game" icon="pi pi-trash"
                        severity="danger" @click="slotProps.data.delete()" />
                </template>
            </Column>
        </DataTable>
        <Pager :kind="games" />
    </div>
    <div class="mt-5 surface-card p-5 border-1 surface-border border-round">
        <h2 class="mt-0">Create Game</h2>

        <Form :send="() => games.create()">
            <div class="flex gap-5 flex-column-reverse md:flex-row">
                <div class="flex-auto p-fluid">

                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="games.new.name" required label="Name" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="userId" type="text" v-model="games.new.userId" required label="User Id" />
                    </div>
                    <div>
                        <Button type="submit" class="w-auto" severity="success">
                            <i class="pi pi-plus mr-1"></i> Create Game
                        </Button>
                    </div>
                </div>

            </div>
        </Form>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth']
});
const dt = useDateTime();
const currentUser = useCurrentUserStore();
const games = useVingKind({
    listApi: `/api/${restVersion()}/game`,
    createApi: `/api/${restVersion()}/game`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc' },
    newDefaults: { name: '', userId: '', archived: false, collection: '' },
});
await Promise.all([
    games.search(),
    games.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => games.dispose());
</script>