<template>
    <Button type="button" severity="secondary" class="p-button-sm p-1" @mousedown="toggle">{{label}}</Button>

    <OverlayPanel ref="op" class="surface-ground">
      <div class="max-h-10rem overflow-scroll">
        <div v-for="(variable, index) in sortedList" :key="index" class="mb-2">
          <div v-if="variable.header"><b>{{variable.header}}</b></div>
          <div v-else @mousedown="takeAction(variable.value)" class="cursor-pointer" v-html="variable.label"></div>
        </div>
      </div>
    </OverlayPanel>
</template>
  
<script setup>
const props = defineProps({
    label: String,
    variables: Object,
    sort: {
        type: Boolean,
        default : false,
    },
    wrap: {
        type: Boolean,
        default : false,
    },
});
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}
const { copy } = useClipboard();
const notify = useNotify();

const takeAction = (text) => {
  let str = text;
  if (props.wrap) {
    str = '{{ ' + text + ' }}';
  }
  copy(str);
  notify.info(`Copied ${str} to Clipboard`);
  toggle();
}

const list = computed(() => {
  if (typeof props.variables[0] == 'object') {
    return props.variables;
  } else {
    let list = [];
    for (let variable of props.variables) {
      list.push({
        value: variable,
        label: variable,
      });
    }
    return list;
  }
});

const sortedList = computed(() => {
  if (props.sort) {
    return list.value.slice(0).sort((a, b) => (a.label > b.label ? 1 : -1));
  }
  return list.value;
});
</script>
  