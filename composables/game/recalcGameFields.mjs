export const recalcGameFields = (game) => {
  let g = game ? game : useGame();
  g.props = templateEngine.process({
    _type: 'gameFields',
    _object: g.props,
    _schema: g.props.fieldSchema,
  })
  useGameTemplateVars(game);
}