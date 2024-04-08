import { useKind } from '#ving/record/utils.mjs';
import { describeParams, getBody, obtainSessionIfRole } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const collaborators = await useKind('Collaborator');
    const session = obtainSessionIfRole(event, 'verifiedEmail');
    const collaborator = await collaborators.createAndVerify(await getBody(event), session);
    return collaborator.describe(describeParams(event, session));
});