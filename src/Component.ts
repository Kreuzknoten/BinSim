import { Coordinate } from "./General";

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
  draw(ctx: CanvasRenderingContext2D): void;
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
    this.size = new Coordinate(50, 50);
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

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "grey";
    ctx.fillRect(
      this.coordinate.x,
      this.coordinate.y,
      this.size.x,
      this.size.x
    );

    ctx.strokeStyle = "black";
    ctx.strokeText("AND", this.coordinate.x + 1, this.coordinate.y + 10);
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
