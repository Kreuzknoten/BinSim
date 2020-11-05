import { Coordinate } from "./Coordinate";
import { GridCoordinate } from "./Coordinate";
import { CanvasCoordinate } from "./Coordinate";

export class Grid {
  scaleFactor: number;
  canvasTranslation: CanvasCoordinate;
  gridBlockSize: number; //unit is px

  constructor() {
    this.scaleFactor = 1;
    this.gridBlockSize = 10;
    this.canvasTranslation = new Coordinate(0, 0);
  }

  zoomBy(factor: number): void {
    this.scaleFactor = this.scaleFactor * factor;
  }

  // translateByGridCoordinate(gridCoordinate: GridCoordinate): void {
  //   let canvasCoordinate = this.getCanvasCoordinateeRelativeToOriginFromGridCoordinate(gridCoordinate);
  //   this.translateByCanvasCoordinate(canvasCoordinate);
  // }

  translateByCanvasCoordinate(canvasCoordinate: CanvasCoordinate): void {
    this.canvasTranslation = this.canvasTranslation.plus(canvasCoordinate);
  }

  getCanvasCoordinateFromGridCoordinate(gridcoordinate: GridCoordinate): CanvasCoordinate {
    let x: number = Math.round(gridcoordinate.x * this.gridBlockSize * this.scaleFactor) + this.canvasTranslation.x;
    let y: number = Math.round(gridcoordinate.y * this.gridBlockSize * this.scaleFactor) + this.canvasTranslation.y;
    return new CanvasCoordinate(x, y);
  }

  getCanvasCoordinateeRelativeToOriginFromGridCoordinate(gridcoordinate: GridCoordinate): CanvasCoordinate {
    let x: number = Math.round(gridcoordinate.x * this.gridBlockSize * this.scaleFactor);
    let y: number = Math.round(gridcoordinate.y * this.gridBlockSize * this.scaleFactor);
    return new CanvasCoordinate(x, y);
  }

  // getGridCoordinateFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
  //   let x: number = Math.round(canvasCoordinate.x - this.canvasTranslation.x / (this.gridBlockSize / this.scaleFactor));
  //   let y: number = Math.round(canvasCoordinate.y - this.canvasTranslation.y / (this.gridBlockSize / this.scaleFactor));
  //   return new GridCoordinate(x, y);
  // }

  // getGridCoordinateRelativeToOriginFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
  //   let x: number = Math.round(canvasCoordinate.x / (this.gridBlockSize / this.scaleFactor));
  //   let y: number = Math.round(canvasCoordinate.y / (this.gridBlockSize / this.scaleFactor));
  //   return new GridCoordinate(x, y);
  // }

  getGridCoordinateFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
    let x: number = Math.round((canvasCoordinate.x - this.canvasTranslation.x) / this.gridBlockSize / this.scaleFactor);
    let y: number = Math.round((canvasCoordinate.y - this.canvasTranslation.y) / this.gridBlockSize / this.scaleFactor);
    return new GridCoordinate(x, y);
  }

  getGridCoordinateRelativeToOriginFromCanvasCoordinate(canvasCoordinate: CanvasCoordinate): GridCoordinate {
    let x: number = Math.round(canvasCoordinate.x / this.gridBlockSize / this.scaleFactor);
    let y: number = Math.round(canvasCoordinate.y / this.gridBlockSize / this.scaleFactor);
    return new GridCoordinate(x, y);
  }

  toString(): string {
    return "scaleFactor: " + this.scaleFactor + " gridBlockSize: " + this.gridBlockSize + " canvasTranslation: " + this.canvasTranslation.toString();
  }
}
