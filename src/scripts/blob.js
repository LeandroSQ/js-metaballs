export class Blob {

	constructor({ x, y, radius }) {
		this.x = x;
		this.y = y;
		this.radius = radius;

		this.speed = Math.randomRange(25, 75);
		this.direction = {
			x: Math.randomIntRange(-1, 1),
			y: Math.randomIntRange(-1, 1)
 		};
	}

	render(ctx) {
		ctx.strokeStyle = "magenta";

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}

	update(deltaTime, bounds) {
		this.x += this.direction.x * this.speed * deltaTime;
		this.y += this.direction.y * this.speed * deltaTime;

		if (this.x < this.radius) {
			this.x = this.radius;
			this.direction.x = 1;
		} else if (this.x >= bounds.width - this.radius) {
			this.x = bounds.width - this.radius;
			this.direction.x = -1;
		}

		if (this.y < this.radius) {
			this.y = this.radius;
			this.direction.y = 1;
		} else if (this.y >= bounds.height - this.radius) {
			this.y = bounds.height - this.radius;
			this.direction.y = -1;
		}
	}

}