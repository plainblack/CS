import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const collaborators = await useKind('Collaborator');
    return await collaborators.describeList(describeListParams(event), describeListWhere(event, collaborators.describeListFilter()));
});