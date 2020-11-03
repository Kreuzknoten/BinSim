import { Coordinate } from "./Coordinate";
import { GridCoordinate } from "./Coordinate";
import { CanvasCoordinate } from "./Coordinate";
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

  // Is there a better place for you?
  getMouseCanvasCoordinateRelativeToOrigin(event: MouseEvent): CanvasCoordinate {
    let canvasBounds = this.canvas.getBoundingClientRect();
    let x = event.pageX - canvasBounds.left;
    let y = event.pageY - canvasBounds.top;

    return new CanvasCoordinate(x, y);
  }

  getComponentsWithinGridCoordinate(gridCoordinate: GridCoordinate): IComponent | null {
    let componentArray = this.renderer.componentTree.components;

    let hitComponentArray = new Array<IComponent>();
    componentArray.forEach((component) => {
      if (component.isGridCoordinateWithingComponent(this.renderer.grid, gridCoordinate)) {
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
    let mouseCanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(event);
    let mouseGridCoordinate = this.renderer.grid.getGridCoordinateFromCanvasCoordinate(mouseCanvasCoordinate);
    let hitComponent: IComponent | null;

    hitComponent = this.getComponentsWithinGridCoordinate(mouseGridCoordinate);

    // Left Mouse Button
    if (buttonCode == 0) {
      this.lastLeftMouseDownEventInfo.setEvent(event, hitComponent);

      if (event.ctrlKey) {
        this.isDraggingGrid = true;
      } else {
        if (hitComponent == null) {
          let gate = new AndGate(mouseGridCoordinate);
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

    this.drawCall();
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

    this.drawCall();
  }

  onCanvasMove(event: MouseEvent) {
    if (this.isDraggingComponent) {
      let mouseCanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(event);
      let mouseGridCoordinate = this.renderer.grid.getGridCoordinateFromCanvasCoordinate(mouseCanvasCoordinate);

      let componentOfLastEvent = this.lastLeftMouseDownEventInfo.hitComponent;
      componentOfLastEvent?.moveTo(mouseGridCoordinate);
    }

    if (this.isDraggingGrid) {
      let mouseCanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(event);
      let mouseGridCoordinate = this.renderer.grid.getGridCoordinateFromCanvasCoordinate(mouseCanvasCoordinate);

      if (this.lastMouseMoveEventInfo.event instanceof MouseEvent) {
        let initialMouseCanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(this.lastMouseMoveEventInfo.event);
        let initialMouseGridCoordinate = this.renderer.grid.getGridCoordinateFromCanvasCoordinate(initialMouseCanvasCoordinate);

        let MouseGridCoordinateDelta = mouseGridCoordinate.minus(initialMouseGridCoordinate);
        this.renderer.grid.translateByGridCoordinate(MouseGridCoordinateDelta);
      }
    }

    this.lastMouseMoveEventInfo.setEvent(event, null);

    this.drawCall();
  }

  onCanvasScroll(event: WheelEvent): void {
    let currentGridScale: number = this.renderer.grid.scaleFactor;
    let zoomStep: number = 0;

    if (event.deltaY < 0) {
      zoomStep = 1.05;
    } else if (event.deltaY > 0) {
      zoomStep = 0.95;
    }

    // Get zoom center
    let mouseCanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(event);
    let mouseGridCoordinate = this.renderer.grid.getGridCoordinateRelativeToOriginFromCanvasCoordinate(mouseCanvasCoordinate);
    console.log("mouseCanvasCoordinate" + mouseCanvasCoordinate.toString());

    // Zoom
    this.renderer.grid.zoomBy(zoomStep);

    // Grid was moved by zoom
    // Get new Canvas Coordinate of zoom center
    let newCanvasCoordinateOfZoomCenter: Coordinate = this.renderer.grid.getCanvasCoordinateFromGridCoordinate(mouseGridCoordinate);
    let afterZoomCanvasCoordinateDelta: Coordinate = mouseCanvasCoordinate.minus(newCanvasCoordinateOfZoomCenter);

    console.log("shouldTranslateByCanvasCoordinate" + afterZoomCanvasCoordinateDelta.toString());

    // Set zoom center to previous canvas coordinate
    this.renderer.grid.translateByCanvasCoordinate(afterZoomCanvasCoordinateDelta);

    this.drawCall();
  }

  drawCall(): void {
    console.log("isDraggingComponent: " + this.isDraggingComponent);
    console.log("isDraggingGrid: " + this.isDraggingGrid);
    console.log("Number Of Gates: " + this.renderer.componentTree.components.length);
    this.renderer.draw();
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
