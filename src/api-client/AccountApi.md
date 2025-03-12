# .AccountApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**accountLoginPost**](AccountApi.md#accountLoginPost) | **POST** /account/login | 
[**accountLogoutPost**](AccountApi.md#accountLogoutPost) | **POST** /account/logout | 
[**accountMineDelete**](AccountApi.md#accountMineDelete) | **DELETE** /account/mine | 
[**accountMineGet**](AccountApi.md#accountMineGet) | **GET** /account/mine | 
[**accountRegisterPost**](AccountApi.md#accountRegisterPost) | **POST** /account/register | 


# **accountLoginPost**
> void accountLoginPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountApi(configuration);

let body:.AccountApiAccountLoginPostRequest = {
  // LoginRequestDto (optional)
  loginRequestDto: {
    email: "email_example",
    password: "password_example",
  },
};

apiInstance.accountLoginPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **loginRequestDto** | **LoginRequestDto**|  |


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

# **accountLogoutPost**
> void accountLogoutPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountApi(configuration);

let body:any = {};

apiInstance.accountLogoutPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **accountMineDelete**
> void accountMineDelete()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountApi(configuration);

let body:any = {};

apiInstance.accountMineDelete(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


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

# **accountMineGet**
> AccountDto accountMineGet()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountApi(configuration);

let body:any = {};

apiInstance.accountMineGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**AccountDto**

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

# **accountRegisterPost**
> accountRegisterPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .AccountApi(configuration);

let body:.AccountApiAccountRegisterPostRequest = {
  // RegistrationRequestDto (optional)
  registrationRequestDto: {
    account: {
      firstName: "firstName_example",
      lastName: "lastName_example",
      birthDay: new Date('1970-01-01').toISOString().split('T')[0];,
      email: "email_example",
      phoneNumber: "phoneNumber_example",
      streetName: "streetName_example",
      houseNumber: "houseNumber_example",
      zipCode: "04807",
      city: "city_example",
      goals: "goals_example",
      hobbies: "hobbies_example",
      impairedSight: true,
      impairedHearing: true,
      impairedSpeech: true,
      impairedMobility: true,
      additionalHandicaps: "additionalHandicaps_example",
    },
    password: "password_example",
    previewModePassword: "previewModePassword_example",
  },
};

apiInstance.accountRegisterPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registrationRequestDto** | **RegistrationRequestDto**|  |


### Return type

void (empty response body)

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


