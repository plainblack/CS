import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";
import { eq } from '#ving/drizzle/orm.mjs';
import { publishUserToast } from '#ving/messagebus.mjs';
import ving from '#ving/index.mjs';

/** Management of individual Games.
 * @class
 */
export class GameRecord extends VingRecord {

    /**
     * Extends `delete()` in `VingRecord` to delete images and archives
     * 
     * @see VingRecord.delete()
     */
    async delete() {
        // await (await this.children('images')).deleteMany();
        // await (await this.children('archives')).deleteMany();
        await super.delete();
    }

    /**
     * Extends `describe()` in `VingRecord` to add the `extra` property `designCount`.
     * 
     * @see VingRecord.describe()
     */
    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.extra.includes('designCount')) {
            if (out.extra === undefined) {
                out.extra = {};
            }
            //  out.extra.designCount = await (await this.children('designs')).count();
        }
        return out;
    }

    skipDefaults = false;

    async createDefaults() {
        if (this.skipDefaults)
            return;
        // set all the defaults

    }

    /**
    * Extends `insert()` in `VingRecord` to add createDefaults() after insert
    * 
    * @see VingRecord.insert()
    */
    async insert() {
        await super.insert();
        await this.createDefaults();
    }

    /*
    isOwner(currentUser) {
        let result = super.isOwner(currentUser);
        if (result)
            return result;
            if (currentUser === undefined)
            return false;
            const collaborator = await (await this.children('collaborators')).findOrDie(newOwnerId);
        }
        */

    async transferOwnership(newOwnerId) {
        const newOwner = await (await this.children('collaborators')).findOrDie(newOwnerId);
        newOwner.userId = this.userId;
        await newOwner.update();
        this.userId = newOwnerId;
        await this.update();
    }

    async objectsToSerialize() {
        return [
            //   { key : 'fontpalettes', kind : await this.children('fontpalettes') },
            //   { key : 'styles', kind : await this.children('styles') },
            //   { key : 'datasets', kind : await this.children('datasets') },
            //   { key : 'folders', kind : await this.children('folders') },
            //   { key : 'designs', kind : await this.children('designs') },        
        ]
    }

    async serialize() {
        const out = {
            cs_version: 3,
            file_version: 4,
            game: {
                name: this.name,
                notes: this.notes,
                fieldSchema: this.fieldSchema,
                fields: this.fields,
            },
            designs: [],
            fontpalettes: [],
        };

        for (const type of await this.objectsToSerialize()) {
            for (const object of await type.kind.findMany()) {
                await publishUserToast(this.userId, `Serializing ${type.key}`, 'info');
                out[type.key] = await object.serialize();
            }
        }
    }

    async deserialize(data) {
        this.setAll(data.game);
        this.skipDefaults = true;
        if (this.isInserted)
            this.update();
        else
            this.insert();

        const datasetIndex = {};
        for (const type of await this.objectsToSerialize()) {
            for (const child of data[type.key]) {
                const object = type.kind.mint({ gameId: this.id });
                if (type.key == 'datasets')
                    object.skipDefaults = true;
                else if (type.key == 'designs')
                    object.datasetId = datasetIndex[child.datasetId];
                await publishUserToast(this.userId, `Deserializing ${type.key}`, 'info');
                await object.deserialize(child);
                if (type.key == 'datasets')
                    datasetIndex[child.id] = object.id;
            }
        }
    }

    async backup() {
        ving.log('game').error('Backup not yet implemented');
    }

    async fetchBackupImages() {
        ving.log('game').error('fetchBackupImages not yet implemented');
    }

    async fetchUrl() {
        ving.log('game').error('fetchUrl not yet implemented');
    }

    async restore() {
        ving.log('game').error('restore not yet implemented');
    }

    async prepImagesForRestore() {
        ving.log('game').error('prepImagesForRestore not yet implemented');
    }
}

/** Management of all Games.
 * @class
 */
export class GameKind extends VingKind {
    // add custom Kind code here

    /**
     * Find archived games
     * 
     * @returns a list of `GameRecord`s that are archived
     */
    async findArchived() {
        return this.select.findMany(eq(this.table.archived, true));
    }
}