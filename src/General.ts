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
}
