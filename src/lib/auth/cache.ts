import { Session, Cookies } from "electron";

let cookies: Cookies | null = null;

type TokenType = "access" | "refresh" | "id";

export function registerSession(session: Session) {
    cookies = session.cookies;
}

export function setCachedToken(type: TokenType, token: string) {
    if (!cookies) return;
    /*
     * Electron bug prevents use of custom uri scheme / protocol
     * Therefore http://peercast/tokens is used in place of peercast://tokens
     * (https://github.com/electron/electron/issues/20940)
     * */
    if (type == "access")
        return cookies.set({
            url: "http://peercast/tokens",
            name: "access-token",
            value: token,
            expirationDate: Math.floor(Date.now() / 1000) + 86400,
        });
    if (type == "id")
        return cookies.set({
            url: "http://peercast/tokens",
            name: "id-token",
            value: token,
            expirationDate: Math.floor(Date.now() / 1000) + 36000,
        });
    if (type == "refresh")
        return cookies.set({
            url: "http://peercast/tokens",
            name: "refresh-token",
            value: token,
            expirationDate: Math.floor(Date.now() / 1000) + 2592000,
        });
}

export async function getCachedToken(type: TokenType) {
    if (!cookies) return;
    return cookies
        .get({
            url: "http://peercast/tokens",
            name: `${type}-token`,
        })
        .then((cookies) => {
            if (!cookies[0]) return null;
            return cookies[0].value;
        });
}

export function deleteCachedToken(type: TokenType) {
    if (!cookies) return;
    return cookies.remove("http://peercast/tokens", `${type}-token`);
}
