import crypto from 'crypto'
const encryptWithAes = (message, key) => {
    const enckey = crypto
        .createHash('sha512')
        .update(key)
        .digest('hex')
        .substring(0, 32); // 32 bytes for AES-256 key
    const IV = crypto
        .createHash('sha512')
        .update(key)
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

const decryptWithAes = (encryptedMessage, key) => {
    const enckey = crypto
        .createHash('sha512')
        .update(key)
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


const key = '1604';
const message = 'lOK0AzB//GiCyHPoZyMlhn8A2cHGYvLFFwFYvxQbuLud';

// const encryptedMessage = encryptWithAes(message, key);
// console.log('Encrypted:', encryptedMessage);

const decryptedMessage = decryptWithAes(message, key);
console.log('Decrypted:', decryptedMessage);