<template>
    <Button @mousedown="navigateTo(`/game/${game.props?.id}/datasets`)" severity="secondary" title="Back" alt="Back to Game" class="p-button-sm p-1"><Icon name="dashicons:exit"/><span v-if="toolbarLabels" class="ml-1 hidden md:block white-space-nowrap">Back to Game</span></Button>
</template>
<script setup>
const props = defineProps({
      game: Object,
});
const toolbarLabels = useToolbarLabels();
</script>