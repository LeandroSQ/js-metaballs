export class Blob {

	constructor({ width, height }) {
		/* this.x = Math.randomIntRange(width);
		this.y = Math.randomIntRange(height); */

		this.x = width / 2;
		this.y = height / 2;

		this.targetRadius = Math.randomRange(50, 300);
		this.radius = 0;

		this.speed = Math.randomRange(-150, 150);
		this.direction = Math.randomDirection();
	}

	render(ctx) {
		ctx.strokeStyle = "magenta";

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.stroke();
	}

	update(deltaTime, bounds) {
		// Apply velocity to position
		this.x += this.direction.x * this.speed * deltaTime;
		this.y += this.direction.y * this.speed * deltaTime;

		// Lerp towards target radius
		this.radius = Math.lerp(this.radius, this.targetRadius, 15 * deltaTime);

		// Bounce off the walls
		if (this.x - this.radius < 0) {
			this.x = this.radius;
			this.direction.x = -this.direction.x;
		}
		if (this.x + this.radius > bounds.width) {
			this.x = bounds.width - this.radius;
			this.direction.x = -this.direction.x;
		}
		if (this.y - this.radius < 0) {
			this.y = this.radius;
			this.direction.y = -this.direction.y;
		}
		if (this.y + this.radius > bounds.height) {
			this.y = bounds.height - this.radius;
			this.direction.y = -this.direction.y;
		}

	}

}