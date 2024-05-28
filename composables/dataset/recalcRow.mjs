export const recalcRow = (row, schema) => {
  let s = schema ? schema : useDataset().props.rowSchema;
  return templateEngine.process({
    images: {}, // context.getters.imageTemplateVars,
    game: {}, //context.getters.gameTemplateVars,
    dataset: {}, //context.getters.datasetTemplateVars,
    _type: 'row',
    _object: row,
    _schema: s,
  })
}