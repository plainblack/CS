import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    const { id } = getRouterParams(event);
    const dataset = await datasets.findOrDie(id);
    const game = await dataset.parent('game');
    return await game.describe(describeParams(event));
});