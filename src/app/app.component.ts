import { Component } from "@angular/core";
import { isNumber } from "util";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  text = "0";

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
}
