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

    console.log("translateByCanvasPosition" + this.getCanvasCoordinateFromGridCoordinate(gridTranslation).toString());
  }

  getCanvasCoordinateFromGridCoordinate(gridcoordinate: GridCoordinate): CanvasCoordinate {
    let x: number = Math.round((gridcoordinate.x - this.gridTranslation.x) * this.gridBlockSize * this.scaleFactor);
    let y: number = Math.round((gridcoordinate.y - this.gridTranslation.y) * this.gridBlockSize * this.scaleFactor);
    return new CanvasCoordinate(x, y);
  }

  getGridCoordinateFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
    let x: number = Math.round(canvasCoordinate.x / this.gridBlockSize / this.scaleFactor - this.gridTranslation.x);
    let y: number = Math.round(canvasCoordinate.y / this.gridBlockSize / this.scaleFactor - this.gridTranslation.y);
    return new GridCoordinate(x, y);
  }

  getGridCoordinateRelativeToOriginFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
    let x: number = Math.round(canvasCoordinate.x / (this.gridBlockSize * this.scaleFactor));
    let y: number = Math.round(canvasCoordinate.y / (this.gridBlockSize * this.scaleFactor));

    return new GridCoordinate(x, y);
  }
}
