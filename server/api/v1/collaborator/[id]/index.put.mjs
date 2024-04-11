import { useKind } from '#ving/record/utils.mjs';
import { describeParams, obtainSession, getBody } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const collaborators = await useKind('Collaborator');
    const { id } = getRouterParams(event);
    const collaborator = await collaborators.findOrDie(id);
    const session = obtainSession(event);
    await collaborator.canEdit(session);
    await collaborator.updateAndVerify(await getBody(event), session);
    return collaborator.describe(describeParams(event, session));
});