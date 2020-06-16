import { Coordinate } from "./General";
import { AndGate } from "./Component";
import { Renderer } from "./Renderer";

export class EventHandler {
  canvas: HTMLCanvasElement;
  renderer: Renderer;

  constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

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
      let mousePosition = this.getCanvasMousePosition(event);
      let gate = new AndGate(mousePosition);
      this.renderer.componentTree.addComponent(gate);
      this.renderer.draw();
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
    }
  }

  onCanvasScroll(event: any): void {
    let buttonCode = event.button;
    if (buttonCode == 0) {
      console.log("Scroll");
    }
  }
}
