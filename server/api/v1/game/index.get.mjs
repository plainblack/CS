import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere } from '#ving/utils/rest.mjs';
import {defineEventHandler} from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    return await games.describeList(describeListParams(event), describeListWhere(event, games.describeListFilter()));
});