export default (game) => {
    const gameTemplateVars = useState('gameTemplateVars');
    if (game) {
        let vars = {name: game.props.name, vars: {}};
        for (let param of Object.keys(game.props.fieldSchema)) {
            vars.vars[param] = game.props.fields[param].calcValue;
        }
        gameTemplateVars.value = vars;
    }
    return gameTemplateVars;
}