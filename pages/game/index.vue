<template>
    <PanelFrame title="Games">
        <template #content>
            <PanelZone title="Existing Games">
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
                            <ManageButton severity="success" :items="[
                                { to:`/game/${slotProps.data.props.id}`, label: 'Edit', icon:'ph:pencil' },
                                { action: slotProps.data.delete, label: 'Delete', icon:'ph:trash' },
                            ]" />
                        </template>
                    </Column>
                </DataTable>
                <Pager :kind="games" />
            </PanelZone>
            <PanelZone title="Create Game">
                <Form :send="() => games.create()">
                        <div class="mb-4">
                            <FormInput name="name" type="text" v-model="games.new.name" required label="Name" />
                        </div>
                        <div>
                            <Button type="submit" class="w-auto" severity="success">
                                <i class="pi pi-plus mr-1"></i> Create Game
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