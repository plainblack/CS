import { ModelMap, Roles, ExtendedRoleOptions, ModelName, vingSchema, vingProp, ModelSelect, ModelInsert, Describe, warning, AuthorizedUser, DescribeParams, DescribeListParams, vingOption, DescribeList, Constructable } from '../../types';
import { vingSchemas } from '../vingschema';
import { findObject, ouch } from '../helpers';
import _ from 'lodash';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import type { SQL } from 'drizzle-orm/sql';
import { sql } from 'drizzle-orm';
import { like, eq, asc, desc, and, or, ne } from 'drizzle-orm/mysql-core/expressions';
import { Name } from "drizzle-orm/table";
import { stringDefault, booleanDefault, numberDefault, dateDefault } from '../vingschema/helpers';
import { AnyMySqlColumn } from 'drizzle-orm/mysql-core';

export const findVingSchema = (nameToFind: string = '-unknown-') => {
    try {
        return findObject('tableName', nameToFind, vingSchemas) as vingSchema;
    }
    catch {
        throw ouch(404, 'ving schema ' + nameToFind + ' not found');
    }
}

export const enum2options = (enums: readonly string[] | readonly boolean[], labels: string[] | undefined) => {
    const options: vingOption[] = [];
    let i = 0
    for (let value of enums) {
        const label = (labels !== undefined && labels[i] !== undefined) ? labels[i] : value.toString();
        options.push({
            value,
            label,
        })
        i++
    }
    return options;
}

export const findPropInSchema = (name: string | number | symbol, props: vingProp[]) => {
    return props.find(prop => prop.name == name);
}

/*
export interface VingRecord<T extends ModelName> {
    db: MySql2Database,
    table: ModelMap[T]['model'],
    warnings: Describe<T>['warnings'],
    addWarning(warning: warning): void,
    get<K extends keyof ModelSelect<T>>(key: K): ModelSelect<T>[K],
    getAll(): ModelSelect<T>,
    set<K extends keyof ModelSelect<T>>(key: K, value: ModelSelect<T>[K]): ModelSelect<T>[K],
    setAll(props: ModelInsert<T>): ModelSelect<T>,
    isInserted: boolean,
    insert(): Promise<void>,
    update(): Promise<void>,
    delete(): Promise<void>,
    refresh(): Promise<ModelSelect<T>>,
    isOwner(currentUser: AuthorizedUser): boolean,
    canEdit(currentUser: AuthorizedUser): boolean,
    describe(params: DescribeParams): Promise<Describe<T>>,
    propOptions(params: DescribeParams): Describe<T>['options'],
    testCreationProps(params: ModelInsert<T>): boolean,
    setPostedProps(params: ModelInsert<T>, currentUser?: AuthorizedUser): Promise<boolean>,
    updateAndVerify(params: ModelSelect<T>, currentUser?: AuthorizedUser): void,
}
*/

//export type useVingRecordOptions<T extends ModelName> = { db: MySql2Database, table: ModelMap[T]['model'], props: ModelMap[T]['select'], inserted?: boolean }


export class VingRecord<T extends ModelName> {
    constructor(public db: MySql2Database, public table: ModelMap[T]['model'], private props: ModelMap[T]['select'], private inserted = true) { }

    public warnings: Describe<T>['warnings'] = [];

    public addWarning(warning: warning) {
        this.warnings?.push(warning);
    }

    public get<K extends keyof ModelSelect<T>>(key: K): ModelSelect<T>[K] {
        return this.props[key];
    }

    public getAll() {
        return this.props;
    }

    public set<K extends keyof ModelSelect<T>>(key: K, value: ModelSelect<T>[K]) {
        const schema = findVingSchema(this.table[Name]);
        const prop = findPropInSchema(key, schema.props);
        if (prop) {
            if (prop.zod) {
                const result = prop.zod(prop as never).safeParse(value);
                if (result.success) {
                    value = result.data;
                }
                else {
                    const formatted = result.error.format();
                    throw ouch(442, key.toString() + ': ' + formatted._errors.join('.') + '.', key);
                }
            }
        }
        else {
            throw ouch(400, key.toString() + ' is not a prop', key);
        }
        return this.props[key] = value;
    }

