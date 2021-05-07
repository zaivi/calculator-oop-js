class Calculator {
    constructor(preOperandElement, curOperandElement) {
        this.preOperandElement = preOperandElement;
        this.curOperandElement = curOperandElement;
        this.overload = false;
        if (localStorage.getItem("curOperand")) {
            this.curOperandElement.innerText = localStorage.getItem(
                "curOperand"
            );
            this.curOperand = localStorage.getItem("curOperand");
        } else {
            this.clear();
        }
    }
    clear() {
        this.curOperand = "";
        this.preOperand = "";
        this.overload = false;
        this.operator = null;
        localStorage.setItem("curOperand", "");
    }
    toNumber(number) {
        const isNumber = Number.parseFloat(number) * 10;
        return isNaN(isNumber) ? undefined : isNumber;
    }
    appendNumber(number) {
        if (this.overload) return;
        if (this.curOperand.length >= 12) {
            this.overload = true;
            return;
        }
        if (number === "." && this.curOperand.includes(".")) return;
        this.curOperand = this.curOperand.toString() + number.toString();
    }
    updateDisplay() {
        if (this.overload) {
            this.curOperandElement.innerText = "Math ERROR";
            return;
        }
        this.curOperandElement.innerText =
            this.curOperand.length >= 12 ? "Math ERROR" : this.curOperand;
        if (this.preOperand !== undefined) {
            this.preOperandElement.innerText = this.operator
                ? this.preOperand + this.operator
                : this.preOperand;
        }
    }
    setOperation(operator) {
        if (this.overload) return;
        if (this.curOperand !== "" && this.preOperand !== "") {
            this.compute();
            return;
        }
        if (this.operator) return;
        this.operator = operator;
        this.preOperand = this.curOperand;
        this.curOperand = "";
    }
    deleteNumber() {
        if (this.curOperand.length === 0 && this.preOperand) {
            localStorage.setItem("curOperand", "");
            this.curOperand = this.preOperand
                ? this.preOperand + this.operator
                : "";
            this.preOperand = "";
            this.operator = "";
        }
        this.curOperand = this.curOperand.toString().slice(0, -1);
    }
    compute() {
        let computed;
        switch (this.operator) {
            case "x":
                computed =
                    this.toNumber(this.preOperand) *
                    this.toNumber(this.curOperand);
                computed /= 10;
                break;
            case "+":
                computed =
                    this.toNumber(this.preOperand) +
                    this.toNumber(this.curOperand);
                break;
            case "-":
                computed =
                    this.toNumber(this.preOperand) -
                    this.toNumber(this.curOperand);
                break;
            case "%":
                computed = Math.floor(
                    this.toNumber(this.preOperand) /
                        this.toNumber(this.curOperand)
                );
                computed *= 10;
                break;
            case "÷":
                computed =
                    this.toNumber(this.preOperand) /
                    this.toNumber(this.curOperand);
                computed = (computed * 10).toPrecision(12);
                break;
            default:
                return;
        }
        this.clear();
        this.curOperand = (computed / 10).toString();
        localStorage.setItem("curOperand", this.curOperand);
    }
}

const preOperand = document.querySelector(".previous-operand");
const curOperand = document.querySelector(".current-operand");
const buttonNumber = document.querySelectorAll("[data-number]");
const buttonOperation = document.querySelectorAll("[data-operation]");
const buttonEqual = document.querySelector("[data-equal]");
const buttonDelete = document.querySelector("[data-delete]");
const buttonClear = document.querySelector("[data-clear]");

buttonNumber.forEach((btn) => {
    btn.addEventListener("click", () => {
        calculator.appendNumber(btn.innerText);
        calculator.updateDisplay();
    });
});

buttonOperation.forEach((btn) => {
    btn.addEventListener("click", () => {
        calculator.setOperation(btn.innerText);
        calculator.updateDisplay();
    });
});

buttonClear.addEventListener("click", () => {
    calculator.clear();
    calculator.updateDisplay();
});

buttonDelete.addEventListener("click", () => {
    calculator.deleteNumber();
    calculator.updateDisplay();
});

buttonEqual.addEventListener("click", () => {
    calculator.compute();
    calculator.updateDisplay();
});

const calculator = new Calculator(preOperand, curOperand);

const curTheme = localStorage.getItem("data-theme");

if (curTheme) {
    document.documentElement.setAttribute("data-theme", curTheme);
}

const btnDarkMode = document.querySelectorAll(".dark-mode button");

const clearActive = () => {
    btnDarkMode.forEach((btn) => {
        if (btn.classList.contains("active")) {
            btn.classList.remove("active");
        }
    });
};

Array.from(btnDarkMode).forEach(function (btn) {
    btn.addEventListener("click", function () {
        clearActive();
        this.classList.add("active");
        if (btn.classList.contains("light")) {
            localStorage.setItem("data-theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            localStorage.setItem("data-theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
        }
    });
});
