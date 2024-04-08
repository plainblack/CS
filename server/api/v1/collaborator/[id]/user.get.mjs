import { useKind } from '#ving/record/utils.mjs';
import { describeParams } from '#ving/utils/rest.mjs';
import {defineEventHandler, getRouterParams} from 'h3';
export default defineEventHandler(async (event) => {
    const collaborators = await useKind('Collaborator');
    const { id } = getRouterParams(event);
    const collaborator = await collaborators.findOrDie(id);
    const user = await collaborator.parent('user');
    return await user.describe(describeParams(event));
});