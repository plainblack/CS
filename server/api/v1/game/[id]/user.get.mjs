import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const { id } = getRouterParams(event);
    const game = await games.findOrDie(id);
    const user = await game.parent('user');
    return await user.describe(describeParams(event));
});