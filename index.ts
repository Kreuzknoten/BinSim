canvas: HTMLCanvasElement;
ctx: CanvasRenderingContext2D;

var canvas = document.getElementById("canvas") as HTMLCanvasElement;
var ctx = canvas.getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 300;

document
  .getElementById("canvas")
  .addEventListener("click", this.onCanvasClick, false);

function onCanvasClick(event: any) {
  let mousePosition = getCanvasMousePosition(event);

  console.log(mousePosition);
  // ctx.fillRect(mousePosition.x, mousePosition.y, 1, 1);

  let gate = new AndGate(mousePosition);
  gate.draw();
}

function getCanvasMousePosition(event: any) {
  let canvasBounds = canvas.getBoundingClientRect();

  let x = event.pageX - canvasBounds.left;
  let y = event.pageY - canvasBounds.top;

  return new Coordinate(x, y);
}

class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

interface IComponent {
  coordinate: Coordinate;
  size: Coordinate;
  background: string;
  draw(): void;
}

interface IGate extends IComponent {
  inputs: Input[];
  outputs: Output[];
}

class AndGate implements IGate {
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

  draw(): void {
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

//----------------------------------------------------------------------------
