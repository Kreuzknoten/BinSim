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
        this.onCanvasMouseMove(event);
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

  getMouseGridCoordinate(event: MouseEvent): GridCoordinate {
    let mouseCanvasCoordinateRelativeToOrigin: CanvasCoordinate = this.getMouseCanvasCoordinateRelativeToOrigin(
      event
    );
    return this.renderer.grid.getGridCoordinateFromCanvasCoordinate(
      mouseCanvasCoordinateRelativeToOrigin
    );
  }

  getMouseCanvasCoordinate(event: MouseEvent): CanvasCoordinate {
    return this.getMouseCanvasCoordinateRelativeToOrigin(event).plus(
      this.renderer.grid.canvasTranslation
    );
  }

  onCanvasMouseDown(event: MouseEvent): void {
    let buttonCode = event.button;

    let mouseGridCoordinate: GridCoordinate = this.getMouseGridCoordinate(event);

    let hitComponent = this.getComponentsWithinGridCoordinate(mouseGridCoordinate);

    // Left Mouse Button
    if (buttonCode == 0) {
      this.lastLeftMouseDownEventInfo.setEvent(event, hitComponent);

      if (event.ctrlKey) {
        this.isDraggingGrid = true;
      } else {
        if (hitComponent == null) {
          let newGate = new AndGate(mouseGridCoordinate);
          this.renderer.componentTree.addComponent(newGate);
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

  onCanvasMouseMove(event: MouseEvent) {
    let grid = this.renderer.grid;

    if (this.isDraggingComponent || this.isDraggingGrid) {
      if (this.isDraggingComponent) {
        let mouseGridCoordinate: GridCoordinate = this.getMouseGridCoordinate(event);
        let componentOfLastEvent = this.lastLeftMouseDownEventInfo.hitComponent;
        componentOfLastEvent?.moveTo(mouseGridCoordinate);
      }

      if (this.isDraggingGrid) {
        if (this.lastMouseMoveEventInfo.event instanceof MouseEvent) {
          let mouseCanvasCoordinate: CanvasCoordinate = this.getMouseCanvasCoordinate(event);
          let previousEvent: MouseEvent = this.lastMouseMoveEventInfo.event;
          let previousMouseCanvasCoordinate: CanvasCoordinate = this.getMouseCanvasCoordinate(
            previousEvent
          );

          let dragDelta: CanvasCoordinate = mouseCanvasCoordinate.minus(
            previousMouseCanvasCoordinate
          );
          grid.translateByCanvasCoordinate(dragDelta);
        }
      }

      this.drawCall();
    }

    this.lastMouseMoveEventInfo.setEvent(event, null);
  }

  // Bestimmt funzt hier nixxx
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
    let mouseGridCoordinate = this.renderer.grid.getGridCoordinateRelativeToOriginFromCanvasCoordinate(
      mouseCanvasCoordinate
    );
    console.log("mouseCanvasCoordinate" + mouseCanvasCoordinate.toString());

    // Zoom
    this.renderer.grid.zoomBy(zoomStep);

    // Grid was moved by zoom
    // Get new Canvas Coordinate of zoom center
    let newCanvasCoordinateOfZoomCenter: CanvasCoordinate = this.renderer.grid.getCanvasCoordinateFromGridCoordinate(
      mouseGridCoordinate
    );
    let afterZoomCanvasCoordinateDelta: CanvasCoordinate = mouseCanvasCoordinate.minus(
      newCanvasCoordinateOfZoomCenter
    );

    console.log("shouldTranslateByCanvasCoordinate" + afterZoomCanvasCoordinateDelta.toString());

    // Set zoom center to previous canvas coordinate
    this.renderer.grid.translateByCanvasCoordinate(afterZoomCanvasCoordinateDelta);

    this.drawCall();
  }

  drawCall(): void {
    // console.log("isDraggingComponent: " + this.isDraggingComponent);
    // console.log("isDraggingGrid: " + this.isDraggingGrid);
    // console.log("Number Of Gates: " + this.renderer.componentTree.components.length);
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
