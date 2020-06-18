import { Coordinate } from "./General";

export class Grid {
  scale: number;
  translation: Coordinate;
  gridSize: number;

  constructor() {
    this.scale = 0.5; // unit is %
    this.gridSize = 20; //unit is px
    this.translation = new Coordinate(0, 0);
  }

  translateBy(newGridCoordinate: Coordinate): void {
    this.translation = this.translation.plus(newGridCoordinate);
  }
}