    public setAll(props: Partial<ModelSelect<T>>) {
        const schema = findVingSchema(this.table[Name]);
        for (const key in props) {
            const field = findPropInSchema(key, schema.props)
            if (!field?.noSetAll)
                this.set(key, props[key] as any);
        }
        return this;
    }

    public(props: ModelInsert<T>): ModelSelect<T> {
        const schema = findVingSchema(this.table[Name]);
        for (const key in props) {
            const field = findPropInSchema(key, schema.props)
            if (!field?.noSetAll)
                this.set(key, this.props[key]);
        }
        return this.props;
    }

    public get isInserted() {
        return this.inserted;
    }

    public async insert() {
        if (this.inserted) {
            const schema = findVingSchema(this.table[Name]);
            throw ouch(409, `${schema.kind} already inserted`);
        }
        this.inserted = true;
        await this.db.insert(this.table).values(this.props);
    }

    public async update() {
        await this.db.update(this.table).set(this.props).where(eq(this.table.id, this.props.id));
    }

    public async delete() {
        await this.db.delete(this.table).where(eq(this.table.id, this.props.id));
    }

    public async refresh() {
        return this.props = (await this.db.select().from(this.table).where(eq(this.table.id, this.props.id)))[0] as ModelSelect<T>;
    }

    public isOwner(currentUser: AuthorizedUser) {
        if (currentUser === undefined)
            return false;
        const schema = findVingSchema(this.table[Name]);
        for (let owner of schema.owner) {
            let found = owner.match(/^\$(.*)$/);
            if (found) {
                if (this.props[found[1] as keyof ModelSelect<T>] == currentUser.getRoleProp('id')) {
                    return true;
                }
            }
            found = owner.match(/^([A-Za-z]+)$/);
            if (found) {
                if (found[1] && currentUser.isRole(found[1] as keyof Roles) == true) {
                    return true;
                }
            }
        }
        return false;
    }

    public canEdit(currentUser: AuthorizedUser) {
        if (this.isOwner(currentUser)) {
            return true;
        }
        const schema = findVingSchema(this.table[Name]);
        throw ouch(403, `You do not have the privileges to access ${schema.kind}.`)
    }

    public async describe(params: DescribeParams = {}) {
        const currentUser = params.currentUser;
        const include = params.include || {};
        const isOwner = currentUser !== undefined && this.isOwner(currentUser);
        const schema = findVingSchema(this.table[Name]);

        let out: Describe<T> = { props: {} };
        out.props.id = this.get('id');
        if (include !== undefined && include.links) {
            out.links = { base: `/api/${schema.kind?.toLowerCase()}` };
            out.links.self = `${out.links.base}/${this.props.id}`;
        }
        if (include !== undefined && include.options) {
            out.options = this.propOptions(params);
        }
        if (include !== undefined && include.meta) {
            out.meta = {
                kind: schema.kind,
            };
        }
        if (include !== undefined && include.related && include.related.length) {
            out.related = {};
        }
        if (this.warnings?.length) {
            out.warnings = this.warnings;
        }

        for (const field of schema.props) {

            // determine field visibility
            const roles = [...field.view, ...field.edit];
            const visible = roles.includes('public')
                || (include !== undefined && include.private)
                || (roles.includes('owner') && isOwner)
                || (currentUser !== undefined && currentUser.isaRole(roles));
            if (!visible) continue;

            const fieldName = field.name.toString();

            // props
            out.props[field.name as keyof Describe<T>['props']] = this.props[field.name as keyof ModelInsert<T>];

            // links 
            if (typeof out.links === 'object'
                && include.links
                && field.relation
            ) {
                let lower = field.relation.name.toLowerCase();
                out.links[lower] = `${out.links.self}/${lower}`;
            }

            // related
            if (typeof out.related === 'object'
                && include.related !== undefined && include.related.length > 0
                && field.relation
                && include.related.includes(fieldName)
            ) {
                //  if (field.relationFromFields.length > 0) { // parent relationship
                //need to handle related differently, probably by consumers adding their own related processors
                //         let parent = await this[field.name as keyof this] as VingRecord<T>;
                //       out.related[fieldName] = await parent.describe({ currentUser: currentUser })
                //  }
            }
            /*   if (typeof out.related === 'object'
                   && include.relatedList !== undefined && include.relatedList.length > 0
                   && field.relationName
                   && include.relatedList.includes(fieldName)
               ) {
                   if (field.relationFromFields.length == 0) { // child relationship
                       let childKind = this[field.name as keyof this] as VingKind<T, this>;
                       out.relatedList[fieldName] = await childKind.describeList({ objectParams: { currentUser: currentUser } })
                   }
               }*/

        }

        return out;
    }

