precision highp float;

#define MAX_METABALLS 20

uniform int uMetaBallCount;
uniform float uMetaBallRadius[MAX_METABALLS];
uniform vec2 uMetaBallPosition[MAX_METABALLS];

uniform vec2 uResolution;

float calculateDistance(vec4 p1, vec2 p2) {
	return sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

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

    	float dist = calculateDistance(gl_FragCoord, uMetaBallPosition[i]);
		float diameter = uMetaBallRadius[i] * 2.0;

		if (dist <= diameter) {
			sum += 1.0;
		} else {
			sum += sin((diameter * diameter) / dist) * (255.0 / float(uMetaBallCount));
		}
	}

	sum = modI(sum, 256.0);

	if (sum >= 200.0) sum = 200.0;

	sum /= 255.0;

	gl_FragColor = vec4(hsv2rgb(vec3(sum, 1.0, 1.0)), 1.0);//vec4(sum, sum, sum, 1.0);
}