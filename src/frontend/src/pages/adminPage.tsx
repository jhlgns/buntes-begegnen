import { adminPasswordLocalStorageKey, useApiResult, getApiResult, ResultStatus, transformResult } from "@bb/api";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button, ButtonState } from "@bb/components/button";
import { ErrorList } from "@bb/components/errorList";
import { Fieldset } from "@bb/components/fieldset";
import { TextInput, Select } from "@bb/components/input";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { usePageInfo } from "@bb/components/pageInfo";
import { Field, fieldConfigs } from "@bb/field";
import { Theme } from "@bb/style/theme";
import { useContentWidth } from "@bb/style/layout";
import { flexColumn } from "@bb/style/util";
import { UserInfoProvider, userInfoProviderContext } from "@bb/userInfoProvider";
import { useSignal, useComputed, Signal, signal } from "@preact/signals";
import { AdminApi, UserWithRolesDto, DebugApi } from "bundlor-web-api-client";
import { ComponentChildren } from "preact";
import { CSSProperties } from "preact/compat";
import { useContext, useMemo, useRef } from "preact/hooks";

// TODO: Test for FormScope with each validation constraint using a bogus DTO that has all constraints that are available
// TODO: Make it possible to assign a promoter to a user

const allRoles = [  // NOTE: Could query that from the API
    "PublicUser",
    "TeamMember",
    "InquiryRecipient",
    "Admin",
];

const userListKeys = [
    'id',
    'userName',
    'email',
];

const userDetailKeys = [
    'id',
    'userName',
    // 'normalizedUserName',
    'email',
    // 'normalizedEmail',
    'emailConfirmed',
    // 'passwordHash',
    'securityStamp',
    // 'concurrencyStamp',
    'phoneNumber',
    'phoneNumberConfirmed',
    'twoFactorEnabled',
    'lockoutEnd',
    'lockoutEnabled',
    'accessFailedCount',
    'createdAt',
    'firstName',
    'lastName',
    'birthDay',
    'streetName',
    'houseNumber',
    'zipCode',
    'city',
    'promoterId',
    'promoter',
    'goals',
    'hobbies',
    'favoriteCategories',
    'impairedSight',
    'impairedHearing',
    'impairedSpeech',
    'impairedMobility',
    'additionalHandicaps',
];

const rebuildCounter = signal(0);

function showCriticalError(error: any) {
    alert(JSON.stringify(error, undefined, "  "));
}

export function AdminPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.admin });
    useContentWidth("100%");

    const usersResult = useApiResult(config => new AdminApi(config).adminUsersGet(), [rebuildCounter]);
    // const promotersResult = useApiResult(config => new PromotersApi(config).promotersGet(), [rebuildCounter]);

    const selectedUserId = useSignal<string | null>(null);
    const selectedPromoterId = useSignal<number | null>(null);

    rebuildCounter.value;

    return (
        <div style={{
            ...flexColumn({ crossAxisAlignment: "stretch", gap: "2rem" }),
            padding: "1rem",
        }}>
            <h1>Administration</h1>

            <AdminPasswordEditor />

            {transformResult(
                usersResult,
                {
                    loading: () => <LoadingSpinner message="Lade Benutzer..." />,
                    failed: (e) => <ErrorList errors={[JSON.stringify(e, undefined, "    ")]} />,
                    done: (usersWithRoles) => <UserList usersWithRoles={usersWithRoles} selectedUserId={selectedUserId} />
                })
            }

            {/*transformResult(
                promotersResult,
                {
                    loading: () => <LoadingSpinner message="Lade Veranstalter..." />,
                    failed: (e) => <ErrorList errors={[JSON.stringify(e, undefined, "    ")]} />,
                    done: (promoters) => (
                        <table>
                            {/* TODO * /}
                        </table>
                    ),
                })
            */}
        </div>
    );
}

function AdminPasswordEditor() {
    const adminPassword = useMemo(() => new Field(fieldConfigs.string, localStorage.getItem(adminPasswordLocalStorageKey) ?? ""), []);

    function saveAdminPassword() {
        if (adminPassword.value.value.length == 0) {
            localStorage.removeItem(adminPasswordLocalStorageKey)
        } else {
            localStorage.setItem(adminPasswordLocalStorageKey, adminPassword.value.value);
        }

        ++rebuildCounter.value;
    }

    return (
        <Fieldset>
            <legend>Admin-Passwort</legend>
            <TextInput
                type="password"
                field={adminPassword}
                label="Admin-Passwort:" />
            <Button onClick={saveAdminPassword}>Speichern</Button>
        </Fieldset>
    );
}


