import { Coordinate } from "./General";
import { AndGate, IComponent, ComponentTree } from "./Component";
import { Renderer } from "./Renderer";

export class EventHandler {
  canvas: HTMLCanvasElement;
  renderer: Renderer;
  eventHistory: EventInfo[]; //Only Keys + Mouse Up/Down intended

  constructor(canvas: HTMLCanvasElement, renderer: Renderer) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.eventHistory = new Array<EventInfo>();

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

  getComponentsWithinGridCoordinate(
    gridCoordinate: Coordinate
  ): IComponent | null {
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

    if (buttonCode == 0) {
      // Left Mouse Button
      if (hitComponent == null) {
        let gate = new AndGate(mouseGridPosition);
        this.renderer.componentTree.addComponent(gate);
        this.renderer.draw();
      } else {
        //
      }
    }

    let eventInfo = new EventInfo();
    eventInfo.addEvent(event, hitComponent);
    this.eventHistory.push(eventInfo);
  }

  onCanvasMouseUp(event: MouseEvent): void {
    let buttonCode = event.button;

    if (buttonCode == 0) {
    }

    let eventInfo = new EventInfo();
    eventInfo.addEvent(event, null);
    this.eventHistory.push(eventInfo);
  }

  onCanvasMove(event: MouseEvent) {
    let mouseCanvasPosition = this.getCanvasMousePosition(event);
    let mouseGridPosition = this.getGridPositionFrom(mouseCanvasPosition);
    let thereIsEventHistory = this.eventHistory.length > 0;

    if (thereIsEventHistory) {
      let lastEvent = this.eventHistory[this.eventHistory.length - 1];
      let lastEventIsHitAndDown =
        lastEvent.hitComponent && lastEvent.event.type == "mousedown";

      if (lastEventIsHitAndDown) {
        let componentOfLastEvent = lastEvent.hitComponent;
        componentOfLastEvent?.moveTo(mouseGridPosition);
      }
    }

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

  addEvent(event: UIEvent, hitComponent: IComponent | null): boolean {
    if (event.type == "mouseup" || event.type == "mousedown") {
      this.event = event;
      this.hitComponent = hitComponent;
      return true;
    } else {
      return false;
    }
  }
}
