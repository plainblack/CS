<template>
    <PanelFrame :title="`${game.props?.name} Settings`">
        <template #left>
            <PanelNav :links="links" :buttons="buttons" />
        </template>
        <template #content>
            <PanelZone v-if="game.props">
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
const game = useVingRecord({
    id,
    fetchApi: `/api/${useRestVersion()}/game/${id}`,
    query: { includeMeta: true, includeOptions: true },
    async onDelete() {
        await navigateTo('/game');
    },
});
await game.fetch();
onBeforeRouteLeave(() => game.dispose());
const links = useGameLinks(game);
const buttons = useGameButtons(game);
</script>