<template>
    <Button type="button" severity="secondary" class="p-button-sm p-1" @click="toggle"><Icon name="gravity-ui:layout-cells-large" class="mr-1" /> Cells</Button>

    <OverlayPanel ref="op" class="surface-ground">
        <div class="flex flex-wrap gap-4">
            <div class="flex-grow-1">
                <PanelZone title="Add Column" class="mb-0">
                    <Form>
                        <FormInput name="fieldName" type="text" v-model="fieldName" label="Field Name" required class="mb-3" subtext="No spaces or special characters other than underscore _." />
                        <FormInput name="fieldType" type="select" v-model="fieldType" :options="fieldTypes()" label="Field Type" class="mb-3" />
                        <Button severity="success">
                            <Icon name="mdi:table-column-add-after" class="mr-1" /> Add Column
                        </Button>
                    </Form>
                </PanelZone>
            </div>
            <div class="flex-grow-1">
                <PanelZone title="Add Rows">
                    <InputNumber showButtons v-model="quantityOfRowsToAdd" required />
                    <Button severity="success" class="ml-1">
                        <Icon name="mdi:table-row-add-before" class="mr-1" /> Add Rows
                    </Button>
                </PanelZone>

                <PanelZone title="Start Over">
                    <Button severity="danger">
                        <Icon name="ph:trash" class="mr-1" /> Delete All Rows
                    </Button>
                </PanelZone>
            </div>
        </div>

    </OverlayPanel>
</template>
<script setup>
const quantityOfRowsToAdd = ref(1);
//const fieldTypes = fieldTypes();
const fieldType = ref('str');
const fieldName = ref();
const op = ref();
const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event) => {
    op.value.toggle(event);
}
</script>