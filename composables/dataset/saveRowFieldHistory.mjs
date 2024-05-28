export default async (row, field) => {
    versionFieldHistory(row.props, [field]);
    row.props = recalcRow(row.props);
    await row.save('fields');
}