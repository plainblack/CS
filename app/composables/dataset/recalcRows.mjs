export const recalcRows = (dataset) => {
  let d = dataset ? dataset : useDataset();
  for (let row of dataset.props.rows) {
    row = recalcRow(row, dataset.props.rowSchema);
  }
}