export const recalcRow = (row, schema) => {
  let s = schema ? schema : useDataset().props.rowSchema;
  const gameTemplateVars = useGameTemplateVars();
  console.log(gameTemplateVars.value)
  return templateEngine.process({
    images: {}, // context.getters.imageTemplateVars,
    game: gameTemplateVars.value,
    dataset: {}, //context.getters.datasetTemplateVars,
    _type: 'row',
    _object: row,
    _schema: s,
  })
}