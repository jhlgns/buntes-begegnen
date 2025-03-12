import { getApiResult, ResultStatus } from "@bb/api";
import { signal, ReadonlySignal } from "@preact/signals";
import { UserDto, AccountApi, ApiException } from "bundlor-web-api-client";
import { createContext } from "preact";

export interface UserInfo {
    readonly account: UserDto;
    readonly roles: string[];
}

export class UserInfoProvider {
    private static readonly _fetchInterval = 10000;

    private _userInfoPromise: Promise<void> | null = null;
    private _userInfoTicket = 0;

    private _userInfo = signal<UserInfo | null>(null);
    public get userInfo() { return this._userInfo as ReadonlySignal<UserInfo>; }

    private _timer: number | null = null;

    public async ensureUserInfo(args?: { force?: boolean, expectAuthenticationError?: boolean }): Promise<void> {
        if (this._timer == null) {
            this._timer = setInterval(
                () => {
                    //console.debug("Fetching user info after interval (", UserInfoProvider.fetchInterval, ")");
                    this.ensureUserInfo({ expectAuthenticationError: true });
                },
                UserInfoProvider._fetchInterval
            );
        }

        const loadUserInfo = async (ticket: number) => {
            const result = await getApiResult(
                config => new AccountApi(config).accountMineGet(),
            );

            if (ticket != this._userInfoTicket) {
                // loadUserInfo was already called again, ignore the result
                console.warn("Ignoring the user info result, the ticket of this fetch operation is", ticket, ", but the current ticket is", this._userInfoTicket);
                return;
            }

            if (result.status == ResultStatus.Failed) {
                const exception = result.error as ApiException<any>;

                if (args?.expectAuthenticationError === true && exception.code === 401) {
                    console.debug("Fetching user info failed but the error is expected");
                } else {
                    console.error("Failed to fetch user info:", result.error);
                }

                // TODO: Notify user that this happened

                this._userInfo.value = null;
                return;
            }

            //console.log("Updating user information:", result.response);
            this._userInfo.value = {
                account: result.response!.user!,
                roles: result.response!.roles!,
            };
        }

        // TODO: Think about this, can this lead to awkward situations?
        if (args?.force === true || this._userInfoPromise == null) {
            ++this._userInfoTicket;
            this._userInfoPromise = loadUserInfo(this._userInfoTicket);
        }

        return this._userInfoPromise
            .then(() => this._userInfoPromise = null)
            .then();
    }
}

export const userInfoProviderContext = createContext(new UserInfoProvider());
