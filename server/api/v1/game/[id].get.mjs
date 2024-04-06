import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const { id } = getRouterParams(event);
    const game = await games.findOrDie(id);
    return game.describe(describeParams(event));
});