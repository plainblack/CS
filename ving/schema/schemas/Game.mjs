import { baseSchemaProps, dbString, zodString, dbEnum, dbBoolean, dbText, zodText, dbRelation, dbDateTime, dbTimestamp, dbInt, dbJson, zodNumber, zodJsonObject, dbMediumText, zodMediumText } from '../helpers.mjs';

export const gameSchema = {
    kind: 'Game',
    tableName: 'games',
    owner: ['$userId', 'admin'],
    props: [
        ...baseSchemaProps,
        {
            type: "string",
            name: "name",
            required: true,
            length: 60,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: 'notes',
            required: false,
            default: '',
            db: (prop) => dbMediumText(prop),
            zod: (prop) => zodMediumText(prop),
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
            view: ['public'],
            edit: [],
        },
        {
            type: "json",
            name: "fields",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(), // or replace .passthrough() with something like .extends({foo: z.string()})
            view: ['public'],
            edit: [],
        },
        {
            type: "id",
            name: 'userId',
            required: true,
            length: 36,
            db: (prop) => dbRelation(prop),
            relation: {
                type: 'parent',
                name: 'user',
                kind: 'User',
            },
            default: undefined,
            view: ['public'],
            edit: ['owner'],
        },
        {
            type: "boolean",
            name: 'archived',
            required: false,
            default: false,
            db: (prop) => dbBoolean(prop),
            enums: [false, true],
            enumLabels: ['Not Archived', 'Archived'],
            view: [],
            edit: ['owner'],
        },
        {
            type: "string",
            name: "collection",
            required: false,
            length: 60,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: [],
            edit: ['owner'],
        },
        {
            type: "virtual",
            name: 'gameId', // the name of this record's id in the remote table
            required: false,
            view: ['public'],
            edit: [],
            relation: {
                type: 'child',
                name: 'collaborators',
                kind: 'Collaborator',
            },
        },
    ],
};