    public propOptions(params: DescribeParams = {}) {
        const options: Describe<T>['options'] = {};
        const currentUser = params.currentUser;
        const include = params.include || {};
        const isOwner = currentUser !== undefined && this.isOwner(currentUser);
        for (const prop of findVingSchema(this.table[Name]).props) {
            const roles = [...prop.view, ...prop.edit];
            const visible = roles.includes('public')
                || (include !== undefined && include.private)
                || (roles.includes('owner') && isOwner)
                || (currentUser !== undefined && currentUser.isaRole(roles));
            if (!visible) continue;
            if ((prop.type == 'enum' || prop.type == 'boolean') && prop.enums && prop.enums.length > 0) {
                options[prop.name as keyof ModelInsert<T>] = enum2options(prop.enums, prop.enumLabels);
            }
        }
        return options;
    }

    public testCreationProps(params: ModelInsert<T>) {
        const schema = findVingSchema(this.table[Name]);
        for (const prop of schema.props) {
            if (!prop.required || (prop.default !== undefined && prop.default !== '') || prop.relation)
                continue;
            // @ts-ignore - vingSchema 
            if (params[prop.name] !== undefined && params[prop.name] != '')
                continue;
            const fieldName = prop.name.toString();
            throw ouch(441, `${fieldName} is required.`, fieldName);
        }
        return true;
    }

    public async setPostedProps(params: ModelInsert<T>, currentUser?: AuthorizedUser) {
        const schema = findVingSchema(this.table[Name]);
        const isOwner = currentUser !== undefined && this.isOwner(currentUser);

        for (const field of schema.props) {
            const fieldName = field.name.toString();
            // @ts-ignore - vingSchema is a safe bet
            const param = params[field.name];
            const roles = [...field.edit];
            const editable = (roles.includes('owner') && (isOwner || !this.isInserted))
                || (currentUser !== undefined && currentUser.isaRole(roles));
            if (!editable) {
                continue;
            }
            if (param === undefined || field.relation) {
                continue;
            }
            if (param === '' && field.required) {
                throw ouch(441, `${fieldName} is required.`, fieldName);
            }
            if (field.name !== undefined && param !== undefined) {

                if (field.unique) {
                    const query = this.db.select({ count: sql<number>`count(*)`.as('count') }).from(this.table);
                    // @ts-ignore - vingSchema knows best
                    let where = eq(this.table[field.name], params[field.name as keyof ModelInsert<T>]);
                    if (this.isInserted)
                        // @ts-ignore - vingSchema knows best
                        where = and(where, ne(this.table.id, this.get('id')));

                    let count = (await query.where(where))[0].count
                    if (count > 0) {
                        console.log('--- unique check failed ---', fieldName)
                        throw ouch(409, `${field.name.toString()} must be unique, but ${params[field.name as keyof ModelInsert<T>]} has already been used.`, field.name)
                    }
                }
                if (param !== null)
                    this.set(field.name as keyof ModelSelect<T>, param);
            }
        }
        return true;
    }

