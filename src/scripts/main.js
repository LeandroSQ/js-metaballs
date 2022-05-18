import { Blob } from "./blob.js";
import { CPURenderer } from "./cpu-renderer.js";
import { GPURenderer } from "./gpu-renderer.js";
import "./extensions.js";
import UI from "./ui.js";

class Main {

	constructor() {
		// Variables
		this.frameStartTime = performance.now();
		this.lastFrameTime = this.frameStartTime;
		this.fps = 0;
		this.frameCount = 0;
		this.frameTimer = 0;
		this.targetFPS = 60;
		this.targetFrameTime = 1000 / this.targetFPS;
		this.frameTimer2 = performance.now();

		// Variables
		this.alreadyInitialized = false;

		this.#hookEvents();

		// Setup
		/** @type {Array<Blob>} */
		this.blobs = [];
		this.#loadSettingsFromLocalStorage();
		if (!this.renderer) this.renderer = new CPURenderer();
	}

	#hookEvents() {
		document.addLoadEventListener(this.#onLoad.bind(this));
		window.addEventListener("resize", this.#onResize.bind(this));
		window.addEventListener("orientationchange", this.#onResize.bind(this));
	}

	#setupBlobs() {
		for (let i = 0; i < 5; i++) {
			const blob = new Blob(UI.wrapperSize);

			this.blobs.push(blob);
		}
	}

	#onLoad() {
		this.alreadyInitialized = true;

		// Setup UI
		UI.addEventListener(this.#onOptionSelected.bind(this));

		// Setup renderer
		this.renderer?.onInit();

		// Define initial sizing
		this.#onResize();

		// Setup blobs
		this.#setupBlobs();

		// Request rendering frame
		this.invalidate();
	}

	#loadSettingsFromLocalStorage() {
		// Checking the local storage
		const renderer = localStorage.getItem("renderer");
		const subOption = localStorage.getItem("subOption");

		if (renderer && subOption) {
			this.#onOptionSelected(renderer, subOption);

			UI.setSelectedOption(renderer, subOption);
		}
	}

	#setRenderer(renderer) {
		this.renderer?.dispose();

		this.renderer = renderer;

		if (this.alreadyInitialized) {
			this.renderer.onInit();
			this.renderer.onResize(UI.wrapperSize);
		}
	}

	#onOptionSelected(renderer, subOption) {
		// Save the option on the local storage
		localStorage.setItem("renderer", renderer);
		localStorage.setItem("subOption", subOption);

		// Update the renderer
		if (renderer === "cpu" && this.renderer instanceof CPURenderer === false) {
			this.#setRenderer(new CPURenderer(subOption));
		} else if (renderer === "gpu" && this.renderer instanceof GPURenderer === false) {
			this.#setRenderer(new GPURenderer(subOption));
		}

		this.renderer?.onOptionSelected(subOption);
	}

	#onResize() {
		this.renderer?.onResize(UI.wrapperSize);
	}

	#onRender() {
		// Calculate the delta time, from the last frame to the current loop time
		this.frameStartTime = performance.now();
		const deltaTime = (this.frameStartTime - this.lastFrameTime) / 1000;

		// Calculate the FPS
		this.frameCount++;
		this.frameTimer += deltaTime;
		if (/* this.frameTimer >= 1.0 ||  */this.frameStartTime - this.frameTimer2 > 1000) {
			this.frameTimer2 = this.frameStartTime;
			this.fps = this.frameCount;
			this.frameCount = 0;
			this.frameTimer -= 1.0;
		}

		// Render blobs
		for (const blob of this.blobs) blob.update(deltaTime, UI.wrapperSize);

		// Invoke renderer's render method
		this.renderer?.render(this.blobs);

		// Update UI FPS counter
		UI.setFPS(this.fps);

		// Schedule next frame
		this.invalidate();
	}

	invalidate() {
		// Calculate the minimum time between now and the next frame
		const elapsed = this.lastFrameTime - this.frameStartTime;
		let delay = this.targetFrameTime - elapsed;

		// Clamp the delay
		if (delay < 0) delay = 0;
		else if (delay > this.targetFrameTime) delay = this.targetFrameTime;

		this.lastFrameTime = performance.now();
		setTimeout(this.#onRender.bind(this), delay);
		// requestAnimationFrame(this.#onRender.bind(this));
	}

}

new Main();
