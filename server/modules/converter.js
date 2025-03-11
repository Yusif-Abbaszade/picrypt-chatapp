function decimalToBinary(decimal) {  
    return decimal.toString(2);  
}  

function binaryToDecimal(binary) {  
    return parseInt(binary, 2);  
}

let num1 = 79;
let num2 = 5;
num1 = decimalToBinary(num1);
num2 = decimalToBinary(num2);

let lngth = Math.max(num1.length, num2.length);
let key = '';
for(let i =0; i<lngth; i++){
    if(num1[i] === undefined){
        num1 = '0' + num1;
    }
    if(num2[i] === undefined){
        num2 = '0' + num2;
    }
}
for(let i = 0; i<lngth; i++){
    if((num1[i] === '1' && num2[i] === '1') || (num1[i] === '0' && num2[i] === '0')){
        key += '0';
    }
    else{
        key += '1';
    }
}

console.log(num1);
console.log(num2);
console.log(key,binaryToDecimal(key));