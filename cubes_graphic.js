/* cubes-graphic.js
* Vince Commero - 2017
* Javascript and WebGL code for a cool little graphic of bouncing cubes.
* Makes use of the TWGL library (http://twgljs.org/dist/3.x/twgl.min.js)
*/

var SceneObjects = [];

var Cube = undefined;
(function() {
	
	Cube = function Cube(position, size) {
		this.position = position || [0.0,0.0,0.0];
		this.size = size || 1.0;
	}
	
})();

function cubeGraphicMain() {
	"use strict";
	var canvas = document.getElementById("about_me_canvas");
	var gl = canvas.getContext('webgl');
	var m4 = twgl.m4;
	var v3 = twgl.v3;
	
	
	var clock = 0.0;
	
	/* Source code for shaders */
	var vertexSrc = 
		"precision highp float;"+
		"attribute vec3 position;"+
		"attribute vec3 normal;"+
		"uniform mat3 normalMatrix;"+
		"uniform mat4 modelViewMatrix;"+
		"uniform mat4 projectionMatrix;"+
		"uniform mat4 MVP;"+
		"varying vec3 fNormal;"+
		"varying vec3 fPosition;"+
		
		"void main() {"+
			"fNormal = normalize(normalMatrix * normal);"+
			"vec4 pos = MVP * vec4(position, 1.0);"+
			"fPosition = pos.xyz;"+
			"gl_Position = pos;"+
		"}"
	var fragSrc = 
		"precision highp float;"+
		"varying vec3 fPosition;"+
		"varying vec3 fNormal;"+

		"vec3 ambient(vec3 color, float intensity)"+
		"{"+
			"return color * intensity;"+
		"}"+

		"vec3 diffuse(vec3 dir, vec3 col, float intensity)"+
		"{"+
			"vec3 l = normalize(dir);"+
			"vec3 n = fNormal;"+
			"return vec3(intensity * col * pow(dot(n, l), 1.) );"+
		"}"+

		"void main()"+
		"{"+
			"gl_FragColor = vec4(ambient(vec3(1.,1.,1.), .5) + diffuse(vec3(0.,0.5,1.), vec3(1.,1.,1.), .55), 1.);"+
		"}"
	
	// Compile vertex shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexSrc);
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	  alert(gl.getShaderInfoLog(vertexShader));
	  return null;
	}
	// Compile fragment shader
	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader,fragSrc);
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
	  alert(gl.getShaderInfoLog(fragShader));
	  return null;
	}
	
	// Attach and link
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	  alert("Couldn't init shaders!"); }
	gl.useProgram(shaderProgram);
	
	// Sets up shader attributes
	shaderProgram.PosAttrib = gl.getAttribLocation(shaderProgram, "position");
	gl.enableVertexAttribArray(shaderProgram.PosAttrib);
	shaderProgram.NormalAttrib = gl.getAttribLocation(shaderProgram, "normal");
	gl.enableVertexAttribArray(shaderProgram.NormalAttrib);
	
	//Sets up shader uniforms
	shaderProgram.NormalMatrix = gl.getUniformLocation(shaderProgram, "normalMatrix");
	shaderProgram.MVPMatrix = gl.getUniformLocation(shaderProgram, "MVP");
	
	
	// Buffer data
	var triangleBuffer = gl.createBuffer();
	var normalBuffer = gl.createBuffer();
	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
	triangleBuffer.vectorSize = 3;
	triangleBuffer.vectorCount = vertexPos / triangleBuffer.vectorSize;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normalVectors, gl.STATIC_DRAW);
	normalBuffer.vectorSize = 3;
	normalBuffer.vectorCount = normalVectors / normalBuffer.vectorSize;
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(shaderProgram.NormalAttrib, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
	gl.vertexAttribPointer(shaderProgram.PosAttrib, 3, gl.FLOAT, false, 0, 0);
	
	// Fill SceneObjects array
	for (var i = -10; i < 11; i++) {
		for (var j = -15; j < 16; j++) {
			SceneObjects.push(new Cube([i,j,0], 0.4));
		}
	}
	
	// The main drawing function
	function draw() {
		
		// Camera and stuff
		var eye = [15, 0, 15];
		var target = [0,0,0];
		var up = [0,0,1];
		var viewM = m4.inverse(m4.lookAt(eye,target,up));
		var projM = m4.perspective(Math.PI/4, 1, 10, 1000);
		
		// Pre-rendering stuff
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		// Draw each cube
		SceneObjects.forEach( function(obj) {
			
			// Setup model transforms
			var modelM = m4.scaling([1,1,1]);
			var pos = obj.position;
			pos[2] += 0.05*Math.sin((1.0*clock + Math.sqrt(Math.pow(pos[1],2) + Math.pow(pos[0],2))*0.2)*Math.PI);
			m4.setTranslation(modelM,pos,modelM);
			m4.multiply(twgl.m4.scaling([obj.size,obj.size,obj.size]), modelM, modelM);
			var mvM = m4.multiply(modelM,viewM);
			var mvp = m4.multiply(mvM, projM);
			
			// Set up uniforms
			gl.uniformMatrix4fv(shaderProgram.MVPMatrix,false,mvp);
			var tempMat = m4.transpose(m4.inverse(mvM));
			var normalMat = Float32Array.of(tempMat[0], tempMat[1], tempMat[2],
											tempMat[4], tempMat[5], tempMat[6],
											tempMat[8], tempMat[9], tempMat[10]);
			gl.uniformMatrix3fv(shaderProgram.NormalMatrix,false,normalMat);
			
			
			
			// Draw the image
			gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
			
		});
		
		
	};
	
	// Update animation
	function updateAnim() {
		clock += 0.016;
		//clock = clock % 1.0;
		//console.log(clock);
	};
	
	var framesUntilRender = 0;
	// Looped wrapper drawing function
	function drawAnim() {
		if (framesUntilRender == 0) {
			updateAnim();
			draw();
			framesUntilRender = 3;
		} else framesUntilRender--;
		window.requestAnimationFrame(drawAnim);
	};
	
	// Enter the looped drawing function
	drawAnim();
	
};
