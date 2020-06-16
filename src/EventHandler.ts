import { Coordinate } from "./General";
import { AndGate } from "./Component";

export class EventHandler {
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    document.getElementById("canvas")!.addEventListener(
      "click",
      (event) => {
        this.onCanvasClick(event);
      },
      false
    );
  }

  onCanvasClick(event: any): void {
    let mousePosition = this.getCanvasMousePosition(event);

    //let mousePosition = new Coordinate(10, 10);
    console.log(mousePosition);
    // ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);

    let gate = new AndGate(mousePosition, this.canvas.getContext("2d")!);
    gate.draw();
  }

  getCanvasMousePosition(event: any): Coordinate {
    let canvasBounds = this.canvas.getBoundingClientRect();

    let x = event.pageX - canvasBounds.left;
    let y = event.pageY - canvasBounds.top;

    return new Coordinate(x, y);
  }
}
