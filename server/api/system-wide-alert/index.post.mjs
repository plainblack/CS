import { obtainSessionIfRole, getBody } from '../../utils/rest.mjs';
import { useCache } from '../../cache';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    obtainSessionIfRole(event, 'admin');
    const body = await getBody(event);
    await useCache().set('system-wide-alert', body, body.ttl);
    return body;
});