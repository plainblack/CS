/**
 * Creates a data structure for game's naivigation buttons.
 * @returns {object[]} An array of objects to be used with the PanelNav component.
 * @example
 * useGameButtons()
 */

export default (game) => {
    const buttons = computed(() => {
        const out = [
            { label: 'Back to Games', to: '/game', icon: 'ph:arrow-left', severity: 'primary' },
            { label: 'Delete', action: game?.delete, icon: 'ph:trash', severity: 'danger' },
        ];
        return out;
    });
    return buttons;
}