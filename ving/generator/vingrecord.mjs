import { getContext, renderTemplate, toFile } from '@featherscloud/pinion';
import { camelCase } from 'scule';


function addRelationshipNames({ schema }) {
    const names = [];
    for (const prop of schema.props) {
        if (prop.relation?.type == 'child') {
            names.push('`' + prop.relation.kind + '`');
        }
    }
    return names.join(' and ');
}

function addRelationshipDeletes({ schema }) {
    let out = '';
    for (const prop of schema.props) {
        if (prop.relation && prop.relation?.type == 'child') {
            out += `
            await this.${prop.relation.name}.deleteMany();
            `;
        }
    }
    return out;
}

function addRelationshipDelete({ schema }) {
    let count = 0;
    for (const prop of schema.props) {
        if (prop.relation?.type == 'child') {
            count++;
        }
    }
    if (count) {
        return `
        /**
             * Extends \`delete()\` in \`VingRecord\` to delete the associated ${addRelationshipNames({ schema })}.
             * 
             * @see VingRecord.delete()
             */
        async delete () {
            ${addRelationshipDeletes({ schema })}
        }
        `;
    }
    return '';
}

const recordTemplate = ({ name, schema }) =>
    `import { VingRecord, VingKind, useKind } from "#ving/record/VingRecord.mjs";
import {eq} from '#ving/drizzle/orm.mjs';

/** Management of individual ${name}s.
 * @class
 */
export class ${name}Record extends VingRecord {
    // add custom Record code here

    /**
     * Extends \`describe()\` in \`VingRecord\` to add \`meta\` property \`bar\`
     *  and the \`extra\` property \`foo\`.
     * 
     * Note, these don't do anything, this is just here to explain how to extend
     * the describe method.
     * 
     * @see VingRecord.describe()
     */
    async describe(params = {}) {
        const out = await super.describe(params);
        if (params?.include?.meta && out.meta) {
            out.meta.bar = 'bar';
        }
        if (params?.include?.extra.includes('foo')) {
            if (out.extra === undefined) {
                out.extra = {};
            }
            out.extra.foo = 'foo';
        }
        return out;
    }

    ${addRelationshipDelete({ schema })}
}

/** Management of all ${name}s.
 * @class
 */
export class ${name}Kind extends VingKind  {
    // add custom Kind code here

    /**
     * An example of a shortcut for a common query you might want to make.
     * 
     * @returns a list of \`${name}Record\`s that are cool
     */
    async findCool() {
        return this.select.findMany(eq(this.table.isCool, true));
    }
}`;

export const generateRecord = (params) => {
    const context = { ...getContext({}), ...params };
    return Promise.resolve(context)
        .then(renderTemplate(recordTemplate, toFile(`ving/record/records/${context.name}.mjs`)));
}