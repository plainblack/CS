<template>
    <Button type="button" severity="secondary" class="p-button-sm p-1" @mousedown="toggle"><Icon name="jam:dice" /> <span v-if="toolbarLabels" class="ml-1 hidden md:block white-space-nowrap">Game</span></Button>

    <OverlayPanel ref="op" class="surface-ground mt-3 mr-3" :showCloseIcon="true">
        <div class="flex flex-wrap gap-4">
            <div class="flex-grow-1">
                <PanelZone title="Add Game Variable" margin="mb-0">
                    <Form>
                        <FormInput :coerce="makeNameSafe" name="fieldName" type="text" v-model="fieldName" label="Name" required class="mb-3" subtext="No spaces or special characters other than underscore _." />
                        <FormInput name="fieldType" type="select" v-model="fieldType" :options="fieldTypes" label="Type" class="mb-3" />
                        <FormInput name="fieldValue" type="text" v-model="fieldValue" label="Value" required class="mb-3" />
                        <Button severity="success" @mousedown="addVariable">
                            <Icon name="mdi:add" class="mr-1" /> Add Game Variable
                        </Button>
                    </Form>
                </PanelZone>
            </div>
            <div class="flex-grow-1">
                <PanelZone title="Existing Variables" margin="mb-0">
                   
                </PanelZone>
            </div>
        </div>
    </OverlayPanel>
</template>
<script setup>
import appendNumberToString from '#ving/utils/appendNumberToString';
const props = defineProps({
    game: Object,
});
const toolbarLabels = useToolbarLabels();
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

const fieldType = ref('str');
const fieldName = ref('');
const fieldValue = ref('');
const makeNameSafe = (userTyped) => {
    let safe = makeWordSafe(userTyped);
    if (safe == '')
        safe = 'A';
    if (safe in props.game.props.fieldSchema)
        return makeNameSafe(appendNumberToString(safe));
    return safe;
};
const addVariable = () => {
    props.game.props.fields[fieldName.value] = formatFieldType(fieldType.value);
    props.game.props.fields[fieldName.value].userValue = fieldValue.value;
    props.game.props.fieldSchema[fieldName.value] = { type : fieldType.value};
    recalcGameFields(props.game);
    props.game.update();
    fieldType.value = 'str';
    fieldName.value = '';
    fieldName.value = '';
};

</script>