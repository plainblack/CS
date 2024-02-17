import { baseSchemaProps, dbString, zodString, dbEnum, dbBoolean, dbText, zodText, dbRelation, dbDateTime, dbTimestamp, dbInt, dbJson, zodNumber, zodJsonObject } from '../helpers.mjs';

export const s3fileSchema = {
    kind: 'S3File',
    tableName: 's3files',
    owner: ['$userId', 'admin'],
    props: [
        ...baseSchemaProps,
        {
            type: "string",
            name: "filename",
            filterQuery: true,
            required: true,
            length: 256,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: ['public'],
            edit: [],
        },
        {
            type: "string",
            name: "extension",
            required: true,
            length: 10,
            filterQualifier: true,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: ['public'],
            edit: [],
        },
        {
            type: "string",
            name: "contentType",
            required: true,
            length: 256,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: ['public'],
            edit: [],
        },
        {
            type: "string",
            name: "s3folder",
            required: true,
            length: 256,
            default: '',
            db: (prop) => dbString(prop),
            zod: (prop) => zodString(prop),
            view: ['admin'],
            edit: [],
        },
        {
            type: "int",
            name: "sizeInBytes",
            filterRange: true,
            filterQualifier: true,
            required: false,
            default: 0,
            db: (prop) => dbInt(prop),
            zod: (prop) => zodNumber(prop).positive(),
            view: ['public'],
            edit: [],
        },
        {
            type: "json",
            name: "metadata",
            required: false,
            default: '{}',
            db: (prop) => dbJson(prop),
            zod: (prop) => zodJsonObject(prop).passthrough(),
            view: ['public'],
            edit: [],
        },
        {
            type: "enum",
            name: 'status',
            required: true,
            length: 20,
            default: 'pending',
            db: (prop) => dbEnum(prop),
            enums: ['pending', 'ready', 'postProcessingFailed', 'verifyFailed'],
            enumLabels: ['Pending', 'Ready for Use', 'Post Processing Failed', 'Failed Verification'],
            view: ['admin'],
            edit: [],
        },
        {
            type: "enum",
            name: 'icon',
            required: true,
            length: 20,
            default: 'pending',
            db: (prop) => dbEnum(prop),
            enums: ['pending', 'thumbnail', 'extension', 'self'],
            enumLabels: ['Pending', 'Thumbnail', 'Extension', 'Self'],
            view: ['admin'],
            edit: [],
        },
        {
            type: "id",
            name: 'userId',
            required: true,
            filterQualifier: true,
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
            type: "virtual",
            name: 'avatarUsers',
            required: false,
            view: ['public'],
            edit: [],
            relation: {
                type: 'child',
                name: 'avatarUsers',
                kind: 'User',
            },
        },
    ],
};