import { Users } from '~/utils/db';
import { vingDescribe } from '~~/utils/helpers';
export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);
    const user = await Users.find(id);
    return user.describe(vingDescribe(event));
});