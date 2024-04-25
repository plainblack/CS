import { baseSchemaProps, dbString, zodString, dbEnum, dbBoolean, dbText, zodText, dbRelation, dbDateTime, dbTimestamp, dbInt, dbJson, zodNumber, zodJsonObject, dbMediumText, zodMediumText } from '../helpers.mjs';

export const datasetSchema = {
    kind: 'Dataset',
    tableName: 'datasets',
    owner: ['admin', '^game'],
    props: [
        ...baseSchemaProps,
        {
            type: "string",
            name: "name",
            required: true,
            length: 60,
            default: '',
            filterQuery: true,
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: "enumerateOn",
            required: false,
            length: 255,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: "sheetsUrl",
            required: false,
            length: 255,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "json",
            name: "fields",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: [],
            edit: ['owner'],
        },
        {
            type: "json",
            name: "fieldSchema",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: [],
            edit: ['owner'],
        },
        {
            type: "json",
            name: "rowFieldOrder",
            required: false,
            default: '[]',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: [],
            edit: ['owner'],
        },
        {
            type: "json",
            name: "rowSchema",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: [],
            edit: ['owner'],
        },
        {
            type: "id",
            name: 'gameId', // the name of the remote record's id in this table
            required: true,
            default: undefined,
            length: 36,
            filterQualifier: true,
            db: (prop) => dbRelation(prop),
            relation: {
                type: 'parent',
                name: 'game',
                kind: 'Game',
            },
            view: ['public'],
            edit: ['owner'],
        },
        {
            type: "virtual",
            name: 'datasetId', // the name of this record's id in the remote table
            required: false,
            view: ['public'],
            edit: ['owner'],
            relation: {
                type: 'child',
                name: 'rows',
                kind: 'Row',
            },
        },
        /*
        {
            type: "virtual",
            name: 'datasetId', // the name of this record's id in the remote table
            required: false,
            view: ['public'],
            edit: ['owner'],
            relation: {
                type: 'designs',
                name: 'rows',
                kind: 'Design',
            },
        },
        */
    ],
};