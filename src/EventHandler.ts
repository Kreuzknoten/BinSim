import { Coordinate } from "./General";
import { AndGate, IComponent, ComponentTree } from "./Component";
import { Renderer } from "./Renderer";

export class EventHandler {
  canvas: HTMLCanvasElement;
  renderer: Renderer;

  lastLeftMouseDownEventInfo: EventInfo;
  lastRightMouseDownEventInfo: EventInfo;
  lastMouseMoveEventInfo: EventInfo;
  isDraggingComponent: boolean;
  isDraggingGrid: boolean;

  constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.lastLeftMouseDownEventInfo = new EventInfo();
    this.lastRightMouseDownEventInfo = new EventInfo();
    this.lastMouseMoveEventInfo = new EventInfo();
    this.isDraggingComponent = false;
    this.isDraggingGrid = false;

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
      "mousemove",
      (event) => {
        this.onCanvasMove(event);
      },
      false
    );

    document.getElementById("canvas")!.addEventListener(
      "wheel",
      (event) => {
        this.onCanvasScroll(event);
      },
      false
    );
  }

  getCanvasMousePosition(event: MouseEvent): Coordinate {
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

  getComponentsWithinGridCoordinate(gridCoordinate: Coordinate): IComponent | null {
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
      return hitComponentArray[0];
    }
  }

  onCanvasMouseDown(event: MouseEvent): void {
    let buttonCode = event.button;
    let mouseCanvasPosition = this.getCanvasMousePosition(event);
    let mouseGridPosition = this.getGridPositionFrom(mouseCanvasPosition);
    let hitComponent: IComponent | null;
    hitComponent = this.getComponentsWithinGridCoordinate(mouseGridPosition);

    // Left Mouse Button
    if (buttonCode == 0) {
      this.lastLeftMouseDownEventInfo.setEvent(event, hitComponent);

      if (event.ctrlKey) {
        this.isDraggingGrid = true;
      } else {
        if (hitComponent == null) {
          let gate = new AndGate(mouseGridPosition);
          this.renderer.componentTree.addComponent(gate);
        } else {
          this.isDraggingComponent = true;
        }
      }
    }

    // Right Mouse Button
    if (buttonCode == 2) {
      this.lastRightMouseDownEventInfo.setEvent(event, hitComponent);
    }

    this.renderer.draw();
  }

  onCanvasMouseUp(event: MouseEvent): void {
    let buttonCode = event.button;

    // Left Mouse Button
    if (buttonCode == 0) {
      this.isDraggingComponent = false;
      this.isDraggingGrid = false;
    }

    // Right Mouse Button
    if (buttonCode == 2) {
    }

    this.renderer.draw();
  }

  onCanvasMove(event: MouseEvent) {
    if (this.isDraggingComponent) {
      let mouseCanvasPosition = this.getCanvasMousePosition(event);
      let mouseGridPosition = this.getGridPositionFrom(mouseCanvasPosition);

      let componentOfLastEvent = this.lastLeftMouseDownEventInfo.hitComponent;
      componentOfLastEvent?.moveTo(mouseGridPosition);
    }

    if (this.isDraggingGrid) {
      let mouseCanvasPosition = this.getCanvasMousePosition(event);
      let mouseGridPosition = this.getGridPositionFrom(mouseCanvasPosition);

      if (this.lastMouseMoveEventInfo.event instanceof MouseEvent) {
        let initialMouseCanvasPosition = this.getCanvasMousePosition(this.lastMouseMoveEventInfo.event);
        let initialMouseGridPosition = this.getGridPositionFrom(initialMouseCanvasPosition);

        let diffMouseGridPosition = mouseGridPosition.minus(initialMouseGridPosition);
        this.renderer.grid.translateBy(diffMouseGridPosition);
      }
    }

    this.lastMouseMoveEventInfo.setEvent(event, null);

    this.renderer.draw();
  }

  onCanvasScroll(event: MouseEvent): void {
    let buttonCode = event.button;
    if (buttonCode == 0) {
      console.log("Scroll");
    }
  }
}

class EventInfo {
  event: UIEvent;
  hitComponent: IComponent | null;

  setEvent(event: UIEvent, hitComponent: IComponent | null): void {
    this.event = event;
    this.hitComponent = hitComponent;
  }
}
