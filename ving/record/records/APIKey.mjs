import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";
import { useDB } from '#ving/drizzle/db.mjs';
import { APIKeyTable } from '#ving/drizzle/schema/APIKey.mjs';
import { useUsers } from '#ving/record/records/User.mjs'

/** Management of individual API Keys for developer access to the API.
 * @class
 */
export class APIKeyRecord extends VingRecord {
    // add custom Record code here

    /** A parent relationship to `UserKind`. */
    async user() {
        return await useUsers().findOrDie(this.get('userId'));
    }

}

/** Management of all API Keys.
 * @class
 */
export class APIKeyKind extends VingKind {
    // add custom Kind code here
}

/** Syntactic sugar that initializes `APIKeyKind`. */
export const useAPIKeys = () => {
    return new APIKeyKind(useDB(), APIKeyTable, APIKeyRecord);
}