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
import { ObservableAccountApi } from './ObservableAPI';

import { AccountApiRequestFactory, AccountApiResponseProcessor} from "../apis/AccountApi";
export class PromiseAccountApi {
    private api: ObservableAccountApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AccountApiRequestFactory,
        responseProcessor?: AccountApiResponseProcessor
    ) {
        this.api = new ObservableAccountApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param loginRequestDto 
     */
    public accountLoginPostWithHttpInfo(loginRequestDto?: LoginRequestDto, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.accountLoginPostWithHttpInfo(loginRequestDto, _options);
        return result.toPromise();
    }

    /**
     * @param loginRequestDto 
     */
    public accountLoginPost(loginRequestDto?: LoginRequestDto, _options?: Configuration): Promise<void> {
        const result = this.api.accountLoginPost(loginRequestDto, _options);
        return result.toPromise();
    }

    /**
     */
    public accountLogoutPostWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.accountLogoutPostWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public accountLogoutPost(_options?: Configuration): Promise<void> {
        const result = this.api.accountLogoutPost(_options);
        return result.toPromise();
    }

    /**
     */
    public accountMineDeleteWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.accountMineDeleteWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public accountMineDelete(_options?: Configuration): Promise<void> {
        const result = this.api.accountMineDelete(_options);
        return result.toPromise();
    }

    /**
     */
    public accountMineGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<AccountDto>> {
        const result = this.api.accountMineGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public accountMineGet(_options?: Configuration): Promise<AccountDto> {
        const result = this.api.accountMineGet(_options);
        return result.toPromise();
    }

    /**
     * @param registrationRequestDto 
     */
    public accountRegisterPostWithHttpInfo(registrationRequestDto?: RegistrationRequestDto, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.accountRegisterPostWithHttpInfo(registrationRequestDto, _options);
        return result.toPromise();
    }

    /**
     * @param registrationRequestDto 
     */
    public accountRegisterPost(registrationRequestDto?: RegistrationRequestDto, _options?: Configuration): Promise<void> {
        const result = this.api.accountRegisterPost(registrationRequestDto, _options);
        return result.toPromise();
    }


}



import { ObservableActivitiesApi } from './ObservableAPI';

import { ActivitiesApiRequestFactory, ActivitiesApiResponseProcessor} from "../apis/ActivitiesApi";
export class PromiseActivitiesApi {
    private api: ObservableActivitiesApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ActivitiesApiRequestFactory,
        responseProcessor?: ActivitiesApiResponseProcessor
    ) {
        this.api = new ObservableActivitiesApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param minDate 
     * @param maxDate 
     * @param searchTerm 
     * @param onlyRegistered 
     */
    public activitiesGetWithHttpInfo(minDate?: Date, maxDate?: Date, searchTerm?: string, onlyRegistered?: boolean, _options?: Configuration): Promise<HttpInfo<Array<ActivityDto>>> {
        const result = this.api.activitiesGetWithHttpInfo(minDate, maxDate, searchTerm, onlyRegistered, _options);
        return result.toPromise();
    }

    /**
     * @param minDate 
     * @param maxDate 
     * @param searchTerm 
     * @param onlyRegistered 
     */
    public activitiesGet(minDate?: Date, maxDate?: Date, searchTerm?: string, onlyRegistered?: boolean, _options?: Configuration): Promise<Array<ActivityDto>> {
        const result = this.api.activitiesGet(minDate, maxDate, searchTerm, onlyRegistered, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdDeleteWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.activitiesIdDeleteWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdDelete(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.activitiesIdDelete(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdGetWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<ActivityDto>> {
        const result = this.api.activitiesIdGetWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdGet(id: number, _options?: Configuration): Promise<ActivityDto> {
        const result = this.api.activitiesIdGet(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     * @param updateActivityDto 
     */
    public activitiesIdPutWithHttpInfo(id: number, updateActivityDto?: UpdateActivityDto, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.activitiesIdPutWithHttpInfo(id, updateActivityDto, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     * @param updateActivityDto 
     */
    public activitiesIdPut(id: number, updateActivityDto?: UpdateActivityDto, _options?: Configuration): Promise<void> {
        const result = this.api.activitiesIdPut(id, updateActivityDto, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdRegisterPostWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.activitiesIdRegisterPostWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdRegisterPost(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.activitiesIdRegisterPost(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdUnregisterPostWithHttpInfo(id: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.activitiesIdUnregisterPostWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public activitiesIdUnregisterPost(id: number, _options?: Configuration): Promise<void> {
        const result = this.api.activitiesIdUnregisterPost(id, _options);
        return result.toPromise();
    }

    /**
     */
    public activitiesPostWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ActivityCreatedDto>> {
        const result = this.api.activitiesPostWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public activitiesPost(_options?: Configuration): Promise<ActivityCreatedDto> {
        const result = this.api.activitiesPost(_options);
        return result.toPromise();
    }


}



import { ObservableAdminApi } from './ObservableAPI';

import { AdminApiRequestFactory, AdminApiResponseProcessor} from "../apis/AdminApi";
export class PromiseAdminApi {
    private api: ObservableAdminApi

    public constructor(
        configuration: Configuration,
        requestFactory?: AdminApiRequestFactory,
        responseProcessor?: AdminApiResponseProcessor
    ) {
        this.api = new ObservableAdminApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public adminUsersGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<Array<UserWithRolesDto>>> {
        const result = this.api.adminUsersGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public adminUsersGet(_options?: Configuration): Promise<Array<UserWithRolesDto>> {
        const result = this.api.adminUsersGet(_options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param isLocked 
     */
    public adminUsersUserIdLockedPutWithHttpInfo(userId: string, isLocked?: boolean, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.adminUsersUserIdLockedPutWithHttpInfo(userId, isLocked, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param isLocked 
     */
    public adminUsersUserIdLockedPut(userId: string, isLocked?: boolean, _options?: Configuration): Promise<void> {
        const result = this.api.adminUsersUserIdLockedPut(userId, isLocked, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param user 
     */
    public adminUsersUserIdPutWithHttpInfo(userId: string, user?: User, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.adminUsersUserIdPutWithHttpInfo(userId, user, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param user 
     */
    public adminUsersUserIdPut(userId: string, user?: User, _options?: Configuration): Promise<void> {
        const result = this.api.adminUsersUserIdPut(userId, user, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     */
    public adminUsersUserIdResetPasswordPostWithHttpInfo(userId: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.adminUsersUserIdResetPasswordPostWithHttpInfo(userId, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     */
    public adminUsersUserIdResetPasswordPost(userId: string, _options?: Configuration): Promise<void> {
        const result = this.api.adminUsersUserIdResetPasswordPost(userId, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesDeleteWithHttpInfo(userId: string, roleName?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.adminUsersUserIdRolesDeleteWithHttpInfo(userId, roleName, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesDelete(userId: string, roleName?: string, _options?: Configuration): Promise<void> {
        const result = this.api.adminUsersUserIdRolesDelete(userId, roleName, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesPostWithHttpInfo(userId: string, roleName?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.adminUsersUserIdRolesPostWithHttpInfo(userId, roleName, _options);
        return result.toPromise();
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesPost(userId: string, roleName?: string, _options?: Configuration): Promise<void> {
        const result = this.api.adminUsersUserIdRolesPost(userId, roleName, _options);
        return result.toPromise();
    }


}



import { ObservableDebugApi } from './ObservableAPI';

import { DebugApiRequestFactory, DebugApiResponseProcessor} from "../apis/DebugApi";
export class PromiseDebugApi {
    private api: ObservableDebugApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DebugApiRequestFactory,
        responseProcessor?: DebugApiResponseProcessor
    ) {
        this.api = new ObservableDebugApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public debugActivitiesAsCodeGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<string>> {
        const result = this.api.debugActivitiesAsCodeGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public debugActivitiesAsCodeGet(_options?: Configuration): Promise<string> {
        const result = this.api.debugActivitiesAsCodeGet(_options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public debugAssumePostWithHttpInfo(id?: string, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.debugAssumePostWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public debugAssumePost(id?: string, _options?: Configuration): Promise<void> {
        const result = this.api.debugAssumePost(id, _options);
        return result.toPromise();
    }

    /**
     */
    public debugErrorTestGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.debugErrorTestGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public debugErrorTestGet(_options?: Configuration): Promise<void> {
        const result = this.api.debugErrorTestGet(_options);
        return result.toPromise();
    }

    /**
     */
    public debugMyClaimsGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<Array<ClaimDto>>> {
        const result = this.api.debugMyClaimsGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public debugMyClaimsGet(_options?: Configuration): Promise<Array<ClaimDto>> {
        const result = this.api.debugMyClaimsGet(_options);
        return result.toPromise();
    }

    /**
     */
    public debugRateLimitingTestGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.debugRateLimitingTestGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public debugRateLimitingTestGet(_options?: Configuration): Promise<void> {
        const result = this.api.debugRateLimitingTestGet(_options);
        return result.toPromise();
    }


}



import { ObservableInquiryApi } from './ObservableAPI';

import { InquiryApiRequestFactory, InquiryApiResponseProcessor} from "../apis/InquiryApi";
export class PromiseInquiryApi {
    private api: ObservableInquiryApi

    public constructor(
        configuration: Configuration,
        requestFactory?: InquiryApiRequestFactory,
        responseProcessor?: InquiryApiResponseProcessor
    ) {
        this.api = new ObservableInquiryApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param createInquiryDto 
     */
    public inquiryPostWithHttpInfo(createInquiryDto?: CreateInquiryDto, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.inquiryPostWithHttpInfo(createInquiryDto, _options);
        return result.toPromise();
    }

    /**
     * @param createInquiryDto 
     */
    public inquiryPost(createInquiryDto?: CreateInquiryDto, _options?: Configuration): Promise<void> {
        const result = this.api.inquiryPost(createInquiryDto, _options);
        return result.toPromise();
    }


}



import { ObservableMetadataApi } from './ObservableAPI';

import { MetadataApiRequestFactory, MetadataApiResponseProcessor} from "../apis/MetadataApi";
export class PromiseMetadataApi {
    private api: ObservableMetadataApi

    public constructor(
        configuration: Configuration,
        requestFactory?: MetadataApiRequestFactory,
        responseProcessor?: MetadataApiResponseProcessor
    ) {
        this.api = new ObservableMetadataApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public metadataGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<ApiMetadataDto>> {
        const result = this.api.metadataGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public metadataGet(_options?: Configuration): Promise<ApiMetadataDto> {
        const result = this.api.metadataGet(_options);
        return result.toPromise();
    }


}



import { ObservableProfileApi } from './ObservableAPI';

import { ProfileApiRequestFactory, ProfileApiResponseProcessor} from "../apis/ProfileApi";
export class PromiseProfileApi {
    private api: ObservableProfileApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProfileApiRequestFactory,
        responseProcessor?: ProfileApiResponseProcessor
    ) {
        this.api = new ObservableProfileApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param id 
     */
    public profileIdGetWithHttpInfo(id: string, _options?: Configuration): Promise<HttpInfo<UserProfileDto>> {
        const result = this.api.profileIdGetWithHttpInfo(id, _options);
        return result.toPromise();
    }

    /**
     * @param id 
     */
    public profileIdGet(id: string, _options?: Configuration): Promise<UserProfileDto> {
        const result = this.api.profileIdGet(id, _options);
        return result.toPromise();
    }


}