    public async updateAndVerify(params: ModelSelect<T>, currentUser?: AuthorizedUser) {
        await this.setPostedProps(params, currentUser);
        await this.update();
    }
}


/*
export interface VingKind<T extends ModelName, VR extends VingRecord<T>> {
    db: MySql2Database,
    table: ModelMap[T]['model'],
    describeList(params: DescribeListParams, whereCallback?: (condition?: SQL) => SQL | undefined, orderBy?: (SQL | AnyMySqlColumn)[]): Promise<DescribeList<T>>,
    copy(originalProps: Partial<ModelSelect<T>>): VR,
    mint(props?: Partial<ModelInsert<T>>): VR,
    create(props: ModelInsert<T>): Promise<VR>,
    createAndVerify(props: ModelSelect<T>, currentUser?: AuthorizedUser): Promise<VR>,
    getDefaultArgs(args?: object): object,
    get select(): any,
    get delete(): any,
    get update(): any,
    get insert(): any,
    count(whereCallback?: (condition?: SQL) => SQL | undefined): Promise<number>,
    find(id: ModelSelect<T>['id']): Promise<VR>,
    findMany(whereCallback?: (condition?: SQL) => SQL | undefined, options?: { limit?: number, offset?: number, orderBy?: (SQL | AnyMySqlColumn)[] }): Promise<VR[]>,
    getOptions(): Describe<T>['options'],
}

export type useVingKindOptions<T extends ModelName, VR extends VingRecord<T>> = {
    db: MySql2Database, table: ModelMap[T]['model'], recordComposable: (opts: useVingRecordOptions<T>) => VR, propDefaults: Partial<ModelInsert<T>>
}
export function useVingKind<T extends ModelName, VR extends VingRecord<T>>({ db, table, recordComposable, propDefaults }: useVingKindOptions<T, VR>) {
*/

export class VingKind<T extends ModelName, VR extends VingRecord<T>> {

    constructor(public db: MySql2Database, public table: ModelMap[T]['model'], public recordClass: Constructable<VR>, private propDefaults: Partial<ModelInsert<T>> = {}) { }


    public async describeList(
        params: DescribeListParams = {},
        whereCallback: (condition?: SQL) => SQL | undefined = (c) => c,
        orderBy: (SQL | AnyMySqlColumn)[] = [asc(this.table.createdAt)]
    ) {
        const itemsPerPage = params.itemsPerPage === undefined || params.itemsPerPage > 100 || params.itemsPerPage < 1 ? 10 : params.itemsPerPage;
        const page = params.page || 1;
        const maxItems = params.maxItems || 100000000000;
        const itemsUpToThisPage = itemsPerPage * page;
        const fullPages = Math.floor(maxItems / itemsPerPage);
        let maxItemsThisPage = itemsPerPage;
        let skipResultSet = false;
        if (itemsUpToThisPage - itemsPerPage >= maxItems) {
            skipResultSet = true;
        }
        else if (page - fullPages == 1) {
            maxItemsThisPage = itemsPerPage - (itemsUpToThisPage - maxItems);
        }
        else if (page - fullPages > 1) {
            skipResultSet = true;
        }
        const totalItems = await this.count(whereCallback);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const out: DescribeList<T> = {
            paging: {
                page: page,
                nextPage: page + 1 >= totalPages ? page : page + 1,
                previousPage: page < 2 ? 1 : page - 1,
                itemsPerPage: itemsPerPage,
                totalItems: totalItems,
                totalPages: totalPages
            },
            items: []
        };
        if (!skipResultSet) {
            const records = await this.findMany(whereCallback, { limit: itemsPerPage, offset: itemsPerPage * (page - 1), orderBy: orderBy });
            for (let record of records) {
                out.items.push(await record.describe(params.objectParams || {}));
                maxItemsThisPage--;
                if (maxItemsThisPage < 1) break;
            }
        }
        return out;
    }

