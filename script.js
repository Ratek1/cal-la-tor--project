const display = document.getElementById('display');

function append(value) {
  if (display.innerText === '0') display.innerText = '';
  display.innerText += value;
}

function cleardisplay() {
  display.innerText = '0';
}

function deleteLast() {
  display.innerText = display.innerText.slice(0, -1) || '0';
}

function backspace() {
  display.innerText = display.innerText.slice(0, -1) || '0';
  if (display.innerText === "" || display.innerText === "NaN") {
    display.innerText = '0';
  }
}

function calculate() {
  let expression = display.innerText;

  expression = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/\^/g, '**');

  try {
    let result = eval(expression);
    display.innerText = result;
  } catch (error) {
    display.innerText = "Error";
  }
}