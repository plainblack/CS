<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>{{ game.props?.name }}</h1>
    <div v-if="game.props?.id" class="surface-card p-4 border-1 surface-border border-round flex-auto">

        <div><b>Id</b>: {{ game.props?.id }}</div>

        <div><b>Created At</b>: {{ dt.formatDateTime(game.props?.createdAt) }}</div>

        <div><b>Updated At</b>: {{ dt.formatDateTime(game.props?.updatedAt) }}</div>

        <div><b>Name</b>: {{ game.props?.name }}</div>

        <div><b>Notes</b>: {{ game.props?.notes }}</div>

        <div><b>Field Schema</b>: {{ game.props?.fieldSchema }}</div>

        <div><b>Fields</b>: {{ game.props?.fields }}</div>

        <div><b>User Id</b>: {{ game.props?.userId }}</div>

        <div><b>Archived</b>: {{ game.props?.archived }}</div>

        <div><b>Collection</b>: {{ game.props?.collection }}</div>

    </div>
    <div class="mt-3" v-if="game.meta?.isOwner">
        <NuxtLink :to="`/game/${game.props?.id}/edit`" class="no-underline mr-2 mb-2">
            <Button severity="success" title="Edit" alt="Edit Game"><i class="pi pi-pencil mr-1"></i> Edit</Button>
        </NuxtLink>
        <Button @click="game.delete()" severity="danger" title="Delete" alt="Delete Game"><i
                class="pi pi-trash mr-1"></i> Delete</Button>
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
const dt = useDateTime();
const breadcrumbs = [
    { label: 'Games', to: '/game' },
    { label: 'View' },
];
</script>