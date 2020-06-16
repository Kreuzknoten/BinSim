import { Coordinate } from "./General";

interface IComponent {
  coordinate: Coordinate;
  size: Coordinate;
  background: string;
  ctx: CanvasRenderingContext2D;
  draw(): void;
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
  ctx: CanvasRenderingContext2D;

  constructor(coordinate: Coordinate, ctx: CanvasRenderingContext2D) {
    this.coordinate = coordinate;
    this.size = new Coordinate(50, 50);
    this.background = "#878787";
    this.ctx = ctx;

    /*
          this.outputs = Output[1];
          this.outputs[0] = new Output;
          this.outputs[0].isOn = false;
  
          this.inputs = new Input[2];
          this.inputs[0] = new Input;
          this.inputs[1] = new Input;
          */
  }

  draw(): void {
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(
      this.coordinate.x,
      this.coordinate.y,
      this.size.x,
      this.size.x
    );

    this.ctx.strokeStyle = "black";
    this.ctx.strokeText("AND", this.coordinate.x + 1, this.coordinate.y + 10);
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
