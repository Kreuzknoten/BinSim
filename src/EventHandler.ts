import { Coordinate } from "./General";
import { AndGate } from "./Component";

export class EventHandler {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    document.getElementById("canvas")!.addEventListener(
      "mousedown",
      (event) => {
        this.onCanvasMouseDown(event);
      },
      false
    );

    document.getElementById("canvas")!.addEventListener(
      "mouseup",
      (event) => {
        this.onCanvasMouseUp(event);
      },
      false
    );

    document.getElementById("canvas")!.addEventListener(
      "scroll",
      (event) => {
        this.onCanvasScroll(event);
      },
      false
    );
  }

  onCanvasMouseDown(event: any): void {
    let buttonCode = event.button;
    if (buttonCode == 0) {
      console.log("down");

      let mousePosition = this.getCanvasMousePosition(event);

      console.log(mousePosition);

      let gate = new AndGate(mousePosition, this.canvas.getContext("2d")!);
      gate.draw();
    }
  }

  getCanvasMousePosition(event: any): Coordinate {
    let canvasBounds = this.canvas.getBoundingClientRect();

    let x = event.pageX - canvasBounds.left;
    let y = event.pageY - canvasBounds.top;

    return new Coordinate(x, y);
  }

  onCanvasMouseUp(event: any): void {
    let buttonCode = event.button;
    if (buttonCode == 0) {
      console.log("up");
    }
  }

  onCanvasScroll(event: any): void {
    let buttonCode = event.button;
    if (buttonCode == 0) {
      console.log("Scroll");
    }
  }
}
