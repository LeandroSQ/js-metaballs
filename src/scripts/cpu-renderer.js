/* eslint-disable max-depth */
/* eslint-disable max-statements */
import { BaseRenderer } from "./base-renderer.js";
import UI from "./ui.js";

export class CPURenderer extends BaseRenderer {

	constructor() {
		super();

		// Variables
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		this.ctx["imageSmoothingEnabled"] = true;
		this.ctx["mozImageSmoothingEnabled"] = true;
		this.ctx["oImageSmoothingEnabled"] = true;
		this.ctx["webkitImageSmoothingEnabled"] = true;
		this.ctx["msImageSmoothingEnabled"] = true;
	}

	onInit() {
		UI.wrapper.appendChild(this.canvas);
	}

	onResize({ width, height }) {
		this.canvas.width = width;
		this.canvas.height = height;
	}

	render(balls, fps) {
		// Clear the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Render blobs
		this.#render(balls);

		// Render FPS
		// this.ctx.fillStyle = "white";
		// this.ctx.fillText(`FPS: ${fps}`, 10, this.canvas.height - 20);
	}

	#render(balls) {
		// Store constants
		const width = this.canvas.width;
		const height = this.canvas.height;
		const ctx = this.ctx;

		// Create buffer
		const data = ctx.createImageData(width, height);
		const buffer = new Uint32Array(data.data.buffer);

		// Calculate heatmap
		let pixelIndex = 0;
		for (let y = height - 1; y >= 0; y--) {
			const normalizedY = 1 - y / height;
			for (let x = 0; x < width; x++) {
				let sum = 0;

				// For each blob, calculate it's influence on the pixel
				for (let i = 0; i < balls.length; i++) {
					const blob = balls[i];
					const dist = Math.distance(x, y, blob.x, blob.y);
					sum += 18000 * (blob.radius * 2) / dist;
				}

				// Clamp the sum to the range [0, 255]
				if (sum >= 200.0) {
					sum = (sum - 200.0) / 55.0;

					// Convert the sum to a color
					let r = ((x / width) * sum) * 255;
					let g = (normalizedY * sum) * 255;
					let b = sum * 255;

					if (r > 255) r = 250;
					if (g > 255) g = 255;
					if (b > 255) b = 255;

					// Store the color in the buffer
					buffer[pixelIndex++] = 0xff000000 | (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
				} else {
					// Black
					buffer[pixelIndex++] = 0xff000000;
				}


			}
		}

		// Draw the buffer to the canvas
		ctx.putImageData(data, 0, 0);
	}

	dispose() {
		try {
			this.canvas.parentElement.removeChild(this.canvas);
		} catch (error) {
			/* Ignore */
		}
	}

}
