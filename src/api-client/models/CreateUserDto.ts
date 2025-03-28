/**
 * BuntesBegegnen.Api
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

export class CreateUserDto {
    'firstName'?: string;
    'lastName'?: string;
    'birthDay'?: string | null;
    'email': string;
    'phoneNumber'?: string | null;
    'streetName'?: string | null;
    'houseNumber'?: string | null;
    'zipCode'?: string | null;
    'city'?: string | null;
    'goals'?: string | null;
    'hobbies'?: string | null;
    'impairedSight'?: boolean;
    'impairedHearing'?: boolean;
    'impairedSpeech'?: boolean;
    'impairedMobility'?: boolean;
    'additionalHandicaps'?: string | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "firstName",
            "baseName": "firstName",
            "type": "string",
            "format": ""
        },
        {
            "name": "lastName",
            "baseName": "lastName",
            "type": "string",
            "format": ""
        },
        {
            "name": "birthDay",
            "baseName": "birthDay",
            "type": "string",
            "format": "date"
        },
        {
            "name": "email",
            "baseName": "email",
            "type": "string",
            "format": ""
        },
        {
            "name": "phoneNumber",
            "baseName": "phoneNumber",
            "type": "string",
            "format": ""
        },
        {
            "name": "streetName",
            "baseName": "streetName",
            "type": "string",
            "format": ""
        },
        {
            "name": "houseNumber",
            "baseName": "houseNumber",
            "type": "string",
            "format": ""
        },
        {
            "name": "zipCode",
            "baseName": "zipCode",
            "type": "string",
            "format": ""
        },
        {
            "name": "city",
            "baseName": "city",
            "type": "string",
            "format": ""
        },
        {
            "name": "goals",
            "baseName": "goals",
            "type": "string",
            "format": ""
        },
        {
            "name": "hobbies",
            "baseName": "hobbies",
            "type": "string",
            "format": ""
        },
        {
            "name": "impairedSight",
            "baseName": "impairedSight",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "impairedHearing",
            "baseName": "impairedHearing",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "impairedSpeech",
            "baseName": "impairedSpeech",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "impairedMobility",
            "baseName": "impairedMobility",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "additionalHandicaps",
            "baseName": "additionalHandicaps",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return CreateUserDto.attributeTypeMap;
    }

    public constructor() {
    }
}
