import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";

/** Management of individual Datasets.
 * @class
 */
export class DatasetRecord extends VingRecord {
    // add custom Record code here


    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.extra) {
            if (out.extra === undefined)
                out.extra = {}
            if (params?.include?.extra.includes('totalQuantity')) {
                out.extra.totalQuantity = 0;
                const rows = this.rows;
                if (this.enumerateOn) {
                    for (const row of rows) {
                        let enumString = '';
                        if (row.fields[this.enumerateOn]?.userValue) {
                            enumString = row.fields[this.enumerateOn]?.userValue;
                        }
                        const enumerations = enumString.split(',');
                        const enumCount = enumerations.length || 1;
                        out.extra.totalQuantity += row.quantity * enumCount;
                    }
                }
                else {
                    out.extra.totalQuantity = this.rows.reduce((accumulator, row) => accumulator + row.quantity, 0);
                }
            }
            if (params?.include?.extra.includes('rowCount')) {
                out.extra.rowCount = this.rows.length;
            }
        }
        return out;
    }

  

    async copyWithRows() {
        const newDataset = await super.copy();
        this.#skipDefaults = true;
        await newDataset.insert();
        const rows = await (await this.children('rows')).getMany();
        for (const row of rows) {
            const newRow = await row.copy();
            newRow.datasetId = newDataset.id;
            await newRow.insert();
        }
    }

    #skipDefaults = false;

    async insert() {
        await super.insert();
        await this.createDefaults();
    }

    async createDefaults() {
        if (this.#skipDefaults)
            return;
        const rows = await this.children('rows');
        await rows.create({ name: 'Untitled' });
    }

    async serialize() {
        const rowsOut = [];
        const rows = await (await this.children('rows')).findMany();
        for (const row in rows) {
            rowsOut.push(await row.serialize());
        }
        return {
            rows,
            id: this.id,
            name: this.name,
            enumerateOn: this.enumerateOn,
            fields: this.fields,
            fieldSchema: this.fieldSchema,
            rowFieldOrder: this.rowFieldOrder,
            rowSchema: this.rowSchema,
        }
    }

    async deserialize(data) {
        this.setAll(data);
        const rows = await this.children('rows');
        for (const rowData of data.rows) {
            const newRow = rows.mint();
            await newRow.deserialize(rowData);
        }
    }


}

/** Management of all Datasets.
 * @class
 */
export class DatasetKind extends VingKind {
    // add custom Kind code here
}