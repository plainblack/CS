<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>Edit Dataset</h1>

    <FieldsetNav v-if="dataset.props">
        <FieldsetItem name="Properties">
            
                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="dataset.props.name" required label="Name" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="enumerateOn" type="text" v-model="dataset.props.enumerateOn"  label="Enumerate On" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="sheetsUrl" type="text" v-model="dataset.props.sheetsUrl"  label="Sheets Url" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="fields" type="text" v-model="dataset.props.fields"  label="Fields" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="fieldSchema" type="text" v-model="dataset.props.fieldSchema"  label="Field Schema" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="rowFieldOrder" type="text" v-model="dataset.props.rowFieldOrder"  label="Row Field Order" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="rowSchema" type="text" v-model="dataset.props.rowSchema"  label="Row Schema" @change="dataset.update()" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="gameId" type="text" v-model="dataset.props.gameId" required label="Game Id" @change="dataset.update()" />
                    </div>
        </FieldsetItem>

        <FieldsetItem name="Statistics">
            
                <div class="mb-4"><b>Id</b>: {{dataset.props?.id}} <CopyToClipboard :text="dataset.props?.id" /></div>
                
            <div class="mb-4"><b>Created At</b>: {{dt.formatDateTime(dataset.props.createdAt)}}</div>
            
            <div class="mb-4"><b>Updated At</b>: {{dt.formatDateTime(dataset.props.updatedAt)}}</div>
            
        </FieldsetItem>

        <FieldsetItem name="Actions">
            <NuxtLink :to="`/dataset/${dataset.props?.id}`" class="no-underline">
                <Button title="View" alt="View Dataset" class="mr-2 mb-2"><i class="pi pi-eye mr-1"></i> View</Button>
            </NuxtLink>
            <Button @click="dataset.delete()" severity="danger" class="mr-2 mb-2" title="Delete" alt="Delete Dataset"><i class="pi pi-trash mr-1"></i> Delete</Button>
        </FieldsetItem>

    </FieldsetNav>
</template>
  
<script setup>
definePageMeta({
    middleware: ['auth']
});
const route = useRoute();
const dt = useDateTime();
const notify = useNotifyStore();
const id = route.params.id.toString();
const dataset = useVingRecord({
    id,
    fetchApi: `/api/${restVersion()}/dataset/${id}`,
    createApi: `/api/${restVersion()}/dataset`,
    query: { includeMeta: true, includeOptions: true },
    onUpdate() {
        notify.success('Updated Dataset.');
    },
    async onDelete() {
        await navigateTo('/dataset');
    },
});
await dataset.fetch()
onBeforeRouteLeave(() => dataset.dispose());

const breadcrumbs = [
    { label: 'Datasets', to: '/dataset' },
    { label: 'View', to: '/dataset/'+dataset.props.id },
    { label: 'Edit' },
];
</script>