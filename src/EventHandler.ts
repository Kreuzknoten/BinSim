import { Coordinate } from "./General";
import { AndGate, IComponent, ComponentTree } from "./Component";
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
    let mouseCanvasPosition = this.getCanvasMousePosition(event);
    let mouseGridPosition = this.getGridPositionFrom(mouseCanvasPosition);

    if (buttonCode == 0) {
      if (this.getComponentsWithinGridCoordinate(mouseGridPosition) == null) {
        let gate = new AndGate(mouseGridPosition);
        this.renderer.componentTree.addComponent(gate);
        this.renderer.draw();
      } else {
        console.log("hier ist bereits was");
      }
    }
  }

  getCanvasMousePosition(event: any): Coordinate {
    let canvasBounds = this.canvas.getBoundingClientRect();

    // Canvas coordinates
    let x = event.pageX - canvasBounds.left;
    let y = event.pageY - canvasBounds.top;

    return new Coordinate(x, y);
  }

  getGridPositionFrom(canvasPosition: Coordinate): Coordinate {
    let grid = this.renderer.grid;

    // Grid coordinates
    let x = Math.round(canvasPosition.x / (grid.gridSize * grid.scale));
    let y = Math.round(canvasPosition.y / (grid.gridSize * grid.scale));

    return new Coordinate(x, y);
  }

  getComponentsWithinGridCoordinate(
    gridCoordinate: Coordinate
  ): IComponent[] | null {
    let componentArray = this.renderer.componentTree.components;

    let hitComponentArray = new Array<IComponent>();
    componentArray.forEach((component) => {
      if (component.isGridPositionWithingComponent(gridCoordinate)) {
        hitComponentArray.push(component);
      }
    });

    if (hitComponentArray.length == 0) {
      return null;
    } else {
      return hitComponentArray;
    }
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
