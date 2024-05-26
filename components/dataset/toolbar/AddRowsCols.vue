<template>
    <Button type="button" severity="secondary" class="p-button-sm p-1" @mousedown="toggle"><Icon name="gravity-ui:layout-cells-large" /> <span v-if="toolbarLabels" class="ml-1 hidden md:block white-space-nowrap">Cells</span></Button>

    <OverlayPanel ref="op" class="surface-ground">
        <div class="flex flex-wrap gap-4">
            <div class="flex-grow-1">
                <PanelZone title="Add Column" margin="mb-0">
                    <Form>
                        <FormInput :coerce="makeNameSafe" name="fieldName" type="text" v-model="fieldName" label="Field Name" required class="mb-3" subtext="No spaces or special characters other than underscore _." />
                        <FormInput name="fieldType" type="select" v-model="fieldType" :options="fieldTypes()" label="Field Type" class="mb-3" />
                        <Button severity="success" @mousedown="addColumn">
                            <Icon name="mdi:table-column-add-after" class="mr-1" /> Add Column
                        </Button>
                    </Form>
                </PanelZone>
            </div>
            <div class="flex-grow-1">
                <PanelZone title="Add Rows">
                    <InputNumber showButtons v-model="quantityOfRowsToAdd" required :min="0" :max="100" />
                    <Button severity="success" class="ml-1" @mousedown="addRows">
                        <Icon name="mdi:table-row-add-before" class="mr-1" /> Add Rows
                    </Button>
                </PanelZone>

                <PanelZone title="Start Over">
                    <Button @mousedown="deleteAllRows" severity="danger">
                        <Icon name="ph:trash" class="mr-1" /> Delete All Rows
                    </Button>
                </PanelZone>
            </div>
        </div>

    </OverlayPanel>
</template>
<script setup>
import appendNumberToString from '#ving/utils/appendNumberToString';
const props = defineProps({
    dataset: Object,
    rows: Object,
});
const toolbarLabels = useToolbarLabels();
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

const notify = useNotify();
const fieldType = ref('str');
const fieldName = ref('');
const addColumn = () => {
    if (fieldName.value == '') {
        notify.warn('You must specify a column name to add a column.');
        return;
    }
    suspendHotRender();
    const rowFieldOrder = props.dataset.props.rowFieldOrder;
    rowFieldOrder.push(fieldName.value);
    const rowSchema = props.dataset.props.rowSchema;
    rowSchema[fieldName.value] = { type : fieldType.value };
    if (fieldType.value == 'image')
        rowSchema[fieldName.value].helper = 'images';
    props.dataset.partialUpdate({
        rowSchema,
        rowFieldOrder,
    });
    resumeHotRender();
    toggle();
    fieldType.value = 'str';
    fieldName.value = '';
};

const makeNameSafe = (userTyped) => {
    let safe = makeWordSafe(userTyped);
    if (safe == '')
        safe = 'A';
    if (['id','quantity','name'].includes(safe))
        safe += '2';
    if (props.dataset.props.rowFieldOrder.includes(safe))
        return makeNameSafe(appendNumberToString(safe));
    return safe;
};

const quantityOfRowsToAdd = ref(1);
const addRows = async () => {
    suspendHotRender();
    for (let i = 0; i < quantityOfRowsToAdd.value; i++) {
        await props.rows.create({name: 'Untitled '+Math.random().toString()});
    }
    toggle();
    resumeHotRender();
    const appendNewRows = useAppendNewRows();
    if (appendNewRows == 'top')
        scrollHotTop();
    else    
        scrollHotBottom();
};

const deleteAllRows = async () => {
    if (confirm('Are you sure you want to delete all rows in this dataset?')) {
        suspendHotRender();
        exportRows(props.dataset, props.rows);
        await props.dataset.call('DELETE', props.dataset.links.rows.href);
        props.rows.reset();
        toggle();
        resumeHotRender();
    }
};


</script>