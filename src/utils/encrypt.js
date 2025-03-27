// src/utils/encrypt.js
export function encryptEmail(email) {
    return email.replace(/(.{2}).+(.{2}@.+)/, "$1***$2");
}
