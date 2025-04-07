// import mpmath from 'mpmath' // Use a library for high-precision math if needed
// mpmath.mp.dps = 10000; // Set precision for π
// const piDigits = mpmath.mp.pi.toString().slice(2); // Get digits of π after the decimal point
const piDigits = '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648';

 // Add an offset to ensure u_new is always positive

function encrypt(text) {
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
            u_new = u + i + p ; // Add OFFSET to ensure u_new is positive
            marker = '1';
        } else if (i % 2 === 0 && p % 2 === 1) {
            u_new = u + i - p ; // Add OFFSET
            marker = '2';
        } else if (i % 2 === 1 && p % 2 === 1) {
            u_new = u - i - p ; // Add OFFSET
            marker = '3';
        } else {
            // Odd index, even `p`
            u_new = u - i + p ; // Add OFFSET
            marker = '4';
        }

        result += String.fromCharCode(u_new) + marker;
    }
    return result;
}

function decrypt(text) {
    let result = "";
    let i = 0;
    while (i < text.length) {
        const char = text[i];
        const marker = text[i + 1];
        const u_new = char.charCodeAt(0) ; // Subtract OFFSET to restore the original value

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

// Test the encryption and decryption
const text = ''; // Test input
const encryptedText = encrypt(text);
console.log(`Encrypted: ${encryptedText}`);
const decryptedText = decrypt(encryptedText);
console.log(`Decrypted: ${decryptedText}`);
console.log(text === decryptedText); // Should be true