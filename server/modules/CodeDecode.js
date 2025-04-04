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
    const cipher = crypto.createCipheriv('aes-256-ccm', key, key);
    return Buffer.from(
        cipher.update(message, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64')
}

export const decryptWithAes = (encryptedMessage, key) => {
    const buff = Buffer.from(encryptedMessage, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-ccm', key, key);
    return(
        decipher.update(buff.toString('utf8'), 'hex', 'utf8')+
        decipher.final('utf8')
    )
}

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

