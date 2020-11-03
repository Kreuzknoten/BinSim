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

  getCanvasMousePosition(event: MouseEvent): CanvasCoordinate {
    let canvasBounds = this.canvas.getBoundingClientRect();
    let x = event.pageX - canvasBounds.left;
    let y = event.pageY - canvasBounds.top;

    return new CanvasCoordinate(x, y);
  }

  // Not needed?
  getGridCoordinateFrom(canvasPosition: CanvasCoordinate): GridCoordinate {
    let grid = this.renderer.grid;

    // Grid coordinates
    let x = Math.round(canvasPosition.x / (grid.gridBlockSize * grid.scaleFactor)) - grid.gridTranslation.x;
    let y = Math.round(canvasPosition.y / (grid.gridBlockSize * grid.scaleFactor)) - grid.gridTranslation.y;

    return new GridCoordinate(x, y);
  }

  // Copy to Grid Class??
  getGridCoordinateRelativeToOriginFrom(canvasPosition: CanvasCoordinate): GridCoordinate {
    let grid = this.renderer.grid;

    // Grid coordinates
    let x = Math.round(canvasPosition.x / (grid.gridBlockSize * grid.scaleFactor));
    let y = Math.round(canvasPosition.y / (grid.gridBlockSize * grid.scaleFactor));

    return new GridCoordinate(x, y);
  }

  getComponentsWithinGridCoordinate(gridCoordinate: GridCoordinate): IComponent | null {
    let componentArray = this.renderer.componentTree.components;

    let hitComponentArray = new Array<IComponent>();
    componentArray.forEach((component) => {
      if (component.isGridPositionWithingComponent(this.renderer.grid, gridCoordinate)) {
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
    let mouseGridPosition = this.getGridCoordinateFrom(mouseCanvasPosition);
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
      let mouseCanvasPosition = this.getCanvasMousePosition(event);
      let mouseGridPosition = this.getGridCoordinateFrom(mouseCanvasPosition);

      let componentOfLastEvent = this.lastLeftMouseDownEventInfo.hitComponent;
      componentOfLastEvent?.moveTo(mouseGridPosition);
    }

    if (this.isDraggingGrid) {
      let mouseCanvasPosition = this.getCanvasMousePosition(event);
      let mouseGridPosition = this.getGridCoordinateFrom(mouseCanvasPosition);

      if (this.lastMouseMoveEventInfo.event instanceof MouseEvent) {
        let initialMouseCanvasPosition = this.getCanvasMousePosition(this.lastMouseMoveEventInfo.event);
        let initialMouseGridPosition = this.getGridCoordinateFrom(initialMouseCanvasPosition);

        let diffMouseGridPosition = mouseGridPosition.minus(initialMouseGridPosition);
        this.renderer.grid.translateByGridCoordinate(diffMouseGridPosition);
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
    let mouseCanvasPosition = this.getCanvasMousePosition(event);
    let mouseGridPosition = this.getGridCoordinateRelativeToOriginFrom(mouseCanvasPosition);
    console.log("mouseCanvasPosition" + mouseCanvasPosition.toString());

    // Zoom
    this.renderer.grid.zoomBy(zoomStep);

    // Grid was moved by zoom
    // Get new Canvas Position of zoom center
    let newCanvasPositionOfZoomCenter: Coordinate = this.renderer.grid.getCanvasCoordinateFromGridCoordinate(mouseGridPosition);
    let afterZoomCanvasCoordinateDelta: Coordinate = mouseCanvasPosition.minus(newCanvasPositionOfZoomCenter);

    console.log("shouldTranslateByCanvasPosition" + afterZoomCanvasCoordinateDelta.toString());

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
