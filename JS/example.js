var arrayOfInts = [1,1,1,2,2,3,4,5,5,6,8,8];

function findAmountOfUniques(numArray) {
    let secondArray = []
    for (let i = 0; i < numArray.length; i++) {
        let x = false
        for (let i = 0; i < secondArray.length; i++) {
            if (secondArray[i] == integer) {
                x = true;
            }
        }
        
        if (!doesContain(secondArray,numArray[i])) {
            secondArray[secondArray.length] = numArray[i];
        }
    }
}

function doesContain(array, integer) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == integer) {
            return true
        }
    }
    return false
}

unique[unique.length] = x