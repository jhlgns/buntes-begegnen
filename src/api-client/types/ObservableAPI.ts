import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { AccountApiRequestFactory, AccountApiResponseProcessor} from "../apis/AccountApi";
export class ObservableAccountApi {
    private requestFactory: AccountApiRequestFactory;
    private responseProcessor: AccountApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AccountApiRequestFactory,
        responseProcessor?: AccountApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AccountApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AccountApiResponseProcessor();
    }

    /**
     * @param loginRequestDto 
     */
    public accountLoginPostWithHttpInfo(loginRequestDto?: LoginRequestDto, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.accountLoginPost(loginRequestDto, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.accountLoginPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param loginRequestDto 
     */
    public accountLoginPost(loginRequestDto?: LoginRequestDto, _options?: Configuration): Observable<void> {
        return this.accountLoginPostWithHttpInfo(loginRequestDto, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public accountLogoutPostWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.accountLogoutPost(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.accountLogoutPostWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public accountLogoutPost(_options?: Configuration): Observable<void> {
        return this.accountLogoutPostWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public accountMineDeleteWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.accountMineDelete(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.accountMineDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public accountMineDelete(_options?: Configuration): Observable<void> {
        return this.accountMineDeleteWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public accountMineGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<AccountDto>> {
        const requestContextPromise = this.requestFactory.accountMineGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.accountMineGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public accountMineGet(_options?: Configuration): Observable<AccountDto> {
        return this.accountMineGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<AccountDto>) => apiResponse.data));
    }

    /**
     * @param registrationRequestDto 
     */
    public accountRegisterPostWithHttpInfo(registrationRequestDto?: RegistrationRequestDto, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.accountRegisterPost(registrationRequestDto, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.accountRegisterPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param registrationRequestDto 
     */
    public accountRegisterPost(registrationRequestDto?: RegistrationRequestDto, _options?: Configuration): Observable<void> {
        return this.accountRegisterPostWithHttpInfo(registrationRequestDto, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { ActivitiesApiRequestFactory, ActivitiesApiResponseProcessor} from "../apis/ActivitiesApi";
export class ObservableActivitiesApi {
    private requestFactory: ActivitiesApiRequestFactory;
    private responseProcessor: ActivitiesApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ActivitiesApiRequestFactory,
        responseProcessor?: ActivitiesApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ActivitiesApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ActivitiesApiResponseProcessor();
    }

    /**
     * @param minDate 
     * @param maxDate 
     * @param searchTerm 
     * @param onlyRegistered 
     */
    public activitiesGetWithHttpInfo(minDate?: Date, maxDate?: Date, searchTerm?: string, onlyRegistered?: boolean, _options?: Configuration): Observable<HttpInfo<Array<ActivityDto>>> {
        const requestContextPromise = this.requestFactory.activitiesGet(minDate, maxDate, searchTerm, onlyRegistered, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param minDate 
     * @param maxDate 
     * @param searchTerm 
     * @param onlyRegistered 
     */
    public activitiesGet(minDate?: Date, maxDate?: Date, searchTerm?: string, onlyRegistered?: boolean, _options?: Configuration): Observable<Array<ActivityDto>> {
        return this.activitiesGetWithHttpInfo(minDate, maxDate, searchTerm, onlyRegistered, _options).pipe(map((apiResponse: HttpInfo<Array<ActivityDto>>) => apiResponse.data));
    }

    /**
     * @param id 
     */
    public activitiesIdDeleteWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.activitiesIdDelete(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesIdDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public activitiesIdDelete(id: number, _options?: Configuration): Observable<void> {
        return this.activitiesIdDeleteWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param id 
     */
    public activitiesIdGetWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<ActivityDto>> {
        const requestContextPromise = this.requestFactory.activitiesIdGet(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public activitiesIdGet(id: number, _options?: Configuration): Observable<ActivityDto> {
        return this.activitiesIdGetWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<ActivityDto>) => apiResponse.data));
    }

    /**
     * @param id 
     * @param updateActivityDto 
     */
    public activitiesIdPutWithHttpInfo(id: number, updateActivityDto?: UpdateActivityDto, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.activitiesIdPut(id, updateActivityDto, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     * @param updateActivityDto 
     */
    public activitiesIdPut(id: number, updateActivityDto?: UpdateActivityDto, _options?: Configuration): Observable<void> {
        return this.activitiesIdPutWithHttpInfo(id, updateActivityDto, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param id 
     */
    public activitiesIdRegisterPostWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.activitiesIdRegisterPost(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesIdRegisterPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public activitiesIdRegisterPost(id: number, _options?: Configuration): Observable<void> {
        return this.activitiesIdRegisterPostWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param id 
     */
    public activitiesIdUnregisterPostWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.activitiesIdUnregisterPost(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesIdUnregisterPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public activitiesIdUnregisterPost(id: number, _options?: Configuration): Observable<void> {
        return this.activitiesIdUnregisterPostWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public activitiesPostWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ActivityCreatedDto>> {
        const requestContextPromise = this.requestFactory.activitiesPost(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.activitiesPostWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public activitiesPost(_options?: Configuration): Observable<ActivityCreatedDto> {
        return this.activitiesPostWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ActivityCreatedDto>) => apiResponse.data));
    }

}

import { AdminApiRequestFactory, AdminApiResponseProcessor} from "../apis/AdminApi";
export class ObservableAdminApi {
    private requestFactory: AdminApiRequestFactory;
    private responseProcessor: AdminApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: AdminApiRequestFactory,
        responseProcessor?: AdminApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new AdminApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new AdminApiResponseProcessor();
    }

    /**
     */
    public adminUsersGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<UserWithRolesDto>>> {
        const requestContextPromise = this.requestFactory.adminUsersGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public adminUsersGet(_options?: Configuration): Observable<Array<UserWithRolesDto>> {
        return this.adminUsersGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<UserWithRolesDto>>) => apiResponse.data));
    }

    /**
     * @param userId 
     * @param isLocked 
     */
    public adminUsersUserIdLockedPutWithHttpInfo(userId: string, isLocked?: boolean, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.adminUsersUserIdLockedPut(userId, isLocked, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersUserIdLockedPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userId 
     * @param isLocked 
     */
    public adminUsersUserIdLockedPut(userId: string, isLocked?: boolean, _options?: Configuration): Observable<void> {
        return this.adminUsersUserIdLockedPutWithHttpInfo(userId, isLocked, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param userId 
     * @param user 
     */
    public adminUsersUserIdPutWithHttpInfo(userId: string, user?: User, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.adminUsersUserIdPut(userId, user, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersUserIdPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userId 
     * @param user 
     */
    public adminUsersUserIdPut(userId: string, user?: User, _options?: Configuration): Observable<void> {
        return this.adminUsersUserIdPutWithHttpInfo(userId, user, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param userId 
     */
    public adminUsersUserIdResetPasswordPostWithHttpInfo(userId: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.adminUsersUserIdResetPasswordPost(userId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersUserIdResetPasswordPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userId 
     */
    public adminUsersUserIdResetPasswordPost(userId: string, _options?: Configuration): Observable<void> {
        return this.adminUsersUserIdResetPasswordPostWithHttpInfo(userId, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesDeleteWithHttpInfo(userId: string, roleName?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.adminUsersUserIdRolesDelete(userId, roleName, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersUserIdRolesDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesDelete(userId: string, roleName?: string, _options?: Configuration): Observable<void> {
        return this.adminUsersUserIdRolesDeleteWithHttpInfo(userId, roleName, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesPostWithHttpInfo(userId: string, roleName?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.adminUsersUserIdRolesPost(userId, roleName, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.adminUsersUserIdRolesPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param userId 
     * @param roleName 
     */
    public adminUsersUserIdRolesPost(userId: string, roleName?: string, _options?: Configuration): Observable<void> {
        return this.adminUsersUserIdRolesPostWithHttpInfo(userId, roleName, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { DebugApiRequestFactory, DebugApiResponseProcessor} from "../apis/DebugApi";
export class ObservableDebugApi {
    private requestFactory: DebugApiRequestFactory;
    private responseProcessor: DebugApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DebugApiRequestFactory,
        responseProcessor?: DebugApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DebugApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DebugApiResponseProcessor();
    }

    /**
     */
    public debugActivitiesAsCodeGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<string>> {
        const requestContextPromise = this.requestFactory.debugActivitiesAsCodeGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.debugActivitiesAsCodeGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public debugActivitiesAsCodeGet(_options?: Configuration): Observable<string> {
        return this.debugActivitiesAsCodeGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<string>) => apiResponse.data));
    }

    /**
     * @param id 
     */
    public debugAssumePostWithHttpInfo(id?: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.debugAssumePost(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.debugAssumePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public debugAssumePost(id?: string, _options?: Configuration): Observable<void> {
        return this.debugAssumePostWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public debugErrorTestGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.debugErrorTestGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.debugErrorTestGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public debugErrorTestGet(_options?: Configuration): Observable<void> {
        return this.debugErrorTestGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     */
    public debugMyClaimsGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<ClaimDto>>> {
        const requestContextPromise = this.requestFactory.debugMyClaimsGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.debugMyClaimsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public debugMyClaimsGet(_options?: Configuration): Observable<Array<ClaimDto>> {
        return this.debugMyClaimsGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<ClaimDto>>) => apiResponse.data));
    }

    /**
     */
    public debugRateLimitingTestGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.debugRateLimitingTestGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.debugRateLimitingTestGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public debugRateLimitingTestGet(_options?: Configuration): Observable<void> {
        return this.debugRateLimitingTestGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { InquiryApiRequestFactory, InquiryApiResponseProcessor} from "../apis/InquiryApi";
export class ObservableInquiryApi {
    private requestFactory: InquiryApiRequestFactory;
    private responseProcessor: InquiryApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: InquiryApiRequestFactory,
        responseProcessor?: InquiryApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new InquiryApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new InquiryApiResponseProcessor();
    }

    /**
     * @param createInquiryDto 
     */
    public inquiryPostWithHttpInfo(createInquiryDto?: CreateInquiryDto, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.inquiryPost(createInquiryDto, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.inquiryPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param createInquiryDto 
     */
    public inquiryPost(createInquiryDto?: CreateInquiryDto, _options?: Configuration): Observable<void> {
        return this.inquiryPostWithHttpInfo(createInquiryDto, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { MetadataApiRequestFactory, MetadataApiResponseProcessor} from "../apis/MetadataApi";
export class ObservableMetadataApi {
    private requestFactory: MetadataApiRequestFactory;
    private responseProcessor: MetadataApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: MetadataApiRequestFactory,
        responseProcessor?: MetadataApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new MetadataApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new MetadataApiResponseProcessor();
    }

    /**
     */
    public metadataGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<ApiMetadataDto>> {
        const requestContextPromise = this.requestFactory.metadataGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.metadataGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public metadataGet(_options?: Configuration): Observable<ApiMetadataDto> {
        return this.metadataGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ApiMetadataDto>) => apiResponse.data));
    }

}

import { ProfileApiRequestFactory, ProfileApiResponseProcessor} from "../apis/ProfileApi";
export class ObservableProfileApi {
    private requestFactory: ProfileApiRequestFactory;
    private responseProcessor: ProfileApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ProfileApiRequestFactory,
        responseProcessor?: ProfileApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ProfileApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ProfileApiResponseProcessor();
    }

    /**
     * @param id 
     */
    public profileIdGetWithHttpInfo(id: string, _options?: Configuration): Observable<HttpInfo<UserProfileDto>> {
        const requestContextPromise = this.requestFactory.profileIdGet(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.profileIdGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param id 
     */
    public profileIdGet(id: string, _options?: Configuration): Observable<UserProfileDto> {
        return this.profileIdGetWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<UserProfileDto>) => apiResponse.data));
    }

}
