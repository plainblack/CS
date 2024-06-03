export const recalcRow = (row, schema) => {
  let s = schema ? schema : useDataset().props.rowSchema;
  const gameTemplateVars = useGameTemplateVars();
  return templateEngine.process({
    images: {}, // context.getters.imageTemplateVars,
    game: gameTemplateVars,
    dataset: {}, //context.getters.datasetTemplateVars,
    _type: 'row',
    _object: row,
    _schema: s,
  })
}