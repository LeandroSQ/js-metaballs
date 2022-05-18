precision highp float;

#define MAX_METABALLS 20

uniform int uMetaBallCount;
uniform float uMetaBallRadius[MAX_METABALLS];
uniform vec2 uMetaBallPosition[MAX_METABALLS];

uniform vec2 uResolution;

float calculateDistance(vec4 p1, vec2 p2) {
	return (p1.x - p2.x) * (p1.x - p2.x) + ((/* uResolution.y - */ p1.y) - p2.y) * ((/* uResolution.y - */ p1.y) - p2.y);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main2() {
	float sum = 0.0;

	for (int i = 0; i < MAX_METABALLS; i++) {
		if (i > uMetaBallCount) break;

    	float dist = calculateDistance(gl_FragCoord, uMetaBallPosition[i]);
		sum += 1500.0 * uMetaBallRadius[i] / dist;
	}

	float v = 1.0;

	if (sum > 200.0) sum = 200.0;
	else if (sum < 100.0) {
		v = sum / 100.0;
	}

	sum /= 255.0;

	vec3 color = hsv2rgb(vec3(sum, 1.0, v));
	gl_FragColor = vec4(color, 1.0);

	/*
    gl_FragColor = vec4(sum, sum, sum, 1.0); */

	/* if (sum > 220.0) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} */
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

	// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	gl_FragColor = vec4(gl_FragCoord.x / uResolution.x, gl_FragCoord.y / uResolution.y, 1.0, 1.0) * vec4(sum, sum, sum, 1.0);

/*
    gl_FragColor = vec4(sum, sum, sum, 1.0); */

	/* if (sum > 220.0) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} */
}