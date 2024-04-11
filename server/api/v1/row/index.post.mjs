import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const rows = await useKind('Row');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const row = await rows.createAndVerify(await getBody(event), session);
    return row.describe(describeParams(event, session));
});