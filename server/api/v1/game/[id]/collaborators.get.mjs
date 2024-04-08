import { useKind } from '#ving/record/utils.mjs';
import { describeListParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const { id } = getRouterParams(event);
    const game = await games.findOrDie(id);
    const Collaborators = await game.children('collaborators');
    return await collaborators.describeList(describeListParams(event), describeListWhere(event, collaborators.describeListFilter()));
});