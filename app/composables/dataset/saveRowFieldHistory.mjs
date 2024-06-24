export default async (row, field) => {
    versionFieldHistory(row, [field]);
    const dataset = useDataset();
    row = recalcRow(row, dataset.props.rowSchema);
    await dataset.save('rows');
}