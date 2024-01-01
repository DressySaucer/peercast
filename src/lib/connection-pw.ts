import "./api";

const PASSWORD_LEN = 8;

export function generatePassword(): string {
    let password: string = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const charlen = chars.length;
    for (let counter = 0; counter < PASSWORD_LEN; counter++) {
        const randint = Math.floor(Math.random() * charlen);
        password += chars[randint];
    }
    return password;
}
