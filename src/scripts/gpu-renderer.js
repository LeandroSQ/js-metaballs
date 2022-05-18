/* eslint-disable max-statements */
import { BaseRenderer } from "./base-renderer.js";
import UI from "./ui.js";

export class GPURenderer extends BaseRenderer {

	constructor() {
		super();

		// Variables
		this.asset = "fragment_shader1.glsl";
		this.program = null;
		this.positionBuffer = null;
		this.canvas = null;

		this.#setupCanvas();
	}

	#setupCanvas() {
		// Variables
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gl = this.#getContext("webgl2", "webgl", "experimental-webgl");

		// Check for compatibility
		if (!this.gl) return alert("Your browser does not support WebGL2. Please try another browser.");
	}

	#getContext(...contexts) {
		for (const context of contexts) {
			const gl = this.canvas.getContext(context, { antialias: true });
			if (gl) return gl;
		}

		return null;
	}

	/**
	 * Loads the content of a file
	 *
	 * @param {String} filename
	 */
	async #loadFileContent(filename) {
		return await fetch(filename).then((x) => x.text());
	}

	/**
	 * Loads and compile shader from file
	 *
	 * @param {gl.VERTEX_SHADER|gl.FRAGMENT_SHADER} type
	 * @param {String} filename
	 */
	async #loadShader(type, filename) {
		// Load the shader file
		const content = await this.#loadFileContent(filename);

		// Create and compile the shader
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, content);
		this.gl.compileShader(shader);

		// Check if the shader compiled successfully
		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			console.error(this.gl.getShaderInfoLog(shader));
			this.gl.deleteShader(shader);
		} else return shader;
	}

	/**
	 * Creates and initializes the shader program
	 *
	 * @return {Promise<WebGLProgram>}
	 */
	async #initShaderProgram() {
		// Load shaders
		const vertexShader = await this.#loadShader(this.gl.VERTEX_SHADER, "assets/vertex_shader.glsl");
		const fragmentShader = await this.#loadShader(this.gl.FRAGMENT_SHADER, `assets/${this.asset}`);

		// Create the shader program
		const program = this.gl.createProgram();
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		// Check if the program linked successfully
		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			console.error(this.gl.getProgramInfoLog(program));
			this.gl.deleteProgram(program);
		} else return program;
	}

	#setUniform(name, value, type) {
		const uniformLocation = this.gl.getUniformLocation(this.program, name);
		this.gl[type](uniformLocation, value);
	}

	#drawBorder() {
		const thickness = 1;

		this.gl.clearColor(0.5, 0.5, 0.5, 1);
		this.gl.disable(this.gl.SCISSOR_TEST);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.enable(this.gl.SCISSOR_TEST);
		this.gl.scissor(thickness, thickness, this.gl.canvas.width - thickness * 2, this.gl.canvas.height - thickness * 2);
	}

	async onInit() {
		// Append the canvas to the document body
		UI.wrapper.appendChild(this.canvas);

		// Create the buffer
		this.positionBuffer = this.gl.createBuffer();
		// Bind the buffer
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		// Fill the buffer
		this.gl.bufferData(this.gl.ARRAY_BUFFER, Float32Array.from([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]), this.gl.STATIC_DRAW);

		// Create the shader program
		this.program = await this.#initShaderProgram();
	}

	onResize({ width, height }) {
		this.canvas.width = width;
		this.canvas.height = height;

		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
	}

	render(balls, fps) {
		if (!this.gl || !this.program) return;

		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		// this.#drawBorder();

		// Set the background color to black
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		// Set the initial attributes
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

		// Set the vertex attribute
		const positionAttributeLocation = this.gl.getAttribLocation(this.program, "aVertexPosition");
		this.gl.enableVertexAttribArray(positionAttributeLocation);
		this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

		// Set the shader program
		this.gl.useProgram(this.program);

		// Set the resolution
		this.#setUniform("uResolution", [this.canvas.width, this.canvas.height], "uniform2fv");

		// Inject the meta balls array size into the shader uniforms
		this.#setUniform("uMetaBallCount", balls.length, "uniform1i");

		// Inject the meta balls into the shader uniforms
		for (let i = 0; i < balls.length; i++) {
			const ball = balls[i];

			// Set the position
			this.#setUniform(`uMetaBallPosition[${i}]`, [ball.x, ball.y], "uniform2fv");

			// Set the radius
			this.#setUniform(`uMetaBallRadius[${i}]`, ball.radius, "uniform1f");
		}

		// Draw the frame
		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
	}

	async onOptionSelected(asset) {
		if (this.asset === asset) return;

		this.gl.deleteProgram(this.program);
		this.program = null;
		this.asset = asset;

		this.program = await this.#initShaderProgram();
	}

	dispose() {
		try {
			this.gl.deleteProgram(this.program);
			this.gl.deleteBuffer(this.positionBuffer);
			this.gl.canvas.remove();

			this.gl = null;
		} catch (error) {
			console.trace(error);
		}
	}

}