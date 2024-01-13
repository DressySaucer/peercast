/*
 * Will need for decoding id token in order to retrieve user data
 * import jwtdecode from "jwt-decode";
 * */
import axios from "axios";
import keytar from "keytar";
import url from "url";
import os from "os";

const auth0Domain = "dev-sttjehio2wsuhqmc.us.auth0.com";
const clientId = "fLXIdu4IC1mmrD7G1oN4iXIPm9LJ73s0";
const redirectUri = "peercast://redirect";

const keytarService = "peercast-oauth";
const keytarAccount = os.userInfo().username;

type Token = string | null;

let accessToken: Token = null;
let idToken: Token = null;
let refreshToken: Token = null;

export function getAccessToken() {
    return accessToken;
}

export function getIdToken() {
    return idToken;
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

export async function refreshTokens() {
    const refreshToken = await keytar.getPassword(keytarService, keytarAccount);

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

export async function logout() {
    await keytar.deletePassword(keytarService, keytarAccount);
    accessToken = null;
    idToken = null;
    refreshToken = null;
}

export function getLogoutUrl() {
    return `https://${auth0Domain}/v2/logout`;
}
