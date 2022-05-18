export class DynamicCanvas {

	constructor(offset = 1) {
		this.offset = offset;
		this.canvas = document.createElement("canvas");
		this.canvas.classList.add("dynamic-canvas");
		this._ctx = null;

		this.context["imageSmoothingEnabled"] = true;
		this.context["mozImageSmoothingEnabled"] = true;
		this.context["oImageSmoothingEnabled"] = true;
		this.context["webkitImageSmoothingEnabled"] = true;
		this.context["msImageSmoothingEnabled"] = true;
	}

	setSize({ width, height }) {
		this.canvas.width = width;
		this.canvas.height = height;

		// this.canvas.style.width = `${width}px`;
		// this.canvas.style.height = `${height}px`;
	}

	/**
	 * Attaches the canvas element as child to a given HTMLElement
	 *
	 * @param {HTMLElement} element The parent element to attach the canvas
	 */
	attachToElement(element) {
		element.appendChild(this.canvas);
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	copyTo(x, y, ctx) {
		if ("context" in ctx) ctx = ctx.context;

		ctx.save();
		ctx.scale(1 / this.drawRatio, 1 / this.drawRatio);
		ctx.drawImage(this.canvas, x, y);
		ctx.restore();
	}

	get width() {
		return this.canvas.width;
	}

	get height() {
		return this.canvas.height;
	}

	get context() {
		if (!this._ctx) this._ctx = this.canvas.getContext("2d");

		return this._ctx;
	}

}