const checkXOR = (item1, item2)=>{
    if((item1 % 2 === 0 && item2 % 2 == 0) || (item1 % 2 === 1 && item2 % 2 === 1)){
        return 1;
    }else {
        return 0;
    }    
}

export default checkXOR;