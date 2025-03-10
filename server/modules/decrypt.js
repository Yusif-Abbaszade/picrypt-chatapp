import pidata from '../utils/pidata.js';

const decryptMessage = (encryptedMessage)=>{
    let message = '';

    for (let i = 0; i < encryptedMessage.length; i++) {
        let xor = (parseInt(encryptedMessage.charCodeAt(i)) % 2 === 0)?1:0;
        if(xor === 1){
            var index = parseInt(encryptedMessage.charCodeAt(i)) - parseInt(pidata.charAt(i));
        }
        else{
            var index = parseInt(encryptedMessage.charCodeAt(i)) + parseInt(pidata.charAt(i));
        }
        message = message + String.fromCharCode(index);
    }
    return message;
}

export default decryptMessage;