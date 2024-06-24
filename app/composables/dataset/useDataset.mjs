export default () => {
    const datasetId = useState('datasetId');
    return useVingRecord({
        id: datasetId.value,
        fetchApi: `/api/${useRestVersion()}/dataset/${datasetId.value}`,
        createApi: `/api/${useRestVersion()}/dataset`,
        query: { includeMeta: true, includeOptions: true },
    });
}