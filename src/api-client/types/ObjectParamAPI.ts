import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { AccountDto } from '../models/AccountDto';
import { Activity } from '../models/Activity';
import { ActivityCategory } from '../models/ActivityCategory';
import { ActivityCreatedDto } from '../models/ActivityCreatedDto';
import { ActivityDto } from '../models/ActivityDto';
import { ActivityRecurrenceByDay } from '../models/ActivityRecurrenceByDay';
import { ActivityRecurrenceByDayDto } from '../models/ActivityRecurrenceByDayDto';
import { ActivityRecurrenceByMonthDay } from '../models/ActivityRecurrenceByMonthDay';
import { ActivityRecurrenceDate } from '../models/ActivityRecurrenceDate';
import { ActivityRecurrenceException } from '../models/ActivityRecurrenceException';
import { ActivityRecurrenceFrequency } from '../models/ActivityRecurrenceFrequency';
import { ActivityVisibility } from '../models/ActivityVisibility';
import { ApiMetadataDto } from '../models/ApiMetadataDto';
import { ClaimDto } from '../models/ClaimDto';
import { CreateInquiryDto } from '../models/CreateInquiryDto';
import { CreateUserDto } from '../models/CreateUserDto';
import { DayOfWeek } from '../models/DayOfWeek';
import { FieldValidationConstraintDto } from '../models/FieldValidationConstraintDto';
import { InquiryType } from '../models/InquiryType';
import { LoginRequestDto } from '../models/LoginRequestDto';
import { Promoter } from '../models/Promoter';
import { RegistrationErrorDto } from '../models/RegistrationErrorDto';
import { RegistrationRequestDto } from '../models/RegistrationRequestDto';
import { TypeConstraintsDto } from '../models/TypeConstraintsDto';
import { UpdateActivityDto } from '../models/UpdateActivityDto';
import { User } from '../models/User';
import { UserDto } from '../models/UserDto';
import { UserFavoriteCategory } from '../models/UserFavoriteCategory';
import { UserProfileDto } from '../models/UserProfileDto';
import { UserWithRolesDto } from '../models/UserWithRolesDto';
import { ValidationConstraintType } from '../models/ValidationConstraintType';

import { ObservableAccountApi } from "./ObservableAPI";
import { AccountApiRequestFactory, AccountApiResponseProcessor} from "../apis/AccountApi";

export interface AccountApiAccountLoginPostRequest {
    /**
     * 
     * @type LoginRequestDto
     * @memberof AccountApiaccountLoginPost
     */
    loginRequestDto?: LoginRequestDto
}

export interface AccountApiAccountLogoutPostRequest {
}

export interface AccountApiAccountMineDeleteRequest {
}

export interface AccountApiAccountMineGetRequest {
}

export interface AccountApiAccountRegisterPostRequest {
    /**
     * 
     * @type RegistrationRequestDto
     * @memberof AccountApiaccountRegisterPost
     */
    registrationRequestDto?: RegistrationRequestDto
}

export class ObjectAccountApi {
    private api: ObservableAccountApi

