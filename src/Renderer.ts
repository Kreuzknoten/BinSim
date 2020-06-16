import { IComponent, ComponentTree } from "./Component";

export class Renderer {
  ctx: CanvasRenderingContext2D;
  componentTree: ComponentTree;

  constructor(ctx: CanvasRenderingContext2D, componentTree: ComponentTree) {
    this.ctx = ctx;
    this.componentTree = componentTree;
  }

  draw() {
    this.componentTree.components.forEach((component) => {
      component.draw(this.ctx);
    });
  }
}
