//Acces DOM elements of the calculator
const inputBox = document.getElementById("input");
const expressionDiv = document.getElementById("expression");
const resultDiv = document.getElementById("result");

// Define expression and result variable
let expression = "";
let result = "";

// Define eventg handler for button clicks

function buttonClick(event) {
  // Get values from clicked button
  const target = event.target;
  const action = target.dataset.action;
  const value = target.dataset.value;
  // console.log(target, action, value);

  //Switch case to control the calculator
  switch (action) {
    case "number":
      addValue(value);
      break;
    case "clear":
      clear();
      break;
    case "backspace":
      backspace();
      break;
    // Add the result to expression as a starting point if expression is empty
    case "addition":
    case "subtraction":
    case "multiplication":
    case "division":
      if (expression === "" && result !== "") {
        startFfromResult(value);
      } else if (expression !== "" && !isLastCharOperator()) {
        addValue(value);
      }
      break;
    case "submit":
      submit();
      break;
    case "negate":
      negate();
      break;
    case "mod":
      percentage();
      break;
    case "decimal":
      decimal(value);
      break;
  }

  //Update display
  updateDisplay(expression, result);
}

inputBox.addEventListener("click", buttonClick);

function addValue(value) {
  if (value === ".") {
    //  Find the index of the last operator in the expresion
    const lastOperatorIndex = expression.search(/[+\-*/]/);
    //  Find the index of the last decimal in the expresion
    const lastDecimalIndex = expression.lastIndexOf(".");
    //Find the index of the last number in the expresion
    const lastnumberIndex = Math.max(
      expression.lastIndexOf("+"),
      expression.lastIndexOf("-"),
      expression.lastIndexOf("*"),
      expression.lastIndexOf("/")
    );
    // Check if this is the first decimal in the current number or if the expression is empty
    if (
      (lastDecimalIndex < lastOperatorIndex ||
        lastDecimalIndex < lastnumberIndex ||
        lastDecimalIndex === -1) &&
      (expression === "" ||
        expression.slice(lastnumberIndex + 1).indexOf("-") === -1)
    ) {
      expression += value;
    }
  } else {
    expression += value;
  }
}

function updateDisplay(expression, result) {
  //  console.log(result);
  //  console.log(expression);
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function clear() {
  expression = "";
  result = "";
}

function backspace() {
  expression = expression.slice(0, -1);
}

function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

function startFfromResult(value) {
  expression += result + value;
}

function submit() {
  result = evaluateExpression();
  expression = " ";
}

function evaluateExpression() {
  const evalResult = eval(expression);
  // checks if evalResult isNaN or infinite . It if is, return a space charachter ' '
  return isNaN(evalResult) || !isFinite(evalResult)
    ? " "
    : evalResult < 1
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(2));
}

function negate() {
  //negate the result if expression is empty and result is present
  if (expression === "" && result !== "") {
    result = -result;
    // toggle the sign of the expression if its not already negative and its not empty
  } else if (!expression.startsWith("-") && expression !== "") {
    expression = "-" + expression;
    // remove the negative sign from the exepression is its already negative.
  } else if (expression.startsWith("-")) {
    expression = expression.slice(1);
  }
}

function percentage() {
  //evaluate the expression else it will take the precentage of only the first number
  if (expression !== " ") {
    result = evaluateExpression();
    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = "";
    }
  } else if (result !== "") {
    result = parseFloat(result) / 100;
  }
}

function decimal(value) {
  if (expression.endsWith("-") && !isSecureContext(expression.slice(-1))) {
    addValue(value);
  }
}
