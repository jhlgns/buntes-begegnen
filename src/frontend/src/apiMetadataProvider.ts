import { getApiResult, ResultStatus } from "@bb/api";
import { TimeSpan } from "@bb/util/date";
import { signal, ReadonlySignal } from "@preact/signals";
import { TypeConstraintsDto, MetadataApi } from "bundlor-web-api-client";
import { createContext } from "preact";

export class ApiMetadataProvider {
    private _intervalId: number | null = null
    private _currentIntervalMs: number | null = null;

    private _promise: Promise<void> | null = null;

    private _constraintsByType = signal<Map<string, TypeConstraintsDto> | null>(null);
    public get constraintsByType() { return this._constraintsByType as ReadonlySignal<Map<string, TypeConstraintsDto> | null>; }

    private _previewModeEnabled = signal<boolean>(false);
    public get previewModeEnabled() { return this._previewModeEnabled as ReadonlySignal<boolean>; }

    private _registrationPasswordRequired = signal<boolean>(false);
    public get registrationPasswordRequired() { return this._registrationPasswordRequired as ReadonlySignal<boolean>; }

    private _apiReachable = signal<boolean>(true);
    public get apiReachable() { return this._apiReachable as ReadonlySignal<boolean>; }

    // TODO @PreviewMode
    private _userInteractionEnabled = signal<boolean>(false);
    public get userInteractionEnabled() { return this._userInteractionEnabled as ReadonlySignal<boolean>; }

    public ensureMetadata(args?: { force?: boolean }): Promise<void> {
        const loadConstraints = async () => {
            //console.log("Fetching API metadata");

            const result = await getApiResult(config => new MetadataApi(config).metadataGet())
            if (result.status != ResultStatus.Done) {
                console.error("Failed to load API metadata:", result.error);
                this._apiReachable.value = false;
                return;
            } else {
                this._apiReachable.value = true;
            }

            const metadata = result.response!;
            //console.log("Got metadata response:", metadata);

            const refreshIntervalMs = (metadata.apiMetadataRefreshInterval == null
                ? null
                : TimeSpan.parse(metadata.apiMetadataRefreshInterval))?.totalMilliseconds;
            if (refreshIntervalMs != this._currentIntervalMs) {
                console.log("Refresh interval changed from", this._currentIntervalMs, "to", refreshIntervalMs);

                this._currentIntervalMs = refreshIntervalMs ?? null;

                if (this._intervalId != null) {
                    clearInterval(this._intervalId);
                }

                if (refreshIntervalMs != null) {
                    this._intervalId = setInterval(
                        () => this.ensureMetadata({ force: true }),
                        refreshIntervalMs,
                    );
                }
            }

            const types = metadata.typeConstraints;
            const constraints = new Map<string, TypeConstraintsDto>();
            for (const type in types) {
                constraints.set(type, types[type]!);
            }

            this._constraintsByType.value = constraints;
            this._previewModeEnabled.value = metadata.previewModeEnabled == true;
            this._userInteractionEnabled.value = metadata.enableUserInteraction == true;
            this._registrationPasswordRequired.value = metadata.previewModeRegistrationPasswordRequired == true;
        }

        if (this._promise != null && args?.force != true) {
            return this._promise;
        }

        this._promise = loadConstraints();
        return this._promise;
    }
}

export const apiMetadataProvider = new ApiMetadataProvider();  // TODO: Remove the context or make up mind which one is better, global vs context

export const apiMetadataProviderContext = createContext(apiMetadataProvider);
