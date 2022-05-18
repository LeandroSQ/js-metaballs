precision highp float;

#define MAX_METABALLS 20

uniform int uMetaBallCount;
uniform float uMetaBallRadius[MAX_METABALLS];
uniform vec2 uMetaBallPosition[MAX_METABALLS];

uniform vec2 uResolution;

float calculateDistance(vec4 p1, vec2 p2) {
	return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

void main() {
	float sum = 0.0;

	for (int i = 0; i < MAX_METABALLS; i++) {
		if (i > uMetaBallCount) break;

    	float dist = calculateDistance(gl_FragCoord, uMetaBallPosition[i]);
		sum += 18000.0 * (uMetaBallRadius[i] * 2.0) / dist;
	}

	if (sum > 200.0) sum = (sum - 200.0) / 55.0;
	else sum = 0.0;

	gl_FragColor = vec4(
		gl_FragCoord.x / uResolution.x * sum,
		gl_FragCoord.y / uResolution.y * sum,
		sum,
		1.0
	);
}