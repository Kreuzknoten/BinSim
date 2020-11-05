export interface ICoordinate {
  x: number;
  y: number;
  plus(newPosition: any): any;
  minus(newPosition: any): any;
  inverse(): any;
  toString(): string;
}

export class GridCoordinate implements ICoordinate {
  gridCoordinateDummy: void;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(newPosition: GridCoordinate): GridCoordinate {
    let newX = this.x + newPosition.x;
    let newY = this.y + newPosition.y;
    return new GridCoordinate(newX, newY);
  }

  minus(newPosition: GridCoordinate): GridCoordinate {
    let newX = this.x - newPosition.x;
    let newY = this.y - newPosition.y;
    return new GridCoordinate(newX, newY);
  }

  inverse(): GridCoordinate {
    let newX = this.x * -1;
    let newY = this.y * -1;
    return new GridCoordinate(newX, newY);
  }

  toString(): string {
    let text: string = "x = " + this.x + " y = " + this.y;
    return text;
  }
}

export class CanvasCoordinate implements ICoordinate {
  canvasCoordinateDummy: void;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(newPosition: CanvasCoordinate): CanvasCoordinate {
    let newX = this.x + newPosition.x;
    let newY = this.y + newPosition.y;
    return new CanvasCoordinate(newX, newY);
  }

  minus(newPosition: CanvasCoordinate): CanvasCoordinate {
    let newX = this.x - newPosition.x;
    let newY = this.y - newPosition.y;
    return new CanvasCoordinate(newX, newY);
  }

  inverse(): CanvasCoordinate {
    let newX = this.x * -1;
    let newY = this.y * -1;
    return new CanvasCoordinate(newX, newY);
  }

  toString(): string {
    let text: string = "x = " + this.x + " y = " + this.y;
    return text;
  }
}
