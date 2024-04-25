import { baseSchemaProps, dbString, zodString, dbEnum, dbBoolean, dbText, zodText, dbRelation, dbDateTime, dbTimestamp, dbInt, dbJson, zodNumber, zodJsonObject, dbMediumText, zodMediumText } from '../helpers.mjs';

export const collaboratorSchema = {
    kind: 'Collaborator',
    tableName: 'collaborators',
    owner: ['$userId', 'admin', '^game'],
    props: [
        ...baseSchemaProps,
        {
            type: "id",
            name: 'gameId', // the name of the remote record's id in this table
            required: true,
            default: undefined,
            length: 36,
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
            type: "id",
            name: 'userId',
            required: true,
            default: undefined,
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
    ],
};