import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const game = await games.createAndVerify(await getBody(event), session);
    return game.describe(describeParams(event, session));
});