
function decimalToBinary(decimal) {
    return decimal.toString(2);
}

function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}



const code_decode_Message = (message, enckey) => {
    let encryptMessage = '';
    for (let i = 0; i < message.length; i++) {
        let num1 = message.charCodeAt(i);
        let num2 = Number(String(enckey).charAt(i%6));
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



export default code_decode_Message;