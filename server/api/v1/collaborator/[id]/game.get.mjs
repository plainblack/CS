import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const collaborators = await useKind('Collaborator');
    const { id } = getRouterParams(event);
    const collaborator = await collaborators.findOrDie(id);
    const game = await collaborator.parent('game');
    return await game.describe(describeParams(event));
});