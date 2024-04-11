import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const datasets = await useKind('Dataset');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const dataset = await datasets.createAndVerify(await getBody(event), session);
    return dataset.describe(describeParams(event, session));
});