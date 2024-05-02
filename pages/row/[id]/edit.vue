<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>Edit Row</h1>

    <FieldsetNav v-if="row.props">
        <FieldsetItem name="Properties">
            
                    <div class="mb-4">
                        <FormInput name="name" type="text" v-model="row.props.name" required label="Name" @change="row.save('name')" />
                    </div>
                    <div class="mb-4">
                        <FormInput name="datasetId" type="text" v-model="row.props.datasetId" required label="Dataset Id" @change="row.save('datasetId')" />
                    </div>
        </FieldsetItem>

        <FieldsetItem name="Statistics">
            
                <div class="mb-4"><b>Id</b>: {{row.props?.id}} <CopyToClipboard :text="row.props?.id" /></div>
                
            <div class="mb-4"><b>Created At</b>: {{formatDateTime(row.props.createdAt)}}</div>
            
            <div class="mb-4"><b>Updated At</b>: {{formatDateTime(row.props.updatedAt)}}</div>
            
            <div class="mb-4"><b>Quantity</b>: {{row.props?.quantity}}</div>
            
            <div class="mb-4"><b>Fields</b>: {{row.props?.fields}}</div>
            
        </FieldsetItem>

        <FieldsetItem name="Actions">
            <NuxtLink :to="`/row/${row.props?.id}`" class="no-underline">
                <Button title="View" alt="View Row" class="mr-2 mb-2"><i class="pi pi-eye mr-1"></i> View</Button>
            </NuxtLink>
            <Button @click="row.delete()" severity="danger" class="mr-2 mb-2" title="Delete" alt="Delete Row"><i class="pi pi-trash mr-1"></i> Delete</Button>
        </FieldsetItem>

    </FieldsetNav>
</template>
  
<script setup>
definePageMeta({
    middleware: ['auth']
});
const route = useRoute();
const notify = useNotify();
const id = route.params.id.toString();
const row = useVingRecord({
    id,
    fetchApi: `/api/${useRestVersion()}/row/${id}`,
    createApi: `/api/${useRestVersion()}/row`,
    query: { includeMeta: true, includeOptions: true },
    onUpdate() {
        notify.success('Updated Row.');
    },
    async onDelete() {
        await navigateTo('/row');
    },
});
await row.fetch()
onBeforeRouteLeave(() => row.dispose());

const breadcrumbs = [
    { label: 'Rows', to: '/row' },
    { label: 'View', to: '/row/'+row.props.id },
    { label: 'Edit' },
];
</script>