#define PI 3.14159265359

varying vec2 vUv;
varying float vDist;

uniform float uGrayscaleProgress;
uniform float uDirection;
uniform float uTime;
uniform vec2 uMouse;
uniform sampler2D uTexture;

vec3 toGrayscale(vec3 color) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));

  return vec3(gray);
}

// Calcola la distanza massima dal punto fornito ai 4 angoli del piano (in coordinate UV)
float getMaxDistFromCorners(vec2 coords) {
  float dist_bl = distance(coords, vec2(0.0, 0.0)); // Bottom-Left
  float dist_br = distance(coords, vec2(1.0, 0.0)); // Bottom-Right
  float dist_tl = distance(coords, vec2(0.0, 1.0)); // Top-Left
  float dist_tr = distance(coords, vec2(1.0, 1.0)); // Top-Right

  // Restituisce la più grande tra le quattro distanze
  return max(dist_tl, max(dist_bl, max(dist_tr, dist_br)));
}

// Funzione per generare un valore random da un vec2
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Funzione di noise 2D
float noise (vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
}


void main() {
  float noisy = (noise(vUv * 25.0 + uTime * 0.5) - 0.5) * 0.05; // Noise centrato su zero
  float distortionStrength = sin(uGrayscaleProgress * PI) * 0.5;
  vec2 distortedUv = vUv + vec2(noisy) * distortionStrength;

  vec4 diffuse = texture2D(uTexture, uDirection > 0.0 ? distortedUv : vUv);
  vec3 textureGrayscale = texture2D(uTexture, uDirection > 0.0 ? vUv : distortedUv).rgb;
  vec3 grayscale = toGrayscale(textureGrayscale);

  vec2 toCenter = vUv - uMouse;
  float dist = length(toCenter);

  float distortedDist = dist + noisy;

  // Calcola la distanza massima possibile dal punto del mouse a uno dei 4 angoli
  float maxDist = getMaxDistFromCorners(uMouse);
  float mask = smoothstep(uGrayscaleProgress - 0.1, uGrayscaleProgress, distortedDist / maxDist);

  vec3 color1 = uDirection > 0.0 ? diffuse.rgb : grayscale;
  vec3 color2 = uDirection > 0.0 ? grayscale : diffuse.rgb;
  vec3 color = mix(color1, color2, mask);

  gl_FragColor = vec4(color, diffuse.a);
}