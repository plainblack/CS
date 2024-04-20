import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import { defineEventHandler, getRouterParams } from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    const { id } = getRouterParams(event);
    const dataset = await datasets.findOrDie(id);
    const rows = await dataset.children('rows');
    return await rows.describeList(describeListParams(event), describeListWhere(event, rows.describeListFilter()));
});