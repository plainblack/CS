import { defineStore } from 'pinia';

export default defineStore('gameTemplateVars', {
    state: () => ({
         name : 'not initialized yet', 
         vars : {}
    }),
    actions : {
        set(game) {
            this.name = game.props.name;
            this.vars = {};
            for (let param of Object.keys(game.props.fieldSchema)) {
                this.vars[param] = game.props.fields[param].calcValue;
            }
        }
    }
});