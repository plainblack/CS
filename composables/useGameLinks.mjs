/**
 * Creates a data structure for game naivigation links.
 * @returns {object[]} An array of objects to be used with the PanelNav component.
 * @example
 * userSettingsLinks()
 */

export default (game) => {
    const links = computed(() => {
        const out = [
            { label: 'Settings', to: `/game/${game.props?.id}`, icon: 'ph:gear' },
            { label: 'Designs', to: `/game/${game.props?.id}/designs`, icon: 'ph:paint-brush' },
            { label: 'Datasets', to: `/game/${game.props?.id}/datasets`, icon: 'ph:table' },
            { label: 'Font Palette', to: `/game/${game.props?.id}/fontpalette`, icon: 'ph:text-aa' },
            { label: 'Archives', to: `/game/${game.props?.id}/archives`, icon: 'ph:folder' },
            { label: 'Exports', to: `/game/${game.props?.id}/exports`, icon: 'ph:export' },
            { label: 'Collaborators', to: `/game/${game.props?.id}/collaborators`, icon: 'ph:user-plus' },
        ];
        return out;
    });
    return links;
}