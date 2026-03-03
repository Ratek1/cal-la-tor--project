let display = document.getElementById("display");
let historyList = document.getElementById("historyList");
let historyDiv = document.getElementById("history");
let calculator = document.querySelector(".calculator");

let historyData = JSON.parse(localStorage.getItem("calcHistory")) || [];
let memory = 0;
let lastResult = 0;
let isDegree = true;
let isShift = false;

// Load history on start
historyData.forEach(item => {
  historyList.innerHTML += `<div class="history-item">${item}</div>`;
});

// ===== VIBRATION =====
function vibrate(duration = 50) {
  if (navigator.vibrate) navigator.vibrate(duration);
}

// ===== DISPLAY OPERATIONS =====
function append(value) {
  vibrate();
  if (display.innerText === "0") display.innerText = value;
  else display.innerText += value;
}

function cleardisplay() {
  vibrate();
  display.innerText = "0";
}

function backspace() {
  vibrate();
  display.innerText = display.innerText.slice(0, -1) || "0";
}

function undo() { backspace(); }

// ===== MEMORY =====
function memoryAdd() {
  vibrate();
  let val = parseFloat(display.innerText);
  if (!isNaN(val)) memory = val;
}

function memoryRecall() {
  vibrate();
  display.innerText = memory;
}

function memoryClear() {
  vibrate();
  memory = 0;
}

// ===== ANS =====
function useAns() {
  vibrate();
  append(lastResult);
}

// ===== DEG/RAD MODE =====
function toggleAngle() {
  vibrate();
  isDegree = !isDegree;
  document.getElementById("angleSwitch").innerText = isDegree ? "DEG" : "RAD";
}

// ===== SHIFT MODE =====
function toggleShift() {
  vibrate();
  isShift = !isShift;
  document.getElementById("shiftBtn").style.background = isShift ? "#6f42c1" : "#444";

  // Update trig button labels dynamically
  document.querySelectorAll('.adv').forEach(button => {
    if (button.innerText === 'sin' || button.innerText === 'cos' || button.innerText === 'tan') {
      if (isShift) {
        if (button.innerText === 'sin') button.innerText = 'sin⁻¹';
        if (button.innerText === 'cos') button.innerText = 'cos⁻¹';
        if (button.innerText === 'tan') button.innerText = 'tan⁻¹';
      } else {
        if (button.innerText === 'sin⁻¹') button.innerText = 'sin';
        if (button.innerText === 'cos⁻¹') button.innerText = 'cos';
        if (button.innerText === 'tan⁻¹') button.innerText = 'tan';
      }
    }
  });
}

// ===== TRIG FUNCTIONS =====
function appendTrig(fn) {
  vibrate();

  let func = fn; // default normal
  if (isShift) { // inverse trig
    if (fn === 'sin') func = 'asin';
    if (fn === 'cos') func = 'acos';
    if (fn === 'tan') func = 'atan';
  }

  let wrapper = '';
  if (func === 'sin' || func === 'cos' || func === 'tan') {
    wrapper = isDegree ? `${func}(Math.PI/180*` : `${func}(`;
  } else if (func === 'asin' || func === 'acos' || func === 'atan') {
    wrapper = isDegree ? `(180/Math.PI*Math.${func}(` : `Math.${func}(`;
  } else {
    wrapper = func + '(';
  }

  append(wrapper);

  // Reset shift after one use
  if (isShift) {
    isShift = false;
    document.getElementById("shiftBtn").style.background = "#444";

    // Reset trig button labels
    document.querySelectorAll('.adv').forEach(button => {
      if (button.innerText === 'sin⁻¹') button.innerText = 'sin';
      if (button.innerText === 'cos⁻¹') button.innerText = 'cos';
      if (button.innerText === 'tan⁻¹') button.innerText = 'tan';
    });
  }
}

// ===== COPY RESULT =====
function copyResult() {
  vibrate();
  navigator.clipboard.writeText(display.innerText);
}

// ===== CALCULATOR =====
function calculate() {
  try {
    let expression = display.innerText
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/∛\(/g, "Math.cbrt(")
      .replace(/asin\(/g, "Math.asin(")
      .replace(/acos\(/g, "Math.acos(")
      .replace(/atan\(/g, "Math.atan(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/π/g, "Math.PI")
      .replace(/e/g, "Math.E")
      .replace(/x²/g, "**2")
      .replace(/\^/g, "**");

    let result = eval(expression);

    if (!isFinite(result)) {
      display.innerText = "Math Error";
      return;
    }

    lastResult = result;

    let entry = `${display.innerText} = ${result}`;
    historyList.innerHTML += `<div class="history-item" onclick="loadFromHistory('${display.innerText}')">${entry}</div>`;
    historyData.push(entry);
    localStorage.setItem("calcHistory", JSON.stringify(historyData));

    display.innerText = result;
  } catch {
    display.innerText = "Invalid Expression";
  }
}

// ===== HISTORY =====
function toggleHistory() {
  historyDiv.style.display = historyDiv.style.display === "none" ? "block" : "none";
}
function clearHistory() {
  historyList.innerHTML = "";
  historyData = [];
  localStorage.removeItem("calcHistory");
}
function loadFromHistory(expr) {
  display.innerText = expr;
}

// ===== MODE SWITCH =====
function toggleMode(mode) {
  if (mode === "advanced") calculator.classList.add("advanced-mode");
  else calculator.classList.remove("advanced-mode");
}

/* ⌨️ Keyboard Support */
document.addEventListener("keydown", function (e) {
  if (!isNaN(e.key) || "+-*/.%".includes(e.key)) append(e.key.replace("*", "×").replace("/", "÷"));
  if (e.key === "Enter") calculate();
  if (e.key === "Backspace") backspace();
  if (e.key === "Escape") cleardisplay();
});