import { User } from '../typeorm/entity/User';
import { describe, test, expect } from "vitest";
import { ModelProps } from "../typeorm/types";
import { initialize } from '../typeorm/data-source'

await initialize()

await User.qb().delete().where('username IN (:...names)', { names: ['warden', 'captain', 'guard'] }).execute();
const warden = await new User().setAll({ username: 'warden', email: 'warden@shawshank.jail', realName: 'Samuel Norton' }).save();
const captain = new User().setAll({ username: 'captain', email: 'captain@shawshank.jail', realName: 'Byron Hadley' })

describe('Users', async () => {
    test("can create user", async () => {
        expect(warden.get('email')).toBe('warden@shawshank.jail');
    });
    test("is owner by id", async () => {
        expect(warden.isOwner(warden)).toBe(true);
    });
    test("is not admin role", async () => {
        expect(warden.isRole('admin')).toBe(false);
    });
    test("not inserted", async () => {
        expect(captain.isInserted).toBe(false);
    });
    test("inserted", async () => {
        await captain.save();
        expect(captain.isInserted).toBe(true);
    });
    test("is not owner by id or role", async () => {
        expect(captain.isOwner(warden)).toBe(false);
        expect(warden.isOwner(captain)).toBe(false);
    });
    test("can update ving record", async () => {
        warden.set('admin', true);
        expect(warden.get('admin')).toBe(true);
        await warden.save();
    });
    test("can refetch ving record", async () => {
        warden.set('admin', false);
        await warden.reload();
        expect(warden.get('admin')).toBe(true);
    });
    test("is owner by role", async () => {
        expect(captain.isOwner(warden)).toBe(true);
    });
    test("described by owner", async () => {
        const description = await captain.describe({ currentUser: captain, include: { links: true, options: true, meta: true } });
        expect(description.meta?.displayName).toBe('captain');
        expect(description.props.username).toBe('captain');
        if (description.links !== undefined) {
            expect(description.links.base).toBe('/api/user');
        }
        if (description.options !== undefined) {
            expect(description.options.useAsDisplayName).toBeTypeOf('object');
            expect(Object.keys(description.options).length).toBe(3);
        }
    });
    test("propOptions by owner", async () => {
        const options = await captain.propOptions({ currentUser: captain });
        expect(options.useAsDisplayName).toBeTypeOf('object');
        expect(Object.keys(options).length).toBe(3);
    });
    test("described by admin", async () => {
        const description = await captain.describe({ currentUser: warden, include: { links: true, options: true, meta: true } });
        expect(description.meta?.displayName).toBe('captain');
        expect(description.props.username).toBe('captain');
        expect(description.props.admin).toBe(false);
        if (description.links !== undefined) {
            expect(description.links.base).toBe('/api/user');
        }
        if (description.options !== undefined) {
            expect(description.options.useAsDisplayName).toBeTypeOf('object');
            expect(Object.keys(description.options).length).toBe(3);
        }
    });
    test("described by visitor", async () => {
        const description = await warden.describe({ include: { links: true, options: true, meta: true } });
        expect(description.meta?.displayName).toBe('warden');
        expect(description.props.username).toBe(undefined);
        expect(description.props.admin).toBe(undefined);
        if (description.links !== undefined) {
            expect(description.links.base).toBe('/api/user');
        }
        expect(description.options).toEqual({});
        if (description.options !== undefined) {
            expect(Object.keys(description.options).length).toBe(0);
        }
    });
    test('set password', async () => {
        await warden.setPassword('foo');
        expect(await warden.testPassword('foo')).toBe(true);
    });
    test('set password via posted params', async () => {
        await warden.setPostedProps({ password: 'food' }, warden);
        expect(await warden.testPassword('food')).toBe(true);
    });
    test('set useAsDisplayName via posted params', async () => {
        await warden.setPostedProps({ useAsDisplayName: 'email' }, warden);
        expect(warden.get('useAsDisplayName')).toBe('email');
    });
    const guard = captain.copy();
    test("clone a record", () => {
        expect(guard.get('realName')).toBe('Byron Hadley');
        guard.setAll({
            username: 'guard',
            email: 'guard@shawshank.jail',
            realName: 'Dekins',
        });
        guard.save();
        expect(guard.get('realName')).toBe('Dekins');
        expect(guard.get('id')).not.toBe(captain.get('id'));
        expect(guard).toHaveProperty('isRole');
    });

    test('can edit', () => {
        expect(() => guard.canEdit(captain)).toThrowError();
        expect(guard.canEdit(warden)).toBe(true);
        expect(guard.canEdit(guard)).toBe(true);
    })

    //  let key = captain.apiKeys.mint({ name: 'foo' } as any);
    // await key.insert();
    // console.log(JSON.stringify(await captain.describe({ currentUser: captain, include: { related: ['apiKeys'], extra: ['foo'] } }), undefined, 2));

    test('can describe list', async () => {
        const list = await User.describeList(User.createQueryBuilder());
        expect(list.paging.totalItems).toBeGreaterThanOrEqual(3);
        expect(list.paging.totalItems).toBeGreaterThanOrEqual(list.items.length);
    })

    test("can delete ving record", async () => {
        await warden.remove()
        expect(warden.get('username')).toBe('warden');
        expect(await User.count({ where: { email: 'warden@shawshank.jail' } })).toBe(0);
        await captain.remove()
        await guard.remove()
    });

    const rita = new User();
    let params: ModelProps<'User'> = { realName: 'Rita Hayworth', email: 'rita@hollywood.com' };
    test('can verify creation params', () => {
        expect(() => rita.testRequiredProps(params)).toThrowError();
        params.username = 'rita';
        expect(rita.testRequiredProps(params)).toBe(true);
    });

    test('can verify empty creation params', () => {
        params.username = '';
        expect(() => rita.testRequiredProps(params)).toThrowError();
    });

    test('can verify posted params', async () => {
        params.username = 'rita';
        params.email = 'rita@rita.com';
        expect(await rita.setPostedProps(params)).toBe(true);
        expect(rita.get('username')).toBe('rita');
    });
})