function UserList(props: { usersWithRoles: UserWithRolesDto[], selectedUserId: Signal<string | null> }) {
    const { usersWithRoles, selectedUserId } = props;
    const userInfoProvider = useContext(userInfoProviderContext);
    const currentUserId = userInfoProvider.userInfo.value?.account.id;

    const selectedUser = useComputed<UserWithRolesDto | null>(() => {
        // TODO: This does not update the user information correctly because the new information has not yet been downloaded when triggering the rebuild
        return selectedUserId.value == null
            ? null
            : usersWithRoles.find(x => x.user.id == selectedUserId.value)!;
    });

    return (
        <>
            <Fieldset>
                <legend>Alle Benutzer</legend>
                <table
                    class="table"
                    style={{
                        overflowY: "sroll",
                    }}>
                    <thead>
                        <tr>
                            <td>Übernehmen</td>
                            <td>Auswählen</td>
                            <td>Rollen</td>
                            {userListKeys.map(key => (
                                <Td>{key}</Td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {usersWithRoles.map(userWithRoles => (
                            <tr style={userWithRoles.user.lockoutEnd != null
                                ? {
                                    color: Theme.error.fg,
                                    backgroundColor: Theme.error.bg,
                                }
                                : undefined}>
                                <td>
                                    <Button
                                        onClick={() => handleAssumeUser(userWithRoles.user.id!, userInfoProvider)}
                                        state={userWithRoles.user.id == currentUserId ? ButtonState.Disabled : ButtonState.Default}>
                                        Übernehmen
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        onClick={() => selectedUserId.value = userWithRoles.user.id!}
                                        state={userWithRoles.user.id == selectedUser.value?.user.id ? ButtonState.Disabled : ButtonState.Default}>
                                        Auswählen
                                    </Button>
                                </td>
                                <td>
                                    <ul>
                                        {userWithRoles.roles.map(role => (
                                            <li>{role}</li>
                                        ))}
                                    </ul>
                                </td>
                                {userListKeys.map(key => (
                                    <Td>
                                        {(userWithRoles.user as any)[key]?.toString() ?? null}
                                    </Td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                Gesamt: {usersWithRoles.length}

                <UserDetails userWithRoles={selectedUser} />
            </Fieldset>
        </>
    );
}

function Td(props: { children: ComponentChildren, style?: CSSProperties }) {
    return (
        <td
            style={{ wordWrap: "break-word", wordBreak: "break-all", ...props.style }}>
            {props.children}
        </td>
    );
}

async function handleAssumeUser(id: string, userInfoProvider: UserInfoProvider) {
    console.log("Assuming user", id);

    const result = await getApiResult(config => new DebugApi(config).debugAssumePost(id))
    if (result.status != ResultStatus.Done) {
        showCriticalError(result.error);
    }

    await userInfoProvider.ensureUserInfo();
}

async function handleAddRole(userId: string, roleName: string) {
    console.log("Adding user", userId, "to role", roleName);

    const result = await getApiResult(config => new AdminApi(config).adminUsersUserIdRolesPost(userId, roleName))
    if (result.status != ResultStatus.Done) {
        showCriticalError(result.error);
    }

    ++rebuildCounter.value;
}

async function handleRemoveRole(userId: string, roleName: string) {
    console.log("Removing user", userId, "from role", roleName);

    const result = await getApiResult(config => new AdminApi(config).adminUsersUserIdRolesDelete(userId, roleName))
    if (result.status != ResultStatus.Done) {
        showCriticalError(result.error);
    }
}

async function handleResetPassword(userId: string) {
    console.log("Resetting password of user", userId);

    const result = await getApiResult(config => new AdminApi(config).adminUsersUserIdResetPasswordPost(userId))
    if (result.status != ResultStatus.Done) {
        showCriticalError(result.error);
    }

    ++rebuildCounter.value;
}

async function handleToggleIsLockedOut(userId: string, isLockedOut: boolean) {
    console.log("Setting locked state of user", userId, "to", isLockedOut == false);

    const result = await getApiResult(config => new AdminApi(config).adminUsersUserIdLockedPut(userId, isLockedOut == false))
    if (result.status != ResultStatus.Done) {
        showCriticalError(result.error);
    }

    ++rebuildCounter.value;
}

function UserDetails(props: { userWithRoles: Signal<UserWithRolesDto | null> }) {
    const userWithRoles = props.userWithRoles?.value;
    if (userWithRoles == null) {
        return <></>;
    }

    const roleField = useMemo(() => new Field(fieldConfigs.string, ""), []);

    return (
        <Fieldset>
            <legend>{userWithRoles.user.email} ({userWithRoles.user.id})</legend>

            <table class="table">
                <thead>
                    <tr>
                        <td>Key</td>
                        <td>Value</td>
                    </tr>
                </thead>
                <tbody>
                    {userDetailKeys.map(key => (
                        <tr>
                            <td>{key}</td>
                            <td>{(userWithRoles.user as any)[key]?.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ul>
                {userWithRoles.roles.map(roleName => (
                    <li>
                        {roleName}
                        <Button onClick={() => handleRemoveRole(userWithRoles.user.id!, roleName)}>Entfernen</Button>
                    </li>
                ))}
            </ul>

            <div>
                <Select
                    label="Rolle auswählen"
                    field={roleField}
                    options={allRoles.map(x => ({ label: x, value: x }))} />
                <Button onClick={() => handleAddRole(userWithRoles.user.id!, roleField.value.peek())}>Hinzufügen</Button>
                {/* <Button onClick={handleRemoveRole}>Entfernen</Button> */}
            </div>

            <div>
                <Button onClick={() => handleResetPassword(userWithRoles.user.id!)}>
                    Passwort zurüksetzen
                </Button>
            </div>

            <div>
                <Button onClick={() => { handleToggleIsLockedOut(userWithRoles.user.id!, userWithRoles.user.lockoutEnd != null); ++rebuildCounter.value; }}>
                    {userWithRoles.user.lockoutEnd != null
                        ? "Sperrung aufheben"
                        : "Sperren"
                    }
                </Button>
            </div>
        </Fieldset>
    );
}
