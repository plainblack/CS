import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";
import { RoleOptions, RoleMixin } from '#ving/record/mixins/Role.mjs';
import { useAPIKeys } from "#ving/record/records/APIKey.mjs";
import { useS3Files } from '#ving/record/records/S3File.mjs'
import bcrypt from 'bcryptjs';
import { useCache } from '#ving/cache.mjs';
import { useDB } from '#ving/drizzle/db.mjs';
import { UserTable } from '#ving/drizzle/schema/User.mjs';
import { ouch } from '#ving/utils/ouch.mjs';

/** Management of individual Users.
 * @class
 */
export class UserRecord extends RoleMixin(VingRecord) {
    #userChanged = false;

    /**
     * Generates the name that the user would like to be known as on the site based upon their `useAsDisplayName` preference.
     * 
     * Usage: `const name = user.displayName()`
     * 
     * @returns a string
     */
    displayName() {
        switch (this.get('useAsDisplayName')) {
            case 'realName':
                return this.get('realName') || '-unknown-';
            case 'email':
                return this.get('email') || '-unknown-';
            default:
                return this.get('username') || '-unknown-';
        }
    }

    /**
     * Returns a URL to an image that represents the identity of this user. Note that it could be a fully qualified URL or a partial URL.
     * 
     * Usage `const url = await user.avatarUrl()`;
     * 
     * @returns A URL to an image. 
     */
    async avatarUrl() {
        switch (this.get('avatarType')) {
            case 'robot': {
                const id = this.get('id');
                let url = `https://robohash.org/${id}/size_300x300`;

                // foreground
                if (this.get('id')?.match(/^[A-M]/)) {
                    url += '/set_set2'
                }
                else if (this.get('id')?.match(/^[a-m]/)) {
                    url += '/set_set3'
                }
                else if (id.match(/^[N-Z]/)) {
                    url += '/set_set4'
                }

                // background
                if (id.match(/[A-Z]$/)) {
                    url += '/bgset_bg1'
                }
                else if (id.match(/[a-z]$/)) {
                    url += '/bgset_bg2'
                }

                return url;
            }
            case 'uploaded': {
                if (this.get('avatarId')) {
                    const avatar = await this.avatar();
                    return avatar.fileUrl();
                }
                else {
                    break;
                }
            }
        }
        return '/img/avatar.png';
    }

    /**
     * Tests a potential password to see if it matches the password stored in the user's account.
     * 
     * Usage: `const result = await testPassword('totaly going to work');`
     * 
     * @throws 400 if the user doesn't have a password set
     * @throws 441 if no password is passed into the function
     * @throws 404 if the user has a `passwordType` other than those allowed
     * @param password the password you'd like to test against the user's set password
     * @returns `true` if it passes, or `false` if it fails to pass
     */
    async testPassword(password) {
        if (this.get('password') == undefined)
            throw ouch(400, 'User has no password, you must log in via another provider.');
        if (password == undefined || password == '')
            throw ouch(441, 'You must specify a password.');
        let passed = false;
        if (this.get('passwordType') == 'bcrypt')
            passed = await bcrypt.compare(password, this.get('password') || '');
        else
            throw ouch(404, 'validating other password types not implemented');
        if (passed) {
            if (this.get('passwordType') != 'bcrypt') {
                await this.setPassword(password)
                await this.update();
            }
            return true;
        }
        throw ouch(454, 'Password does not match.');
    }

    /**
     * Sets a password for this user. Note that passwords cannot be set through the normal `set()` function.
     * 
     * Usage: `await user.setPassword('my new cool password');`
     * 
     * @param password A string that will act as the user's password.
     */
    async setPassword(password) {
        const hashedPass = bcrypt.hashSync(password, 10);
        this.set('password', hashedPass);
        this.set('passwordType', 'bcrypt');
    }

    /**
        * Extends `describe()` in `VingRecord` to add `meta` properties `displayName`
        *  and `avatarUrl`.
        * 
        * @see VingRecord.describe()
        */
    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.meta && out.meta) {
            out.meta.displayName = this.displayName();
            out.meta.avatarUrl = await this.avatarUrl();
        }
        return out;
    }

    /**
       * Extends `setPostedProps()` in `VingRecord` to enable password security.
       * 
       * @see VingRecord.setPostedProps()
       */
    async setPostedProps(params, currentUser) {
        if (params.password && (currentUser === undefined || this.isOwner(currentUser))) {
            await this.setPassword(params.password);
        }
        if (params.email) {
            this.set('verifiedEmail', false);
        }
        await super.setPostedProps(params, currentUser);
        return true;
    }

    /**
        * Extends `update()` in `VingRecord` to enable change detection in user records.
        * 
        * @see VingRecord.update()
        */
    async update() {
        if (this.#userChanged)
            await useCache().set('user-changed-' + this.get('id'), true, 1000 * 60 * 60 * 24 * 7);
        await super.update();
    }

    /**
         * Extends `delete()` in `VingRecord` to delete APIKeys and S3Files the user created.
         * 
         * @see VingRecord.delete()
         */
    async delete() {
        await this.apikeys.deleteMany();
        if (this.get('avatarId')) {
            const avatar = await this.avatar();
            await avatar.delete();
        }
        await super.delete();
    }

    /**
         * Extends `set()` in `VingRecord` to enable change detection in user records.
         * 
         * @see VingRecord.set()
         */
    set(key, value) {
        if (key in ['password', ...RoleOptions])
            this.#userChanged = true;
        return super.set(key, value);
    }

    /**
         * A child relationship to `APIKeyKind` that this user has generated
         * 
         * Usage: `const apikeys = await user.apikeys.findMany()`
         * 
         * @returns `APIKeyKind`
         */
    get apikeys() {
        const apikeys = useAPIKeys();
        apikeys.propDefaults.push({
            prop: 'userId',
            field: apikeys.table.userId,
            value: this.get('id')
        });
        return apikeys;
    }

    /**
         * A parent relationship to a `S3FileRecord` that will act as an avatar for this user.
         * 
         * Usage: `const avatar = await user.avatar()`
         * 
         * @throws 404 if the avatar cannot be found
         * @returns A `S3FileRecord` instance
         */
    async avatar() {
        return await useS3Files().findOrDie(this.get('avatarId'));
    }
}

/** Management of all Users.
 * @class
 */
export class UserKind extends VingKind {
    // add custom Kind code here
}

/** Syntactic sugar that initializes `UserKind`. */
export const useUsers = () => {
    return new UserKind(useDB(), UserTable, UserRecord);
}