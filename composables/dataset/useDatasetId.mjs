export default (id) => {
    const datasetId = useState('datasetId');
    if (id)
        datasetId.value = id;
    return datasetId;
}