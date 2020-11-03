export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(newPosition: Coordinate): Coordinate {
    let newX = this.x + newPosition.x;
    let newY = this.y + newPosition.y;
    return new Coordinate(newX, newY);
  }

  minus(newPosition: Coordinate): Coordinate {
    let newX = this.x - newPosition.x;
    let newY = this.y - newPosition.y;
    return new Coordinate(newX, newY);
  }

  inverse(): Coordinate {
    let newX = this.x * -1;
    let newY = this.y * -1;
    return new Coordinate(newX, newY);
  }

  toString(): string {
    let text: string = "x = " + this.x + " y = " + this.y;
    return text;
  }
}

export class GridCoordinate extends Coordinate {}

export class CanvasCoordinate extends Coordinate {}