    public copy(originalProps: Partial<ModelSelect<T>>) {
        let props = { ...originalProps };
        delete props.id;
        delete props.createdAt;
        return this.mint(props);
    }

    public mint(props?: Partial<ModelInsert<T>>) {
        const output: Record<string, any> = {};
        for (const prop of findVingSchema(this.table[Name]).props) {
            // @ts-ignore
            if (props && props[prop.name] !== undefined)
                // @ts-ignore
                output[prop.name] = props[prop.name]
            else if (prop.type == 'string' || prop.type == 'enum' || prop.type == 'id')
                output[prop.name] = stringDefault(prop)
            else if (prop.type == 'boolean')
                output[prop.name] = booleanDefault(prop)
            else if (prop.type == 'number')
                output[prop.name] = numberDefault(prop)
            else if (prop.type == 'date')
                output[prop.name] = dateDefault(prop)
        }
        return new this.recordClass(this.db, this.table, output as ModelSelect<T>, false);
    }

    public async create(props: ModelInsert<T>) {
        const obj = this.mint(props);
        await obj.insert();
        return obj;
    }

    public async createAndVerify(props: ModelSelect<T>, currentUser?: AuthorizedUser) {
        const obj = this.mint({});
        obj.testCreationProps(props);
        await obj.setPostedProps(props, currentUser);
        await obj.insert();
        return obj;
    }

    public getDefaultArgs(args?: object) {
        const defaultArgs = Object.keys(this.propDefaults).length ? { where: { ...this.propDefaults } } : {};
        return _.defaults(defaultArgs, args);
    }

    public get select() { return this.db.select().from(this.table) }
    public get delete() { return this.db.delete(this.table) }
    public get update() { return this.db.update(this.table) }
    public get insert() { return this.db.insert(this.table) }

    public async count(whereCallback: (condition?: SQL) => SQL | undefined = (c) => c) {
        return (await this.db.select({ count: sql<number>`count(*)`.as('count') }).from(this.table).where(whereCallback()))[0].count;
    }

    public async find(id: ModelSelect<T>['id']) {
        try {
            return await this.findOrDie(id);
        } catch {
            return undefined;
        }
    }

    public async findOrDie(id: ModelSelect<T>['id']) {
        const props = (await this.select.where(eq(this.table.id, id)))[0] as ModelSelect<T>;
        if (props)
            return new this.recordClass({ db: this.db, table: this.table, props });
        const schema = findVingSchema(this.table[Name]);
        throw ouch(404, `${schema.kind} not found.`)
    }

    public async findOne(whereCallback: (condition?: SQL) => SQL | undefined = (c) => c) {
        const result = await this.findMany(whereCallback, { limit: 1 });
        if (result.length)
            return result[0];
        return undefined;
    }

    public async findMany(
        whereCallback: (condition?: SQL) => SQL | undefined = (c) => c,
        options?: {
            limit?: number,
            offset?: number,
            orderBy?: (SQL | AnyMySqlColumn)[]
        }
    ) {
        //  const customArgs = this.getDefaultArgs(args) as TModel[T]['findMany']['args'];
        let query = this.select.where(whereCallback());
        if (options && options.limit)
            query.limit(options.limit);
        if (options && options.offset)
            query.offset(options.offset);
        const results = (await query) as ModelSelect<T>[];
        return results.map(props => new this.recordClass({ db: this.db, table: this.table, props }));
    }
    /*
        public propOptions() {
            const options: Describe<T>['options'] = {};
            for (const field of findVingSchema(this.table[Name]).props) {
                if (field.type == 'enum' && field.enums && field.enums.length > 0) {
                    options[field.name as keyof ModelInsert<T>] = enum2options(field.enums, field.enumLabels);
                }
    
            }
            return options;
        }
        */
}