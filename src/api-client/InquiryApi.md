# .InquiryApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**inquiryPost**](InquiryApi.md#inquiryPost) | **POST** /inquiry | 


# **inquiryPost**
> void inquiryPost()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .InquiryApi(configuration);

let body:.InquiryApiInquiryPostRequest = {
  // CreateInquiryDto (optional)
  createInquiryDto: {
    emailAddress: "emailAddress_example",
    type: "General",
    message: "message_example",
    isAnonymous: true,
  },
};

apiInstance.inquiryPost(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createInquiryDto** | **CreateInquiryDto**|  |


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


