<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>{{row.props?.name}}</h1>
    <div v-if="row.props?.id" class="surface-card p-4 border-1 surface-border border-round flex-auto">
        
            <div><b>Id</b>: {{row.props?.id}} <CopyToClipboard :text="row.props?.id" /></div>
            
            <div><b>Created At</b>: {{formatDateTime(row.props?.createdAt)}}</div>
            
            <div><b>Updated At</b>: {{formatDateTime(row.props?.updatedAt)}}</div>
            
            <div><b>Name</b>: {{row.props?.name}}</div>
            
            <div><b>Quantity</b>: {{row.props?.quantity}}</div>
            
            <div><b>Fields</b>: {{row.props?.fields}}</div>
            
            <div><b>Dataset Id</b>: {{row.props?.datasetId}} <CopyToClipboard :text="row.props?.datasetId" /></div>
            
    </div>
    <div class="mt-3" v-if="row.meta?.isOwner">
        <NuxtLink :to="`/row/${row.props?.id}/edit`" class="no-underline mr-2 mb-2">
            <Button severity="success" title="Edit" alt="Edit Row"><i class="pi pi-pencil mr-1"></i> Edit</Button>
        </NuxtLink>
        <Button @mousedown="row.delete()" severity="danger" title="Delete" alt="Delete Row"><i class="pi pi-trash mr-1"></i> Delete</Button>
    </div>
</template>
  
<script setup>
const route = useRoute();
const id = route.params.id.toString();
const row = useVingRecord({
    id,
    fetchApi: `/api/${useRestVersion()}/row/${id}`,
    query: { includeMeta: true, includeOptions: true },
    async onDelete() {
        await navigateTo('/row');
    },
});
await row.fetch();
onBeforeRouteLeave(() => row.dispose());
const breadcrumbs = [
    { label: 'Rows', to: '/row' },
    { label: 'View' },
];
</script>