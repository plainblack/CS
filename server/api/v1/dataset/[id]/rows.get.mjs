import { useKind } from '#ving/record/utils.mjs';
import { describeListParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    const { id } = getRouterParams(event);
    const dataset = await datasets.findOrDie(id);
    const Rows = await dataset.children('rows');
    return await rows.describeList(describeListParams(event), describeListWhere(event, rows.describeListFilter()));
});