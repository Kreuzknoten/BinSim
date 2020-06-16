import { IComponent, ComponentTree } from "./Component";
import { Grid } from "./Grid";

export class Renderer {
  ctx: CanvasRenderingContext2D;
  componentTree: ComponentTree;
  grid: Grid;

  constructor(ctx: CanvasRenderingContext2D, componentTree: ComponentTree) {
    this.ctx = ctx;
    this.componentTree = componentTree;
    this.grid = new Grid();
    this.draw();
  }

  draw() {
    this.componentTree.components.forEach((component) => {
      component.draw(this.ctx, this.grid);
    });
  }
}
