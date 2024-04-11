import { useKind } from '#ving/record/utils.mjs';
import { describeParams, obtainSession, getBody } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const { id } = getRouterParams(event);
    const game = await games.findOrDie(id);
    const session = obtainSession(event);
    await game.canEdit(session);
    await game.updateAndVerify(await getBody(event), session);
    return game.describe(describeParams(event, session));
});