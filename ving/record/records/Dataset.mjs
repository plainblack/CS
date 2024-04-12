import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";
import { eq } from '#ving/drizzle/orm.mjs';

/** Management of individual Datasets.
 * @class
 */
export class DatasetRecord extends VingRecord {
    // add custom Record code here


    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.extra.includes('sumQuantity')) {
            if (out.extra === undefined) {
                out.extra = {};
            }
            out.extra.sumQuantity = 0;
            const rows = await this.children('rows');
            if (this.enumerateOn) {
                const rowRecords = await rows.findMany();
                for (const row of rowRecords) {
                    let enumString = '';
                    if (row.fields[this.enumerateOn]?.userValue) {
                        enumString = row.fields[this.enumerateOn]?.userValue;
                    }
                    const enumerations = enumString.split(',');
                    const enumCount = enumerations.length || 1;
                    out.extra.sumQuantity += row.quantity * enumCount;
                }
            }
            else {
                out.extra.sumQuantity = await rows.sum('quantity');
            }
        }
        if (params?.include?.extra.includes('rowCount')) {
            if (out.extra === undefined) {
                out.extra = {};
            }
            out.extra.rowCount = await (await this.children('rows')).count();
        }
        return out;
    }

    async delete() {

        //  if (await (await this.parent('design')).count())
        //      throw ouch(441, 'Cannot delete a data set while it is still attached to a design.');
        await (await this.children('rows')).deleteMany();

        await super.delete();
    }

    copyWithRows() {
        const newDataset = super.copy();
    }

}

/** Management of all Datasets.
 * @class
 */
export class DatasetKind extends VingKind {
    // add custom Kind code here
}