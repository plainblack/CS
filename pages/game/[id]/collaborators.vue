<template>
    <PanelFrame :title="`${game.props?.name} Collaborators`">
        <template #left>
            <PanelNav :links="links" :buttons="buttons" />
        </template>
        <template #content>
            <PanelZone v-if="game.props" title="Existing Collaborators">
                <DataTable :value="collaborators.records" stripedRows
                    @sort="(e) => collaborators.sortDataTable(e)">
                    <Column field="props.userId" header="User Id" sortable>
                        <template #body="slotProps">
                            <UserProfileLink :user="slotProps.data.related?.user" />
                        </template>
                    </Column>
                    <Column field="props.createdAt" header="Added At" sortable>
                        <template #body="slotProps">
                            {{ formatDateTime(slotProps.data.props.createdAt) }}
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
            </PanelZone>
            <PanelZone title="Add a Collaborator">
                <InputGroup>
                    <InputGroupAddon>
                        <i class="pi pi-search" />
                    </InputGroupAddon>
                    <AutoComplete v-model="selectedCollaborator" optionLabel="label"
                        :suggestions="users.recordsAsOptions('meta', 'displayName')"
                        placeholder="type a username or email address"
                        @complete="async (e) => await users.search({ query: { search: e.query.trim() } })"
                        @item-select="validateAndCreateCollaborator">
                        <template #option="item">
                            <UserAvatar :user="users.find(item.option.value)" />
                        </template>
                    </AutoComplete>
                </InputGroup>
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
onBeforeRouteLeave(() => game.dispose());
onBeforeRouteLeave(() => collaborators.dispose());
const selectedCollaborator = ref();
const users = useVingKind({
    listApi: `/api/${restVersion()}/user`,
    createApi: `/api/${restVersion()}/user`,
    query: { includeMeta: true, sortBy: 'username' },
});
await users.search();
onBeforeRouteLeave(() => users.dispose());
const notify = useNotifyStore();

const validateAndCreateCollaborator = (e) => {
    const userId = e.value.value;
    if (userId == currentUser.props.id) {
        notify.warn('Cannot add self as collaborator.');
        return;
    }
    if (collaborators.records.find(r => userId == r.props.userId)) {
        notify.warn('That user is already a collaborator.');
    }
    else {
        collaborators.create({ userId });
    }
}
const links = useGameLinks(game);
const buttons = useGameButtons(game);

</script>