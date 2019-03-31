// global functions
let add = (a, b) => a+b;
let substract = (a, b) => a-b;
let multiply = (a, b) => Math.floor(a*b*10000)/10000;
let divide = (a, b) => b === 0 ? NaN : Math.floor(a*10000/b)/10000;
let operate = (operator, a, b) => operations[operator](a,b);

// global variables
let buttons = document.querySelector('.calcButtons');
let currentNumber;
let storedNumber;
let result;
let digitAfterPeriod;
let pendingOperation;
const screenInput = document.querySelector('#input');
const screenOperation = document.querySelector('#output');
const calcButtons = document.querySelector('.calcButtons');
const operations = {add, substract, multiply, divide};
const operationToSymbol = {
    add: '+',
    substract: '−',
    multiply: '×',
    divide: '÷'
};

window.onload = clickClear();

function clickDigit(digit) {
    if (dispError()) return;
    if (screenOperation.textContent.slice(-1) === '=') {
        clickClear();
    }

    if (digitAfterPeriod > 0) {
        currentNumber += digit * Math.pow(10, -digitAfterPeriod);
        currentNumber = parseFloat(currentNumber.toFixed(digitAfterPeriod));
        digitAfterPeriod++;
    } else {
        currentNumber = currentNumber ? currentNumber * 10 + digit : digit;
    }
    displayCurrentNumber();
}

function clickPeriod() {
    if (dispError()) return;
    if (screenOperation.textContent.slice(-1) === '=') {
        clickClear();
    }
    if(digitAfterPeriod > 0) return;
    if(currentNumber === undefined) currentNumber = 0;
    digitAfterPeriod = 1;
    displayCurrentNumber(currentNumber+'.');
}

function clickClear() {
    currentNumber = undefined;
    storedNumber = undefined;
    result = undefined;
    pendingOperation = '';
    digitAfterPeriod = 0;
    displayStoredContent('');
    displayCurrentNumber('0');
}

function clickPlusMinus() {
    if (dispError()) return;
    if (currentNumber===undefined) {
        if (storedNumber === undefined) return;
        currentNumber = -1 * storedNumber;
        digitAfterPeriod = String(currentNumber).split('.')[1] === undefined ? 0 : String(currentNumber).split('.')[1].length + 1;
    } else {
        currentNumber *= -1;
    }
    displayStoredContent('');
    displayCurrentNumber();
}

function clickEquals() {
    if (dispError()) return;
    if(storedNumber === undefined && currentNumber === undefined) return;
    if(currentNumber === undefined || isNaN(currentNumber)) {
        pendingOperation = '';
        displayStoredContent(`${storedNumber} =`);
        displayCurrentNumber(storedNumber);
        return;
    }
    if(pendingOperation === '') {
        storedNumber = currentNumber;
        currentNumber = undefined;
        digitAfterPeriod = 0;
        displayStoredContent(`${storedNumber} =`);
        displayCurrentNumber(storedNumber);
        return;
    }
    displayStoredContent(`${screenOperation.textContent} ${currentNumber} =`);
    result =  operate(pendingOperation, storedNumber, currentNumber);
    displayCurrentNumber(Number.isNaN(result) ? 'ERROR' : result);
    storedNumber = result;
    currentNumber = undefined;
    result = undefined;
    digitAfterPeriod = 0;
    pendingOperation = '';
}


function clickOperator(operation) {
    if (dispError()) return;

    if (currentNumber === undefined) {
        displayStoredContent(`${storedNumber} ${operationToSymbol[operation]}`);
        displayCurrentNumber('')
        pendingOperation = operation;
        return;
    }
    storedNumber = storedNumber === undefined ? 0 : storedNumber;
    if (pendingOperation !== ''){
        result = operate(pendingOperation, storedNumber, currentNumber);
        storedNumber = result;
        if(Number.isNaN(result)) {
            displayStoredContent(`${screenOperation.textContent} ${currentNumber} =`);
            displayCurrentNumber(Number.isNaN(result) ? 'ERROR' : result);
            return;
        }
        result = undefined;
        currentNumber = undefined;
        digitAfterPeriod = 0;
    } else {
        storedNumber = currentNumber === undefined ? storedNumber : currentNumber;
        currentNumber = undefined;
        digitAfterPeriod = 0;
    }
    pendingOperation = operation;
    displayStoredContent(`${storedNumber} ${operationToSymbol[operation]}`);
    displayCurrentNumber('');
}

function clickRemainder() {
    if (dispError()) return;
    if (currentNumber === undefined) return;
    storedNumber = storedNumber === undefined ? 1 : storedNumber;
    currentNumber = storedNumber * currentNumber / 100;
    clickEquals();
}

function dispError() {
    if(Number.isNaN(currentNumber) || Number.isNaN(storedNumber)) {
        displayCurrentNumber('ERROR');
        return true;
    }
    return false;
}

function displayCurrentNumber(text = currentNumber.toFixed(digitAfterPeriod ? digitAfterPeriod-1 : 0)) {
    screenInput.textContent = text;
}

function displayStoredContent(text = storedNumber) {
    screenOperation.textContent = text;
}

document.addEventListener('keydown', function(event) {
    if (event.repeat) return;
    switch (event.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            clickDigit(Number(event.key));
            break;
        case '.':
        case ',':
            clickPeriod();
            break;
        case '+':
            clickOperator('add');
            break;
        case '-':
            clickOperator('substract');
            break;
        case '*':
            clickOperator('multiply');
            break;
        case '/':
            clickOperator('divide');
            event.preventDefault();
            break;
        case '%':
            clickRemainder();
            break;
        case '=':
        case 'Enter':
            clickEquals();
            break;
        case 'Delete':
        case 'Backspace':
            clickClear();
            break;
    }
});
