import { Coordinate } from "./Coordinate";
import { GridCoordinate } from "./Coordinate";
import { CanvasCoordinate } from "./Coordinate";

export class Grid {
  scaleFactor: number;
  gridTranslation: GridCoordinate;
  gridBlockSize: number; //unit is px

  constructor() {
    this.scaleFactor = 1;
    this.gridBlockSize = 10;
    this.gridTranslation = new Coordinate(0, 0);
  }

  zoomBy(factor: number): void {
    this.scaleFactor = this.scaleFactor * factor;
  }

  translateByGridCoordinate(newGridCoordinate: GridCoordinate): void {
    this.gridTranslation = this.gridTranslation.plus(newGridCoordinate);
  }

  translateByCanvasCoordinate(canvasCoordinate: CanvasCoordinate): void {
    let gridTranslation: Coordinate = this.getGridCoordinateFromCanvasCoordinate(canvasCoordinate);
    this.translateByGridCoordinate(gridTranslation);

    // let gridTranslationX: number = canvasCoordinate.x / (this.gridSize * this.scale);
    // let gridTranslationY: number = canvasCoordinate.y / (this.gridSize * this.scale);

    // let gridTranslationCoordinate: Coordinate = new Coordinate(gridTranslationX, gridTranslationY);
    // this.translateBy(gridTranslationCoordinate);

    console.log("translateByCanvasPosition" + this.getCanvasCoordinateFromGridCoordinate(gridTranslation).toString());
  }

  getCanvasCoordinateFromGridCoordinate(gridcoordinate: GridCoordinate): CanvasCoordinate {
    let canvasCoordinateX: number = Math.round((gridcoordinate.x + this.gridTranslation.x) * this.gridBlockSize * this.scaleFactor);
    let canvasCoordinateY: number = Math.round((gridcoordinate.y + this.gridTranslation.y) * this.gridBlockSize * this.scaleFactor);
    return new CanvasCoordinate(canvasCoordinateX, canvasCoordinateY);
  }

  getGridCoordinateFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
    let gridCoordinateX: number = Math.round(canvasCoordinate.x / this.gridBlockSize / this.scaleFactor + this.gridTranslation.x);
    let gridCoordinateY: number = Math.round(canvasCoordinate.y / this.gridBlockSize / this.scaleFactor + this.gridTranslation.y);
    return new GridCoordinate(gridCoordinateX, gridCoordinateY);
  }
}
