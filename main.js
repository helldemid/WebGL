var gl;                         // The webgl context.
var surface;                    // A surface model
var shProgram;                  // A shader program
var spaceball;                  // A SimpleRotator object that lets the user rotate the view by mouse.

/* Initialize the WebGL context. Called from init() */
function initGL() {
	shProgram = new ShProgram("Basic");
	shProgram.init(gl, vertexShaderSource, fragmentShaderSource);
	shProgram.use(gl);

	// create surface model
	surface = new Surface("Parabolic Humming-Top", 1, 1, 65, 65);
	surface.initBuffer(gl);
	surface.createTextures(gl);

	gl.enable(gl.DEPTH_TEST);
}

function animateLight(time) {
    const baseRadius = 10.0;
    const speed = 0.001; // Speed of light rotation
    const radiusAmplitude = 2.0; // Amplitude for radius variation
    const heightAmplitude = 3.0; // Amplitude for height variation

    // Dynamic radius change
    const radius = baseRadius + radiusAmplitude * Math.sin(time * speed * 0.5);

    // Light position coordinates
    const x = radius * Math.cos(time * speed); // X-coordinate changes in a circular motion
    const z = radius * Math.sin(time * speed); // Z-coordinate changes in a circular motion
    const y = 5.0 + heightAmplitude * Math.sin(time * speed * 0.7); // Y-coordinate changes smoothly over time

    if (shProgram) {
        gl.uniform3fv(shProgram.lightDirectionUni, [x, y, z]); // Update the light direction
        draw(); // Redraw the scene
    }

    requestAnimationFrame(animateLight); // Recursive call for animation
}


function draw() {
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	const projection = m4.perspective(Math.PI / 8, 1, 0.1, 100);
	const modelView = spaceball.getViewMatrix();

	const rotateToPointZero = m4.axisRotation([Math.SQRT1_2, Math.SQRT1_2, 0], 0.7);
	const translateToPointZero = m4.translation(0, 0, -10);

	const matAcc0 = m4.multiply(rotateToPointZero, modelView);
	const matAcc1 = m4.multiply(translateToPointZero, matAcc0);

	const modelViewProjection = m4.multiply(projection, matAcc1);
	gl.uniformMatrix4fv(shProgram.matrixUni, false, modelViewProjection);

	const normalMatrix = m4.transpose(m4.inverse(matAcc1));
	gl.uniformMatrix4fv(shProgram.normalMatrixUni, false, normalMatrix);

    gl.uniform3fv(shProgram.viewPositionUni, [0.0, 0.0, 5.0]);
    gl.uniform3f(shProgram.ambientColorUni, 0.05, 0.05, 0.05);
	gl.uniform3f(shProgram.diffuseColorUni, 0.8, 0.8, 0.8); // Белый свет

    gl.uniform3f(shProgram.specularColorUni, 1.0, 1.0, 1.0);
    gl.uniform1f(shProgram.shininessUni, 10.0);

	surface.initTextures(gl, shProgram);
	surface.draw(gl, shProgram);
}

/**
 * initialization function that will be called when the page has loaded
 */
function init() {
	const canvas = document.getElementById("webglcanvas");
	try {
		gl = canvas.getContext("webgl");
		if (!gl) {
			throw "Browser does not support WebGL";
		}
		initGL()
		$('#p').val(surface.getP());
        $('#h').val(surface.getH());
	} catch (e) {
		console.error('Someting went wrong' + e)
        $("#canvas-holder").html(
            `<p>Sorry, something went wrong: ${e}</p>`
        )
        return;
	}
	spaceball = new TrackballRotator(canvas, draw, 0);
	draw();
	animateLight(0);
}