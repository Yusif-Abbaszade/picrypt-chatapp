import crypto from 'crypto';
import piDigits from '../utils/pidata.js';
function decimalToBinary(decimal) {
    return decimal.toString(2);
}

function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}
// export function encryptData(data) {
//     const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV)
//     return Buffer.from(
//         cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
//     ).toString('base64') // Encrypts data and converts to hex and base64
// }
// export function decryptData(encryptedData) {
//     const buff = Buffer.from(encryptedData, 'base64')
//     const decipher = crypto.createDecipheriv(ecnryption_method, key, encryptionIV)
//     return (
//         decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
//         decipher.final('utf8')
//     ) // Decrypts data and converts to utf8
// }

export const encryptWithAes = (message, key) => {
    const enckey = crypto
        .createHash('sha512')
        .update(String(key))
        .digest('hex')
        .substring(0, 32); // 32 bytes for AES-256 key
    const IV = crypto
        .createHash('sha512')
        .update(String(key))
        .digest()
        .slice(0, 12); // 12 bytes for AES-256-CCM IV

    const cipher = crypto.createCipheriv('aes-256-ccm', enckey, IV, { authTagLength: 16 });
    const encrypted = Buffer.concat([
        cipher.update(message, 'utf8'),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([IV, authTag, encrypted]).toString('base64');
};

export const decryptWithAes = (encryptedMessage, key) => {
    const enckey = crypto
        .createHash('sha512')
        .update(String(key))
        .digest('hex')
        .substring(0, 32); // 32 bytes for AES-256 key

    const buff = Buffer.from(encryptedMessage, 'base64');
    const IV = buff.slice(0, 12); // Extract the first 12 bytes as IV
    const authTag = buff.slice(12, 28); // Next 16 bytes as auth tag
    const encrypted = buff.slice(28); // Remaining bytes as encrypted data

    // Ensure `encrypted` is a Buffer
    if (!Buffer.isBuffer(encrypted)) {
        throw new TypeError('Invalid encrypted data format');
    }

    const decipher = crypto.createDecipheriv('aes-256-ccm', enckey, IV, { authTagLength: 16 });
    decipher.setAuthTag(authTag);

    // Decrypt the data
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return decrypted.toString('utf8');
};

export const code_decode_Message = (message, enckey) => {
    let encryptMessage = '';
    while (String(enckey).length < 6) {
        enckey += '0';
    }
    for (let i = 0; i < message.length; i++) {
        let num1 = message.charCodeAt(i);
        let num2 = Number(String(enckey).charAt(i % 6));
        num1 = decimalToBinary(parseInt(num1));
        num2 = decimalToBinary(parseInt(num2));

        let lngth = Math.max(num1.length, num2.length);

        for (let i = 0; i < lngth; i++) {
            if (num1[i] === undefined) {
                num1 = '0' + num1;
            }
            if (num2[i] === undefined) {
                num2 = '0' + num2;
            }
        }

        let key = '';
        for (let i = 0; i < lngth; i++) {
            if ((num1[i] === '1' && num2[i] === '1') || (num1[i] === '0' && num2[i] === '0')) {
                key += '0';
            }
            else {
                key += '1';
            }
        }
        encryptMessage += String.fromCharCode(binaryToDecimal(key))
    }
    return encryptMessage;
};

export function encrypt_with_pi(text, key) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const u = char.charCodeAt(0); // Unicode value of the character
        if (i >= piDigits.length) {
            throw new Error(`Pi-də ${i}-ci rəqəm mövcud deyil.`); // Ensure `i` is within bounds
        }

        const p = parseInt(piDigits[i]); // Use the index `i` to fetch `p` from `piDigits`

        let u_new, marker;
        if (i % 2 === 0 && p % 2 === 0) {
            u_new = u + i + p +Number(String(key).substring(0,2)); // Add OFFSET to ensure u_new is positive
            marker = '1';
        } else if (i % 2 === 0 && p % 2 === 1) {
            u_new = u + i - p +Number(String(key).substring(0,2)); // Add OFFSET
            marker = '2';
        } else if (i % 2 === 1 && p % 2 === 1) {
            u_new = u - i - p +Number(String(key).substring(0,2)); // Add OFFSET
            marker = '3';
        } else {
            // Odd index, even `p`
            u_new = u - i + p +Number(String(key).substring(0,2)); // Add OFFSET
            marker = '4';
        }

        result += String.fromCharCode(u_new) + marker;
    }
    return result;
}


export function decrypt_with_pi(text, key) {
    let result = "";
    let i = 0;
    while (i < text.length) {
        const char = text[i];
        const marker = text[i + 1];
        const u_new = char.charCodeAt(0) - Number(String(key).substring(0,2)); // Subtract OFFSET to restore the original value

        const i_index = result.length; // Correctly calculate the index based on the decrypted result length

        const p = parseInt(piDigits[i_index]); // Use the same index logic as in `encrypt`

        let u;
        if (marker === '1') {
            // u_new = u + i + p + OFFSET → u = u_new - i - p
            u = u_new - i_index - p;
        } else if (marker === '2') {
            // u_new = u + i - p + OFFSET → u = u_new - i + p
            u = u_new - i_index + p;
        } else if (marker === '3') {
            // u_new = u - i - p + OFFSET → u = u_new + i + p
            u = u_new + i_index + p;
        } else if (marker === '4') {
            // u_new = u - i + p + OFFSET → u = u_new + i - p
            u = u_new + i_index - p;
        } else {
            throw new Error("Yanlış marker tapıldı!"); // Invalid marker
        }

        result += String.fromCharCode(u);
        i += 2; // Move to the next character and marker
    }
    return result;
}