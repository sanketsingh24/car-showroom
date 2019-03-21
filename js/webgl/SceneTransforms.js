
function SceneTransforms(c){
	this.stack = [];
	this.camera = c;
	this.mvMatrix    = mat4.create();    
	this.pMatrix     = mat4.create();    
	this.nMatrix     = mat4.create();    
	this.cMatrix     = mat4.create();    
};


SceneTransforms.prototype.calculateModelView = function(){
	this.mvMatrix = this.camera.getViewTransform();
};

SceneTransforms.prototype.calculateNormal = function(){
	
    mat4.identity(this.nMatrix);
    mat4.set(this.mvMatrix, this.nMatrix);
    mat4.inverse(this.nMatrix);
    mat4.transpose(this.nMatrix);
};

SceneTransforms.prototype.calculatePerspective = function(){
    var c = this.camera;
	mat4.identity(this.pMatrix);
    mat4.perspective(c.FOV, c_width / c_height, c.minZ, c.maxZ, this.pMatrix);
};

SceneTransforms.prototype.init = function(){
    this.calculateModelView();
    this.calculatePerspective();
    this.calculateNormal();
};


SceneTransforms.prototype.updatePerspective = function(){
    var c = this.camera;
    mat4.perspective(c.FOV, c_width / c_height, c.minZ, c.maxZ, this.pMatrix);  
};


SceneTransforms.prototype.setMatrixUniforms = function(){
	this.calculateNormal();
    gl.uniformMatrix4fv(Program.uMVMatrix, false, this.mvMatrix);  
    gl.uniformMatrix4fv(Program.uPMatrix, false, this.pMatrix);    
    gl.uniformMatrix4fv(Program.uNMatrix, false, this.nMatrix);    
};


SceneTransforms.prototype.push = function(){
	var memento =  mat4.create();
	mat4.set(this.mvMatrix, memento);
	this.stack.push(memento);
};

SceneTransforms.prototype.pop = function(){
	if(this.stack.length == 0) return;
	this.mvMatrix  =  this.stack.pop();
};