// Create vertex attribute arrays
var vertexPos = new Float32Array ([
				1.0, -1.0, -1.0,
				1.0, 1.0, -1.0,
				-1.0, 1.0, -1.0,
				-1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0,
				-1.0, 1.0, -1.0,
				-1.0, 1.0, 1.0,
				-1.0, -1.0, 1.0,
				-1.0, -1.0, 1.0,
				-1.0, 1.0, 1.0,
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,
				1.0, 1.0, -1.0,
				1.0, -1.0, -1.0,
				1.0, -1.0, 1.0,
				1.0, 1.0, 1.0,
				1.0, -1.0, 1.0,
				1.0, -1.0, -1.0,
				-1.0, -1.0, -1.0,
				-1.0, -1.0, 1.0,
				-1.0, 1.0, 1.0,
				-1.0, 1.0, -1.0,
				1.0, 1.0, -1.0,
				1.0, 1.0, 1.0 ]);

var normalVectors = new Float32Array ([
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				0.0, 0.0, -1.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				-1.0, 0.0, 0.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				0.0, 0.0, 1.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, -1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 1.0, 0.0 ]);

var triangleIndices = new Uint8Array ([
				2, 1, 0,
				3, 2, 0,
				6, 5, 4,
				7, 6, 4,
				10, 9, 8,
				11, 10, 8,
				14, 13, 12,
				15, 14, 12,
				18, 17, 16,
				19, 18, 16,
				22, 21, 20,
				23, 22, 20 ]);