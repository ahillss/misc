var oldZoom=view.zoom;
view.zoom+=mouse.scroll[1]*0.001;//+(touch.pinch[0]+touch.pinch[1])*0.1;
view.zoom=Math.min(Math.max(view.zoom, 1), view.zoomMax);
var zoomDif=view.zoom-oldZoom;

if(mouse.down[0]) {
    view.x+=mouse.move[0]*view.zoom;
    view.y+=mouse.move[1]*view.zoom;
}

//view.x+=touch.pan[0]*view.zoom;
//view.y+=touch.pan[1]*view.zoom;

view.x+=(mouse.cursor[0]-canvas.width*0.5)*zoomDif;
view.y+=(mouse.cursor[1]-canvas.height*0.5)*zoomDif;

//proj
var projMat=glMatrix.mat4.create();
glMatrix.mat4.ortho(projMat,-canvas.width*0.5*view.zoom,canvas.width*0.5*view.zoom,-canvas.height*0.5*view.zoom,canvas.height*0.5*view.zoom,-1,1);

//view
var viewMat=glMatrix.mat4.create();
glMatrix.mat4.translate(viewMat,viewMat,[view.x,-view.y,0]);
glMatrix.mat4.scale(viewMat,viewMat,[3,3,1]);

//viewProj
var viewProjMat=glMatrix.mat4.create();
glMatrix.mat4.mul(viewProjMat,projMat,viewMat);

//invViewProj
var invViewProjMat=glMatrix.mat4.create();
glMatrix.mat4.invert(invViewProjMat,viewProjMat);

//cursorWorldPos
glMatrix_unproject(worldCursor,[mouse.cursor[0],canvas.height-mouse.cursor[1],0], invViewProjMat, [0,0,canvas.width,canvas.height]);
log(worldCursor.slice(0,2).map(x=>Math.floor(x)),'cursor => world');

//shipScreenPos test
var u=glMatrix.vec3.create();
//glMatrix_project(u,[entities[0].position[0],entities[0].position[1],0], viewProjMat, [0,0,canvas.width,canvas.height]);
