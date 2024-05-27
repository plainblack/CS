<template>
  <VariableDropdown :variables="variables" label="history"></VariableDropdown>
</template>
  
<script setup>
const props = defineProps({
  variables: Object,
});
</script>
