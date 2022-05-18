precision highp float;

#define MAX_METABALLS 20

uniform int uMetaBallCount;
uniform float uMetaBallRadius[MAX_METABALLS];
uniform vec2 uMetaBallPosition[MAX_METABALLS];

uniform vec2 uResolution;

float calculateDistance(vec4 p1, vec2 p2) {
	return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}


void main() {
	float sum = 0.0;

	for (int i = 0; i < MAX_METABALLS; i++) {
		if (i > uMetaBallCount) break;

    	float dist = calculateDistance(gl_FragCoord, uMetaBallPosition[i]);
		sum += 18000.0 * (uMetaBallRadius[i] * 2.0) / dist;
	}

	if (sum > 230.0) sum = min((sum - 200.0) / 25.0, 1.0);
	else sum = 0.0;

	float noise = pow(rand(gl_FragCoord.xy / uResolution.xy), 2.0) * pow(sin(radians(sum)), 1.0) * 20.0;

	gl_FragColor = vec4(vec3(noise * sum), 1.0);

	/* gl_FragColor = vec4(
		sum * pow(gl_FragCoord.x / uResolution.x, 2.0),
		sum * pow(gl_FragCoord.y / uResolution.y, 2.0),
		sum,
		1.0
	); */
}