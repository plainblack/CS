import { baseSchemaProps, dbString, zodString, dbEnum, dbBoolean, dbText, zodText, dbRelation, dbDateTime, dbTimestamp, dbInt, dbJson, zodNumber, zodJsonObject, dbMediumText, zodMediumText } from '../helpers.mjs';

export const rowSchema = {
    kind: 'Row',
    tableName: 'datasetrows',
    owner: ['admin', '^dataset'],
    props: [
        ...baseSchemaProps,
        {
            type: "string",
            name: "name",
            required: true,
            unique: true,
            uniqueQualifiers: ['datasetId'],
            length: 60,
            default: '',
            filterQuery: true,
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "int",
            name: "quantity",
            required: false,
            default: 1,
            filterRange: true,
            db: (prop) => dbInt(prop),
            zod: (prop) => zodNumber(prop).nonnegative(),
            view: ['public'],
            edit: ['owner'],
        },
        {
            type: "json",
            name: "fields",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: ['public'],
            edit: ['owner'],
        },
        {
            type: "id",
            name: 'datasetId', // the name of the remote record's id in this table
            default: undefined,
            required: true,
            filterQualifier: true,
            db: (prop) => dbRelation(prop),
            relation: {
                type: 'parent',
                name: 'dataset',
                kind: 'Dataset',
            },
            view: ['public'],
            edit: ['owner'],
        },
    ],
};