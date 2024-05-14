import { useKind } from '#ving/record/utils.mjs';
import { describeListParams, describeListWhere, obtainSession } from '#ving/utils/rest.mjs';
import { defineEventHandler, getRouterParams } from 'h3';
export default defineEventHandler(async (event) => {
    const games = await useKind('Game');
    const { id } = getRouterParams(event);
    const game = await games.findOrDie(id);
    const collaborators = await game.children('collaborators');
    const all = await collaborators.findMany();
    const session = obtainSession(event);
    for (const record of all) {
        if (record.isOwner(session))
            await record.delete();
    }
    return await collaborators.describeList(describeListParams(event, session), describeListWhere(event, collaborators.describeListFilter()));
});