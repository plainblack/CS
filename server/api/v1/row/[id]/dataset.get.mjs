import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const rows = await useKind('Row');
    const { id } = getRouterParams(event);
    const row = await rows.findOrDie(id);
    const dataset = await row.parent('dataset');
    return await dataset.describe(describeParams(event));
});