document.addLoadEventListener = function (handler, timeout = 1000) {
	let fired = false;

	const _func = () => {
		if (fired) return;
		fired = true;

		handler();
	};

	window.addEventListener("DOMContentLoaded", _func);
	window.addEventListener("load", _func);
	document.addEventListener("load", _func);
	window.addEventListener("ready", _func);
	setTimeout(_func, timeout);
};

Math.clamp = function(x, min, max) {
	if (x > max) return max;
	else if (x < min) return min;
	else return x;
};

/* Math.map = function(entry, entryMin, entryMax, targetMin, targetMax) {
	return ((entry - entryMin) / entryMax) * (targetMax - targetMin) + targetMin;
}; */

Math.randomRange = function(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	return Math.random() * (max - min) + min;
};

Math.randomIntRange = function(min, max) {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
};

Math.randomDirection = function() {
	const f = () => Math.random() <= 0.5 ? -1 : 1;

	return { x: f(), y: f() };
};

Math.lerp = function(current, target, speed) {
	const difference = target - current;

	if (difference > speed) return current + speed;
	else if (difference < -speed) return current - speed;
	else return current + difference;
};

Math.distance = function(x1, y1, x2, y2) {
	return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function () {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}

	return this;
};