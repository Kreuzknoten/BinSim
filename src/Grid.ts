export class Grid {
  scale: number;
  xTranslation: number;
  yTranslation: number;
  gridSize: number;

  constructor() {
    this.scale = 0.5; // unit is %
    this.gridSize = 20; //unit is px
    this.xTranslation = 0;
    this.yTranslation = 0;
  }
}
