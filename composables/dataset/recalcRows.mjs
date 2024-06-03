export const recalcRows = (rows, schema) => {
  let s = schema ? schema : useDataset().props.rowSchema;
  for (const record of rows.records) {
    record.props = recalcRow(record.props, s);
  }
}