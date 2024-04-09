<template>
    <h1>Games</h1>

    <div class="surface-card p-4 border-1 surface-border border-round">

        <InputGroup>
            <InputGroupAddon>
                <i class="pi pi-search" />
            </InputGroupAddon>
            <InputText type="text" placeholder="Search Games" class="w-full" v-model="games.query.search"
                @keydown.enter="games.search()" />
            <Button label="Search" @click="games.search()" />
        </InputGroup>

        <DataTable :value="games.records" stripedRows @sort="(e) => games.sortDataTable(e)">

            <Column field="props.name" header="Name" sortable>
                <template #body="slotProps">
                    <NuxtLink :to="`/game/${slotProps.data.props.id}`" v-ripple>
                        {{ slotProps.data.props.name }}
                    </NuxtLink>
                </template>
            </Column>
            <Column field="props.archived" header="Archived" sortable>
                <template #body="slotProps">
                    {{ enum2label(slotProps.data.props.archived, games.propsOptions.archived) }}
                </template>
            </Column>
            <Column field="props.collection" header="Collection" sortable></Column>
            <Column header="Manage">
                <template #body="slotProps">
                    <NuxtLink :to="`/game/${slotProps.data.props.id}`" class="mr-2 no-underline">
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
    query: { includeMeta: true, sortBy: 'name', sortOrder: 'asc' },
    newDefaults: { name: '', userId: currentUser.props?.id },
});
await Promise.all([
    games.search(),
    games.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => games.dispose());
</script>