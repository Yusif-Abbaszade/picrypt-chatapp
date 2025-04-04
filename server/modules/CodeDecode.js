import crypto from 'crypto';
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

