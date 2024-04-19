import { VingRecord, VingKind } from "#ving/record/VingRecord.mjs";

/** Management of individual Rows.
 * @class
 */
export class RowRecord extends VingRecord {
    // add custom Record code here

    async serialize() {
        return {
            name: this.name,
            quantity: this.quantity,
            fields: this.fields,
        }
    }

    async deserialize(data) {
        this.setAll(data);
        await this.insert();
    }

}

/** Management of all Rows.
 * @class
 */
export class RowKind extends VingKind {
    // add custom Kind code here

}