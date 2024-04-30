<template>
    <div class="surface-ground px-4 md:px-6 lg:px-8">
        <h1> {{ game.props?.name }} Settings</h1>

        <div class="flex flex-column lg:flex-row">
            <GameNav :game="game" />
            <div v-if="game.props" class="flex-auto">
                <div class="surface-card p-5 border-1 surface-border border-round">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto">
                            <div class="mb-4">
                                <FormInput name="name" type="text" v-model="game.props.name" required label="Name"
                                    @change="game.save('name')" />
                            </div>
                            <div class="mb-4">
                                <FormInput type="select" name="archived" :options="game.options?.archived"
                                    v-model="game.props.archived" label="Archived" @change="game.save('archived')" />
                            </div>
                            <div class="mb-4">
                                <FormInput name="collection" type="text" v-model="game.props.collection"
                                    label="Collection" @change="game.save('collection')" />
                            </div>

                            <div class="mb-4">
                                <FormInput name="notes" type="textarea" v-model="game.props.notes" label="Notes"
                                    @change="game.save('notes')" />
                            </div>
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
</script>