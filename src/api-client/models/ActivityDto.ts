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

import { ActivityCategory } from '../models/ActivityCategory';
import { ActivityRecurrenceByDayDto } from '../models/ActivityRecurrenceByDayDto';
import { ActivityRecurrenceFrequency } from '../models/ActivityRecurrenceFrequency';
import { ActivityVisibility } from '../models/ActivityVisibility';
import { HttpFile } from '../http/http';

export class ActivityDto {
    'id': number;
    'createdAt': Date;
    'createdById': string;
    'promoterId'?: number;
    'title'?: string;
    'visibility'?: ActivityVisibility;
    'category'?: ActivityCategory;
    'startTime'?: Date;
    'endTime'?: Date;
    'isAllDay'?: boolean;
    'maxNumberOfParticipants'?: number | null;
    'registrationLocked'?: boolean;
    'location'?: string;
    'description'?: string;
    'recurrenceFrequency'?: ActivityRecurrenceFrequency;
    'recurrenceInterval'?: number | null;
    'repeatUntil'?: string | null;
    'repeatCount'?: number | null;
    'isInstance'?: boolean;
    'recurrenceDates'?: Array<Date>;
    'recurrenceByDay'?: Array<ActivityRecurrenceByDayDto>;
    'recurrenceByMonthDay'?: Array<number>;
    'recurrenceExceptions'?: Array<Date>;
    'isRegistered'?: boolean;
    'currentNumberOfParticipants'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "createdAt",
            "baseName": "createdAt",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "createdById",
            "baseName": "createdById",
            "type": "string",
            "format": ""
        },
        {
            "name": "promoterId",
            "baseName": "promoterId",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "title",
            "baseName": "title",
            "type": "string",
            "format": ""
        },
        {
            "name": "visibility",
            "baseName": "visibility",
            "type": "ActivityVisibility",
            "format": ""
        },
        {
            "name": "category",
            "baseName": "category",
            "type": "ActivityCategory",
            "format": ""
        },
        {
            "name": "startTime",
            "baseName": "startTime",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "endTime",
            "baseName": "endTime",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "isAllDay",
            "baseName": "isAllDay",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "maxNumberOfParticipants",
            "baseName": "maxNumberOfParticipants",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "registrationLocked",
            "baseName": "registrationLocked",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "location",
            "baseName": "location",
            "type": "string",
            "format": ""
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string",
            "format": ""
        },
        {
            "name": "recurrenceFrequency",
            "baseName": "recurrenceFrequency",
            "type": "ActivityRecurrenceFrequency",
            "format": ""
        },
        {
            "name": "recurrenceInterval",
            "baseName": "recurrenceInterval",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "repeatUntil",
            "baseName": "repeatUntil",
            "type": "string",
            "format": "date"
        },
        {
            "name": "repeatCount",
            "baseName": "repeatCount",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "isInstance",
            "baseName": "isInstance",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "recurrenceDates",
            "baseName": "recurrenceDates",
            "type": "Array<Date>",
            "format": "date-time"
        },
        {
            "name": "recurrenceByDay",
            "baseName": "recurrenceByDay",
            "type": "Array<ActivityRecurrenceByDayDto>",
            "format": ""
        },
        {
            "name": "recurrenceByMonthDay",
            "baseName": "recurrenceByMonthDay",
            "type": "Array<number>",
            "format": "int32"
        },
        {
            "name": "recurrenceExceptions",
            "baseName": "recurrenceExceptions",
            "type": "Array<Date>",
            "format": "date-time"
        },
        {
            "name": "isRegistered",
            "baseName": "isRegistered",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "currentNumberOfParticipants",
            "baseName": "currentNumberOfParticipants",
            "type": "number",
            "format": "int32"
        }    ];

    static getAttributeTypeMap() {
        return ActivityDto.attributeTypeMap;
    }

    public constructor() {
    }
}


