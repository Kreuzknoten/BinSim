import { Coordinate } from "./General";
import { Grid } from "./Grid";

export class ComponentTree {
  components: IComponent[];
  constructor() {
    this.components = new Array();
  }

  addComponent(component: IComponent) {
    this.components.push(component);
  }

  removeComponent(component: IComponent) {
    // TODO
  }
}

export interface IComponent {
  coordinate: Coordinate;
  size: Coordinate;
  background: string;
  draw(ctx: CanvasRenderingContext2D, grid: Grid): void;
  isGridPositionWithingComponent(gridPosition: Coordinate): Boolean;
}

interface IGate extends IComponent {
  inputs: Input[];
  outputs: Output[];
}

export class AndGate implements IGate {
  inputs: Input[];
  outputs: Output[];
  coordinate: Coordinate;
  size: Coordinate;
  background: string;

  constructor(coordinate: Coordinate) {
    this.coordinate = coordinate;
    this.size = new Coordinate(3, 3);
    this.background = "#878787";

    /*
          this.outputs = Output[1];
          this.outputs[0] = new Output;
          this.outputs[0].isOn = false;
  
          this.inputs = new Input[2];
          this.inputs[0] = new Input;
          this.inputs[1] = new Input;
          */
  }
  isGridPositionWithingComponent(gridPosition: Coordinate): Boolean {
    let isX1 = this.coordinate.x - 1 < gridPosition.x;
    let isX2 = gridPosition.x < this.coordinate.x + this.size.x + 1;
    let isY1 = this.coordinate.y - 1 < gridPosition.y;
    let isY2 = gridPosition.y < this.coordinate.y + this.size.y + 1;

    if (isX1 && isX2 && isY1 && isY2) {
      return true;
    }

    return false;
  }

  draw(ctx: CanvasRenderingContext2D, grid: Grid): void {
    ctx.fillStyle = "grey";
    ctx.fillRect(
      this.coordinate.x * grid.gridSize * grid.scale,
      this.coordinate.y * grid.gridSize * grid.scale,
      this.size.x * grid.gridSize * grid.scale,
      this.size.x * grid.gridSize * grid.scale
    );

    ctx.strokeStyle = "black";
    ctx.strokeText(
      "AND",
      this.coordinate.x * grid.gridSize * grid.scale + 1,
      this.coordinate.y * grid.gridSize * grid.scale + 10
    );
  }
}

interface IPort {}

interface IInputPort extends IPort {
  isConnectedTo: IConnection;
}

interface IOutputPort extends IPort {
  isOn: Boolean;
}

class Output implements IOutputPort {
  isOn: Boolean;
}

class Input implements IInputPort {
  isConnectedTo: IConnection;
}

interface IConnection {
  isConnectedTo: IOutputPort;
}

class Connection implements IConnection {
  isConnectedTo: IOutputPort;
}
