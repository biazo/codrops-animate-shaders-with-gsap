varying vec2 vUv;
varying float vRipple;

uniform float uGrayscaleProgress;
uniform vec2 uMouse;
uniform float uDirection;
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

void main() {
  vec4 diffuse = texture2D(uTexture, vUv);
  vec3 grayscale = toGrayscale(diffuse.rgb);

  float dist = distance(vUv, uMouse);
  // Calcola la distanza massima possibile dal punto del mouse a uno dei 4 angoli
  float maxDist = getMaxDistFromCorners(uMouse);
  float mask = smoothstep(uGrayscaleProgress - 0.1, uGrayscaleProgress, dist / maxDist);

  vec3 color1 = uDirection > 0.0 ? diffuse.rgb : grayscale;
  vec3 color2 = uDirection > 0.0 ? grayscale : diffuse.rgb;

  // La maschera si espande sempre dal centro verso l'esterno
  vec3 color = mix(color1, color2, mask);

  color += vRipple * 2.;

  gl_FragColor = vec4(color, diffuse.a);
}