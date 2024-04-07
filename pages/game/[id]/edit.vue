<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>Edit Game</h1>

    <FieldsetNav v-if="game.props">
        <FieldsetItem name="Properties">

            <div class="mb-4">
                <FormInput name="name" type="text" v-model="game.props.name" required label="Name"
                    @change="game.update()" />
            </div>
            <div class="mb-4">
                <FormInput name="notes" type="text" v-model="game.props.notes" label="Notes" @change="game.update()" />
            </div>
            <div class="mb-4">
                <FormInput name="userId" type="text" v-model="game.props.userId" required label="User Id"
                    @change="game.update()" />
            </div>
            <div class="mb-4">
                <FormSelect name="archived" :options="game.options.archived" v-model="game.props.archived"
                    label="Archived" @change="game.update()" />
            </div>
            <div class="mb-4">
                <FormInput name="collection" type="text" v-model="game.props.collection" required label="Collection"
                    @change="game.update()" />
            </div>
        </FieldsetItem>

        <FieldsetItem name="Statistics">

            <div class="mb-4"><b>Id</b>: {{ game.props?.id }}</div>

            <div class="mb-4"><b>Created At</b>: {{ dt.formatDateTime(game.props.createdAt) }}</div>

            <div class="mb-4"><b>Updated At</b>: {{ dt.formatDateTime(game.props.updatedAt) }}</div>

            <div class="mb-4"><b>Field Schema</b>: {{ game.props?.fieldSchema }}</div>

            <div class="mb-4"><b>Fields</b>: {{ game.props?.fields }}</div>

        </FieldsetItem>

        <FieldsetItem name="Actions">
            <NuxtLink :to="`/game/${game.props?.id}`" class="no-underline">
                <Button title="View" alt="View Game" class="mr-2 mb-2"><i class="pi pi-eye mr-1"></i> View</Button>
            </NuxtLink>
            <Button @click="game.delete()" severity="danger" class="mr-2 mb-2" title="Delete" alt="Delete Game"><i
                    class="pi pi-trash mr-1"></i> Delete</Button>
        </FieldsetItem>

    </FieldsetNav>
</template>

<script setup>
definePageMeta({
    middleware: ['auth']
});
const route = useRoute();
const dt = useDateTime();
const notify = useNotifyStore();
const id = route.params.id.toString();
const game = useVingRecord({
    id,
    fetchApi: `/api/${restVersion()}/game/${id}`,
    createApi: `/api/${restVersion()}/game`,
    query: { includeMeta: true, includeOptions: true },
    onUpdate() {
        notify.success('Updated Game.');
    },
    async onDelete() {
        await navigateTo('/game');
    },
});
await game.fetch()
onBeforeRouteLeave(() => game.dispose());

const breadcrumbs = [
    { label: 'Games', to: '/game' },
    { label: 'View', to: '/game/' + game.props.id },
    { label: 'Edit' },
];
</script>