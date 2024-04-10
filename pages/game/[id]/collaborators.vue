<template>
    <div class="surface-ground px-4 md:px-6 lg:px-8">
        <h1> {{ game.props?.name }} Collaborators</h1>

        <div class="p-fluid flex flex-column lg:flex-row">
            <GameNav :game="game" />
            <div v-if="game.props" class="flex-auto">
                <div class="surface-card p-5 border-1 surface-border border-round">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto p-fluid">
                            <h2 class="mt-0">Existing Collaborators</h2>

                            <DataTable :value="collaborators.records" stripedRows
                                @sort="(e) => collaborators.sortDataTable(e)">
                                <Column field="props.userId" header="User Id" sortable>
                                    <template #body="slotProps">
                                        <UserProfileLink :user="slotProps.data.related?.user" />
                                    </template>
                                </Column>
                                <Column field="props.createdAt" header="Created At" sortable>
                                    <template #body="slotProps">
                                        {{ dt.formatDateTime(slotProps.data.props.createdAt) }}
                                    </template>
                                </Column>
                                <Column header="Remove">
                                    <template #body="slotProps">
                                        <Button v-if="slotProps.data.meta?.isOwner" title="Remove"
                                            alt="Remove Collaborator" icon="pi pi-trash" severity="danger"
                                            @click="slotProps.data.delete()" />
                                    </template>
                                </Column>
                            </DataTable>
                            <Pager :kind="collaborators" />


                        </div>
                    </div>
                </div>

                <div class="surface-card p-5 border-1 surface-border border-round mt-5">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto p-fluid">


                            <h2 class="mt-0">Add a Collaborator</h2>
                            <AutoComplete v-model="selectedCollaborator" optionLabel="label"
                                :suggestions="users.recordsAsOptions('meta', 'displayName')"
                                @complete="async (e) => await users.search({ query: { search: e.query.trim() } })"
                                @item-select="(e) => collaborators.create({ userId: e.value.value })" />

                            <Form :send="() => collaborators.create()">
                                <div class="flex gap-5 flex-column-reverse md:flex-row">
                                    <div class="flex-auto p-fluid">

                                        <div class="mb-4">
                                            <FormInput name="gameId" type="text" v-model="collaborators.new.gameId"
                                                required label="Game Id" />
                                        </div>
                                        <div class="mb-4">
                                            <FormInput name="userId" type="text" v-model="collaborators.new.userId"
                                                required label="User Id" />
                                        </div>
                                        <div>
                                            <Button type="submit" class="w-auto" severity="success">
                                                <i class="pi pi-plus mr-1"></i> Create Collaborator
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
const currentUser = useCurrentUserStore();
const game = useVingRecord({
    id,
    fetchApi: `/api/${restVersion()}/game/${id}`,
    query: { includeMeta: true, includeOptions: true },
    async onDelete() {
        await navigateTo('/game');
    },
});
const collaborators = useVingKind({
    listApi: `/api/${restVersion()}/collaborator`,
    createApi: `/api/${restVersion()}/collaborator`,
    query: { includeMeta: true, sortBy: 'createdAt', sortOrder: 'desc', includeRelated: ['user'] },
    newDefaults: { gameId: id, userId: currentUser.props?.id },
});
await Promise.all([
    game.fetch(),
    collaborators.search(),
    collaborators.fetchPropsOptions(),
]);
onBeforeRouteLeave(() => collaborators.dispose());
const selectedCollaborator = ref();
const users = useVingKind({
    listApi: `/api/${restVersion()}/user`,
    createApi: `/api/${restVersion()}/user`,
    query: { includeMeta: true, sortBy: 'username' },
});
await users.search();
const dt = useDateTime();

</script>