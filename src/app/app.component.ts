import { Component } from "@angular/core";
import { isNumber } from "util";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  text = "0";
  error = "";
  regex = /^\s*([-+]?)(\d+)(?:\s*([-+*\/])\s*((?:\s[-+])?\d+)\s*)+$/;

  public typeCharacter(char: string | number) {
    if (this.text === "0") {
      this.text = char.toString();
      return;
    }
    this.text += char;
  }

  public remove() {
    if (this.text.length <= 1) {
      this.text = "0";
    } else {
      this.text = this.text.substr(0, this.text.length - 1);
    }
  }

  public calculate() {
    let m: any[] | RegExpExecArray;
    const formattedText = this.text.replace(/÷/g, "/").replace(/×/g, "*");
    let result = 0;
    if ((m = this.regex.exec(formattedText)) !== null) {
      this.error = "";
      this.findDots(m[0]);
    } else {
      this.error = "invalid format!";
    }
  }

  private findDots(expression) {
    let processedTxt = expression;
    const multiplies = processedTxt.split("*");

    processedTxt = this.processStatement("", multiplies, "*");
    const divides = processedTxt.split("/");
    console.log(multiplies);

    if (divides.length > 1) {
      console.log(divides);
      processedTxt = this.processStatement(divides[0], divides, "/");
    }
    console.log(processedTxt);
  }

  private processStatement(preparedTxt: string, array, symbol: string): string {
    for (let i = 0; i < array.length; i++) {
      let partA = array[i];
      let partB = array[i + 1];

      let a = partA;
      let b = partB;

      if (!a || !b) {
        continue;
      }

      do {
        let splittedA = this.split(a);
        if (splittedA) {
          a = splittedA[splittedA.length - 1];
        }
      } while (!isNumber(Number(a)));
      do {
        let splittedB = this.split(b);
        if (splittedB) {
          b = splittedB[0];
        }
      } while (!isNumber(Number(b)));

      const loiA = this.getLastOperationIndex(partA);
      const foiA = this.getFirstOperationIndex(partA);
      if (loiA > 0 && foiA > 0 && loiA !== foiA) {
        preparedTxt += partA.substr(foiA, loiA);
      } else if (loiA > 0 && foiA > 0) {
        preparedTxt += partA.substr(loiA, 1);
      }

      preparedTxt += this.doCalc(a, b, symbol);

      if (i !== array.length - 2) {
        continue;
      }
      const loiB = this.getLastOperationIndex(partB);
      const foiB = this.getFirstOperationIndex(partB);
      if (loiB > 0 && foiB > 0 && loiB !== foiB) {
        preparedTxt += partB.substr(foiB);
      } else if (loiB > 0 && foiB > 0) {
        preparedTxt += partB.substr(loiB, 1);
      }
    }
    return preparedTxt;
  }

  private doCalc(a: number, b: number, symbol: string): number {
    switch (symbol) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "/":
        return a / b;
      case "*":
        return a * b;
    }
  }

  private getFirstOperationIndex(str: string): number {
    let minIndex = str.indexOf("+");
    let indMinus = str.indexOf("-");
    if ((minIndex > indMinus && indMinus > 0) || minIndex < 0) {
      minIndex = indMinus;
    }
    let indMult = str.indexOf("*");
    if ((minIndex > indMult && indMult > 0) || minIndex < 0) {
      minIndex = indMult;
    }
    let indDiv = str.indexOf("/");
    if ((minIndex > indDiv && indDiv > 0) || minIndex < 0) {
      minIndex = indDiv;
    }
    return minIndex;
  }

  private getLastOperationIndex(str: string): number {
    let minIndex = str.lastIndexOf("+");
    let indMinus = str.lastIndexOf("-");
    if ((minIndex > indMinus && indMinus > 0) || minIndex < 0) {
      minIndex = indMinus;
    }
    let indMult = str.lastIndexOf("*");
    if ((minIndex > indMult && indMult > 0) || minIndex < 0) {
      minIndex = indMult;
    }
    let indDiv = str.lastIndexOf("/");
    if ((minIndex > indDiv && indDiv > 0) || minIndex < 0) {
      minIndex = indDiv;
    }
    return minIndex;
  }

  private split(expr: string) {
    let splitted = expr.split("+");
    if (splitted.length >= 2) {
      return splitted;
    }
    splitted = expr.split("-");
    if (splitted.length >= 2) {
      return splitted;
    }
    splitted = expr.split("/");
    if (splitted.length >= 2) {
      return splitted;
    }
    splitted = expr.split("*");
    if (splitted.length >= 2) {
      return splitted;
    }
  }
}
