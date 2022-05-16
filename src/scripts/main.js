/* eslint-disable max-statements */
import { Blob } from "./blob.js";
import { DynamicCanvas } from "./dynamic-canvas.js";
import "./extensions.js";

class Main {

	constructor() {
		// Variables
		this.frameStartTime = performance.now();
		this.lastFrameTime = this.frameStartTime;
		this.fps = 0;
		this.frameCount = 0;
		this.frameTimer = 0;
		this.targetFPS = 45;
		this.targetFrameTime = 1000 / this.targetFPS;
		this.frameTimeSum = 0;

		this.#hookEvents();

		// Setup
		/** @type {Array<Blob>} */
		this.blobs = [];
	}

	#hookEvents() {
		document.addLoadEventListener(this.#onLoad.bind(this));
		window.addEventListener("resize", this.#onResize.bind(this));
		window.addEventListener("orientationchange", this.#onResize.bind(this));
	}

	#onLoad() {
		// Setup canvas
		this.canvas = new DynamicCanvas(0.25);
		this.canvas.attachToElement(document.body);

		// Setup blobs
		for (let i = 0; i < 5; i++) {
			const blob = new Blob({
				x: Math.randomIntRange(this.canvas.width),
				y: Math.randomIntRange(this.canvas.height),
				radius: Math.randomIntRange(15, 50)
			});

			this.blobs.push(blob);
		}

		// Define initial size
		this.#onResize();

		// Request rendering frame
		this.invalidate();
	}

	#onResize() {
		const size = {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		};

		this.canvas.setSize(size);
	}

	#onRender() {
		// Calculate the delta time, from the last frame to the current loop time
		this.frameStartTime = performance.now();
		const deltaTime = (this.frameStartTime - this.lastFrameTime) / 1000;

		// Calculate the FPS
		this.frameCount++;
		this.frameTimer += deltaTime;
		if (this.frameTimer >= 1) {
			this.fps = this.frameCount;
			this.frameCount = 0;
			this.frameTimer -= 1;
		}

		// Clear the canvas
		// this.canvas.clear();

		this.#onRenderHeatMap();

		// Render blobs
		for (const blob of this.blobs) {
			blob.update(deltaTime, this.canvas);
			// blob.render(this.canvas.context);
		}

		this.canvas.context.fillStyle = "white";
		this.canvas.context.fillText(`FPS: ${this.fps}`, 10, this.canvas.height - 20);

		this.lastFrameTime = performance.now();

		this.invalidate();
	}

	#onRenderHeatMap() {
		const w = this.canvas.width;
		const h = this.canvas.height;
		const ctx = this.canvas.context;

		// Clear canvas
		const data = ctx.createImageData(w, h);
		const buffer = new Uint32Array(data.data.buffer);

		let p = 0;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let sum = 0;

				for (let i = 0; i < this.blobs.length; i++) {
					const blob = this.blobs[i];
					const dist = Math.distance(x, y, blob.x, blob.y);
					sum += 12000 * blob.radius / dist;
				}

				// console.log(sum);

				p ++;
				buffer[p] = this.hsl2rgb(Math.clamp(sum, 0, 360), 100, 50);
				// const c = Math.clamp(sum, 0, 255);

				/* const color = 0xff000000 | (c << 16) | (c << 8) | c;
				buffer[x + y * this.canvas.width] = color; */
				/* p += 1;
				if (sum > 200)
					buffer[p] = 0xffffffff; */

			}
		}

		ctx.putImageData(data, 0, 0);
	}

	invalidate() {
		const elapsed = this.lastFrameTime - this.frameStartTime;
		let delay = this.targetFrameTime - elapsed;
		if (delay < 0) delay = 0;
		// const delay = Math.floor(Math.clamp(this.targetFrameTime - elapsed, 0, this.targetFrameTime));

		setTimeout(this.#onRender.bind(this), delay);
		// requestAnimationFrame(this.#onRender.bind(this));
	}

	hsl2rgb(h, s, l) {
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

			return Math.floor(255 * color); // convert to Hex and prefix "0" if needed
		};

		return 0xff000000 | (f(0) << 16) | (f(8) << 8) | f(4);
		// return [f(0),f(8),f(4)];
	}

}

new Main();