    public constructor(configuration: Configuration, requestFactory?: AccountApiRequestFactory, responseProcessor?: AccountApiResponseProcessor) {
        this.api = new ObservableAccountApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public accountLoginPostWithHttpInfo(param: AccountApiAccountLoginPostRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.accountLoginPostWithHttpInfo(param.loginRequestDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountLoginPost(param: AccountApiAccountLoginPostRequest = {}, options?: Configuration): Promise<void> {
        return this.api.accountLoginPost(param.loginRequestDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountLogoutPostWithHttpInfo(param: AccountApiAccountLogoutPostRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.accountLogoutPostWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountLogoutPost(param: AccountApiAccountLogoutPostRequest = {}, options?: Configuration): Promise<void> {
        return this.api.accountLogoutPost( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountMineDeleteWithHttpInfo(param: AccountApiAccountMineDeleteRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.accountMineDeleteWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountMineDelete(param: AccountApiAccountMineDeleteRequest = {}, options?: Configuration): Promise<void> {
        return this.api.accountMineDelete( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountMineGetWithHttpInfo(param: AccountApiAccountMineGetRequest = {}, options?: Configuration): Promise<HttpInfo<AccountDto>> {
        return this.api.accountMineGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountMineGet(param: AccountApiAccountMineGetRequest = {}, options?: Configuration): Promise<AccountDto> {
        return this.api.accountMineGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountRegisterPostWithHttpInfo(param: AccountApiAccountRegisterPostRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.accountRegisterPostWithHttpInfo(param.registrationRequestDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public accountRegisterPost(param: AccountApiAccountRegisterPostRequest = {}, options?: Configuration): Promise<void> {
        return this.api.accountRegisterPost(param.registrationRequestDto,  options).toPromise();
    }

}

import { ObservableActivitiesApi } from "./ObservableAPI";
import { ActivitiesApiRequestFactory, ActivitiesApiResponseProcessor} from "../apis/ActivitiesApi";

export interface ActivitiesApiActivitiesGetRequest {
    /**
     * 
     * @type Date
     * @memberof ActivitiesApiactivitiesGet
     */
    minDate?: Date
    /**
     * 
     * @type Date
     * @memberof ActivitiesApiactivitiesGet
     */
    maxDate?: Date
    /**
     * 
     * @type string
     * @memberof ActivitiesApiactivitiesGet
     */
    searchTerm?: string
    /**
     * 
     * @type boolean
     * @memberof ActivitiesApiactivitiesGet
     */
    onlyRegistered?: boolean
}

export interface ActivitiesApiActivitiesIdDeleteRequest {
    /**
     * 
     * @type number
     * @memberof ActivitiesApiactivitiesIdDelete
     */
    id: number
}

export interface ActivitiesApiActivitiesIdGetRequest {
    /**
     * 
     * @type number
     * @memberof ActivitiesApiactivitiesIdGet
     */
    id: number
}

export interface ActivitiesApiActivitiesIdPutRequest {
    /**
     * 
     * @type number
     * @memberof ActivitiesApiactivitiesIdPut
     */
    id: number
    /**
     * 
     * @type UpdateActivityDto
     * @memberof ActivitiesApiactivitiesIdPut
     */
    updateActivityDto?: UpdateActivityDto
}

export interface ActivitiesApiActivitiesIdRegisterPostRequest {
    /**
     * 
     * @type number
     * @memberof ActivitiesApiactivitiesIdRegisterPost
     */
    id: number
}

export interface ActivitiesApiActivitiesIdUnregisterPostRequest {
    /**
     * 
     * @type number
     * @memberof ActivitiesApiactivitiesIdUnregisterPost
     */
    id: number
}

export interface ActivitiesApiActivitiesPostRequest {
}

export class ObjectActivitiesApi {
    private api: ObservableActivitiesApi

    public constructor(configuration: Configuration, requestFactory?: ActivitiesApiRequestFactory, responseProcessor?: ActivitiesApiResponseProcessor) {
        this.api = new ObservableActivitiesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public activitiesGetWithHttpInfo(param: ActivitiesApiActivitiesGetRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ActivityDto>>> {
        return this.api.activitiesGetWithHttpInfo(param.minDate, param.maxDate, param.searchTerm, param.onlyRegistered,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesGet(param: ActivitiesApiActivitiesGetRequest = {}, options?: Configuration): Promise<Array<ActivityDto>> {
        return this.api.activitiesGet(param.minDate, param.maxDate, param.searchTerm, param.onlyRegistered,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdDeleteWithHttpInfo(param: ActivitiesApiActivitiesIdDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.activitiesIdDeleteWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdDelete(param: ActivitiesApiActivitiesIdDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.activitiesIdDelete(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdGetWithHttpInfo(param: ActivitiesApiActivitiesIdGetRequest, options?: Configuration): Promise<HttpInfo<ActivityDto>> {
        return this.api.activitiesIdGetWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdGet(param: ActivitiesApiActivitiesIdGetRequest, options?: Configuration): Promise<ActivityDto> {
        return this.api.activitiesIdGet(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdPutWithHttpInfo(param: ActivitiesApiActivitiesIdPutRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.activitiesIdPutWithHttpInfo(param.id, param.updateActivityDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdPut(param: ActivitiesApiActivitiesIdPutRequest, options?: Configuration): Promise<void> {
        return this.api.activitiesIdPut(param.id, param.updateActivityDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdRegisterPostWithHttpInfo(param: ActivitiesApiActivitiesIdRegisterPostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.activitiesIdRegisterPostWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdRegisterPost(param: ActivitiesApiActivitiesIdRegisterPostRequest, options?: Configuration): Promise<void> {
        return this.api.activitiesIdRegisterPost(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdUnregisterPostWithHttpInfo(param: ActivitiesApiActivitiesIdUnregisterPostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.activitiesIdUnregisterPostWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesIdUnregisterPost(param: ActivitiesApiActivitiesIdUnregisterPostRequest, options?: Configuration): Promise<void> {
        return this.api.activitiesIdUnregisterPost(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesPostWithHttpInfo(param: ActivitiesApiActivitiesPostRequest = {}, options?: Configuration): Promise<HttpInfo<ActivityCreatedDto>> {
        return this.api.activitiesPostWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public activitiesPost(param: ActivitiesApiActivitiesPostRequest = {}, options?: Configuration): Promise<ActivityCreatedDto> {
        return this.api.activitiesPost( options).toPromise();
    }

}

import { ObservableAdminApi } from "./ObservableAPI";
import { AdminApiRequestFactory, AdminApiResponseProcessor} from "../apis/AdminApi";

export interface AdminApiAdminUsersGetRequest {
}

export interface AdminApiAdminUsersUserIdLockedPutRequest {
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdLockedPut
     */
    userId: string
    /**
     * 
     * @type boolean
     * @memberof AdminApiadminUsersUserIdLockedPut
     */
    isLocked?: boolean
}

export interface AdminApiAdminUsersUserIdPutRequest {
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdPut
     */
    userId: string
    /**
     * 
     * @type User
     * @memberof AdminApiadminUsersUserIdPut
     */
    user?: User
}

export interface AdminApiAdminUsersUserIdResetPasswordPostRequest {
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdResetPasswordPost
     */
    userId: string
}

export interface AdminApiAdminUsersUserIdRolesDeleteRequest {
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdRolesDelete
     */
    userId: string
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdRolesDelete
     */
    roleName?: string
}

export interface AdminApiAdminUsersUserIdRolesPostRequest {
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdRolesPost
     */
    userId: string
    /**
     * 
     * @type string
     * @memberof AdminApiadminUsersUserIdRolesPost
     */
    roleName?: string
}

export class ObjectAdminApi {
    private api: ObservableAdminApi

    public constructor(configuration: Configuration, requestFactory?: AdminApiRequestFactory, responseProcessor?: AdminApiResponseProcessor) {
        this.api = new ObservableAdminApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public adminUsersGetWithHttpInfo(param: AdminApiAdminUsersGetRequest = {}, options?: Configuration): Promise<HttpInfo<Array<UserWithRolesDto>>> {
        return this.api.adminUsersGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersGet(param: AdminApiAdminUsersGetRequest = {}, options?: Configuration): Promise<Array<UserWithRolesDto>> {
        return this.api.adminUsersGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdLockedPutWithHttpInfo(param: AdminApiAdminUsersUserIdLockedPutRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.adminUsersUserIdLockedPutWithHttpInfo(param.userId, param.isLocked,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdLockedPut(param: AdminApiAdminUsersUserIdLockedPutRequest, options?: Configuration): Promise<void> {
        return this.api.adminUsersUserIdLockedPut(param.userId, param.isLocked,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdPutWithHttpInfo(param: AdminApiAdminUsersUserIdPutRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.adminUsersUserIdPutWithHttpInfo(param.userId, param.user,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdPut(param: AdminApiAdminUsersUserIdPutRequest, options?: Configuration): Promise<void> {
        return this.api.adminUsersUserIdPut(param.userId, param.user,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdResetPasswordPostWithHttpInfo(param: AdminApiAdminUsersUserIdResetPasswordPostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.adminUsersUserIdResetPasswordPostWithHttpInfo(param.userId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdResetPasswordPost(param: AdminApiAdminUsersUserIdResetPasswordPostRequest, options?: Configuration): Promise<void> {
        return this.api.adminUsersUserIdResetPasswordPost(param.userId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdRolesDeleteWithHttpInfo(param: AdminApiAdminUsersUserIdRolesDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.adminUsersUserIdRolesDeleteWithHttpInfo(param.userId, param.roleName,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdRolesDelete(param: AdminApiAdminUsersUserIdRolesDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.adminUsersUserIdRolesDelete(param.userId, param.roleName,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdRolesPostWithHttpInfo(param: AdminApiAdminUsersUserIdRolesPostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.adminUsersUserIdRolesPostWithHttpInfo(param.userId, param.roleName,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public adminUsersUserIdRolesPost(param: AdminApiAdminUsersUserIdRolesPostRequest, options?: Configuration): Promise<void> {
        return this.api.adminUsersUserIdRolesPost(param.userId, param.roleName,  options).toPromise();
    }

}

import { ObservableDebugApi } from "./ObservableAPI";
import { DebugApiRequestFactory, DebugApiResponseProcessor} from "../apis/DebugApi";

export interface DebugApiDebugActivitiesAsCodeGetRequest {
}

export interface DebugApiDebugAssumePostRequest {
    /**
     * 
     * @type string
     * @memberof DebugApidebugAssumePost
     */
    id?: string
}

export interface DebugApiDebugErrorTestGetRequest {
}

export interface DebugApiDebugMyClaimsGetRequest {
}

export interface DebugApiDebugRateLimitingTestGetRequest {
}

export class ObjectDebugApi {
    private api: ObservableDebugApi

    public constructor(configuration: Configuration, requestFactory?: DebugApiRequestFactory, responseProcessor?: DebugApiResponseProcessor) {
        this.api = new ObservableDebugApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public debugActivitiesAsCodeGetWithHttpInfo(param: DebugApiDebugActivitiesAsCodeGetRequest = {}, options?: Configuration): Promise<HttpInfo<string>> {
        return this.api.debugActivitiesAsCodeGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugActivitiesAsCodeGet(param: DebugApiDebugActivitiesAsCodeGetRequest = {}, options?: Configuration): Promise<string> {
        return this.api.debugActivitiesAsCodeGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugAssumePostWithHttpInfo(param: DebugApiDebugAssumePostRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.debugAssumePostWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugAssumePost(param: DebugApiDebugAssumePostRequest = {}, options?: Configuration): Promise<void> {
        return this.api.debugAssumePost(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugErrorTestGetWithHttpInfo(param: DebugApiDebugErrorTestGetRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.debugErrorTestGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugErrorTestGet(param: DebugApiDebugErrorTestGetRequest = {}, options?: Configuration): Promise<void> {
        return this.api.debugErrorTestGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugMyClaimsGetWithHttpInfo(param: DebugApiDebugMyClaimsGetRequest = {}, options?: Configuration): Promise<HttpInfo<Array<ClaimDto>>> {
        return this.api.debugMyClaimsGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugMyClaimsGet(param: DebugApiDebugMyClaimsGetRequest = {}, options?: Configuration): Promise<Array<ClaimDto>> {
        return this.api.debugMyClaimsGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugRateLimitingTestGetWithHttpInfo(param: DebugApiDebugRateLimitingTestGetRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.debugRateLimitingTestGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public debugRateLimitingTestGet(param: DebugApiDebugRateLimitingTestGetRequest = {}, options?: Configuration): Promise<void> {
        return this.api.debugRateLimitingTestGet( options).toPromise();
    }

}

import { ObservableInquiryApi } from "./ObservableAPI";
import { InquiryApiRequestFactory, InquiryApiResponseProcessor} from "../apis/InquiryApi";

export interface InquiryApiInquiryPostRequest {
    /**
     * 
     * @type CreateInquiryDto
     * @memberof InquiryApiinquiryPost
     */
    createInquiryDto?: CreateInquiryDto
}

export class ObjectInquiryApi {
    private api: ObservableInquiryApi

    public constructor(configuration: Configuration, requestFactory?: InquiryApiRequestFactory, responseProcessor?: InquiryApiResponseProcessor) {
        this.api = new ObservableInquiryApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public inquiryPostWithHttpInfo(param: InquiryApiInquiryPostRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.inquiryPostWithHttpInfo(param.createInquiryDto,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public inquiryPost(param: InquiryApiInquiryPostRequest = {}, options?: Configuration): Promise<void> {
        return this.api.inquiryPost(param.createInquiryDto,  options).toPromise();
    }

}

import { ObservableMetadataApi } from "./ObservableAPI";
import { MetadataApiRequestFactory, MetadataApiResponseProcessor} from "../apis/MetadataApi";

export interface MetadataApiMetadataGetRequest {
}

export class ObjectMetadataApi {
    private api: ObservableMetadataApi

    public constructor(configuration: Configuration, requestFactory?: MetadataApiRequestFactory, responseProcessor?: MetadataApiResponseProcessor) {
        this.api = new ObservableMetadataApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public metadataGetWithHttpInfo(param: MetadataApiMetadataGetRequest = {}, options?: Configuration): Promise<HttpInfo<ApiMetadataDto>> {
        return this.api.metadataGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public metadataGet(param: MetadataApiMetadataGetRequest = {}, options?: Configuration): Promise<ApiMetadataDto> {
        return this.api.metadataGet( options).toPromise();
    }

}

import { ObservableProfileApi } from "./ObservableAPI";
import { ProfileApiRequestFactory, ProfileApiResponseProcessor} from "../apis/ProfileApi";

export interface ProfileApiProfileIdGetRequest {
    /**
     * 
     * @type string
     * @memberof ProfileApiprofileIdGet
     */
    id: string
}

export class ObjectProfileApi {
    private api: ObservableProfileApi

    public constructor(configuration: Configuration, requestFactory?: ProfileApiRequestFactory, responseProcessor?: ProfileApiResponseProcessor) {
        this.api = new ObservableProfileApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public profileIdGetWithHttpInfo(param: ProfileApiProfileIdGetRequest, options?: Configuration): Promise<HttpInfo<UserProfileDto>> {
        return this.api.profileIdGetWithHttpInfo(param.id,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public profileIdGet(param: ProfileApiProfileIdGetRequest, options?: Configuration): Promise<UserProfileDto> {
        return this.api.profileIdGet(param.id,  options).toPromise();
    }

}
