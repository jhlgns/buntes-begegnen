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

import { CreateUserDto } from '../models/CreateUserDto';
import { HttpFile } from '../http/http';

export class RegistrationRequestDto {
    'account': CreateUserDto;
    'password': string;
    'previewModePassword': string | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "account",
            "baseName": "account",
            "type": "CreateUserDto",
            "format": ""
        },
        {
            "name": "password",
            "baseName": "password",
            "type": "string",
            "format": ""
        },
        {
            "name": "previewModePassword",
            "baseName": "previewModePassword",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return RegistrationRequestDto.attributeTypeMap;
    }

    public constructor() {
    }
}
