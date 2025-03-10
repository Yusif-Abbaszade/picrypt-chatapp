import checkXOR from './XOR.js';
import pidata from '../utils/pidata.js';

const encryptMessage = (message)=>{
    let encryptedMessage = '';
    for (let i = 0; i < message.length; i++) {
        let xor = checkXOR(parseInt(message.charCodeAt(i)), parseInt(pidata.charAt(i)));
        if(xor === 1){
            var index = parseInt(message.charCodeAt(i)) + parseInt(pidata.charAt(i));
        }else{
            var index = parseInt(message.charCodeAt(i)) - parseInt(pidata.charAt(i));
        }
        encryptedMessage = encryptedMessage + String.fromCharCode(index);
    }
    return encryptedMessage;
}

export default encryptMessage;