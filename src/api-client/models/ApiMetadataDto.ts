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

import { TypeConstraintsDto } from '../models/TypeConstraintsDto';
import { HttpFile } from '../http/http';

export class ApiMetadataDto {
    'previewModeEnabled'?: boolean;
    'previewModeRegistrationPasswordRequired'?: boolean;
    'enableUserInteraction'?: boolean;
    'apiMetadataRefreshInterval'?: string | null;
    'typeConstraints'?: { [key: string]: TypeConstraintsDto; };

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "previewModeEnabled",
            "baseName": "previewModeEnabled",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "previewModeRegistrationPasswordRequired",
            "baseName": "previewModeRegistrationPasswordRequired",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "enableUserInteraction",
            "baseName": "enableUserInteraction",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "apiMetadataRefreshInterval",
            "baseName": "apiMetadataRefreshInterval",
            "type": "string",
            "format": "date-span"
        },
        {
            "name": "typeConstraints",
            "baseName": "typeConstraints",
            "type": "{ [key: string]: TypeConstraintsDto; }",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ApiMetadataDto.attributeTypeMap;
    }

    public constructor() {
    }
}
