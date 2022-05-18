precision highp float;

#define MAX_METABALLS 20

uniform int uMetaBallCount;
uniform float uMetaBallRadius[MAX_METABALLS];
uniform vec2 uMetaBallPosition[MAX_METABALLS];

uniform vec2 uResolution;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main() {
	float sum = 0.0;

	for (int i = 0; i < MAX_METABALLS; i++) {
		if (i > uMetaBallCount) break;

		float diameter = uMetaBallRadius[i] * 2.0;

    	float dist = distance(gl_FragCoord.xy, uMetaBallPosition[i]);

		sum += pow(10.0 * diameter / dist, 2.0);
	}

	// sum = 240.0;

	if (sum >= 240.0) sum = 240.0;
	sum = 240.0 - sum;

	if (modI(gl_FragCoord.x, 10.0) == 0.0) {
		sum = sum * 0.75;
		sum = modI(sum, 33.0);
	}

	if (modI(gl_FragCoord.y, 10.0) == 0.0) {
		sum = sum * 0.75;
		sum = modI(sum, 33.0);
	}

	sum /= 360.0;

	gl_FragColor = vec4(hsv2rgb(vec3(sum, 1.0, 1.0)), 1.0);
}