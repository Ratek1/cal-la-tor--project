let display = document.getElementById("display");
let historyList = document.getElementById("historyList");
let historyDiv = document.getElementById("history");
let calculator = document.querySelector(".calculator");
let currencyPanel = document.getElementById("currencyPanel");

let historyData = JSON.parse(localStorage.getItem("calcHistory")) || [];
let memory = 0;
let lastResult = 0;
let isDegree = true;
let isShift = false;

historyData.forEach(item => {
  historyList.innerHTML += `<div class="history-item">${item}</div>`;
});

function append(value) {
  if (isShift) {
    if (value === 'x²') value = '√(';
    isShift = false;
    document.getElementById("shiftBtn").style.background = "#444";
  }
  if (display.innerText === "0") display.innerText = value;
  else display.innerText += value;
}

function cleardisplay() { display.innerText = "0"; }
function backspace() { display.innerText = display.innerText.slice(0, -1) || "0"; }
function undo() { backspace(); }

function memoryAdd() {
  let val = parseFloat(display.innerText);
  if (!isNaN(val)) memory = val;
}
function memoryRecall() { display.innerText = memory; }
function memoryClear() { memory = 0; }
function useAns() { append(lastResult); }

function toggleAngle() {
  isDegree = !isDegree;
  document.getElementById("angleSwitch").innerText = isDegree ? "DEG" : "RAD";
}

function toggleShift() {
  isShift = !isShift;
  document.getElementById("shiftBtn").style.background = isShift ? "#6f42c1" : "#444";
}

function copyResult() { navigator.clipboard.writeText(display.innerText); }

function calculate() {
  try {
    let expr = display.innerText
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/∛\(/g, "Math.cbrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(");

    expr = expr.replace(/sin\(/g, () =>
      isShift
        ? isDegree ? "(180/Math.PI)*Math.asin(" : "Math.asin("
        : isDegree ? "Math.sin(Math.PI/180*" : "Math.sin("
    );
    expr = expr.replace(/cos\(/g, () =>
      isShift
        ? isDegree ? "(180/Math.PI)*Math.acos(" : "Math.acos("
        : isDegree ? "Math.cos(Math.PI/180*" : "Math.cos("
    );
    expr = expr.replace(/tan\(/g, () =>
      isShift
        ? isDegree ? "(180/Math.PI)*Math.atan(" : "Math.atan("
        : isDegree ? "Math.tan(Math.PI/180*" : "Math.tan("
    );

    let result = eval(expr);
    lastResult = result;

    let entry = `${display.innerText} = ${result}`;
    historyList.innerHTML += `<div>${entry}</div>`;
    historyData.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(historyData));

    display.innerText = result;
  } catch {
    display.innerText = "Error";
  }
  isShift = false;
  document.getElementById("shiftBtn").style.background = "#444";
}

function toggleHistory() {
  historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
}

function clearHistory() {
  historyList.innerHTML = "";
  historyData = [];
  localStorage.removeItem("calcHistory");
}

function toggleMode(mode) {
  if (mode === "advanced") calculator.classList.add("advanced-mode");
  else calculator.classList.remove("advanced-mode");
}

function toggleCurrency() {
  currencyPanel.style.display =
    currencyPanel.style.display === "none" ? "block" : "none";
}

async function convertCurrency() {
  let amount = document.getElementById("currencyAmount").value;
  let from = document.getElementById("fromCurrency").value;
  let to = document.getElementById("toCurrency").value;
  let resultBox = document.getElementById("currencyResult");

  if (!amount || amount <= 0) {
    resultBox.innerText = "Enter an amount";
    return;
  }

  if (from === to) {
    resultBox.innerText = `${amount} ${from} = ${amount} ${to}`;
    return;
  }

  try {
    let res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    let data = await res.json();

    let rate = data.rates[to];
    let converted = amount * rate;

    resultBox.innerText = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  } catch {
    resultBox.innerText = "Conversion failed";
  }
}