<template>

    <Sidebar v-model:visible="val" :header="field" position="right" role="region" :modal="false" :dismissable="false">
      {{ row }}

      <div v-if="row && field && row.fields[field]">
      <Message v-if="row.fields[field].hasError" class="mb-2 mt-0" :closable="false" severity="error">{{row.fields[field].error}}</Message>
      
      <div class="mb-2">
        <label for="calcValue">Calculated Value</label>
        <Textarea id="calcValue" v-model="row.fields[field].calcValue" disabled autoResize class="w-full" />
      </div>

      <div class="mb-2">
        <label for="userValue">User Value</label>
        <Textarea id="userValue" v-model="row.fields[field].userValue" autoResize class="w-full" @change="saveRowFieldHistory(row, field)" @focus="suspendHotRender()" @blur="resumeHotRender()" />
      </div>

      <div>Shortcuts</div>
      <div class="flex flex-inline gap-1">
        <TemplateFunctions />
        <FieldHistory :variables="row.fields[field].history" />
      </div>
    </div>

    </Sidebar>
</template>

<script setup>

  const props = defineProps({
      row: Object,
      field: String,
      modelValue: Boolean,
  });
  const emit = defineEmits(['update:modelValue']);
  const val = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
});
</script>