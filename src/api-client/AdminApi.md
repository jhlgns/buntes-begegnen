# .AdminApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**adminUsersGet**](AdminApi.md#adminUsersGet) | **GET** /admin/users | 
[**adminUsersUserIdLockedPut**](AdminApi.md#adminUsersUserIdLockedPut) | **PUT** /admin/users/{userId}/locked | 
[**adminUsersUserIdPut**](AdminApi.md#adminUsersUserIdPut) | **PUT** /admin/users/{userId} | 
[**adminUsersUserIdResetPasswordPost**](AdminApi.md#adminUsersUserIdResetPasswordPost) | **POST** /admin/users/{userId}/reset-password | 
[**adminUsersUserIdRolesDelete**](AdminApi.md#adminUsersUserIdRolesDelete) | **DELETE** /admin/users/{userId}/roles | 
[**adminUsersUserIdRolesPost**](AdminApi.md#adminUsersUserIdRolesPost) | **POST** /admin/users/{userId}/roles | 


# **adminUsersGet**
> Array<UserWithRolesDto> adminUsersGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:any = {};

apiInstance.adminUsersGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<UserWithRolesDto>**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **adminUsersUserIdLockedPut**
> void adminUsersUserIdLockedPut()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:.AdminApiAdminUsersUserIdLockedPutRequest = {
  // string
  userId: "userId_example",
  // boolean (optional)
  isLocked: true,
};

apiInstance.adminUsersUserIdLockedPut(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] |  | defaults to undefined
 **isLocked** | [**boolean**] |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **adminUsersUserIdPut**
> void adminUsersUserIdPut()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:.AdminApiAdminUsersUserIdPutRequest = {
  // string
  userId: "userId_example",
  // User (optional)
  user: {
    id: "id_example",
    userName: "userName_example",
    normalizedUserName: "normalizedUserName_example",
    email: "email_example",
    normalizedEmail: "normalizedEmail_example",
    emailConfirmed: true,
    passwordHash: "passwordHash_example",
    securityStamp: "securityStamp_example",
    concurrencyStamp: "concurrencyStamp_example",
    phoneNumber: "phoneNumber_example",
    phoneNumberConfirmed: true,
    twoFactorEnabled: true,
    lockoutEnd: new Date('1970-01-01T00:00:00.00Z'),
    lockoutEnabled: true,
    accessFailedCount: 1,
    createdAt: new Date('1970-01-01T00:00:00.00Z'),
    firstName: "firstName_example",
    lastName: "lastName_example",
    birthDay: new Date('1970-01-01').toISOString().split('T')[0];,
    streetName: "streetName_example",
    houseNumber: "houseNumber_example",
    zipCode: "zipCode_example",
    city: "city_example",
    promoterId: 1,
    promoter: {
      id: 1,
      createdAt: new Date('1970-01-01T00:00:00.00Z'),
      createdById: "createdById_example",
      createdBy: ,
      isDeleted: true,
      name: "name_example",
      website: "website_example",
      streetName: "streetName_example",
      houseNumber: "houseNumber_example",
      zipCode: "zipCode_example",
      city: "city_example",
      activities: [
        {
          id: 1,
          createdAt: new Date('1970-01-01T00:00:00.00Z'),
          createdById: "createdById_example",
          createdBy: ,
          isDeleted: true,
          promoterId: 1,
          promoter: ,
          title: "title_example",
          visibility: "PrivateDraft",
          category: "Excursion",
          startTime: new Date('1970-01-01T00:00:00.00Z'),
          endTime: new Date('1970-01-01T00:00:00.00Z'),
          isAllDay: true,
          maxNumberOfParticipants: 1,
          registrationLocked: true,
          location: "location_example",
          description: "description_example",
          recurrenceFrequency: "None",
          recurrenceInterval: 1,
          repeatUntil: new Date('1970-01-01').toISOString().split('T')[0];,
          repeatCount: 1,
          recurrenceDates: [
            {
              activityId: 1,
              activity: ,
              startTime: new Date('1970-01-01T00:00:00.00Z'),
            },
          ],
          recurrenceByDay: [
            {
              activityId: 1,
              activity: ,
              ordinal: 1,
              dayOfWeek: "Sunday",
            },
          ],
          recurrenceByMonthDay: [
            {
              activityId: 1,
              activity: ,
              monthDay: 1,
            },
          ],
          recurrenceExceptions: [
            {
              activityId: 1,
              activity: ,
              startTime: new Date('1970-01-01T00:00:00.00Z'),
            },
          ],
        },
      ],
    },
    goals: "goals_example",
    hobbies: "hobbies_example",
    favoriteCategories: [
      {
        userId: "userId_example",
        user: ,
        category: "Excursion",
      },
    ],
    impairedSight: true,
    impairedHearing: true,
    impairedSpeech: true,
    impairedMobility: true,
    additionalHandicaps: "additionalHandicaps_example",
  },
};

apiInstance.adminUsersUserIdPut(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user** | **User**|  |
 **userId** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **adminUsersUserIdResetPasswordPost**
> void adminUsersUserIdResetPasswordPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:.AdminApiAdminUsersUserIdResetPasswordPostRequest = {
  // string
  userId: "userId_example",
};

apiInstance.adminUsersUserIdResetPasswordPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] |  | defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **adminUsersUserIdRolesDelete**
> void adminUsersUserIdRolesDelete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:.AdminApiAdminUsersUserIdRolesDeleteRequest = {
  // string
  userId: "userId_example",
  // string (optional)
  roleName: "roleName_example",
};

apiInstance.adminUsersUserIdRolesDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] |  | defaults to undefined
 **roleName** | [**string**] |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **adminUsersUserIdRolesPost**
> void adminUsersUserIdRolesPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AdminApi(configuration);

let body:.AdminApiAdminUsersUserIdRolesPostRequest = {
  // string
  userId: "userId_example",
  // string (optional)
  roleName: "roleName_example",
};

apiInstance.adminUsersUserIdRolesPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**string**] |  | defaults to undefined
 **roleName** | [**string**] |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


