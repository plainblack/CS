<template>
    <div class="surface-ground px-4 md:px-6 lg:px-8">
        <h1> {{ game.props?.name }} Archives</h1>

        <div class="p-fluid flex flex-column lg:flex-row">
            <GameNav :game="game" />
            <div v-if="game.props" class="flex-auto">
                <div class="surface-card p-5 border-1 surface-border border-round">

                    <div class="flex gap-5 flex-column-reverse md:flex-row">
                        <div class="flex-auto p-fluid">




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

const dt = useDateTime();

</script>