import "./api";
import crypto from "crypto";

// remember to replace crypto polyfill by exposing api w/ electron preload

const PASSWORD_LEN = 8;

export function generatePassword(): string {
    let password: string = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charlen = chars.length;
    for (let counter = 0; counter < PASSWORD_LEN; counter++) {
        const randint = crypto.randomInt(1000);
        crypto.randomUUID;
        password += chars[randint % charlen];
    }
    return password;
}
