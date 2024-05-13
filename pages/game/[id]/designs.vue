<template>
    <Title>{{ game.props?.name }} Designs</Title>
    <PanelFrame :title="`${game.props?.name} Designs`">
        <template #left>
            <PanelNav :links="links" :buttons="buttons" />
        </template>
        <template #content>
            <PanelZone v-if="game.props" title="Existing Designs">

            </PanelZone>
            <PanelZone title="Create Design">

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