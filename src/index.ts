import { EventHandler } from "./EventHandler";
import { Renderer } from "./Renderer";
import { ComponentTree } from "./Component";

canvas: HTMLCanvasElement;
ctx: CanvasRenderingContext2D;

var canvas = document.getElementById("canvas")! as HTMLCanvasElement;
var ctx = canvas.getContext("2d")!;
canvas.width = 300;
canvas.height = 300;

let componentTree = new ComponentTree();
let renderer = new Renderer(ctx, componentTree);
let eventHandler = new EventHandler(canvas, renderer);
