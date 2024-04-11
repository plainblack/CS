import { useKind } from '#ving/record/utils.mjs';
import { obtainSession, describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const rows = await useKind('Row');
    const { id } = getRouterParams(event);
    const row = await rows.findOrDie(id);
    const session = obtainSession(event);
    await row.canEdit(session);
    await row.delete();
    return row.describe(describeParams(event, session));
});