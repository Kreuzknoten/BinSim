import { IComponent, ComponentTree } from "./Component";
import { Grid } from "./Grid";

export class Renderer {
  canvas: HTMLCanvasElement;
  componentTree: ComponentTree;
  grid: Grid;

  constructor(canvas: HTMLCanvasElement, componentTree: ComponentTree) {
    this.canvas = canvas;
    this.componentTree = componentTree;
    this.grid = new Grid();
    this.draw();
  }

  draw() {
    var ctx = this.canvas.getContext("2d")!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.componentTree.components.forEach((component) => {
      component.draw(ctx, this.grid);
    });
  }
}
