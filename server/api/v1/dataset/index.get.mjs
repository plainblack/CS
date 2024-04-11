import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    return await datasets.describeList(describeListParams(event), describeListWhere(event, datasets.describeListFilter()));
});