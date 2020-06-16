import { EventHandler } from "./EventHandler";

canvas: HTMLCanvasElement;
ctx: CanvasRenderingContext2D;

var canvas = document.getElementById("canvas")! as HTMLCanvasElement;
var ctx = canvas.getContext("2d");
canvas.width = 300;
canvas.height = 300;

let eventHandler = new EventHandler(canvas);
