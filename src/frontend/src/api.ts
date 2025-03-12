import { ReadonlySignal, useSignal, Signal, useSignalEffect } from "@preact/signals";
import { Configuration, createConfiguration, ServerConfiguration, HttpLibrary, RequestContext, ResponseContext } from "bundlor-web-api-client";
import { Observable, from } from "../../api-client/dist/rxjsStub";
import { PromiseMiddleware } from "../../api-client/dist/middleware";

const apiBaseAddress = import.meta.env.BUNTES_BEGEGNEN_API_BASE_ADDRESS ?? "https://localhost:8443";
console.log("API BASE ADDRESS IS", apiBaseAddress);

//
// API result hook
//

export enum ResultStatus {
    Loading = 1,
    Done = 2,
    Failed = 3,
}

export interface ApiResult<TResponse> {
    readonly status: ResultStatus;
    readonly response: TResponse | null;
    readonly error: any | null;
}

export function throwOnError<T>(result: ApiResult<T>): ApiResult<T> {
    if (result.status == ResultStatus.Failed) {
        throw Error("API result error: " + result.error);  // TODO: Error handling to present fatal errors to the user?
    }

    return result;
}

export function useApiResult<TResponse>(
    computeResponse: (config: Configuration) => Promise<TResponse> | null,
    additionalDependencies?: Signal<any>[],
    args?: { skipResetWhenReloading?: boolean },
): ReadonlySignal<ApiResult<TResponse>> {
    const result = useSignal<ApiResult<TResponse>>({ status: ResultStatus.Loading, response: null, error: null });

    useSignalEffect(
        () => {
            for (const dependency of additionalDependencies ?? []) {
                const _ = dependency.value;
            }

            if (args?.skipResetWhenReloading != true) {
                result.value = { status: ResultStatus.Loading, response: null, error: null };
            }

            async function run() {
                const config = makeConfig();

                try {
                    const response = await computeResponse(config);

                    if (ignore) {
                        return;
                    }

                    result.value = { status: ResultStatus.Done, response: response, error: null };
                } catch (e) {
                    console.error(e);
                    if (ignore) {
                        return;
                    }

                    result.value = { status: ResultStatus.Failed, response: null, error: e };
                }
            }

            let ignore = false;
            run();
            return () => ignore = true;
        },
    );

    return result;
}

// TODO: If the requests must be authenticated, create something like useRequireAuthenticated()

export async function getApiResult<TResponse>(getResponse: (config: Configuration) => Promise<TResponse>): Promise<ApiResult<TResponse>> {
    const config = makeConfig();

    try {
        const response = await getResponse(config);

        return { status: ResultStatus.Done, error: null, response: response };
    } catch (e) {
        console.error(e);
        return { status: ResultStatus.Failed, error: e, response: null };
    }
}

//
// Transform API result from something
//

export type ApiResultTransformer<TResponse, TResult> = {
    loading: () => TResult,
    failed?: (error: any) => TResult,
    done: (response: TResponse) => TResult,
};

export function transformResult<TResponse, TResult>(
    result: Signal<ApiResult<TResponse>>,
    multiplexer: ApiResultTransformer<TResponse, TResult>,
): TResult {
    switch (result.value.status) {
        case ResultStatus.Loading:
            return multiplexer.loading();

        case ResultStatus.Failed:
            if (multiplexer.failed == undefined) {
                console.warn("Re-throwing the error because the error builder is not defined");
                throw result.value.error;
                // TODO: We could show a popup to allow the user to report the error
            }

            return multiplexer.failed(result.value.error);

        case ResultStatus.Done:
            return multiplexer.done(result.value.response!);

        default:
            console.error("Invalid result status:", result.value.status);
            throw Error("Invalid result status: " + result.value.status);
    }

}

//
// Internal
//

function makeConfig(): Configuration {
    return createConfiguration({
        baseServer: new ServerConfiguration(apiBaseAddress, {}),
        httpApi: new IsomorphicFetchWithIncludeCredentialsHttpLibrary(),  // NOTE: This is currently required, TODO: Check if this is secure - could for example use something like anti forgery tokens or so
        promiseMiddleware: [new IncludeAdminPasswordFromLocalStorageMiddleware()],
    });
}

class IsomorphicFetchWithIncludeCredentialsHttpLibrary implements HttpLibrary {
    public send(request: RequestContext): Observable<ResponseContext> {
        let method = request.getHttpMethod().toString();
        let body = request.getBody();

        const resultPromise = fetch(request.getUrl(), {
            method: method,
            body: body as any,
            headers: request.getHeaders(),
            credentials: "include"
        }).then((resp: any) => {
            const headers: { [name: string]: string } = {};
            resp.headers.forEach((value: string, name: string) => {
                headers[name] = value;
            });

            const body = {
                text: () => resp.text(),
                binary: () => resp.blob()
            };
            return new ResponseContext(resp.status, headers, body);
        });

        return from<Promise<ResponseContext>>(resultPromise);
    }
}


export const adminPasswordLocalStorageKey = "api.adminPassword";

class IncludeAdminPasswordFromLocalStorageMiddleware implements PromiseMiddleware {
    public async pre(context: RequestContext): Promise<RequestContext> {
        const password = localStorage.getItem(adminPasswordLocalStorageKey);
        if (password != null) {
            context.setHeaderParam("BB-Admin-Password", password);
        }

        return context;
    }

    public async post(context: ResponseContext): Promise<ResponseContext> {
        return context;
    }
}
