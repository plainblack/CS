export const recalcRow = (schema, row) => templateEngine.process({
    images: {}, // context.getters.imageTemplateVars,
    game: {}, //context.getters.gameTemplateVars,
    dataset: {}, //context.getters.datasetTemplateVars,
    _type: 'row',
    _object: row,
    _schema: schema,
  })