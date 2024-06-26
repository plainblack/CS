import {z} from 'zod';
import {ouch} from '#ving/utils/ouch.mjs';

const fixBool = z.coerce.string().transform((value) => ['false','undefined','0','null',''].includes(value) ? false : value);

const shared = {
    history : z.coerce.string().array().default([]),
    error : z.coerce.string().default(''),
    hasError : fixBool.pipe(z.coerce.boolean()),
};

const str = {
    userValue : z.coerce.string().default(''),
    calcValue : z.coerce.string().default(''),
}

const bool = {
    userValue : z.coerce.string().default('true'),
    calcValue : fixBool.pipe(z.coerce.boolean()),
}

const hex = {
    userValue : z.coerce.string().default('000000'),
    calcValue : z.coerce.string().default('000000'),
}

const int = {
    userValue : z.coerce.string().default('0'),
    calcValue : z.coerce.number().default(0),
}

const image = {
    userValue : z.coerce.string().default(''),
    calcValue : z.coerce.string().default(''),
}

export const fieldTypeIndex = {
    str : 0,
    hex : 1,
    int : 2,
    bool : 3,
    image : 4,
}


export const fieldTypes = [
    { label: 'Text', value: 'str', default: '', formatter : z.object({
            ...shared,
            ...str,
        }).default({}),
    },
    { label: 'Color', value: 'hex', default: '000000', formatter : z.object({
            ...shared,
            ...hex,
        }).default({}),
    },
    { label: 'Number', value: 'int', default: 0, formatter : z.object({
            ...shared,
            ...int,
        }).default({}),
    },
    { label: 'True/False', value: 'bool', default: true, formatter : z.object({
            ...shared,
            ...bool,
        }).default({}),
    },
    { label: 'Image URL', value: 'image', default: '', formatter : z.object({
            ...shared,
            ...image,
        }).default({}),
    },
];

export const formatFieldType = (type, fieldObject = {}) => {
    const result = fieldTypes[fieldTypeIndex[type]].formatter.safeParse(fieldObject);
    if (result.success == false) {
        console.log(result.error.format());
        throw ouch(500, `Could not formatFieldType ${type} with ${fieldObject}`);
    }
    return result.data;
};