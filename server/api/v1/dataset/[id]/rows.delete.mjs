import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere, obtainSession } from '#ving/utils/rest.mjs';
import { defineEventHandler, getRouterParams } from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    const { id } = getRouterParams(event);
    const dataset = await datasets.findOrDie(id);
    const rows = await dataset.children('rows');
    const all = await rows.findMany();
    const session = obtainSession(event);
    for (const record of all) {
        if (record.isOwner(session))
            await record.delete();
    }
    return await rows.describeList(describeListParams(event, session), describeListWhere(event, rows.describeListFilter()));
});