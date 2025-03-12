# .ActivitiesApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**activitiesGet**](ActivitiesApi.md#activitiesGet) | **GET** /activities | 
[**activitiesIdDelete**](ActivitiesApi.md#activitiesIdDelete) | **DELETE** /activities/{id} | 
[**activitiesIdGet**](ActivitiesApi.md#activitiesIdGet) | **GET** /activities/{id} | 
[**activitiesIdPut**](ActivitiesApi.md#activitiesIdPut) | **PUT** /activities/{id} | 
[**activitiesIdRegisterPost**](ActivitiesApi.md#activitiesIdRegisterPost) | **POST** /activities/{id}/register | 
[**activitiesIdUnregisterPost**](ActivitiesApi.md#activitiesIdUnregisterPost) | **POST** /activities/{id}/unregister | 
[**activitiesPost**](ActivitiesApi.md#activitiesPost) | **POST** /activities | 


# **activitiesGet**
> Array<ActivityDto> activitiesGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesGetRequest = {
  // Date (optional)
  minDate: new Date('1970-01-01T00:00:00.00Z'),
  // Date (optional)
  maxDate: new Date('1970-01-01T00:00:00.00Z'),
  // string (optional)
  searchTerm: "searchTerm_example",
  // boolean (optional)
  onlyRegistered: false,
};

apiInstance.activitiesGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **minDate** | [**Date**] |  | (optional) defaults to undefined
 **maxDate** | [**Date**] |  | (optional) defaults to undefined
 **searchTerm** | [**string**] |  | (optional) defaults to undefined
 **onlyRegistered** | [**boolean**] |  | (optional) defaults to false


### Return type

**Array<ActivityDto>**

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

# **activitiesIdDelete**
> void activitiesIdDelete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesIdDeleteRequest = {
  // number
  id: 1,
};

apiInstance.activitiesIdDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


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

# **activitiesIdGet**
> ActivityDto activitiesIdGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesIdGetRequest = {
  // number
  id: 1,
};

apiInstance.activitiesIdGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


### Return type

**ActivityDto**

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

# **activitiesIdPut**
> void activitiesIdPut()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesIdPutRequest = {
  // number
  id: 1,
  // UpdateActivityDto (optional)
  updateActivityDto: {
    promoterId: 1,
    title: "title_example",
    visibility: "PrivateDraft",
    category: "Excursion",
    startTime: new Date('1970-01-01T00:00:00.00Z'),
    endTime: new Date('1970-01-01T00:00:00.00Z'),
    isAllDay: true,
    maxNumberOfParticipants: 0,
    registrationLocked: true,
    location: "location_example",
    description: "description_example",
    recurrenceFrequency: "None",
    recurrenceInterval: 1,
    repeatUntil: new Date('1970-01-01').toISOString().split('T')[0];,
    repeatCount: 1,
    recurrenceDates: [
      new Date('1970-01-01T00:00:00.00Z'),
    ],
    recurrenceByDay: [
      {
        ordinal: 1,
        dayOfWeek: "Sunday",
      },
    ],
    recurrenceByMonthDay: [
      1,
    ],
    recurrenceExceptions: [
      new Date('1970-01-01T00:00:00.00Z'),
    ],
  },
};

apiInstance.activitiesIdPut(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateActivityDto** | **UpdateActivityDto**|  |
 **id** | [**number**] |  | defaults to undefined


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

# **activitiesIdRegisterPost**
> void activitiesIdRegisterPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesIdRegisterPostRequest = {
  // number
  id: 1,
};

apiInstance.activitiesIdRegisterPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


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

# **activitiesIdUnregisterPost**
> void activitiesIdUnregisterPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:.ActivitiesApiActivitiesIdUnregisterPostRequest = {
  // number
  id: 1,
};

apiInstance.activitiesIdUnregisterPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


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

# **activitiesPost**
> ActivityCreatedDto activitiesPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .ActivitiesApi(configuration);

let body:any = {};

apiInstance.activitiesPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ActivityCreatedDto**

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


