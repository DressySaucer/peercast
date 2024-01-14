/*
 * Will need for decoding id token in order to retrieve user data
 * import jwtdecode from "jwt-decode";
 * */
import axios from "axios";
import { auth0Domain, clientId, redirectUri } from "./auth-env.json";
import {
    registerSession,
    setCachedToken,
    getCachedToken,
    deleteCachedToken,
} from "./cache";

type Token = string | null;
type GrantType = "code" | "refresh";

let accessToken: Token = null;
let idToken: Token = null;
let refreshToken: Token = null;

export async function getAccessToken() {
    if (accessToken) return accessToken;

    const cachedToken = await getCachedToken("access");
    if (cachedToken) return cachedToken;

    refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.log("No refresh token available");
        return null;
    }

    try {
        await exchangeToken("refresh", refreshToken);
        return accessToken;
    } catch (err) {
        console.log("Token exchange failed");
        return null;
    }
}

export async function getIdToken() {
    if (idToken) return idToken;

    const cachedToken = await getCachedToken("id");
    if (cachedToken) return cachedToken;

    return null;
}

export async function getRefreshToken() {
    if (refreshToken) return refreshToken;

    const cachedToken = await getCachedToken("refresh");
    if (cachedToken) return cachedToken;

    return null;
}

export async function exchangeToken(
    grantType: GrantType,
    token: NonNullable<Token>,
) {
    let exchangeOptions;

    if (grantType == "code") {
        exchangeOptions = {
            grant_type: "authorization_code",
            client_id: clientId,
            code: token,
            redirect_uri: redirectUri,
        };
    }

    if (grantType == "refresh") {
        exchangeOptions = {
            grant_type: "refresh_token",
            client_id: clientId,
            refresh_token: token,
        };
    }

    const options = {
        method: "POST",
        url: `https://${auth0Domain}/oauth/token`,
        headers: { "content-type": "application/json" },
        data: exchangeOptions,
    };

    try {
        const response = await axios(options);

        accessToken = response.data.access_token;
        idToken = response.data.id_token;
        refreshToken = response.data.refresh_token;

        if (!accessToken) throw new Error("No / invalid access token recieved");

        if (!refreshToken)
            throw new Error("No / invalid refresh token recieved");

        setCachedToken("access", accessToken);
        setCachedToken("refresh", refreshToken);
    } catch (err) {
        await logout();
        throw err;
    }
}

export async function isAuthenticated() {
    return accessToken != null || (await getCachedToken("access")) != null;
}

export function getAuthUrl() {
    return (
        "https://" +
        auth0Domain +
        "/authorize?" +
        "scope=openid profile offline_access&" +
        "response_type=code&" +
        "client_id=" +
        clientId +
        "&" +
        "redirect_uri=" +
        redirectUri
    );
}

/*
export async function refreshTokens() {
    refreshToken = await keytar.getPassword(keytarService, keytarAccount);

    if (refreshToken) {
        const refreshOptions = {
            method: "POST",
            url: `https://${auth0Domain}/oauth/token`,
            headers: { "content-type": "application/json" },
            data: {
                grant_type: "refresh_token",
                client_id: clientId,
                refresh_token: refreshToken,
            },
        };

        try {
            const response = await axios(refreshOptions);

            accessToken = response.data.access_token;
            idToken = response.data.id_token;
            refreshToken = response.data.refresh_token;

            if (!refreshToken)
                throw new Error("No / invalid refresh token recieved");

            await keytar.setPassword(
                keytarService,
                keytarAccount,
                refreshToken,
            );
        } catch (error) {
            await logout();

            throw error;
        }
    } else {
        throw new Error("No available refresh token");
    }
}

export async function loadTokens(callbackURL: string) {
    const urlParts = url.parse(callbackURL, true);
    const query = urlParts.query;

    const exchangeOptions = {
        grant_type: "authorization_code",
        client_id: clientId,
        code: query.code,
        redirect_uri: redirectUri,
    };

    const options = {
        method: "POST",
        url: `https://${auth0Domain}/oauth/token`,
        headers: {
            "content-type": "application/json",
        },
        data: JSON.stringify(exchangeOptions),
    };

    try {
        const response = await axios(options);

        accessToken = response.data.access_token;
        idToken = response.data.id_token;
        refreshToken = response.data.refresh_token;

        if (refreshToken) {
            await keytar.setPassword(
                keytarService,
                keytarAccount,
                refreshToken,
            );
        }
    } catch (error) {
        await logout();

        throw error;
    }
}
*/

export async function logout() {
    await deleteCachedToken("access");
    await deleteCachedToken("id");
    await deleteCachedToken("refresh");
    accessToken = null;
    idToken = null;
    refreshToken = null;
}

export function getLogoutUrl() {
    return `https://${auth0Domain}/v2/logout`;
}

export { registerSession };
