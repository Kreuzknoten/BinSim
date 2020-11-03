!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);class i{constructor(t,e){this.x=t,this.y=e}plus(t){let e=this.x+t.x,n=this.y+t.y;return new i(e,n)}minus(t){let e=this.x-t.x,n=this.y-t.y;return new i(e,n)}inverse(){let t=-1*this.x,e=-1*this.y;return new i(t,e)}toString(){return"x = "+this.x+" y = "+this.y}}class o extends i{}class s extends i{}class r{constructor(t){this.gridPosition=t,this.size=new i(3,3),this.background="#878787"}moveTo(t){this.gridPosition.x=t.x,this.gridPosition.y=t.y}isGridPositionWithingComponent(t,e){let n=this.gridPosition.x-1<e.x,i=e.x<this.gridPosition.x+this.size.x+1,o=this.gridPosition.y-1<e.y,s=e.y<this.gridPosition.y+this.size.y+1;return!!(n&&i&&o&&s)}draw(t,e){t.fillStyle="grey",t.fillRect((this.gridPosition.x+e.gridTranslation.x)*e.gridBlockSize*e.scaleFactor,(this.gridPosition.y+e.gridTranslation.y)*e.gridBlockSize*e.scaleFactor,this.size.x*e.gridBlockSize*e.scaleFactor,this.size.x*e.gridBlockSize*e.scaleFactor)}}class a{setEvent(t,e){this.event=t,this.hitComponent=e}}class d{constructor(){this.scaleFactor=1,this.gridBlockSize=10,this.gridTranslation=new i(0,0)}zoomBy(t){this.scaleFactor=this.scaleFactor*t}translateByGridCoordinate(t){this.gridTranslation=this.gridTranslation.plus(t)}translateByCanvasCoordinate(t){let e=this.getGridCoordinateFromCanvasCoordinate(t);this.translateByGridCoordinate(e),console.log("translateByCanvasPosition"+this.getCanvasCoordinateFromGridCoordinate(e).toString())}getCanvasCoordinateFromGridCoordinate(t){let e=Math.round((t.x+this.gridTranslation.x)*this.gridBlockSize*this.scaleFactor),n=Math.round((t.y+this.gridTranslation.y)*this.gridBlockSize*this.scaleFactor);return new s(e,n)}getGridCoordinateFromCanvasCoordinate(t){let e=Math.round(t.x/this.gridBlockSize/this.scaleFactor+this.gridTranslation.x),n=Math.round(t.y/this.gridBlockSize/this.scaleFactor+this.gridTranslation.y);return new o(e,n)}}HTMLCanvasElement,CanvasRenderingContext2D;var l=document.getElementById("canvas");l.getContext("2d");l.width=300,l.height=300;let h=new class{constructor(){this.components=new Array}addComponent(t){this.components.push(t)}removeComponent(t){}},g=new class{constructor(t,e){this.canvas=t,this.componentTree=e,this.grid=new d,this.draw()}draw(){var t=this.canvas.getContext("2d");t.clearRect(0,0,this.canvas.width,this.canvas.height),this.componentTree.components.forEach(e=>{e.draw(t,this.grid)})}}(l,h);new class{constructor(t,e){this.canvas=t,this.renderer=e,this.lastLeftMouseDownEventInfo=new a,this.lastRightMouseDownEventInfo=new a,this.lastMouseMoveEventInfo=new a,this.isDraggingComponent=!1,this.isDraggingGrid=!1,document.getElementById("canvas").addEventListener("mousedown",t=>{this.onCanvasMouseDown(t)},!1),document.getElementById("canvas").addEventListener("mouseup",t=>{this.onCanvasMouseUp(t)},!1),document.getElementById("canvas").addEventListener("mousemove",t=>{this.onCanvasMove(t)},!1),document.getElementById("canvas").addEventListener("wheel",t=>{this.onCanvasScroll(t)},!1)}getCanvasMousePosition(t){let e=this.canvas.getBoundingClientRect(),n=t.pageX-e.left,i=t.pageY-e.top;return new s(n,i)}getGridCoordinateFrom(t){let e=this.renderer.grid,n=Math.round(t.x/(e.gridBlockSize*e.scaleFactor))-e.gridTranslation.x,i=Math.round(t.y/(e.gridBlockSize*e.scaleFactor))-e.gridTranslation.y;return new o(n,i)}getGridCoordinateRelativeToOriginFrom(t){let e=this.renderer.grid,n=Math.round(t.x/(e.gridBlockSize*e.scaleFactor)),i=Math.round(t.y/(e.gridBlockSize*e.scaleFactor));return new o(n,i)}getComponentsWithinGridCoordinate(t){let e=this.renderer.componentTree.components,n=new Array;return e.forEach(e=>{e.isGridPositionWithingComponent(this.renderer.grid,t)&&n.push(e)}),0==n.length?null:n[0]}onCanvasMouseDown(t){let e,n=t.button,i=this.getCanvasMousePosition(t),o=this.getGridCoordinateFrom(i);if(e=this.getComponentsWithinGridCoordinate(o),0==n)if(this.lastLeftMouseDownEventInfo.setEvent(t,e),t.ctrlKey)this.isDraggingGrid=!0;else if(null==e){let t=new r(o);this.renderer.componentTree.addComponent(t)}else this.isDraggingComponent=!0;2==n&&this.lastRightMouseDownEventInfo.setEvent(t,e),this.drawCall()}onCanvasMouseUp(t){let e=t.button;0==e&&(this.isDraggingComponent=!1,this.isDraggingGrid=!1),this.drawCall()}onCanvasMove(t){if(this.isDraggingComponent){let e=this.getCanvasMousePosition(t),n=this.getGridCoordinateFrom(e),i=this.lastLeftMouseDownEventInfo.hitComponent;null==i||i.moveTo(n)}if(this.isDraggingGrid){let e=this.getCanvasMousePosition(t),n=this.getGridCoordinateFrom(e);if(this.lastMouseMoveEventInfo.event instanceof MouseEvent){let t=this.getCanvasMousePosition(this.lastMouseMoveEventInfo.event),e=this.getGridCoordinateFrom(t),i=n.minus(e);this.renderer.grid.translateByGridCoordinate(i)}}this.lastMouseMoveEventInfo.setEvent(t,null),this.drawCall()}onCanvasScroll(t){this.renderer.grid.scaleFactor;let e=0;t.deltaY<0?e=1.05:t.deltaY>0&&(e=.95);let n=this.getCanvasMousePosition(t),i=this.getGridCoordinateRelativeToOriginFrom(n);console.log("mouseCanvasPosition"+n.toString()),this.renderer.grid.zoomBy(e);let o=this.renderer.grid.getCanvasCoordinateFromGridCoordinate(i),s=n.minus(o);console.log("shouldTranslateByCanvasPosition"+s.toString()),this.renderer.grid.translateByCanvasCoordinate(s),this.drawCall()}drawCall(){console.log("isDraggingComponent: "+this.isDraggingComponent),console.log("isDraggingGrid: "+this.isDraggingGrid),console.log("Number Of Gates: "+this.renderer.componentTree.components.length),this.renderer.draw()}}(l,g)}]);