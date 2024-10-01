import CryptoJS from "crypto-js";
import {Base64} from 'js-base64';

const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;

export function encryptData(data) {
    try {
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        return Base64.encode(ciphertext);
    } catch (error) {
        console.error("Error encrypting data:", error);
        return null;
    }
}

export function decryptData(base64Ciphertext) {
    try {
        const ciphertext = Base64.decode(base64Ciphertext);
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedData) {
            return null;
        }

        return JSON.parse(decryptedData);
    } catch (error) {
        console.error(error);
        return null;
    }
}
