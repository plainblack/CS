import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const rows = await useKind('Row');
    return await rows.describeList(describeListParams(event), describeListWhere(event, rows.describeListFilter()));
});