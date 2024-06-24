<template>
  <Shortcut :variables="variables" label="history"></Shortcut>
</template>
  
<script setup>
const props = defineProps({
  variables: Object,
});
</script>
