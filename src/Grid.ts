import { Coordinate } from "./General";

export class Grid {
  scale: number;
  translation: Coordinate;
  gridSize: number;

  constructor() {
    this.scale = 1; // scale factor
    this.gridSize = 10; //unit is px
    this.translation = new Coordinate(0, 0);
  }

  translateBy(newGridCoordinate: Coordinate): void {
    this.translation = this.translation.plus(newGridCoordinate);
  }

  // Center = GridCoordinate
  zoomBy(amount: number): void {
    this.scale = this.scale * amount;
    console.log(this.scale);
  }

  getCanvasCoordinateFromGridCoordinate(gridcoordinate: Coordinate): Coordinate {
    let canvasCoordinateX: number = Math.round((gridcoordinate.x + this.translation.x) * this.gridSize * this.scale);
    let canvasCoordinateY: number = Math.round((gridcoordinate.y + this.translation.y) * this.gridSize * this.scale);
    return new Coordinate(canvasCoordinateX, canvasCoordinateY);
  }

  getGridCoordinateFromCanvasCoordinate(canvasCoordinate: Coordinate): Coordinate {
    let gridCoordinateX: number = Math.round(canvasCoordinate.x / this.gridSize / this.scale + this.translation.x);
    let gridCoordinateY: number = Math.round(canvasCoordinate.y / this.gridSize / this.scale + this.translation.y);
    return new Coordinate(gridCoordinateX, gridCoordinateY);
  }

  translateByPx(canvasCoordinate: Coordinate): void {
    let gridTranslation: Coordinate = this.getGridCoordinateFromCanvasCoordinate(canvasCoordinate);
    this.translateBy(gridTranslation);

    // let gridTranslationX: number = canvasCoordinate.x / (this.gridSize * this.scale);
    // let gridTranslationY: number = canvasCoordinate.y / (this.gridSize * this.scale);

    // let gridTranslationCoordinate: Coordinate = new Coordinate(gridTranslationX, gridTranslationY);
    // this.translateBy(gridTranslationCoordinate);

    console.log("translateByCanvasPosition" + this.getCanvasCoordinateFromGridCoordinate(gridTranslation).toString());
  }
}
