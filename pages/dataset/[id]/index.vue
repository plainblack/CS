<template>
    <Crumbtrail :crumbs="breadcrumbs" />
    <h1>{{dataset.props?.name}}</h1>
    <div v-if="dataset.props?.id" class="surface-card p-4 border-1 surface-border border-round flex-auto">
        
            <div><b>Id</b>: {{dataset.props?.id}} <CopyToClipboard :text="dataset.props?.id" /></div>
            
            <div><b>Created At</b>: {{dt.formatDateTime(dataset.props?.createdAt)}}</div>
            
            <div><b>Updated At</b>: {{dt.formatDateTime(dataset.props?.updatedAt)}}</div>
            
            <div><b>Name</b>: {{dataset.props?.name}}</div>
            
            <div><b>Enumerate On</b>: {{dataset.props?.enumerateOn}}</div>
            
            <div><b>Sheets Url</b>: {{dataset.props?.sheetsUrl}}</div>
            
            <div><b>Fields</b>: {{dataset.props?.fields}}</div>
            
            <div><b>Field Schema</b>: {{dataset.props?.fieldSchema}}</div>
            
            <div><b>Row Field Order</b>: {{dataset.props?.rowFieldOrder}}</div>
            
            <div><b>Row Schema</b>: {{dataset.props?.rowSchema}}</div>
            
            <div><b>Game Id</b>: {{dataset.props?.gameId}} <CopyToClipboard :text="dataset.props?.gameId" /></div>
            
    </div>
    <div class="mt-3" v-if="dataset.meta?.isOwner">
        <NuxtLink :to="`/dataset/${dataset.props?.id}/edit`" class="no-underline mr-2 mb-2">
            <Button severity="success" title="Edit" alt="Edit Dataset"><i class="pi pi-pencil mr-1"></i> Edit</Button>
        </NuxtLink>
        <Button @click="dataset.delete()" severity="danger" title="Delete" alt="Delete Dataset"><i class="pi pi-trash mr-1"></i> Delete</Button>
    </div>
</template>
  
<script setup>
const route = useRoute();
const id = route.params.id.toString();
const dataset = useVingRecord({
    id,
    fetchApi: `/api/${restVersion()}/dataset/${id}`,
    query: { includeMeta: true, includeOptions: true },
    async onDelete() {
        await navigateTo('/dataset');
    },
});
await dataset.fetch();
onBeforeRouteLeave(() => dataset.dispose());
const dt = useDateTime();
const breadcrumbs = [
    { label: 'Datasets', to: '/dataset' },
    { label: 'View' },
];
</script>